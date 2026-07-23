# ML 튜토리얼 프로젝트

Google Colab에서 실습하는 머신러닝/LLM 입문 튜토리얼 저장소입니다. 성격이 다른 세 종류의 콘텐츠로
구성되어 있습니다.

| 구분 | 위치 | 성격 |
|---|---|---|
| ① 이론 커리큘럼 | `notebooks/ml-curriculum/` | scikit-learn/PyTorch로 배우는 전통적인 머신러닝·딥러닝 입문 (이론 + 실습 + 연습문제) |
| ② 라이브러리 실습 | `notebooks/rag-pipeline-practice/` | 문서 기반 LLM 앱(크롤링→청킹→구조화→RAG)에 쓰이는 라이브러리를 Colab에서 손으로 익히는 실습 |
| ③ 실전 예제 | `example-projects/` | ②에서 익힌 라이브러리로 실제 동작하는 미니 프로젝트 4개를 이어붙인 파이프라인 |

①은 ②/③과 주제가 겹치지 않는 별도 커리큘럼입니다. ②와 ③은 같은 파이프라인(사내 규정 검색 챗봇)을
다루며, ②는 "라이브러리 하나씩 실습", ③은 "그 라이브러리들로 만든 실제 프로젝트"라는 관계입니다.

## 학습 가이드 — 어떻게 진행하면 되나요?

**목표에 따라 시작 지점이 다릅니다.**

- **머신러닝/딥러닝을 처음부터 배우고 싶다** → `notebooks/ml-curriculum/` 01번부터 순서대로.
  자세한 목차는 **[CURRICULUM.md](CURRICULUM.md)** 참고.
- **LLM/RAG 앱을 만들 때 쓰는 라이브러리(크롤링, 청킹, 구조화 출력, 임베딩/벡터 검색)를 익히고 싶다,
  ML 기초는 필요 없다** → `notebooks/rag-pipeline-practice/` 01 → 02 → 03 → 04 순서대로. Colab에서
  API 키나 Docker 없이도 끝까지 실행되도록 만들어져 있어 설치 걱정 없이 바로 시작할 수 있습니다.
- **동작하는 실전 코드/프로젝트 구조를 보고 싶다** → `example-projects/` 참고. 각 프로젝트는
  로컬 실행 시 PostgreSQL/OpenSearch(Docker)와 OpenAI API 키가 필요합니다.

**전부 다 해보고 싶다면 이 순서를 추천합니다.**

1. `notebooks/rag-pipeline-practice/01~04` — Colab에서 설치 없이 개념과 라이브러리 사용법을 먼저 손에 익힙니다.
2. `example-projects/` — 같은 파이프라인을 실제 인프라(PostgreSQL, OpenSearch)와 진짜 API로 동작시켜봅니다.
   시작하기 전에 **[example-projects/README.md](example-projects/README.md)**의 파이프라인 다이어그램을
   먼저 읽으면 4개 프로젝트가 어떻게 이어지는지 한눈에 파악됩니다.
3. (선택) `notebooks/ml-curriculum/01~06` — ML/딥러닝 기초 이론까지 확장하고 싶을 때.

각 단계 안에서도 `_solutions.ipynb`(rag-pipeline-practice, ml-curriculum 02~06)는 정답 코드이므로
먼저 혼자 풀어본 뒤에 열어보는 걸 권장합니다.

## 바로 열기 (Colab 배지)

배지를 클릭하면 각 노트북이 Colab에서 바로 열립니다 (GitHub 저장소: [karzit/temp](https://github.com/karzit/temp)).

### ① ml-curriculum

| 노트북 | 열기 |
|---|---|
| 01. 기본 분류 (scikit-learn) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/ml-curriculum/01_basic_classification/01_basic_classification.ipynb) |
| 02. Linear Regression | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/ml-curriculum/02_linear_regression/02_linear_regression.ipynb) |
| 03. Classification | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/ml-curriculum/03_classification/03_classification.ipynb) |
| 04. Neural Networks | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/ml-curriculum/04_neural_networks/04_neural_networks.ipynb) |
| 05. CNN | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/ml-curriculum/05_cnn/05_cnn.ipynb) |
| 06. RNN | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/ml-curriculum/06_rnn/06_rnn.ipynb) |

### ② rag-pipeline-practice

| 노트북 | 열기 |
|---|---|
| 01. 웹 크롤링 (requests + BeautifulSoup) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/01_web_crawling/01_web_crawling.ipynb) |
| 02. 텍스트 청킹 & PDF 처리 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/02_text_chunking/02_text_chunking.ipynb) |
| 03. 문서 구조화 (Pydantic + OpenAI) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/03_document_structuring/03_document_structuring.ipynb) |
| 04. RAG 파이프라인 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/04_rag_pipeline/04_rag_pipeline.ipynb) |

## 폴더 구조 (각 폴더에는 무엇이 있나요)

```
notebooks/
  ml-curriculum/                이론 커리큘럼 (①) — scikit-learn/PyTorch
    01_basic_classification/    scikit-learn 파이프라인 입문
    02_linear_regression/       Lec 1-4: Linear Regression
    03_classification/          Lec 5-6: Logistic/Softmax Regression
    04_neural_networks/         Lec 7-10: 실전 팁, XOR, ReLU, Dropout, MNIST
    05_cnn/                     Lec 11: CNN
    06_rnn/                     Lec 12: RNN
  rag-pipeline-practice/        라이브러리 실습 (②) — example-projects와 1:1 대응
    01_web_crawling/            requests + BeautifulSoup 크롤링, sqlite3/dotenv 실습 (crawl-storage-example)
    02_text_chunking/           langchain-text-splitters, PyMuPDF/pypdf, tiktoken 실습 (preprocess/rag-regulation-example)
    03_document_structuring/    Pydantic + OpenAI 정형 출력, Streamlit 실습 (document-input-example)
    04_rag_pipeline/            임베딩, 벡터 유사도 검색, opensearch-py, 프롬프트 조립 실습 (rag-regulation-example)

example-projects/               실전 예제 (③) — 자세한 내용은 example-projects/README.md
  crawl-storage-example/        [A-1] 웹 크롤링 -> PostgreSQL 원본 저장
  preprocess-example/           [A-2] PostgreSQL 원본 -> 청킹 -> OpenSearch 인덱싱
  document-input-example/       [B]   서류 사진 -> OCR -> LLM 정형 출력(JSON), Streamlit UI
  rag-regulation-example/       [C]   PDF/OpenSearch 검색 -> LLM 응답(RAG)

data/          직접 추가하거나 노트북이 내려받는 데이터셋 (git에는 커밋 안 됨)
models/        학습된 모델 저장 위치 (git에는 커밋 안 됨)
CURRICULUM.md  ①의 이론+실습 목차 (원본 강의 매핑 포함)
requirements.txt
```

각 노트북은 `notebooks/<시리즈>/<주제>/`처럼 시리즈별 하위 폴더에 있습니다. `ml-curriculum` 노트북 안에서
데이터/모델 폴더는 `../../../data`, `../../../models`로 참조하고(프로젝트 루트 기준 3단계 아래에 위치하므로),
`rag-pipeline-practice` 노트북은 예제 프로젝트를 `../../../example-projects/...`로 참조합니다.

## Colab에서 열기

**방법 A — 배지 클릭 (가장 쉬움)**
위 표의 배지를 클릭하면 바로 Colab에서 열립니다.

**방법 B — GitHub 탭에서 직접 탐색**
1. [colab.research.google.com](https://colab.research.google.com) 접속
2. 파일 → GitHub 탭 → 저장소 `karzit/temp` 입력 → 노트북 선택
3. Colab에서 수정한 내용은 "GitHub에 사본 저장"으로 다시 push 가능

**방법 C — Google Drive**
1. 이 프로젝트 폴더를 Google Drive에 업로드
2. 노트북 첫 코드 셀에서 `drive.mount('/content/drive')` 주석 해제 후 실행

## 로컬에서 실행하려면

```bash
pip install -r requirements.txt
jupyter notebook notebooks/ml-curriculum/01_basic_classification/01_basic_classification.ipynb
```

`example-projects/`의 각 프로젝트는 별도의 `requirements.txt`와 `.env.example`을 가지고 있고,
`crawl-storage-example`/`preprocess-example`/`rag-regulation-example`은 PostgreSQL 또는 OpenSearch를
Docker로 띄워야 합니다. 실행 방법은 각 프로젝트 폴더의 `README.md`를 참고하세요.

## 다음 튜토리얼 아이디어
- PyTorch로 이미지 분류 (CNN, MNIST/CIFAR-10)
- Hugging Face Transformers로 텍스트 분류
- 자신의 CSV 데이터셋으로 파이프라인 재사용
- `example-projects/` 4개를 실제로 이어서 실행하는 통합 데모 스크립트/가이드
