# 용어집

이 프로젝트 전체(① ml-curriculum, ② rag-pipeline-practice, ③ example-projects)에서 반복적으로 등장하는
용어를 모아둔 통합 용어집입니다. 각 노트북/README에서 낯선 용어를 만나면 `[용어](../glossary.md#anchor)`
링크를 눌러 여기로 돌아와 확인하면 됩니다.

## 목차

- [1. 공통 기초 개념](#1-공통-기초-개념)
- [2. ML/DL 이론 (ml-curriculum)](#2-mldl-이론-ml-curriculum)
- [3. RAG/LLM 실습 (rag-pipeline-practice)](#3-ragllm-실습-rag-pipeline-practice)
- [4. 인프라/도구 (example-projects)](#4-인프라도구-example-projects)
- [5. 개발 생태계 기초 (Python)](#5-개발-생태계-기초-python)

---

## 1. 공통 기초 개념

#### <a id="supervised-learning"></a>지도학습 (Supervised Learning)
입력과 정답(label)이 쌍으로 있는 데이터로 모델을 학습시키는 방식. 회귀와 분류가 대표적이다.

#### <a id="unsupervised-learning"></a>비지도학습 (Unsupervised Learning)
정답 없이 데이터 자체의 구조(군집 등)를 학습하는 방식.

#### <a id="feature"></a>특성/피처 (Feature)
모델이 예측에 사용하는 입력 변수(예: 공부 시간, 나이). 데이터의 각 열에 해당한다.

#### <a id="label"></a>라벨/타깃 (Label/Target)
모델이 맞혀야 하는 정답 값.

#### <a id="train-test-split"></a>학습/테스트 분리 (Train/Test Split)
모델이 실제로 일반화되는지 확인하기 위해 학습에 쓰지 않은 데이터로 따로 평가하는 절차.

#### <a id="overfitting"></a>과적합 (Overfitting)
모델이 학습 데이터에만 지나치게 맞춰져서 새로운 데이터에는 성능이 떨어지는 현상.

#### <a id="regularization"></a>정규화/규제 (Regularization)
과적합을 줄이기 위해 모델의 복잡도를 억제하는 기법들의 총칭([드롭아웃](#dropout) 등).

#### <a id="scaling"></a>스케일링 (Scaling / StandardScaler)
특성들의 단위(스케일)를 맞춰주는 전처리. 특성 간 단위 차이가 크면 학습이 비효율적이거나 왜곡될 수 있다.

#### <a id="eda"></a>탐색적 데이터 분석 (EDA, Exploratory Data Analysis)
모델링 전에 데이터의 분포와 특성을 시각화·요약해 살펴보는 단계.

#### <a id="hyperparameter"></a>하이퍼파라미터 (Hyperparameter)
학습률, epoch 수처럼 학습 전에 사람이 직접 정해주는 설정값(학습되는 가중치와 구분됨).

#### <a id="epoch"></a>에폭 (Epoch)
전체 학습 데이터를 한 번 다 사용해 학습하는 단위.

#### <a id="generalization"></a>일반화 (Generalization)
학습에 쓰지 않은 새로운 데이터에서도 모델이 잘 동작하는 능력.

## 2. ML/DL 이론 (ml-curriculum)

#### <a id="numpy"></a>NumPy
파이썬에서 다차원 배열(`ndarray`)과 행렬 연산을 다루는 기본 라이브러리. 브로드캐스팅으로 반복문 없이
원소별 연산을 수행할 수 있어, [Gradient Descent](#gradient-descent)를 직접 구현할 때처럼 수식을
그대로 코드로 옮길 수 있다. `00_python_essentials`에서 기본기를 실습한다.

#### <a id="pandas"></a>Pandas
표(행/열) 형태 데이터를 다루는 라이브러리. `DataFrame`으로 CSV 등을 불러와 필터링, 정렬, `groupby`
집계를 수행한다. `00_python_essentials`에서 기본기를 실습한다.

#### <a id="pytorch"></a>PyTorch
딥러닝 모델을 만들고 학습시키는 프레임워크. [NumPy](#numpy)와 유사한 `Tensor` 연산에 더해, 미분을
자동으로 계산해주는 **autograd**(`.backward()`)를 제공해 [Backpropagation](#backpropagation)을
직접 구현하지 않아도 된다. `04_neural_networks`부터 본격적으로 사용하며, `00_python_essentials`에서
기본기를 실습한다.

#### <a id="tensorflow"></a>TensorFlow
Google이 만든 딥러닝 프레임워크. [PyTorch](#pytorch)와 마찬가지로 `Tensor` 연산과 자동미분
(`tf.GradientTape`)을 제공하며, 원본 강의([모두를 위한 머신러닝과 딥러닝](https://hunkim.github.io/ml/))가
사용한 프레임워크다. 이 커리큘럼은 최신 Colab 환경 호환을 위해 PyTorch로 다시 작성했지만,
`07_tensorflow_practice`에서 TensorFlow/Keras 버전을 별도로 실습할 수 있다.

#### <a id="keras"></a>Keras (`tf.keras`)
TensorFlow에 내장된 고수준 신경망 API. `Sequential`로 레이어를 쌓고 `compile`/`fit`으로 학습 루프를
대신 처리해준다. PyTorch의 `nn.Sequential` + 직접 짠 학습 루프에 대응된다.

#### <a id="gradienttape"></a>GradientTape (`tf.GradientTape`)
TensorFlow의 자동미분 도구. `with tf.GradientTape():` 블록 안에서 실행된 연산만 미분 대상으로
기록하고, `tape.gradient(cost, [변수들])`로 gradient를 계산한다. PyTorch의
`requires_grad=True` + `.backward()`에 대응하지만, 추적 범위를 명시적으로 지정한다는 점이 다르다.

#### <a id="hypothesis"></a>가설 함수 (Hypothesis, H(x))
입력으로부터 출력을 예측하는 모델의 수식 형태 (예: H(x) = Wx + b).

#### <a id="weight-bias"></a>가중치와 편향 (Weight & Bias, W/b)
모델이 데이터로부터 학습해서 조정하는 파라미터. W는 입력의 중요도, b는 기준점을 결정한다.

#### <a id="cost-function"></a>비용/손실 함수 (Cost/Loss Function)
모델의 예측이 실제 값과 얼마나 다른지를 하나의 숫자로 나타내는 함수. 학습은 이 값을 최소화하는 과정이다.

#### <a id="mse"></a>평균 제곱 오차 (MSE, Mean Squared Error)
예측값과 실제값 차이를 제곱해 평균낸 회귀 문제의 대표적인 비용 함수.

#### <a id="gradient-descent"></a>경사 하강법 (Gradient Descent)
[비용 함수](#cost-function)의 기울기(미분값) 반대 방향으로 파라미터를 조금씩 이동시켜 최솟값을 찾는 최적화 알고리즘.

#### <a id="learning-rate"></a>학습률 (Learning Rate)
[경사 하강법](#gradient-descent)에서 한 번에 얼마나 이동할지 정하는 값. 너무 크면 발산하고 너무 작으면 학습이 느리다.

#### <a id="logistic-regression"></a>로지스틱 회귀 (Logistic Regression)
[시그모이드](#sigmoid) 함수로 선형 결합값을 0~1 확률로 변환해 이진 분류를 수행하는 모델.

#### <a id="sigmoid"></a>시그모이드 함수 (Sigmoid)
입력값을 0과 1 사이 값으로 눌러주는 S자 모양 함수. 확률 표현에 쓰인다.

#### <a id="cross-entropy"></a>교차 엔트로피 (Cross-Entropy)
분류 문제에서 확률 예측이 실제 라벨과 얼마나 다른지 측정하는 비용 함수. Logistic/Softmax Regression에 사용된다.

#### <a id="softmax-regression"></a>소프트맥스 회귀 (Softmax Regression)
클래스가 3개 이상인 다중 분류에서, 각 클래스 점수를 확률 분포로 변환하는 방법.

#### <a id="one-hot-encoding"></a>원-핫 인코딩 (One-hot Encoding)
범주형 라벨을 하나의 값만 1이고 나머지는 0인 벡터로 표현하는 방식.

#### <a id="decision-boundary"></a>결정 경계 (Decision Boundary)
분류 모델이 서로 다른 클래스를 나누는 기준선(또는 곡면).

#### <a id="xor-problem"></a>XOR 문제
하나의 직선으로는 나눌 수 없는 대표적인 비선형 분류 문제. 단일 퍼셉트론으로 풀 수 없어 다층 신경망의 필요성을 보여준다.

#### <a id="hidden-layer"></a>은닉층/은닉 유닛 (Hidden Layer/Unit)
입력층과 출력층 사이에 있는 신경망의 중간 계층으로, 복잡한 패턴을 표현할 수 있게 해준다.

#### <a id="backpropagation"></a>역전파 (Backpropagation)
출력에서 발생한 오차를 체인 룰로 역방향 전파해 각 층의 가중치에 대한 그래디언트를 계산하는 알고리즘.

#### <a id="vanishing-gradient"></a>기울기 소실 (Vanishing Gradient)
층이 깊어질수록 역전파되는 그래디언트가 0에 가까워져 학습이 잘 안 되는 문제.

#### <a id="relu"></a>ReLU (Rectified Linear Unit)
f(x)=max(0,x) 형태의 활성화 함수로, [기울기 소실](#vanishing-gradient) 문제를 완화하며 깊은 신경망에서 널리 쓰인다.

#### <a id="weight-initialization"></a>가중치 초기화 (Weight Initialization)
신경망 학습 시작 전 가중치를 어떻게 설정할지 정하는 방법(Xavier/He 초기화 등). 0으로 초기화하면 학습이 되지 않는다.

#### <a id="dropout"></a>드롭아웃 (Dropout)
학습 시 일부 뉴런을 무작위로 꺼서 특정 뉴런 의존을 줄이고 [과적합](#overfitting)을 방지하는 정규화 기법.

#### <a id="cnn"></a>합성곱 신경망 (CNN, Convolutional Neural Network)
이미지의 공간적 구조를 보존하며 지역 패턴을 학습하는 신경망 구조.

#### <a id="convolution"></a>합성곱/필터/커널 (Convolution/Filter/Kernel)
작은 크기의 필터가 이미지를 슬라이딩하며 지역 특징을 추출하는 연산.

#### <a id="feature-map"></a>특성 맵 (Feature Map)
[합성곱](#convolution) 연산의 결과로 만들어지는, 추출된 특징들을 담은 배열.

#### <a id="stride"></a>스트라이드 (Stride)
합성곱 필터가 한 번에 이동하는 간격.

#### <a id="padding"></a>패딩 (Padding)
이미지 가장자리 정보 손실을 막기 위해 테두리에 0 등을 채우는 기법.

#### <a id="weight-sharing"></a>가중치 공유 (Weight Sharing)
같은 필터를 이미지 전체에 반복 적용해 파라미터 수를 줄이는 CNN의 핵심 특성.

#### <a id="pooling"></a>풀링/맥스 풀링 (Pooling/Max Pooling)
[특성 맵](#feature-map)의 크기를 줄여 연산량을 줄이고 위치 변화에 강건하게 만드는 다운샘플링 기법.

#### <a id="rnn"></a>순환 신경망 (RNN, Recurrent Neural Network)
이전 시점의 정보(은닉 상태)를 기억하며 순서가 있는 데이터를 처리하는 신경망.

#### <a id="hidden-state"></a>은닉 상태 (Hidden State)
RNN이 이전 타임스텝의 정보를 요약해 담아두는 벡터로, 다음 타임스텝 계산에 함께 사용된다.

#### <a id="lstm-gru"></a>LSTM/GRU
기본 RNN의 [기울기 소실](#vanishing-gradient) 문제를 완화하기 위해 게이트 구조로 정보를 선택적으로 기억/망각하는 개선된 RNN 계열.

#### <a id="long-term-dependency"></a>장기 의존성 (Long-term Dependency)
시퀀스에서 멀리 떨어진 과거 정보가 현재 예측에 중요한 영향을 미치는 상황.

## 3. RAG/LLM 실습 (rag-pipeline-practice)

#### <a id="crawling"></a>크롤링 (Crawling)
웹사이트에서 자동으로 페이지나 파일을 수집하는 작업.

#### <a id="robots-txt"></a>robots.txt / Crawl-delay
크롤링 허용 범위와 요청 빈도 제한을 사이트가 명시해두는 규칙 파일 및 지시자.

#### <a id="upsert"></a>UPSERT
데이터가 이미 있으면 갱신하고 없으면 새로 삽입하는 DB 연산(`ON CONFLICT ... DO UPDATE`).

#### <a id="raw-vs-processed"></a>원본/가공본 분리 (Raw vs Processed Data)
크롤링한 원본 데이터를 그대로 저장해두고, 이후 별도 단계에서 가공([청킹](#chunking) 등)하는 설계 원칙.

#### <a id="chunking"></a>청킹 (Chunking)
긴 문서를 작은 조각(청크)으로 잘라서, 검색 시 질문과 관련된 부분만 정확히 찾을 수 있게 하는 전처리 과정.

#### <a id="chunk-size-overlap"></a>chunk_size / chunk_overlap
청크 하나의 최대 크기와, 인접한 청크끼리 겹치게 하는 글자 수(문맥 단절 방지용).

#### <a id="recursive-splitter"></a>RecursiveCharacterTextSplitter
LangChain의 텍스트 분할 도구로, 지정된 구분자(문단→줄바꿈→마침표→공백→글자) 순으로 청크 크기를 맞춰 자른다.

#### <a id="token"></a>토큰 (Token)
LLM이 텍스트를 처리하는 최소 단위. 과금과 컨텍스트 제한이 글자 수가 아닌 토큰 수 기준으로 계산된다.

#### <a id="tiktoken"></a>tiktoken
OpenAI 모델이 텍스트를 실제로 몇 개의 [토큰](#token)으로 나누는지 계산해주는 라이브러리.

#### <a id="ocr"></a>OCR (Optical Character Recognition)
이미지 속 글자를 인식해 텍스트로 변환하는 기술.

#### <a id="structured-output"></a>정형 출력/구조화 출력 (Structured Output)
LLM의 응답을 자유 텍스트가 아닌, 미리 정의된 스키마(JSON 등) 형태로 강제해서 받는 방식.

#### <a id="pydantic"></a>Pydantic BaseModel
각 필드의 타입을 미리 정의해두고 그 형식에 맞는 데이터만 받도록 강제하는 파이썬 데이터 검증 라이브러리.

#### <a id="rag"></a>RAG (Retrieval-Augmented Generation, 검색 증강 생성)
관련 문서를 먼저 검색(Retrieval)해서 LLM 프롬프트에 덧붙인(Augmented) 뒤 답을 생성(Generation)하는 방식.

#### <a id="embedding"></a>임베딩 (Embedding)
문장이나 단어를 숫자 벡터(좌표)로 변환해, 의미가 비슷한 텍스트일수록 벡터가 가깝게 만드는 기법.

#### <a id="huggingface"></a>Hugging Face
사전학습 모델(임베딩, LLM 등)과 데이터셋을 공유하는 오픈소스 생태계이자 플랫폼(Model Hub). `transformers` 라이브러리로 모델을 직접 불러와 로컬에서 돌릴 수 있고, `sentence-transformers`는 그중 [임베딩](#embedding) 전용 모델을 다루는 라이브러리다. OpenAI 임베딩/LLM API의 대안으로, 비용 없이 로컬 환경에서(또는 데이터를 외부로 보내지 않고) 처리하고 싶을 때 고려한다.

#### <a id="vector-search"></a>벡터 검색/유사도 검색 (Vector Search / Similarity Search)
[임베딩](#embedding) 벡터 간 거리(코사인 유사도 등)를 계산해 의미상 가장 가까운 문서를 찾는 검색 방식.

#### <a id="cosine-similarity"></a>코사인 유사도 (Cosine Similarity)
두 벡터가 방향상 얼마나 비슷한지를 측정하는 지표로, [벡터 검색](#vector-search)의 핵심 계산.

#### <a id="tfidf"></a>TF-IDF
단어 빈도 기반으로 텍스트를 벡터화하는 전통적 방법. 의미 기반 임베딩보다 단순하지만 API 키 없이 유사도 비교를 체험할 수 있게 해준다.

#### <a id="opensearch"></a>OpenSearch / knn_vector
벡터를 저장하고 유사도 기반으로 검색할 수 있는 오픈소스 검색엔진과, 벡터를 담는 필드 타입.

#### <a id="keyword-search"></a>키워드 검색 (Keyword Search / BM25)
역색인을 이용해 질의에 쓰인 단어가 그대로 등장하는 문서를 찾는 검색 방식. BM25는 그 스코어링 알고리즘 중 하나로, 단어 빈도와 문서 길이를 고려해 관련도를 매긴다. [벡터 검색](#vector-search)이 "의미가 비슷한 문장"에 강하다면, 키워드 검색은 조항 번호·고유명사처럼 정확한 단어 매칭에 강하다.

#### <a id="rrf"></a>RRF (Reciprocal Rank Fusion)
성격이 다른 여러 검색 결과(예: [벡터 검색](#vector-search) + [키워드 검색](#keyword-search))를 하나로 합치는 방법. 점수 자체는 스케일이 달라 직접 비교할 수 없으므로, 각 검색에서 몇 등이었는지(rank)만 보고 `1 / (k + rank)`를 더해 최종 순위를 매긴다. 이렇게 두 검색을 합쳐 쓰는 것을 하이브리드 검색(Hybrid Search)이라고 부른다.

#### <a id="morphological-analysis"></a>형태소 분석 (Morphological Analysis)
문장을 의미를 가지는 최소 단위(형태소)로 쪼개고 품사를 태깅하는 자연어 처리 기법. 한국어는 조사·어미가 붙어서 공백 기준으로만 나누면 "휴가를"과 "휴가가"가 다른 토큰으로 취급되는데, 형태소 분석으로 명사(NNG/NNP)만 뽑아내면 이 문제를 줄일 수 있다.

#### <a id="top-k"></a>top-k 검색 (TOP_K)
유사도 순으로 상위 k개의 문서만 검색 결과로 가져오는 파라미터. 너무 작으면 정보 부족, 너무 크면 비용/정확도 저하라는 트레이드오프가 있다.

#### <a id="prompt-assembly"></a>프롬프트 조립/그라운딩 (Prompt Assembly / Grounding)
검색된 문서를 프롬프트에 포함시켜 "이 근거만 보고 답하라"고 지시함으로써 LLM 응답의 근거를 문서에 고정하는 것.

#### <a id="hallucination"></a>환각 (Hallucination)
LLM이 근거 없는 내용을 사실처럼 지어내는 현상.

#### <a id="langchain"></a>LangChain / LangChain 텍스트 스플리터
LLM 애플리케이션을 구성하는 파이썬 오케스트레이션 프레임워크와, 문서를 분할하는 그 하위 모듈.

#### <a id="metadata-source-page"></a>메타데이터 (source/page)
청크가 원본 문서의 어느 파일, 어느 페이지에서 왔는지 함께 저장해두는 부가 정보로, 답변의 출처 표시에 쓰인다.

#### <a id="prompt-injection"></a>프롬프트 인젝션 (Prompt Injection)
사용자 입력이나 [검색](#rag)된 문서 등 외부 데이터 안에 LLM을 향한 지시문을 숨겨, 원래의 시스템 프롬프트를 무시하고 공격자가 원하는 동작을 하도록 유도하는 공격. RAG처럼 외부 문서를 프롬프트에 끼워넣는 구조에서는 사용자가 직접 입력하지 않아도 문서 자체가 공격 경로(간접 프롬프트 인젝션)가 될 수 있다.

#### <a id="jailbreak"></a>탈옥 (Jailbreak)
모델에 내장된 안전 지침이나 사용 정책을 우회해, 원래는 거부해야 할 응답을 하도록 유도하는 것. [프롬프트 인젝션](#prompt-injection)이 "무엇을 지시하는가"에 가깝다면, 탈옥은 "안전장치를 얼마나 우회하는가"에 초점이 있다.

#### <a id="guardrail"></a>가드레일 (Guardrail)
LLM 입력(검색된 문서, 사용자 질문)이나 출력을 사전/사후에 검사해 [프롬프트 인젝션](#prompt-injection)·유해 콘텐츠 등을 걸러내는 안전장치. 정규식 기반 패턴 탐지부터 별도 분류 모델까지 다양한 형태가 있으며, 어느 하나만으로는 완벽하지 않아 여러 겹으로 겹쳐 쓰는 것이 일반적이다.

## 4. 인프라/도구 (example-projects)

#### <a id="postgresql"></a>PostgreSQL
크롤링한 원본 데이터를 저장해두는 관계형 데이터베이스.

#### <a id="sqlite3"></a>sqlite3
파이썬 표준 라이브러리에 내장된 가벼운 로컬 DB. 노트북 실습에서 PostgreSQL 대신 사용된다.

#### <a id="psycopg"></a>psycopg2 / psycopg3
파이썬에서 [PostgreSQL](#postgresql)에 접속하기 위한 드라이버 라이브러리.

#### <a id="docker"></a>Docker / docker compose
애플리케이션과 그 의존 서비스([OpenSearch](#opensearch) 등)를 컨테이너로 격리해 실행하는 도구.

#### <a id="streamlit"></a>Streamlit
파이썬 코드만으로 웹 UI(업로드 버튼 등)를 빠르게 만들 수 있는 프로토타이핑 도구.

#### <a id="dotenv"></a>python-dotenv (.env)
API 키 등 민감한 설정값을 코드에서 분리해 `.env` 파일에 두고 불러오는 라이브러리.

#### <a id="requests-bs4"></a>requests / BeautifulSoup
웹 페이지를 요청(HTTP)하고 HTML을 파싱해 본문을 추출하는 파이썬 라이브러리 조합.

#### <a id="pdf-libs"></a>PyMuPDF(fitz) / pypdf
PDF에서 텍스트를 추출하는 두 라이브러리(PyMuPDF는 빠르고 레이아웃 보존, pypdf는 순수 파이썬으로 가벼움).

#### <a id="google-vision"></a>google-cloud-vision
이미지에서 텍스트를 인식([OCR](#ocr))하는 Google Cloud API.

#### <a id="openai-structured-output"></a>OpenAI structured output (beta.chat.completions.parse)
OpenAI API가 [Pydantic](#pydantic) 모델 형식에 맞춰 응답을 자동 변환해주는 기능.

## 5. 개발 생태계 기초 (Python)

이 프로젝트는 Python 생태계를 기반으로 한다. 다른 언어의 Maven/Gradle(Java), npm(JavaScript) 같은
빌드·패키지 관리 도구에 익숙하다면, 아래는 그에 대응하는 Python 쪽 개념들이다. AI 실습 코드를
직접 돌리거나 새 프로젝트를 세팅할 때 알아야 하는 최소한의 생태계 지식을 정리했다.

#### <a id="venv"></a>가상환경 (Virtual Environment, venv)
프로젝트별로 독립된 Python 패키지 설치 공간을 만드는 기능(`python -m venv`). 프로젝트마다 다른
라이브러리 버전이 필요할 때 시스템 전역 환경과 충돌하지 않게 해준다.

#### <a id="pip"></a>pip / requirements.txt
pip은 Python의 기본 패키지 설치 도구(`pip install`)이며, `requirements.txt`는 프로젝트가 필요로
하는 패키지 목록을 적어두는 파일(`pip install -r requirements.txt`)이다. Java의 `pom.xml`(Maven),
`build.gradle`(Gradle)이나 Node의 `package.json`에 대응한다.

#### <a id="conda"></a>conda / Anaconda
패키지 관리와 가상환경 관리를 함께 제공하는 도구. [pip](#pip)/[venv](#venv)와 달리 Python 자체
버전이나 비-Python 의존성(예: CUDA)까지 다룰 수 있어 데이터 과학/딥러닝 환경에서 자주 쓰인다.

#### <a id="poetry-pyproject"></a>pyproject.toml / Poetry
의존성 목록, 버전, 빌드 설정을 한 파일로 통합 관리하는 최신 방식. [requirements.txt](#pip)보다
의존성 잠금(lock)과 버전 충돌 관리가 엄격하다. Java의 Gradle, Node의 `package.json`+lockfile과
유사한 역할.

#### <a id="jupyter"></a>Jupyter Notebook/Lab
코드, 실행 결과, 설명 텍스트를 한 문서(.ipynb) 안에서 셀 단위로 실행하며 볼 수 있는 대화형 개발
환경. 이 저장소의 `notebooks/` 실습 대부분이 이 형식으로 작성돼 있다.

#### <a id="fastapi-uvicorn"></a>FastAPI / uvicorn
Python으로 REST API 서버를 만드는 웹 프레임워크(FastAPI)와 이를 실제로 구동하는 ASGI 서버
(uvicorn). Java의 Spring(Boot)에 대응하는 역할로, LLM/RAG 파이프라인을 API로 노출할 때 쓰인다.
