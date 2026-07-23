"""PostgreSQL 원본 -> 500자 청킹 -> OpenSearch 인덱싱까지 수행하는 메인 스크립트.

rag-regulation-example의 ingest.py와 하는 일은 거의 같다. 차이점은 딱 하나,
"어디서 원본을 가져오느냐"이다.
    - rag-regulation-example/ingest.py : 내 컴퓨터에 있는 PDF 파일에서 바로 읽음
    - 이 파일(preprocess.py)          : crawl-storage-example이 PostgreSQL에 저장해둔 원본에서 읽음

전체 흐름:
    PostgreSQL에서 원본 문서 읽기
    -> PDF면 PyMuPDF로 텍스트 추출, HTML이면 저장된 텍스트 그대로 사용
    -> 정규식으로 잡음(중복 공백, 과도한 줄바꿈 등) 정리
    -> LangChain으로 500자 청크로 자르기
    -> 형태소 분석으로 청크별 대표 명사 키워드 추출 (메타데이터로 저장)
    -> OpenAIEmbeddings로 벡터 변환
    -> OpenSearch에 저장

사용법:
    python src/preprocess.py
"""
import io
import re

import fitz  # PyMuPDF. import 이름이 패키지명(PyMuPDF)과 달라서 헷갈리기 쉬우니 주의! 참고 https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/02_text_chunking/02_text_chunking.ipynb
from kiwipiepy import Kiwi  # 참고 https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/02_text_chunking/02_text_chunking.ipynb (실습 9. 한국어 형태소 분석)
from langchain_community.vectorstores import OpenSearchVectorSearch  # 참고 https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/04_rag_pipeline/04_rag_pipeline.ipynb
from langchain_core.documents import Document  # 참고 https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/02_text_chunking/02_text_chunking.ipynb
from langchain_openai import OpenAIEmbeddings  # 참고 https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/04_rag_pipeline/04_rag_pipeline.ipynb
from langchain_text_splitters import RecursiveCharacterTextSplitter  # 참고 https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/02_text_chunking/02_text_chunking.ipynb

from config import EMBEDDING_MODEL, OPENSEARCH_INDEX, OPENSEARCH_URL
from reader import RawDocument, fetch_raw_documents

# rag-regulation-example의 청크 크기(1000자)보다 작게 잡은 이유:
# 이 프로젝트는 조항 번호가 촘촘한 규정 문서가 많아서, 더 작은 단위로 잘라야
# "질문과 정확히 관련된 조항 하나"를 콕 집어서 찾기 쉬워진다.
CHUNK_SIZE = 500
CHUNK_OVERLAP = 75  # CHUNK_SIZE가 작아진 만큼 겹침도 비례해서 줄였다 (기존 1000자 대비 150자 = 15% 비율 유지)

# Kiwi는 초기화(사전 로딩)에 비용이 좀 들어서, 문서마다 새로 만들지 않고 모듈 레벨에서 한 번만 만든다.
_kiwi = Kiwi()


def clean_text(text: str) -> str:
    """크롤링/OCR로 얻은 원문의 잡음을 정규식으로 정리한다.

    HTML을 텍스트로 바꾸거나 PDF에서 글자를 뽑다 보면 연속된 공백, 과도한 빈 줄,
    반복된 특수문자(마침표·느낌표 등)가 섞여 들어오는 경우가 흔하다. 청킹 전에 한 번
    정리해두면 청크 경계가 잡음 때문에 이상하게 갈리는 것을 줄일 수 있다.
    자세한 설명과 실습은
    https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/02_text_chunking/02_text_chunking.ipynb
    실습 8 참고.
    """
    text = re.sub(r"[ \t]+", " ", text)  # 연속 공백을 하나로
    text = re.sub(r"\n{3,}", "\n\n", text)  # 빈 줄이 3개 이상이면 2개로
    text = re.sub(r"\.{2,}", ".", text)  # 반복된 마침표 정리
    text = re.sub(r"!{2,}", "!", text)  # 반복된 느낌표 정리
    return text.strip()


def extract_keywords(text: str, limit: int = 10) -> list[str]:
    """형태소 분석으로 명사(NNG/NNP)만 뽑아 청크의 대표 키워드로 남긴다.

    "휴가를"/"휴가가"처럼 조사가 붙어도 형태소 분석을 거치면 같은 명사("휴가")로 인식되기
    때문에, 공백 기준 분리보다 안정적인 키워드 태깅이 가능하다. 등장 빈도가 높은 순으로
    최대 `limit`개만 남긴다. 자세한 설명과 실습은 위 노트북의 실습 9 참고.
    """
    nouns = [token.form for token in _kiwi.tokenize(text) if token.tag in ("NNG", "NNP")]
    counts: dict[str, int] = {}
    for noun in nouns:
        counts[noun] = counts.get(noun, 0) + 1
    ranked = sorted(counts.items(), key=lambda item: item[1], reverse=True)
    return [noun for noun, _count in ranked[:limit]]


def extract_pdf_text(binary_content: bytes) -> str:
    """PDF 파일의 이진 데이터를 사람이 읽는 텍스트로 변환한다.

    PyMuPDF(모듈명 fitz)는 PDF 페이지를 하나씩 열어서 그 안의 글자를 뽑아주는 도구다.
    파일을 디스크에 저장하지 않고, 메모리에 있는 바이트(binary_content) 그대로 열 수 있어서 편리하다.
    """
    text_parts = []
    # io.BytesIO: 파일이 아니라 메모리 상의 바이트 덩어리를 "파일인 척" 다룰 수 있게 해주는 도구.
    with fitz.open(stream=io.BytesIO(binary_content), filetype="pdf") as pdf:
        for page in pdf:
            text_parts.append(page.get_text())
    return "\n".join(text_parts)


def raw_document_to_text(raw_doc: RawDocument) -> str:
    """RawDocument 하나를 (PDF든 HTML이든 상관없이) 정제된 순수 텍스트로 통일해서 반환한다."""
    if raw_doc.content_type == "pdf":
        text = extract_pdf_text(raw_doc.binary_content)
    else:
        text = raw_doc.text_content or ""
    return clean_text(text)


def split_into_chunks(raw_docs: list[RawDocument]) -> list[Document]:
    """원본 문서들을 500자 청크(LangChain Document 객체)로 잘라준다."""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", ". ", " ", ""],
    )

    all_chunks: list[Document] = []
    for raw_doc in raw_docs:
        text = raw_document_to_text(raw_doc)
        if not text.strip():
            # 텍스트를 하나도 못 뽑아낸 문서(빈 PDF 등)는 건너뛴다.
            print(f"건너뜀 (텍스트 없음): {raw_doc.url}")
            continue

        # LangChain의 텍스트 분할기는 Document 객체 목록을 입력으로 받으니,
        # 순수 텍스트를 먼저 Document로 감싸준다. metadata에 출처 URL을 함께 담아둔다.
        doc = Document(page_content=text, metadata={"source": raw_doc.url})
        chunks = splitter.split_documents([doc])
        for chunk in chunks:
            # 검색 필터링/태깅에 쓸 수 있도록 청크별 대표 명사를 메타데이터로 남겨둔다.
            chunk.metadata["keywords"] = extract_keywords(chunk.page_content)
        all_chunks.extend(chunks)
        print(f"{raw_doc.url}: {len(chunks)} chunks")

    return all_chunks


def index_chunks(chunks: list[Document]) -> None:
    """청크들을 임베딩으로 변환해 OpenSearch에 저장한다. (rag-regulation-example/ingest.py와 동일한 방식)"""
    embeddings = OpenAIEmbeddings(model=EMBEDDING_MODEL)

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
    raw_docs = fetch_raw_documents()
    if not raw_docs:
        print("PostgreSQL에 처리할 원본 문서가 없습니다. 먼저 crawl-storage-example을 실행하세요.")
    else:
        chunks = split_into_chunks(raw_docs)
        index_chunks(chunks)
