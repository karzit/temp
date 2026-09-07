# RAG 파이프라인 라이브러리 실습 (rag-pipeline-practice)

**"우리 회사 규정을 물어보면 답해주는 챗봇"을 만드는 데 쓰이는 라이브러리를 하나씩 손에 익히는**
5개 노트북입니다.

ChatGPT에게 "우리 회사 육아휴직은 몇 개월까지야?"라고 물으면 답을 못 합니다. 그 회사 규정을
배운 적이 없기 때문입니다. 그러면 **질문할 때 규정 문서를 같이 넣어주면** 됩니다.
말은 간단한데, 그러려면 문서를 모으고(01) 자르고(02) 형식을 맞추고(03) 질문에 맞는 조각을
찾아내야(04) 합니다. 그리고 그 문서가 안전하다는 보장이 없다는 것도 알아야 합니다(05).

**API 키도 Docker도 없이 Colab에서 5개 노트북이 전부 끝까지 실행됩니다.** 키가 없으면
대체 경로로 자동 전환되도록 만들어져 있습니다(아래 "무엇이 없어도 되나" 참고).

## 구성

| 노트북 | 다루는 라이브러리 | 다루는 내용 | 소요 | Colab | 해설 |
|---|---|---|---|---|---|
| [01. 웹 크롤링](01_web_crawling/01_web_crawling.ipynb) | `requests`, `BeautifulSoup`, `python-dotenv`, `sqlite3` | 페이지 가져오기와 한글 인코딩, HTML에서 글자만 뽑기, 설정값 분리, **같은 URL을 두 번 긁어도 중복이 안 생기게**(UPSERT), 바이너리 저장 | 30~40분 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/01_web_crawling/01_web_crawling.ipynb) | [해설](01_web_crawling/01_web_crawling_solutions.ipynb) |
| [02. 텍스트 청킹 & PDF](02_text_chunking/02_text_chunking.ipynb) | `langchain-text-splitters`, `PyMuPDF`, `pypdf`, `tiktoken`, `kiwipiepy` | `chunk_size`/`chunk_overlap`이 검색 품질을 어떻게 바꾸는지, PDF에서 텍스트·메타데이터 추출, **출처를 유지한 채 자르기**, 토큰 세기, 형태소로 명사 뽑기 | 40~50분 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/02_text_chunking/02_text_chunking.ipynb) | [해설](02_text_chunking/02_text_chunking_solutions.ipynb) |
| [03. 문서 구조화](03_document_structuring/03_document_structuring.ipynb) | `pydantic`, `openai`, `streamlit` | 지저분한 OCR 원문에서 JSON 꺼내기, **파이썬 클래스가 그대로 LLM에게 주는 지시가 되는 것**(정형 출력), 스키마 검증, 앱 형태 | 30~40분 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/03_document_structuring/03_document_structuring.ipynb) | [해설](03_document_structuring/03_document_structuring_solutions.ipynb) |
| [04. RAG 파이프라인](04_rag_pipeline/04_rag_pipeline.ipynb) | `openai`(임베딩), `numpy`, `rank_bm25`, `opensearch-py`, `fastapi` | 임베딩과 코사인 유사도, **글자가 하나도 안 겹치는 질문 찾아내기**, BM25 키워드 검색, RRF 하이브리드, 프롬프트 조립(그라운딩), 답변 생성, API로 감싸기 | 55~65분 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/04_rag_pipeline/04_rag_pipeline.ipynb) | [해설](04_rag_pipeline/04_rag_pipeline_solutions.ipynb) |
| [05. 프롬프트 인젝션 방어](05_prompt_injection_defense/05_prompt_injection_defense.ipynb) | (라이브러리보다 설계) | 오염된 검색 결과 재현, **실제로 뚫리는 것 확인**, 데이터와 지시 분리, 인덱싱 전 가드레일 | 30~40분 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/05_prompt_injection_defense/05_prompt_injection_defense.ipynb) | [해설](05_prompt_injection_defense/05_prompt_injection_defense_solutions.ipynb) |

각 노트북 끝에 연습 문제가 있고, `_solutions.ipynb`에 정답 코드와 해설이 있습니다.
**먼저 직접 풀어본 뒤** 열어보는 걸 권장합니다.

**순서대로 보세요.** 다섯 노트북이 하나의 파이프라인을 앞에서부터 이어 만듭니다.

```
[01 크롤링] → [02 청킹] → [03 구조화] → [04 검색·답변] → [05 방어]
  문서를 모은다   잘라둔다    형식을 맞춘다   찾아서 답한다   구멍을 막는다
```

## 이 시리즈를 관통하는 주제 — 앞 단계의 결정이 뒤에서 청구서로 돌아온다

파이프라인을 나눠 배우면 각 단계가 독립적으로 보입니다. 실제로는 **앞에서 대충 넘어간 것이
뒤에서 반드시 문제로 돌아옵니다.** 이 시리즈는 그 연결을 일부러 눈에 보이게 배치했습니다.

| 앞에서 한 결정 | 뒤에서 돌아오는 곳 |
|---|---|
| 01 — `raise_for_status()`를 안 넣는다 | 404 페이지의 "Not Found" 화면을 **정상 문서인 줄 알고 저장**합니다 |
| 01 — `get_text()`로 글자를 다 긁는다 | 05 — 흰색 글씨·0px 폰트로 **숨겨둔 공격 문장까지 딸려 들어옵니다** |
| 02 — 자르기 전에 메타데이터를 안 붙인다 | 04 — 답변에 **출처를 달 수 없습니다.** 조각은 찾았는데 어디서 왔는지 모릅니다 |
| 02 — 조항 한가운데서 자른다 | 04 — "육아휴직은 최대"에서 끊긴 조각은 **아무리 잘 찾아내도 답이 안 됩니다** |
| 03 — `Field(description=...)`을 대충 쓴다 | 그 문장이 곧 LLM에게 주는 지시라, **출력 형식이 그대로 흔들립니다** |
| 04 — 검색 결과를 프롬프트에 그대로 끼운다 | 05 — LLM에게는 전체가 하나의 긴 글이라 **심어진 문장을 지시로 착각합니다** |

특히 **05번은 04번을 되돌아보는 장**입니다. 04번에서 만든 챗봇이 잘 돌아가는 것을 확인한
직후에, 같은 챗봇이 뚫리는 것을 봅니다. 순서를 지켜야 이 장면이 성립합니다.

## 무엇이 없어도 되나

**설치도 결제도 없이 시작할 수 있게** 만들어져 있습니다. 원래 필요한 것이 없으면 이렇게 대체됩니다.

| 원래 필요한 것 | 없을 때 |
|---|---|
| OpenAI API 키 (03 정형 출력) | 정규식 기반 대체 함수로 자동 전환 |
| OpenAI API 키 (04 임베딩) | TF-IDF 임베딩으로 자동 전환 |
| OpenSearch + Docker (04) | 파이썬 리스트에 담아 인메모리로 검색 |
| PostgreSQL (01) | `sqlite3` — 같은 스키마로 실습하고, 실제 `psycopg2` 버전도 함께 보여줍니다 |

키가 있으면 실제 호출로 동작합니다. **키를 넣었을 때와 안 넣었을 때 무엇이 달라지는지도
노트북 안에서 설명합니다.** 01번만 실제 웹사이트에 요청을 보내므로 인터넷 연결이 필요합니다
(크롤링 연습을 허용하는 `toscrape.com`을 씁니다).

## 다른 시리즈와의 관계

| 시리즈 | 관계 |
|---|---|
| [`project-walkthrough`](../project-walkthrough/README.md) | **같은 프로젝트를 반대 각도에서.** 이쪽이 "`BeautifulSoup`은 어떻게 쓰나"라면 저쪽은 "이 프로젝트는 왜 이렇게 짰나"입니다. **번호가 같으면 같은 프로젝트**입니다 |
| [`example-projects`](../../example-projects/README.md) | 여기서 익힌 라이브러리로 만든 **실제로 동작하는 프로젝트**. 인프라와 키가 필요합니다 |
| [`ml-curriculum`](../../CURRICULUM.md) | 선수 과목이 아닙니다. **①을 몰라도 이 시리즈를 시작할 수 있습니다.** LLM을 직접 만드는 것이 아니라 이미 만들어진 것을 가져다 쓰기 때문입니다 |
| [`text-classification-practice`](../text-classification-practice/README.md) | 같은 "텍스트"지만 목적이 다릅니다. 저쪽은 **분류**, 이쪽은 **검색과 생성**입니다. 임베딩은 양쪽에 다 나옵니다 |

②와 ③′의 대응은 이렇습니다.

| # | ② 라이브러리 실습 (여기) | ③′ 프로젝트 동행 | ③ 대상 프로젝트 |
|---|---|---|---|
| 01 | `01_web_crawling` | `01_crawl_storage` | `crawl-storage-example` |
| 02 | `02_text_chunking` | `02_preprocess` | `preprocess-example`(청킹은 `rag-regulation-example`도) |
| 03 | `03_document_structuring` | `03_document_input` | `document-input-example` |
| 04 | `04_rag_pipeline` | `04_rag_regulation` | `rag-regulation-example` |
| 05 | `05_prompt_injection_defense` | — | `rag-regulation-example` 확장 |

## 막혔을 때

- 낯선 용어는 [glossary.md](../../glossary.md)의 "3. RAG/LLM 실습" 섹션에서 찾아보세요
- 에러가 나면 [troubleshooting.md](../../troubleshooting.md)를 보세요. 설치 실패·한글 깨짐·`NameError`·API 키 문제를 모아뒀습니다
- 각 노트북 앞부분에도 **"막혔을 때 — 이 노트북에서 자주 나오는 증상"** 절이 따로 있습니다

## 다음으로 해볼 만한 것

- **[`project-walkthrough`](../project-walkthrough/README.md)** — 직접 만들어본 것들이 실제 프로젝트에서 어떻게 조립되어 있는지. 인프라 없이 Colab에서 돕니다
- **[`example-projects`](../../example-projects/README.md)** — 같은 파이프라인을 PostgreSQL·OpenSearch·진짜 API로 동작시키기
- 각 프로젝트의 `ALTERNATIVES.md` — 여기서 쓴 라이브러리 말고 어떤 선택지가 있는지, 왜 이걸 골랐는지
