"""PDF 규정 문서를 "파싱 -> 조항 단위 청킹 -> 임베딩 -> OpenSearch 저장" 순서로 처리하는 스크립트입니다.

이 파일은 쉽게 말하면 "책을 도서관에 등록하는 작업"을 합니다.
나중에 챗봇이 질문을 받았을 때 빠르게 찾아볼 수 있도록,
PDF 규정집을 미리 잘게 자르고(청킹) 색인을 붙여서(임베딩) 검색엔진(OpenSearch)에 등록해두는 것입니다.

비유하자면: 두꺼운 백과사전을 통째로 도서관에 던져놓는 게 아니라,
한 페이지씩(또는 한 문단씩) 찢어서 "이 조각은 무슨 내용이다"라는 태그를 붙여
찾기 쉽게 서랍에 정리해두는 것과 같습니다.

전체 흐름:
    PDF 파일 읽기 -> 페이지별로 글자 꺼내기 -> 조/항 단위로 자르기(parse.py)
    -> 각 조각을 숫자 벡터(임베딩)로 바꾸기 -> OpenSearch라는 검색엔진에 저장하기

사용법:
    python src/ingest.py data/pdfs/규정1.pdf data/pdfs/규정2.pdf
    python src/ingest.py data/sample_regulation.txt      # PDF 없이 연습할 때
"""
import sys
from pathlib import Path

# LangChain은 PDF 읽기, 문서 자르기, 검색엔진 연결 같은 귀찮은 작업들을
# 미리 만들어진 부품처럼 가져다 쓸 수 있게 해주는 도구 모음(라이브러리)입니다.
# 공식 문서: https://python.langchain.com/docs/introduction/
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import OpenSearchVectorSearch
from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

from config import EMBEDDING_MODEL, OPENSEARCH_INDEX, OPENSEARCH_URL
from parse import Article, check_article_sequence, parse_articles, split_paragraphs

# 조 하나가 이 길이를 넘으면 항(①②③) 단위로 한 번 더 쪼갭니다.
# 조 단위를 기본으로 두는 이유는, 조가 곧 "하나의 완결된 규칙"이라서
# 통째로 있어야 문맥이 살기 때문입니다. 다만 너무 긴 조는 검색이 뭉개지므로 상한을 둡니다.
MAX_ARTICLE_CHARS = 900

# 조 표지를 하나도 못 찾았을 때 쓰는 비상용 설정입니다 (아래 fallback_chunks 참고).
FALLBACK_CHUNK_SIZE = 1000
FALLBACK_CHUNK_OVERLAP = 150


def load_pages(path: str) -> list[str]:
    """파일을 페이지별 텍스트 목록으로 읽어옵니다. (.txt는 통째로 1페이지 취급)"""
    if path.lower().endswith(".pdf"):
        # PyPDFLoader는 PDF 파일을 열어서 "페이지 1의 글자, 페이지 2의 글자, ..." 식으로
        # 페이지별 텍스트 목록으로 바꿔주는 도구입니다.
        # 참고: https://python.langchain.com/docs/integrations/document_loaders/pypdfloader/
        return [page.page_content for page in PyPDFLoader(path).load()]
    return [Path(path).read_text(encoding="utf-8")]


def articles_to_documents(articles: list[Article], source: str) -> list[Document]:
    """파싱된 조 목록을, 검색엔진에 넣을 수 있는 Document 조각들로 바꿉니다.

    핵심은 본문 앞에 **계층 경로를 프리픽스로 붙이는 것**입니다.

        제3장 근무 > 제11조(재택근무)
        제11조(재택근무)
        ③ 재택근무 중 발생한 연장근로에 대하여는 제12조에 따른 수당을 지급한다.

    이렇게 해두면 두 가지가 동시에 좋아집니다.
      1) 의미 검색: "재택근무"라는 단어가 조각 안에 실제로 들어 있으니,
         ③항만 떼어놔도 재택근무 관련 질문에 걸립니다.
      2) 답변 품질: AI가 조각을 읽을 때 "이건 제11조 얘기구나"를 알 수 있어서
         출처를 조항 번호로 정확히 말해줄 수 있습니다.
    """
    documents: list[Document] = []
    for article in articles:
        for marker, body in split_paragraphs(article, max_chars=MAX_ARTICLE_CHARS):
            documents.append(
                Document(
                    page_content=f"{article.full_path}\n{body}",
                    metadata={
                        "source": source,
                        "page": article.page,
                        # 아래 세 개가 1000자 청킹에는 없던 정보입니다.
                        # query.py가 출처를 "취업규칙.pdf 제11조 ③ (p.4)"처럼 보여줄 수 있고,
                        # evaluate.py가 "정답 조항을 찾았는지"를 채점할 수 있게 됩니다.
                        "path": article.full_path,
                        "article": article.number,
                        "paragraph": marker,
                    },
                )
            )
    return documents


def fallback_chunks(pages: list[str], source: str) -> list[Document]:
    """조 표지를 하나도 못 찾았을 때 쓰는 예전 방식(고정 길이 청킹)입니다.

    모든 문서가 규정 형식인 건 아닙니다. 안내문, 회의록, 표만 있는 부속서류처럼
    "제N조"가 없는 문서도 같은 인덱스에 들어올 수 있습니다. 그런 문서까지 파서가
    책임지려 하면 오히려 망가지므로, 구조가 없으면 조용히 예전 방식으로 넘어갑니다.

    chunk_overlap(조각끼리 살짝 겹치게 자르기)이 여기에만 남아 있는 것도 이유가 있습니다.
    고정 길이로 자르면 문장 중간이 잘려서 문맥을 잃기 때문에 겹침으로 보완해야 하지만,
    조항 단위로 자르면 애초에 경계가 의미 단위와 일치하므로 겹칠 필요가 없습니다.
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=FALLBACK_CHUNK_SIZE,
        chunk_overlap=FALLBACK_CHUNK_OVERLAP,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    documents = [
        Document(page_content=page, metadata={"source": source, "page": index})
        for index, page in enumerate(pages, start=1)
    ]
    return splitter.split_documents(documents)


def load_and_split(paths: list[str]) -> list[Document]:
    """문서들을 읽어서 조항 단위 조각으로 자르고, 그 과정에서 무결성 검증도 함께 합니다."""
    all_chunks: list[Document] = []

    for path in paths:
        source = Path(path).name
        pages = load_pages(path)
        articles = parse_articles(pages)

        if articles:
            chunks = articles_to_documents(articles, source)
            print(f"{path}: {len(pages)}페이지 -> 조 {len(articles)}개 -> 청크 {len(chunks)}개")

            # 조 번호가 끊긴 곳이 있으면 여기서 알려줍니다.
            # 이걸 안 하면 "그 조항만 유독 검색이 안 되는" 상태로 서비스가 나갑니다.
            for warning in check_article_sequence(articles):
                print(f"  ⚠️  [무결성] {warning}")
        else:
            chunks = fallback_chunks(pages, source)
            print(f"{path}: 조 표지를 찾지 못해 고정 길이로 분할 -> 청크 {len(chunks)}개")

        all_chunks.extend(chunks)

    return all_chunks


def index_chunks(chunks: list[Document]) -> None:
    """조각들을 숫자 벡터(임베딩)로 바꿔서 OpenSearch라는 검색엔진에 등록합니다."""
    # OpenAIEmbeddings는 글자를 숫자 좌표로 바꿔주는 변환기입니다.
    # 예를 들면 "연차휴가 규정"이라는 문장이 [0.0123, -0.045, ...] 같은
    # 1536개의 숫자로 이루어진 좌표(벡터)로 바뀝니다. 의미가 비슷한 문장은 이 좌표도 서로 가깝게 나옵니다.
    embeddings = OpenAIEmbeddings(model=EMBEDDING_MODEL)

    # from_documents 한 줄이 사실 이런 일을 다 해줍니다:
    #   1) 조각들을 하나씩 OpenAI에 보내서 벡터로 변환하고
    #   2) "원래 글 + 벡터 + 출처 이름표"를 세트로 묶어서
    #   3) OpenSearch 서랍(인덱스)에 차곡차곡 저장합니다
    # engine과 space_type은 OpenSearch가 "비슷한 벡터를 빠르게 찾는 방법"을 정하는 옵션입니다.
    #   - engine="nmslib": 벡터들 중 가까운 것들을 빠르게(정확히는 근사적으로) 찾아주는 알고리즘 이름입니다.
    #   - space_type="cosinesimil": "가깝다"를 판단하는 기준으로 코사인 유사도(벡터들이 가리키는 방향이
    #     얼마나 비슷한지)를 사용한다는 뜻입니다. 나침반 방향이 비슷할수록 의미도 비슷하다고 보는 것과 같습니다.
    # 참고: https://opensearch.org/docs/latest/search-plugins/knn/knn-index/
    OpenSearchVectorSearch.from_documents(
        documents=chunks,
        embedding=embeddings,
        opensearch_url=OPENSEARCH_URL,
        index_name=OPENSEARCH_INDEX,
        engine="nmslib",
        space_type="cosinesimil",
    )
    print(f"Indexed {len(chunks)} chunks into '{OPENSEARCH_INDEX}'")


if __name__ == "__main__":
    # 터미널에서 "python src/ingest.py 파일1.pdf 파일2.pdf" 처럼 실행하면
    # 파일1.pdf, 파일2.pdf가 doc_paths 리스트로 들어옵니다.
    doc_paths = sys.argv[1:]
    if not doc_paths:
        print("사용법: python src/ingest.py <pdf1|txt1> <pdf2> ...")
        sys.exit(1)

    index_chunks(load_and_split(doc_paths))
