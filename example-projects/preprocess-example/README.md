# A파트-2 데이터 전처리 예시 (PostgreSQL Raw -> [청킹](../../glossary.md#chunking) -> [OpenSearch](../../glossary.md#opensearch))

[`../crawl-storage-example`](../crawl-storage-example)가 PostgreSQL에 쌓아둔 원본 데이터를 꺼내서,
500자 단위로 청킹하고 [임베딩](../../glossary.md#embedding)한 뒤 OpenSearch에 인덱싱하는 예시.

용어가 낯설다면 **[../../glossary.md](../../glossary.md)**를 참고하세요.

## 왜 필요한가?

PostgreSQL에 있는 원본은 "사람이 읽는 형태"일 뿐, AI 검색에 바로 쓸 수 있는 형태가 아니다.
- PDF는 아직 이진 파일 그대로라 글자를 꺼내야 한다 (PyMuPDF 사용).
- HTML에서 뽑은 텍스트/PDF에서 뽑은 텍스트 모두, 문서 전체를 통째로 검색하기엔 너무 길다.
  그래서 작은 조각(청크)으로 잘라 임베딩해야 "질문과 관련된 부분만" 정확히 찾을 수 있다.

## 파이프라인

```
PostgreSQL (crawled_documents 테이블)
    -> content_type이 'pdf'면 PyMuPDF로 텍스트 추출, 'html'이면 저장된 text_content 그대로 사용
    -> LangChain [RecursiveCharacterTextSplitter](../../glossary.md#recursive-splitter)로 500자 청크 생성
    -> OpenAIEmbeddings로 벡터 변환
    -> OpenSearch에 인덱싱 (rag-regulation-example의 ingest.py와 최종 결과물은 동일)
```

## 1. 환경 준비

```bash
docker compose up -d   # OpenSearch 실행 (PostgreSQL은 crawl-storage-example 쪽에서 이미 떠 있어야 함)
pip install -r requirements.txt
cp .env.example .env   # DATABASE_URL, OPENAI_API_KEY 등 채워넣기
```

## 2. 실행

```bash
python src/preprocess.py
```

PostgreSQL의 `crawled_documents` 테이블에 있는 모든 문서를 순회하며 처리한다.

## 다음 단계

여기서 만들어진 OpenSearch 인덱스는 [`../rag-regulation-example`](../rag-regulation-example)의
`query.py`가 그대로 검색해서 쓸 수 있다 (같은 `OPENSEARCH_INDEX` 이름을 쓰면 됨).

## 다른 선택지가 궁금하다면

`langchain`/`PyMuPDF`/`opensearch-py` 대신 쓸 수 있는 라이브러리(`LlamaIndex`, `pdfplumber`,
`pgvector`, `Qdrant` 등)와 언제 그걸 고려하면 좋을지는 [`ALTERNATIVES.md`](ALTERNATIVES.md)에
정리해두었다.
