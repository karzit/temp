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

`query.py`의 `answer()`는 벡터 검색(`search_similar_docs`)과 키워드 검색(`search_keyword_docs`)을
[RRF](../../glossary.md#rrf)로 합친 **하이브리드 검색**(`search_hybrid_docs`)을 기본으로 사용한다.
벡터 검색만으로는 놓치기 쉬운 정확한 단어·조항 번호 매칭을 키워드 검색이 보완해준다. 개념과
numpy 기반 미니 구현은 [`04_rag_pipeline.ipynb`](../../notebooks/rag-pipeline-practice/04_rag_pipeline/04_rag_pipeline.ipynb) 실습 4~5에서 실습해볼 수 있다.

## 5. 웹 챗봇으로 실행하기

```bash
uvicorn src.api:app --reload
```

브라우저에서 http://localhost:8000 을 열면 `static/index.html` 채팅 화면이 뜬다. 입력한 질문은
`POST /chat`으로 전달되어 `answer()`가 처리하고, 답변과 함께 근거가 된 조항의 출처(source, page)가
같이 표시된다. FastAPI로 API를 감싸고 그 위에 HTML/JS 화면을 얇게 얹는 구조는
[`04_rag_pipeline.ipynb`](../../notebooks/rag-pipeline-practice/04_rag_pipeline/04_rag_pipeline.ipynb) 실습 9에서 다룬다.

## 예상 리소스 (문서 2건, 400페이지 규모)

- OpenSearch 단일 노드, RAM 2GB 내외로 충분
- 인덱스 크기: 원문 대비 임베딩(1536차원 float) 포함 수십 MB 수준
- 임베딩/생성 비용은 전량 OpenAI API 종량 과금 (로컬 GPU 불필요)

## 다음 단계 (필요 시)

- 청크 크기/overlap 튜닝 (표/조항 번호가 많은 규정 문서는 chunk_size를 줄이는 게 유리할 수 있음)
- 한국어 형태소 분석기(노리 Nori) 플러그인을 OpenSearch 인덱스에 적용해 키워드 검색 정확도 개선
  (현재는 기본 분석기라 조사가 다르면 놓칠 수 있음 — `query.py`의 `search_keyword_docs` 주석 참고)
- 답변에 출처(source, page) 표시는 이미 `query.py`의 프롬프트 컨텍스트와 `/chat` 응답에 포함됨
- **보안**: `query.py`처럼 검색된 문서를 프롬프트에 그대로 이어붙이는 구조는 [프롬프트 인젝션/탈옥](../../glossary.md#prompt-injection)에 취약할 수 있다. PDF 안에 숨겨진 지시문이 실제로 어떻게 시스템 프롬프트를 무력화시키는지, 그리고 데이터/지시 분리·입력 가드레일로 어떻게 방어하는지는 [`notebooks/rag-pipeline-practice/05_prompt_injection_defense/`](../../notebooks/rag-pipeline-practice/05_prompt_injection_defense/05_prompt_injection_defense.ipynb)에서 실습해볼 수 있다.

## 다른 선택지가 궁금하다면

`langchain`/`opensearch-py`/`pypdf`/`openai` 대신 쓸 수 있는 라이브러리(`LlamaIndex`, `pgvector`,
`Qdrant`, `anthropic`, [Hugging Face](../../glossary.md#huggingface) `sentence-transformers` 등)와
언제 그걸 고려하면 좋을지는 [`ALTERNATIVES.md`](ALTERNATIVES.md)에 정리해두었다.
