"""PDF 규정 문서를 청킹 -> 임베딩 -> OpenSearch 인덱싱까지 수행하는 스크립트.

사용법:
    python src/ingest.py data/pdfs/규정1.pdf data/pdfs/규정2.pdf
"""
import sys
from pathlib import Path

from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import OpenSearchVectorSearch
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

from config import EMBEDDING_MODEL, OPENSEARCH_INDEX, OPENSEARCH_URL

CHUNK_SIZE = 1000
CHUNK_OVERLAP = 150


def load_and_split(pdf_paths: list[str]):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", ". ", " ", ""],
    )

    all_chunks = []
    for pdf_path in pdf_paths:
        loader = PyPDFLoader(pdf_path)
        pages = loader.load()
        chunks = splitter.split_documents(pages)
        for chunk in chunks:
            chunk.metadata["source"] = Path(pdf_path).name
        all_chunks.extend(chunks)
        print(f"{pdf_path}: {len(pages)} pages -> {len(chunks)} chunks")

    return all_chunks


def index_chunks(chunks):
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
    pdf_paths = sys.argv[1:]
    if not pdf_paths:
        print("사용법: python src/ingest.py <pdf1> <pdf2> ...")
        sys.exit(1)

    chunks = load_and_split(pdf_paths)
    index_chunks(chunks)
