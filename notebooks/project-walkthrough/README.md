# project-walkthrough: 예제 프로젝트 동행 노트북

`example-projects/`의 네 프로젝트를 **하나씩 옆에 펼쳐놓고 같이 읽는** 노트북 시리즈입니다.
프로젝트마다 노트북 하나가 1:1로 대응합니다.

| 노트북 | 대상 프로젝트 | 다루는 것 | 소요 | Colab | 해설 |
|---|---|---|---|---|---|
| [01. crawl-storage](01_crawl_storage/01_crawl_storage.ipynb) | [`crawl-storage-example`](../../example-projects/crawl-storage-example) (A-1) | 크롤링, 원본 보관, UPSERT, 실패 격리 | 30~40분 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/project-walkthrough/01_crawl_storage/01_crawl_storage.ipynb) | [해설](01_crawl_storage/01_crawl_storage_solutions.ipynb) |
| [02. preprocess](02_preprocess/02_preprocess.ipynb) | [`preprocess-example`](../../example-projects/preprocess-example) (A-2) | 형식 통일, 정제, 청킹, 형태소 키워드 | 40~50분 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/project-walkthrough/02_preprocess/02_preprocess.ipynb) | [해설](02_preprocess/02_preprocess_solutions.ipynb) |
| [03. document-input](03_document_input/03_document_input.ipynb) | [`document-input-example`](../../example-projects/document-input-example) (B) | OCR, 정형 출력, 스키마 검증, fail fast | 30~40분 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/project-walkthrough/03_document_input/03_document_input.ipynb) | [해설](03_document_input/03_document_input_solutions.ipynb) |
| [04. rag-regulation](04_rag_regulation/04_rag_regulation.ipynb) | [`rag-regulation-example`](../../example-projects/rag-regulation-example) (C) | 구조 파싱, 조항 청킹, 하이브리드 검색, 리랭킹, 평가 | 60~70분 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/project-walkthrough/04_rag_regulation/04_rag_regulation.ipynb) | [해설](04_rag_regulation/04_rag_regulation_solutions.ipynb) |

각 `_solutions.ipynb`는 본문 끝 "연습 문제"의 정답 코드와 해설입니다.
먼저 직접 풀어본 뒤에 열어보세요.

## `rag-pipeline-practice`와 뭐가 다른가

같은 프로젝트를 다루지만 **보는 각도가 다릅니다.**

| | `rag-pipeline-practice` | `project-walkthrough` (이 시리즈) |
|---|---|---|
| 축 | **기법별** — 라이브러리 하나씩 | **프로젝트별** — 완성된 코드 하나씩 |
| 코드 | 노트북 안에서 새로 작성 | **프로젝트 파일을 그대로 열고 import** |
| 질문 | "`BeautifulSoup`은 어떻게 쓰나?" | "이 프로젝트는 왜 이렇게 짰나?" |
| 목적 | 도구를 손에 익히기 | 남의 코드를 읽고 이어받기 |

둘 다 봐도 되고, 한쪽만 봐도 됩니다.

- **라이브러리가 처음이다** → `rag-pipeline-practice` 먼저
- **코드는 좀 읽을 줄 아는데 이 프로젝트를 넘겨받았다** → 이 시리즈부터

## 어떻게 동작하나

각 노트북의 첫 셀이 저장소를 통째로 내려받아, **진짜 프로젝트 파일**을 엽니다.
설명을 옮겨 적은 게 아니라 `show("crawl.py")`로 실제 소스를 출력하고,
그 안의 함수를 `from crawl import extract_text_from_html`처럼 직접 import해서 돌립니다.
노트북과 코드가 어긋날 일이 없습니다.

**PostgreSQL, OpenSearch, OpenAI 키, Google Vision 없이 전부 실행됩니다.** 이렇게 대체합니다.

| 원래 필요한 것 | 노트북에서 대신 쓰는 것 |
|---|---|
| PostgreSQL | SQLite (같은 스키마, 문법 차이는 노트북에서 설명) |
| OpenSearch + OpenAI 임베딩 | TF-IDF 인메모리 검색 |
| OpenAI 정형 출력 | 규칙 기반 대체 함수 (키가 있으면 실제 호출) |
| Google Vision OCR | OCR 결과를 흉내 낸 텍스트 |
| DB 저장 함수 | 몽키패칭으로 교체 (테스트에서 실제로 쓰는 기법) |

대체한 부분은 노트북에서 **"원래는 이렇게 동작한다"를 함께 설명**합니다.

## 순서

01 → 02 → 03 → 04 순으로 데이터가 흐릅니다. 처음이면 순서대로 보는 걸 권합니다.
다만 각 노트북은 독립적으로 실행되므로, 관심 있는 프로젝트만 골라 봐도 됩니다.

04는 앞의 셋을 안 봤어도 따라갈 수 있게 쓰여 있고, 이 시리즈에서 가장 깁니다.
**구조 파싱 → 조항 청킹 → 하이브리드 검색 → 리랭킹 → 평가**까지 다룹니다.
