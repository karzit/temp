"""PDF 규정 문서를 "청킹 -> 임베딩 -> OpenSearch 저장" 순서로 처리하는 스크립트.

이 파일은 쉽게 말하면 "책을 도서관에 등록하는 작업"을 해.
나중에 챗봇이 질문을 받았을 때 빠르게 찾아볼 수 있도록,
PDF 규정집을 미리 잘게 자르고(청킹) 색인을 붙여서(임베딩) 검색엔진(OpenSearch)에 등록해두는 거야.

비유하자면: 두꺼운 백과사전을 통째로 도서관에 던져놓는 게 아니라,
한 페이지씩(또는 한 문단씩) 찢어서 "이 조각은 무슨 내용이다"라는 태그를 붙여
찾기 쉽게 서랍에 정리해두는 것과 같아.

전체 흐름:
    PDF 파일 읽기 -> 페이지별로 글자 꺼내기 -> 작은 조각(청크)으로 자르기
    -> 각 조각을 숫자 벡터(임베딩)로 바꾸기 -> OpenSearch라는 검색엔진에 저장하기

사용법:
    python src/ingest.py data/pdfs/규정1.pdf data/pdfs/규정2.pdf
"""
import sys
from pathlib import Path

# LangChain은 PDF 읽기, 문서 자르기, 검색엔진 연결 같은 귀찮은 작업들을
# 미리 만들어진 부품처럼 가져다 쓸 수 있게 해주는 도구 모음(라이브러리)이야.
# 공식 문서: https://python.langchain.com/docs/introduction/
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import OpenSearchVectorSearch
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

from config import EMBEDDING_MODEL, OPENSEARCH_INDEX, OPENSEARCH_URL

# 왜 문서를 통째로 안 쓰고 잘게 자를까? 두 가지 이유가 있어.
#   1) AI 모델은 한 번에 읽을 수 있는 글자 양에 한계가 있어. (사람도 책 한 권을 한눈에 못 외우잖아!)
#   2) 질문이랑 "정확히 관련된 부분만" 쏙 찾아내려면, 문서 전체보다 작은 단위로 나눠야 정확도가 높아져.
#      (백과사전 전체를 주는 것보다, 딱 필요한 문단 하나만 주는 게 훨씬 도움이 되는 것과 같은 원리)
CHUNK_SIZE = 1000  # 조각 하나의 최대 글자 수 (대략 A4 반 페이지 정도)
CHUNK_OVERLAP = 150  # 옆 조각과 살짝 겹치는 글자 수.
# 왜 겹치게 자를까? 문장 중간에서 뚝 잘리면 앞뒤 문맥을 잃어버릴 수 있어서,
# 자른 경계 부분을 살짝 겹쳐서 이어붙여야 내용이 자연스럽게 연결돼.
# 더 알고 싶다면: https://python.langchain.com/docs/how_to/recursive_text_splitter/


def load_and_split(pdf_paths: list[str]):
    """PDF들을 읽어서 페이지 단위로 불러온 뒤, 정해진 크기의 작은 조각들로 잘라준다."""
    # separators는 "이 순서대로 잘라보자"는 우선순위 목록이야.
    # 먼저 문단 구분(\n\n)으로 잘라보고, 그래도 너무 길면 줄바꿈(\n) -> 마침표(". ") -> 띄어쓰기(" ")
    # -> 그래도 안 되면 글자 하나하나 순서로 점점 더 잘게 자르면서 CHUNK_SIZE를 맞춰.
    # 이렇게 하면 최대한 문장이 뚝뚝 끊기지 않고 자연스럽게 잘리게 돼.
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", ". ", " ", ""],
    )

    all_chunks = []
    for pdf_path in pdf_paths:
        # PyPDFLoader는 PDF 파일을 열어서 "페이지 1의 글자, 페이지 2의 글자, ..." 식으로
        # 페이지별 텍스트 목록으로 바꿔주는 도구야.
        # 참고: https://python.langchain.com/docs/integrations/document_loaders/pypdfloader/
        loader = PyPDFLoader(pdf_path)
        pages = loader.load()
        chunks = splitter.split_documents(pages)
        for chunk in chunks:
            # 조각마다 "이건 어느 파일에서 나온 조각이야"라는 이름표(메타데이터)를 붙여둬.
            # 나중에 답변할 때 "출처: 취업규칙.pdf" 처럼 근거를 보여주기 위해 필요해.
            chunk.metadata["source"] = Path(pdf_path).name
        all_chunks.extend(chunks)
        print(f"{pdf_path}: {len(pages)} pages -> {len(chunks)} chunks")

    return all_chunks


def index_chunks(chunks):
    """조각들을 숫자 벡터(임베딩)로 바꿔서 OpenSearch라는 검색엔진에 등록한다."""
    # OpenAIEmbeddings는 글자를 숫자 좌표로 바꿔주는 변환기야.
    # 예를 들면 "연차휴가 규정"이라는 문장이 [0.0123, -0.045, ...] 같은
    # 1536개의 숫자로 이루어진 좌표(벡터)로 바뀌어. 의미가 비슷한 문장은 이 좌표도 서로 가깝게 나와.
    embeddings = OpenAIEmbeddings(model=EMBEDDING_MODEL)

    # from_documents 한 줄이 사실 이런 일을 다 해줘:
    #   1) 조각들을 하나씩 OpenAI에 보내서 벡터로 변환하고
    #   2) "원래 글 + 벡터 + 출처 이름표"를 세트로 묶어서
    #   3) OpenSearch 서랍(인덱스)에 차곡차곡 저장한다
    # engine과 space_type은 OpenSearch가 "비슷한 벡터를 빠르게 찾는 방법"을 정하는 옵션이야.
    #   - engine="nmslib": 벡터들 중 가까운 것들을 빠르게(정확히는 근사적으로) 찾아주는 알고리즘 이름.
    #   - space_type="cosinesimil": "가깝다"를 판단하는 기준으로 코사인 유사도(벡터들이 가리키는 방향이
    #     얼마나 비슷한지)를 사용한다는 뜻. 나침반 방향이 비슷할수록 의미도 비슷하다고 보는 것과 같아.
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
    # 파일1.pdf, 파일2.pdf가 pdf_paths 리스트로 들어와.
    pdf_paths = sys.argv[1:]
    if not pdf_paths:
        print("사용법: python src/ingest.py <pdf1> <pdf2> ...")
        sys.exit(1)

    chunks = load_and_split(pdf_paths)
    index_chunks(chunks)
