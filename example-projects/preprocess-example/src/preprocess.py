"""PostgreSQL 원본 -> 500자 청킹 -> OpenSearch 인덱싱까지 수행하는 메인 스크립트.

rag-regulation-example의 ingest.py와 하는 일은 거의 같다. 차이점은 딱 하나,
"어디서 원본을 가져오느냐"이다.
    - rag-regulation-example/ingest.py : 내 컴퓨터에 있는 PDF 파일에서 바로 읽음
    - 이 파일(preprocess.py)          : crawl-storage-example이 PostgreSQL에 저장해둔 원본에서 읽음

전체 흐름:
    PostgreSQL에서 원본 문서 읽기
    -> PDF면 PyMuPDF로 텍스트 추출, HTML이면 저장된 텍스트 그대로 사용
    -> LangChain으로 500자 청크로 자르기
    -> OpenAIEmbeddings로 벡터 변환
    -> OpenSearch에 저장

사용법:
    python src/preprocess.py
"""
import io

import fitz  # PyMuPDF. import 이름이 패키지명(PyMuPDF)과 달라서 헷갈리기 쉬우니 주의! 참고 https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/02_text_chunking/02_text_chunking.ipynb
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
    """RawDocument 하나를 (PDF든 HTML이든 상관없이) 순수 텍스트로 통일해서 반환한다."""
    if raw_doc.content_type == "pdf":
        return extract_pdf_text(raw_doc.binary_content)
    return raw_doc.text_content or ""


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
