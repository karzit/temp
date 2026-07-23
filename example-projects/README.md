# example-projects: 문서 기반 AI 파이프라인 예제 4종

사내 규정을 찾아주는 챗봇을 만든다고 가정했을 때 실제로 거치는 단계를, 독립 실행 가능한 4개의 작은 프로젝트로
나눠놓은 것입니다. 각 프로젝트는 폴더 안에서 단독으로 실행할 수 있지만, 데이터는 아래처럼 서로 이어집니다.
낯선 용어는 **[../glossary.md](../glossary.md)**(통합 용어집)를 참고하세요.

## 전체 파이프라인

**인덱싱(쓰기) 경로 — 두 갈래가 같은 OpenSearch 인덱스로 합류**

```
[A-1] crawl-storage-example                [C] rag-regulation-example
  웹 URL 목록                                  로컬 PDF 2~3개
  -> requests/BeautifulSoup                    -> ingest.py
  -> PostgreSQL (원본 그대로 보관)                (1000자 청킹)
        |                                          |
        v                                          |
[A-2] preprocess-example                           |
  PostgreSQL 원본                                   |
  -> 500자 청킹                                     |
  -> OpenSearch 인덱싱                              |
        |                                          |
        +------------------+  +-------------------+
                           v  v
              OpenSearch 인덱스 "regulation-docs" (knn_vector)
```

**질의(읽기) 경로 — B파트는 C파트와 별도의 입력 경로**

```
[B] document-input-example                 [C] rag-regulation-example
  서류 사진                                    사용자 질문
  -> Google Vision OCR                         -> 임베딩
  -> gpt-4o-mini structured output              -> OpenSearch 유사도 검색
  -> 정형 JSON                                  -> 프롬프트 조합
     (document_type/keywords/related_dates)     -> gpt-4o-mini 응답
        |                                          ^
        +---- JSON의 키워드/사유를 질문으로 활용 ----+
```

**핵심은 "일렬로 이어지는 4단계"가 아니라, 두 개의 입력 경로(A: 크롤링 / B: 사용자 업로드)가
하나의 검색 지점(OpenSearch, C파트)으로 합류하는 구조**라는 점입니다.

- A-1(`crawl-storage-example`)과 A-2(`preprocess-example`)는 "미리 긁어둔 규정 문서"를 검색 가능하게
  만드는 경로입니다.
- C파트(`rag-regulation-example`)는 로컬에 있는 PDF 2~3개를 직접 청킹해서 같은 OpenSearch 인덱스
  (`OPENSEARCH_INDEX` 기본값 `regulation-docs`, `preprocess-example`와 동일)에 넣을 수도 있습니다 —
  즉 A-2를 거치지 않고 C파트만 단독으로 실행해도 최소 동작을 확인할 수 있습니다.
- B파트(`document-input-example`)는 "사용자가 방금 올린 서류"를 정형 JSON으로 바꾸는, C파트와는
  별개의 입력 경로입니다. 이 JSON에서 뽑아낸 키워드/사유를 C파트의 질문으로 활용하는 시나리오입니다.

## 프로젝트별 요약

| 프로젝트 | 파트 | 배우는 것 | 핵심 라이브러리 |
|---|---|---|---|
| [`crawl-storage-example`](crawl-storage-example) | A-1 | 웹 [크롤링](../glossary.md#crawling) → DB 원본 보관 | `requests`, `beautifulsoup4`, `psycopg2` |
| [`preprocess-example`](preprocess-example) | A-2 | DB 원본 → [청킹](../glossary.md#chunking) → 벡터 인덱싱 | `langchain-text-splitters`, `PyMuPDF`, `langchain-openai` |
| [`document-input-example`](document-input-example) | B | 이미지 [OCR](../glossary.md#ocr) → LLM [정형 출력](../glossary.md#structured-output) | `google-cloud-vision`, `openai`, `pydantic`, `streamlit` |
| [`rag-regulation-example`](rag-regulation-example) | C | [벡터 검색](../glossary.md#vector-search) → LLM 응답([RAG](../glossary.md#rag)) | `langchain`, `opensearch-py`, `openai` |

각 프로젝트의 상세 실행 방법은 폴더 안 `README.md`를 참고하세요. 라이브러리 자체를 하나씩 손으로
연습해보고 싶다면 [`../notebooks/rag-pipeline-practice/`](../notebooks/rag-pipeline-practice)의
Colab 노트북 4개가 이 파이프라인 순서(A-1 → A-2 → B → C) 그대로 구성되어 있습니다. C파트
(`rag-regulation-example`)처럼 검색된 문서를 프롬프트에 그대로 이어붙이는 구조는
[프롬프트 인젝션/탈옥](../glossary.md#prompt-injection)에 취약할 수 있는데, 이를 재현하고 방어하는
5번째 노트북([`05_prompt_injection_defense`](../notebooks/rag-pipeline-practice/05_prompt_injection_defense/05_prompt_injection_defense.ipynb))도 추가로 준비되어 있습니다.

각 프로젝트 폴더에는 `README.md` 외에 **`ALTERNATIVES.md`**도 있습니다. 여기 쓰인 라이브러리를
대신할 수 있는 다른 선택지(예: `requests` 대신 `httpx`/`Scrapy`, `opensearch-py` 대신
`pgvector`/`Qdrant`, `openai` 대신 `anthropic`/`ollama` 등)와 "언제 그걸 고려하면 좋은지"를
정리해둔 참고 문서입니다. 실습 코드를 그 대안으로 바꾸는 건 다루지 않고, 딱 "이럴 때는 이런
선택지도 있다"는 감을 잡는 용도입니다.

## 청킹 전략은 문서 특성에 맞춰 다르게 잡았습니다

같은 "PDF/텍스트를 청크로 잘라 OpenSearch에 넣는다"는 로직이지만, 두 프로젝트의 [chunk_size / chunk_overlap](../glossary.md#chunk-size-overlap)이 다릅니다.

| | `chunk_size` | `chunk_overlap` | 이유 |
|---|---|---|---|
| `rag-regulation-example/src/ingest.py` | 1000자 | 150자(15%) | 200페이지급 일반 규정 PDF, 문단 단위 검색이면 충분 |
| `preprocess-example/src/preprocess.py` | 500자 | 75자(15%) | 조항 번호가 촘촘한 문서가 많아, 질문과 정확히 관련된 조항 하나를 더 콕 집어 찾기 위해 더 잘게 자름 |

두 파일을 나란히 열어 비교해보면 "청킹 전략은 정답이 하나가 아니라 문서 특성에 맞춰 조정하는 것"이라는
감각을 얻을 수 있습니다. (오버랩 비율은 15%로 동일하게 유지 — `chunk_size`가 작아진 만큼 오버랩도
비례해서 줄인 것.)
