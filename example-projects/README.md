# example-projects: 문서 기반 AI 파이프라인 예제 4종

사내 규정을 찾아주는 챗봇을 만든다고 가정했을 때 실제로 거치는 단계를, 독립 실행 가능한 4개의 작은 프로젝트로
나눠놓은 것입니다. 각 프로젝트는 폴더 안에서 단독으로 실행할 수 있지만, 데이터는 아래처럼 서로 이어집니다.
낯선 용어는 **[../glossary.md](../glossary.md)**(통합 용어집)를, 실행이 막히면
**[../troubleshooting.md](../troubleshooting.md)**(막혔을 때 보는 문서)의 API 키·Docker 항목을 참고하세요.

## 전체 파이프라인

**인덱싱(쓰기) 경로 — 두 갈래가 같은 OpenSearch 인덱스로 합류**

```
[A-1] crawl-storage-example                [C] rag-regulation-example
  웹 URL 목록                                  로컬 PDF 2~3개
  -> requests/BeautifulSoup                    -> parse.py (장>절>조>항)
  -> PostgreSQL (원본 그대로 보관)                -> ingest.py (조항 단위 청킹)
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
  -> Google Vision OCR                         -> 벡터 + 키워드 검색 (RRF, 20개)
  -> gpt-4o-mini structured output              -> 리랭킹 (bge-reranker, 4개)
  -> 정형 JSON                                  -> 프롬프트 조합
     (document_type/keywords/related_dates)     -> gpt-4o-mini 응답
                                                (evaluate.py로 검색 품질 채점)
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
| [`rag-regulation-example`](rag-regulation-example) | C | 구조 파싱 → 조항 청킹 → 하이브리드 검색·리랭킹 → LLM 응답([RAG](../glossary.md#rag)) → 검색 품질 평가 | `langchain`, `opensearch-py`, `openai`, `sentence-transformers` |

## 코드를 같이 읽어줄 노트북이 있습니다

각 프로젝트마다 **동행 노트북**이 하나씩 붙어 있습니다.
실제 소스를 열어서 보여주고, 함수를 직접 import해서 돌려보며 "왜 이렇게 짰는지"를 따라갑니다.
**PostgreSQL·OpenSearch·API 키 없이 Colab에서 전부 실행됩니다.**

| 프로젝트 | 동행 노트북 |
|---|---|
| `crawl-storage-example` | [01_crawl_storage](../notebooks/project-walkthrough/01_crawl_storage/01_crawl_storage.ipynb) |
| `preprocess-example` | [02_preprocess](../notebooks/project-walkthrough/02_preprocess/02_preprocess.ipynb) |
| `document-input-example` | [03_document_input](../notebooks/project-walkthrough/03_document_input/03_document_input.ipynb) |
| `rag-regulation-example` | [04_rag_regulation](../notebooks/project-walkthrough/04_rag_regulation/04_rag_regulation.ipynb) |

인프라를 띄우기 전에 코드부터 이해하고 싶다면 여기서 시작하세요.
자세한 내용은 [시리즈 README](../notebooks/project-walkthrough/README.md)를 참고하세요.

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

## 전체를 이어서 한 번 실행해보기

4개 프로젝트를 순서대로 띄워서 "A/B 경로가 C로 합류하는" 구조를 직접 확인하는 최소 실행 순서입니다.
각 단계는 해당 프로젝트 폴더 안 `README.md`의 축약판이며, 자세한 옵션은 그쪽을 참고하세요.

```bash
# 1) A-1: 크롤링 -> PostgreSQL
#    targets.py 기본값이 크롤링 연습용 공개 사이트(quotes.toscrape.com)라 그대로 돌아갑니다.
cd crawl-storage-example
docker compose up -d          # postgres 컨테이너 기동
pip install -r requirements.txt
cp .env.example .env
python src/crawl.py

# 2) A-2: PostgreSQL -> 청킹(500자) -> OpenSearch
cd ../preprocess-example
docker compose up -d          # opensearch 컨테이너 기동 (컨테이너명 opensearch-rag)
pip install -r requirements.txt
cp .env.example .env          # DATABASE_URL, OPENSEARCH_INDEX 등 채우기
python src/preprocess.py

# 3) C: rag-regulation-example은 방금 띄운 OpenSearch를 그대로 재사용
cd ../rag-regulation-example
pip install -r requirements.txt
cp .env.example .env          # OPENSEARCH_INDEX를 preprocess-example과 동일하게 맞추기

#    3-a) 방금 A경로로 들어간 데이터에 질문해보기 (내용이 명언이라 질문도 그 주제로)
python src/query.py "세상을 바꾸는 것에 대해 아인슈타인이 한 말이 있나요?"

#    3-b) 같은 인덱스에 C경로로 규정 문서를 하나 더 넣고, 규정 질문을 해보기
python src/ingest.py data/sample_regulation.txt
python src/query.py "재택근무 중에 야근하면 수당 받을 수 있나요?"

#    3-c) 답변이 어느 쪽 데이터에서 나왔는지 출처까지 보려면 웹 챗봇으로
#         (--app-dir이 왜 필요한지 등 자세한 설명은 rag-regulation-example README의 7단계)
uvicorn api:app --reload --app-dir src   # http://localhost:8000

# 4) B: 서류 사진 -> OCR -> 정형 JSON (C와는 별도 입력 경로, 독립 실행)
cd ../document-input-example
pip install -r requirements.txt
cp .env.example .env
streamlit run src/app.py
# 여기서 나온 JSON의 keywords/applicant_request를 3)의 질문으로 다시 넣어보면
# B -> C로 이어지는 흐름을 체감할 수 있습니다.
```

3-a와 3-b가 이 문서의 핵심을 보여주는 지점입니다. **출처가 전혀 다른 두 데이터(웹에서 긁어온
명언, 로컬 규정 파일)가 같은 인덱스에 들어가 있고, `query.py`는 어느 쪽에서 왔는지 신경 쓰지 않고
질문에 맞는 쪽을 찾아옵니다.** 두 경로가 어떻게 구분되는지는 출처 표시에서 드러납니다 —
A경로 청크는 URL만, C경로 청크는 `sample_regulation.txt 제11조 (p.1)`처럼 조항 번호까지 나옵니다.
`query.py`는 최종 답변만 출력하므로 이 차이는 3-c의 웹 챗봇에서 눈으로 확인할 수 있습니다
([7단계 설명](rag-regulation-example/README.md#7-웹-챗봇으로-실행하기)).

3-a와 3-b를 나란히 놓으면 한 가지가 더 보입니다. **3-a는 벡터 검색이 혼자 해내는 경우이고,
3-b는 키워드 검색이 있어야 하는 경우입니다.**

3-a에서는 보통 **한국어로 물었는데 영어로 된 명언이 걸려 나옵니다.** 임베딩이 글자가 아니라
의미를 좌표로 바꾸기 때문에, 언어가 달라도 뜻이 같으면 좌표가 가깝게 찍히는 덕분입니다.
(교차언어 매칭은 모델이 알아서 해주는 부분이라 항상 똑같이 나오지는 않습니다. 엉뚱한 게
나온다면 질문을 명언 내용 쪽에 더 붙여서 다시 물어보세요.) 대신 하이브리드 검색의 다른 축인
키워드 검색은 이 질문에서 아무 일도 못 합니다 — "아인슈타인"이라는 글자가 영어 본문에 없으니
한 건도 못 걸죠.

반대로 3-b는 질문과 문서가 둘 다 한국어이고 "재택근무" 같은 단어가 그대로 나오는 경우라,
키워드 검색이 제 몫을 합니다. 두 검색을 함께 쓰는 이유가 이 대비에 있습니다 — 어느 한쪽이
늘 이기는 게 아니라, **각자 놓치는 질문이 서로 다릅니다.**

**주의: 3)에서 `rag-regulation-example`의 `docker compose up -d`는 실행하지 마세요.**
`preprocess-example`과 `rag-regulation-example`의 `docker-compose.yml`은 둘 다 컨테이너명을
`opensearch-rag`로 써서 같은 OpenSearch를 가리키도록 되어 있습니다. 2)에서 이미 띄웠다면
3)에서 또 띄우려고 하면 컨테이너 이름 충돌로 실패합니다 (`rag-regulation-example`을 A-2 없이
단독으로만 쓸 때만 그 폴더의 `docker compose up -d`를 실행하세요).

## 청킹 전략은 문서 특성에 맞춰 다르게 잡았습니다

같은 "PDF/텍스트를 청크로 잘라 OpenSearch에 넣는다"는 로직이지만, 두 프로젝트가 **자르는 기준 자체**가
다릅니다. 길이로 자를 때 쓰는 값이 [chunk_size / chunk_overlap](../glossary.md#chunk-size-overlap)입니다.

| | 자르는 기준 | 설정값 |
|---|---|---|
| `rag-regulation-example/src/ingest.py` | 조항 단위 (`parse.py`가 찾은 제N조) | `MAX_ARTICLE_CHARS` 900자 — 이걸 넘는 조만 항(①②③)으로 한 번 더 분할 |
| `preprocess-example/src/preprocess.py` | 고정 길이 | `chunk_size` 500자 / `chunk_overlap` 75자(15%) |

**기준이 갈린 건 입력을 믿을 수 있느냐의 차이입니다.** `ingest.py`는 손에 쥔 규정 PDF를 다루니
조 표지를 믿을 수 있습니다. 사람이 이미 정해둔 경계를 그대로 쓰면 문맥이 살고, 출처도
"제11조 ③"으로 정확히 남습니다. 반면 `preprocess.py`가 받는 건 웹에서 긁어온 문서라 형식을
믿을 수 없습니다. 사이트마다 조 표지를 `<table>`이나 `<div>`로 흩어놓거나 아예 안 쓰기 때문에,
파서가 조를 못 찾거나 엉뚱한 데서 자를 위험이 큽니다.

그래서 `ingest.py`도 조 표지가 하나도 없는 문서(안내문·회의록 등)를 만나면 고정 길이 방식
(`FALLBACK_CHUNK_SIZE` 1000자 / `FALLBACK_CHUNK_OVERLAP` 150자, 15%)으로 자동으로 넘어갑니다.
조항 단위가 "되면 좋은" 방식이고, 고정 길이가 언제나 쓸 수 있는 기본값인 셈입니다.

**그럼 같은 고정 길이인데 `preprocess.py`는 왜 500자인가** — 폴백의 1000자보다 짧습니다.
크롤링 대상이 규정 게시판이라면 조 하나가 짧아서, 1000자로 자르면 한 청크에 관련 없는 조가
여러 개 섞입니다. 그러면 검색에 걸리기는 해도 "질문과 정확히 관련된 조항 하나"를 집어내기
어려워집니다. 형식은 못 믿더라도 내용의 성격에는 맞춰 더 짧게 잡은 것입니다.

오버랩이 고정 길이 쪽에만 있는 것도 이유가 있습니다 — 길이로 자르면 문장 중간이 잘려 문맥을 잃으니
겹침으로 보완해야 하지만, 조항 단위로 자르면 경계가 이미 의미 단위와 맞아서 겹칠 필요가 없습니다.

두 파일을 나란히 열어 비교해보면 "청킹 전략은 정답이 하나가 아니라 문서 특성에 맞춰 조정하는 것"이라는
감각을 얻을 수 있습니다.
