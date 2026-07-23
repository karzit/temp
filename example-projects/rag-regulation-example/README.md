# 사내 규정 [RAG](../../glossary.md#rag) 예시 프로젝트

LangChain + OpenSearch + gpt-4o-mini 기반 규정 문서 검색/응답 예시.
200페이지 PDF 2건 기준 최소 구성으로 설계됨.

용어가 낯설다면 **[../../glossary.md](../../glossary.md)**를 참고하세요.

## 파이프라인

```
PDF (2건, 200p) -> [청킹](../../glossary.md#chunking) (RecursiveCharacterTextSplitter)
                 -> [임베딩](../../glossary.md#embedding) (text-embedding-3-small)
                 -> [OpenSearch](../../glossary.md#opensearch) 인덱싱 (knn_vector)
사용자 질문 -> 임베딩 -> [벡터 검색](../../glossary.md#vector-search) -> [프롬프트 조립](../../glossary.md#prompt-assembly) -> gpt-4o-mini 응답
```

## 1. 환경 준비

```bash
docker compose up -d
pip install -r requirements.txt
cp .env.example .env   # OPENAI_API_KEY 채워넣기
```

OpenSearch 정상 기동 확인:

```bash
curl http://localhost:9200
```

## 2. PDF 배치

`data/pdfs/` 폴더에 규정 PDF 2개를 넣는다. (예: `data/pdfs/취업규칙.pdf`, `data/pdfs/복무규정.pdf`)

## 3. 인덱싱

```bash
python src/ingest.py data/pdfs/취업규칙.pdf data/pdfs/복무규정.pdf
```

200페이지 기준 PDF당 약 150~250개 청크 생성 예상 (chunk_size=1000, overlap=150).

## 4. 질의응답

```bash
python src/query.py "육아휴직 기간은 최대 몇 개월인가요?"
```

## 예상 리소스 (문서 2건, 400페이지 규모)

- OpenSearch 단일 노드, RAM 2GB 내외로 충분
- 인덱스 크기: 원문 대비 임베딩(1536차원 float) 포함 수십 MB 수준
- 임베딩/생성 비용은 전량 OpenAI API 종량 과금 (로컬 GPU 불필요)

## 다음 단계 (필요 시)

- 청크 크기/overlap 튜닝 (표/조항 번호가 많은 규정 문서는 chunk_size를 줄이는 게 유리할 수 있음)
- 하이브리드 검색(BM25 + kNN) 적용
- 답변에 출처(source, page) 표시는 이미 `query.py`의 프롬프트 컨텍스트에 포함됨

## 다른 선택지가 궁금하다면

`langchain`/`opensearch-py`/`pypdf`/`openai` 대신 쓸 수 있는 라이브러리(`LlamaIndex`, `pgvector`,
`Qdrant`, `anthropic` 등)와 언제 그걸 고려하면 좋을지는 [`ALTERNATIVES.md`](ALTERNATIVES.md)에
정리해두었다.
