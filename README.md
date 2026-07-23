# ML 튜토리얼 프로젝트

Google Colab에서 실습하는 머신러닝 입문 튜토리얼입니다. 노트북은 성격이 다른 두 시리즈로 나뉘어 있습니다.

- **`notebooks/ml-curriculum/`**: scikit-learn/PyTorch 기반 머신러닝·딥러닝 입문 커리큘럼
  - `01_basic_classification/`: scikit-learn으로 Iris 분류 파이프라인(로드 → EDA → 전처리 → 학습 → 평가 → 저장) 감 잡기
  - `02~06`: 김성훈 교수님의 [모두를 위한 머신러닝과 딥러닝](https://hunkim.github.io/ml/) 시즌 1 커리큘럼을 이론+실습으로 재구성한 시리즈 — 자세한 목차와 학습 순서는 **[CURRICULUM.md](CURRICULUM.md)** 참고
- **`notebooks/rag-pipeline-practice/`**: [`example-projects/`](example-projects)의 4개 예제 프로젝트(크롤링 → 청킹 → 문서 구조화 → RAG)에서 쓰인 라이브러리(`requests`/`BeautifulSoup`, `langchain-text-splitters`/`PyMuPDF`/`pypdf`/`tiktoken`, `pydantic`/`openai`, 임베딩/벡터 검색)를 실습하는 시리즈. Docker나 API 키가 없어도 끝까지 실행되도록 만들어져 있습니다(자세한 내용은 각 노트북 상단 이론 참고).

## 바로 열기 (Colab 배지)

배지를 클릭하면 각 노트북이 Colab에서 바로 열립니다 (GitHub 저장소: [karzit/temp](https://github.com/karzit/temp)).

### ml-curriculum

| 노트북 | 열기 |
|---|---|
| 01. 기본 분류 (scikit-learn) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/ml-curriculum/01_basic_classification/01_basic_classification.ipynb) |
| 02. Linear Regression | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/ml-curriculum/02_linear_regression/02_linear_regression.ipynb) |
| 03. Classification | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/ml-curriculum/03_classification/03_classification.ipynb) |
| 04. Neural Networks | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/ml-curriculum/04_neural_networks/04_neural_networks.ipynb) |
| 05. CNN | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/ml-curriculum/05_cnn/05_cnn.ipynb) |
| 06. RNN | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/ml-curriculum/06_rnn/06_rnn.ipynb) |

### rag-pipeline-practice

| 노트북 | 열기 |
|---|---|
| 01. 웹 크롤링 (requests + BeautifulSoup) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/01_web_crawling/01_web_crawling.ipynb) |
| 02. 텍스트 청킹 & PDF 처리 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/02_text_chunking/02_text_chunking.ipynb) |
| 03. 문서 구조화 (Pydantic + OpenAI) | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/03_document_structuring/03_document_structuring.ipynb) |
| 04. RAG 파이프라인 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/04_rag_pipeline/04_rag_pipeline.ipynb) |

## 폴더 구조

```
notebooks/
  ml-curriculum/
    01_basic_classification/   scikit-learn 파이프라인 입문
    02_linear_regression/      Lec 1-4: Linear Regression
    03_classification/         Lec 5-6: Logistic/Softmax Regression
    04_neural_networks/        Lec 7-10: 실전 팁, XOR, ReLU, Dropout, MNIST
    05_cnn/                    Lec 11: CNN
    06_rnn/                    Lec 12: RNN
  rag-pipeline-practice/
    01_web_crawling/           requests + BeautifulSoup 크롤링, sqlite3/dotenv 실습 (crawl-storage-example)
    02_text_chunking/          langchain-text-splitters, PyMuPDF/pypdf, tiktoken 실습 (preprocess/rag-regulation-example)
    03_document_structuring/   Pydantic + OpenAI 정형 출력, Streamlit 실습 (document-input-example)
    04_rag_pipeline/           임베딩, 벡터 유사도 검색, opensearch-py, 프롬프트 조립 실습 (rag-regulation-example)
example-projects/  실전 예제 프로젝트 4종 (rag-pipeline-practice 노트북이 여기서 쓰인 라이브러리를 실습용으로 재구성)
data/          직접 추가하거나 노트북이 내려받는 데이터셋 (git에는 커밋 안 됨)
models/        학습된 모델 저장 위치 (git에는 커밋 안 됨)
CURRICULUM.md  이론+실습 커리큘럼 목차 (원본 강의 매핑 포함, ml-curriculum 시리즈)
requirements.txt
```

각 노트북은 `notebooks/<시리즈>/<주제>/`처럼 시리즈별 하위 폴더에 있습니다. `ml-curriculum` 노트북 안에서 데이터/모델 폴더는 `../../../data`, `../../../models`로 참조하고(프로젝트 루트 기준 3단계 아래에 위치하므로), `rag-pipeline-practice` 노트북은 예제 프로젝트를 `../../../example-projects/...`로 참조합니다.

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

## 다음 튜토리얼 아이디어
- PyTorch로 이미지 분류 (CNN, MNIST/CIFAR-10)
- Hugging Face Transformers로 텍스트 분류
- 자신의 CSV 데이터셋으로 파이프라인 재사용
