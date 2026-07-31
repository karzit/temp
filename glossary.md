# 용어집

이 프로젝트 전체(① ml-curriculum, ② rag-pipeline-practice, ③ example-projects,
④ tabular-ml-practice)에서 반복적으로 등장하는 용어를 모아둔 통합 용어집입니다.
각 노트북/README에서 낯선 용어를 만나면 `[용어](../glossary.md#anchor)` 링크를 눌러
여기로 돌아와 확인하면 됩니다.

## 목차

- [1. 공통 기초 개념](#1-공통-기초-개념)
- [2. ML/DL 이론 (ml-curriculum)](#2-mldl-이론-ml-curriculum)
- [3. RAG/LLM 실습 (rag-pipeline-practice)](#3-ragllm-실습-rag-pipeline-practice)
- [4. 인프라/도구 (example-projects)](#4-인프라도구-example-projects)
- [5. 개발 생태계 기초 (Python)](#5-개발-생태계-기초-python)
- [6. 정형 데이터 실무 (tabular-ml-practice)](#6-정형-데이터-실무-tabular-ml-practice)

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

#### <a id="reranker"></a>리랭커 (Reranker / Cross-Encoder)
검색으로 추린 후보를 한 번 더 정확하게 줄 세우는 모델. [임베딩](#embedding)(bi-encoder)은 질문과 문서를 **따로** 벡터로 만들어 비교하기 때문에 빠르지만 대략적인 반면, 리랭커(cross-encoder)는 질문과 문서를 **한 쌍으로 묶어** 모델에 넣고 관련도를 직접 점수화해서 훨씬 정확하다. 대신 후보마다 모델을 돌려야 해서 느리다. 그래서 "빠른 검색으로 20개까지 좁히고, 리랭커로 상위 4개를 고르는" 2단 구성으로 쓴다. 한국어에는 `BAAI/bge-reranker-v2-m3` 같은 다국어 모델을 쓴다.

#### <a id="article-chunking"></a>조항 단위 청킹 (Article-based Chunking)
법령·사내 규정처럼 "제N조"라는 구조가 있는 문서를 글자 수가 아니라 **조항 경계**로 자르는 [청킹](#chunking) 방식. 고정 길이로 자르면 조 표지("제11조(재택근무)")와 본문이 다른 조각으로 갈려서, 조각만 봐서는 무슨 조인지 알 수 없게 된다. 조 단위로 자르고 상위 계층 경로(`제3장 근무 > 제11조(재택근무)`)를 조각 앞에 붙여두면 검색에도 걸리고 출처도 조항 번호로 표시할 수 있다.

#### <a id="golden-set"></a>골든셋 (Golden Set)
"이 질문에는 이 문서(조항)가 나와야 한다"를 미리 적어둔 검색 평가용 정답지. 설정을 바꿀 때마다 같은 질문 세트로 채점해서 [hit@k / MRR](#retrieval-metrics)을 비교하면, 개선 여부를 감이 아니라 숫자로 판단할 수 있다. 질문을 문서 문구 그대로 베끼면 항상 만점이 나와 쓸모가 없으므로, 실제 사용자의 말투로 쓰는 것이 중요하다.

#### <a id="retrieval-metrics"></a>검색 평가 지표 (hit@k / MRR / recall@k)
- **hit@k**: 상위 k개 안에 정답 문서가 하나라도 있던 질문의 비율. 이 값이 낮으면 프롬프트를 아무리 다듬어도 소용없다. 근거 자체가 LLM에게 전달되지 않았다는 뜻이기 때문이다.
- **MRR (Mean Reciprocal Rank, 평균 역순위)**: 정답이 1등이면 1점, 2등이면 1/2점, 3등이면 1/3점으로 매겨 평균 낸 값. hit@k가 같아도 MRR이 높으면 정답을 더 위쪽에 올려놓았다는 뜻이다.
- **recall@k**: 정답 문서가 여러 개일 때 그중 몇 개를 찾아왔는지의 비율.

주의: `k`가 전체 문서 수보다 크면 검색이 무엇을 하든 hit@k는 항상 1.0이 된다. 만점이 나오면 지표가 실제로 무언가를 재고 있는지 먼저 의심해야 한다.

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

## 6. 정형 데이터 실무 (tabular-ml-practice)

표(행/열) 형태의 실제 데이터를 다룰 때 등장하는 용어들. `notebooks/tabular-ml-practice/`의
01~04 노트북에서 실습한다.

### 6-1. 데이터 정리

#### <a id="outlier"></a>이상치 (Outlier)
다른 값들과 동떨어진 값. **두 종류를 구분해야 한다.** ① *기록 오류* — 9.4마일을 7초에 이동,
나이 999세처럼 물리적으로 불가능한 값. 제거 대상이다. ② *실제 극단값* — 1등급 특실 요금처럼
진짜 있었던 값. 제거하면 그 집단을 통째로 잃으므로 판단이 필요하다. [IQR 기준](#iqr)이
지목했다고 해서 잘못된 값인 것은 아니다.

#### <a id="iqr"></a>IQR / 사분위 범위 (Interquartile Range)
`IQR = Q3 - Q1`. 가운데 50%의 데이터가 퍼진 폭이다. 이상치 판별에 흔히 쓰는 기준은
`lower fence = Q1 - 1.5 × IQR`, `upper fence = Q3 + 1.5 × IQR`이고, 이 밖의 값을 이상치로 본다.
**박스플롯의 수염 끝이 바로 이 fence**다. 계수 1.5는 정규분포에서 약 99.3%를 담는 값이라
관례가 되었다. 오른쪽으로 치우친 분포에서는 정상적인 큰 값이 대량으로 걸리므로 주의한다.

#### <a id="missing-value"></a>결측치 (Missing Value)
값이 비어 있는 칸(`NaN`). scikit-learn 모델 대부분은 결측치가 있으면 에러를 낸다.
대응은 **삭제**(`dropna`)와 **대체**(`fillna`)가 있고, 판단 기준은 대략 이렇다 — 비율 5% 미만이면
삭제, 5~30%이고 중요한 변수면 대체, 50%를 넘으면 컬럼 자체를 삭제. 치우친 분포에서는
평균보다 **중앙값**으로 대체하는 편이 안전하다. "값이 비어 있다"는 사실 자체가 정보일 때는
`결측 여부` 컬럼을 따로 만들기도 한다.

#### <a id="data-leakage"></a>데이터 누출 (Data Leakage)
**예측 시점에는 알 수 없는 정보가 피처에 섞여 들어간 상태.** 검증 점수가 비정상적으로 좋게
나오지만 실제 환경에서는 성능이 무너진다. 에러도 경고도 나지 않아 발견이 어렵다.

판별 기준은 하나다 — **"이 값을 예측하는 시점에 실제로 알 수 있는가?"** 택시가 출발하는 순간에
평균 시속이나 최종 요금은 알 수 없으므로 피처로 쓸 수 없다. 대표적인 형태:

- 정답으로부터 계산된 컬럼 (`speed = distance / duration`, `alive` = `survived`)
- 사후에 확정되는 값 (운행이 끝나야 정해지는 `fare`, `tip`)
- [학습/검증 분리](#train-test-split) *전에* 수행한 [스케일링](#scaling)이나 결측치 대체
- [교차 검증](#cross-validation) 없이 전체 데이터로 하이퍼파라미터를 고른 뒤 그 점수를 최종 성능으로 보고

[변수중요도](#feature-importance)가 상식과 어긋날 때가 누출을 발견하는 가장 흔한 계기다.

#### <a id="feature-engineering"></a>파생 변수 (Feature Engineering)
원본 컬럼을 조합·변형해 새 컬럼을 만드는 작업. 승차 시각에서 요일과 시간대를 뽑아내면
"출퇴근 시간엔 오래 걸린다"는 패턴을 모델이 학습할 수 있다. **모델을 바꾸는 것보다
피처를 개선하는 것이 대개 더 큰 성능 향상을 준다.**

#### <a id="label-encoding"></a>레이블 인코딩 (Label Encoding)
각 범주에 0, 1, 2… 번호를 매기는 방식. 모델이 이 숫자를 **크기로 해석**하므로
`Manhattan(0) < Queens(1) < Brooklyn(2)`이라는 없던 관계가 만들어진다.
**순서가 실제로 있는 범주에만** 써야 한다(학점 F<D<C<B<A, 등급 저<중<고).
순서가 없는 범주에는 [원-핫 인코딩](#one-hot-encoding)을 쓴다.

#### <a id="dummy-trap"></a>더미 변수 함정 (Dummy Variable Trap) / 다중공선성
[원-핫 인코딩](#one-hot-encoding)으로 만든 컬럼들은 **합이 항상 1**이라, 하나만 알면 나머지가
자동으로 결정된다. 이렇게 한 변수가 다른 변수로 완전히 설명되는 상태를 **다중공선성**이라 하고,
회귀 계열 모델에서 계수 계산을 불안정하게 만든다. `pd.get_dummies(..., drop_first=True)`로
범주마다 컬럼 하나씩을 빼면 해결된다(정보 손실은 없다).
**트리 모델은 영향을 받지 않으므로** 해석 편의를 위해 `drop_first=False`를 쓰기도 한다.

#### <a id="stratify"></a>층화 추출 (Stratified Sampling / `stratify`)
[학습/검증 분리](#train-test-split) 시 클래스 비율을 양쪽에 동일하게 유지하는 옵션
(`train_test_split(..., stratify=y)`). 무작위로 나누면 우연히 한쪽에 특정 클래스가 몰릴 수 있고,
**클래스가 불균형할수록 심해진다.** 분류에만 쓰며, 연속값을 다루는 회귀에는 쓰지 않는다.
[교차 검증](#cross-validation)에서는 `StratifiedKFold`가 같은 역할을 한다.

#### <a id="scaler-types"></a>스케일러 3종 (Standard / MinMax / Robust)
[스케일링](#scaling)의 세 가지 방식. **[이상치](#outlier)에 대한 민감도가 다르다.**

| 스케일러 | 계산 | 결과 | 이상치에 |
|---|---|---|---|
| `StandardScaler` | (x - 평균) / 표준편차 | 평균 0, 표준편차 1 | 민감 |
| `MinMaxScaler` | (x - 최소) / (최대 - 최소) | 0 ~ 1 | **매우 민감** |
| `RobustScaler` | (x - 중앙값) / [IQR](#iqr) | 중앙값 0 | **강함** |

`MinMaxScaler`는 극단값 하나가 최댓값을 잡아버리면 정상값 대부분이 0 근처로 짜부라진다.
이상치가 있는 데이터라면 `RobustScaler`가 안전하다. **트리 모델에는 스케일링 자체가 불필요**하고,
신경망에는 필수에 가깝다.

#### <a id="fit-transform"></a>`fit` / `transform` / `fit_transform`
scikit-learn 전처리 객체의 공통 규약. `fit`은 데이터를 보고 **기준을 계산**하고(평균, 중앙값, IQR,
범주 목록), `transform`은 이미 계산된 기준으로 **값을 변환**한다.

**`fit`은 학습 데이터에만 적용한다**는 것이 철칙이다. 검증 데이터에 `fit`을 하면
[데이터 누출](#data-leakage)이 된다. 실제 서비스에서는 요청이 한 건씩 들어오므로 그 한 건의
평균을 계산할 수 없고, 학습 때 저장해둔 기준을 쓰는 것 외에 방법이 없다.
`Pipeline`으로 전처리와 모델을 묶으면 이 구분이 자동으로 지켜진다.

### 6-2. 모델과 평가

#### <a id="decision-tree"></a>결정 트리 (Decision Tree)
"이 값보다 큰가?"라는 질문을 연달아 던져 데이터를 좁혀가는 모델. 더 이상 나눌 수 없으면
그 자리에 남은 데이터로 답한다(분류는 다수결, 회귀는 평균). 각 단계에서
**[불순도](#gini)가 가장 많이 줄어드는 질문**을 고른다.

컬럼마다 독립적으로 크기 비교만 하므로 **[스케일링이 필요 없고](#scaler-types)**
[이상치](#outlier)에 둔감하며, 학습된 규칙을 그대로 읽을 수 있다.
깊이 제한이 없으면 학습 데이터를 통째로 외우므로([과적합](#overfitting)),
`max_depth`, `min_samples_split`, `min_samples_leaf` 등으로 성장을 억제한다.

#### <a id="gini"></a>지니 불순도 (Gini Impurity)
한 노드에 여러 클래스가 섞여 있는 정도. `Gini = 1 - Σ(각 클래스 비율)²`.
50:50이면 0.5(최대), 한 클래스만 남으면 0(완전히 순수).
[결정 트리](#decision-tree)는 나눈 뒤 이 값의 가중 평균이 가장 많이 줄어드는 분할을 고른다.
분류의 대안 기준으로 엔트로피가, 회귀에서는 분산(MSE)이 쓰인다.

#### <a id="random-forest"></a>랜덤 포레스트 (Random Forest)
서로 다른 [결정 트리](#decision-tree) 수백 개를 만들어 예측을 평균 내는 모델.
다양성은 두 가지로 만든다 — ① **[부트스트랩](#bagging) 샘플링**(트리마다 다른 데이터),
② **컬럼 무작위 선택**(분할마다 일부 컬럼만 후보로). "제각각 틀리는 모델 여럿의 평균은
개별 모델보다 낫다"는 원리다. 튜닝 없이도 잘 동작해서 **표 데이터의 기본 선택지**로 쓰인다.
`n_estimators`(나무 개수)는 많다고 과적합되지 않으며, 보통 100~300이면 충분하다.

#### <a id="bagging"></a>배깅 / 부트스트랩 (Bagging / Bootstrap) · OOB
**부트스트랩**은 n개 데이터에서 n개를 *복원 추출*하는 것. 중복이 생기고 어떤 데이터는
한 번도 안 뽑힌다. 이렇게 만든 여러 표본으로 모델을 각각 학습시켜 합치는 것이 **배깅**이다.

한 데이터가 매번 안 뽑힐 확률은 `(1-1/n)^n → 1/e ≈ 0.368`이다. 즉 **각 트리는 데이터의 약
63.2%만 보고 학습**하며, 나머지 36.8%가 그 트리의 **OOB(Out-Of-Bag) 샘플**이다.
`RandomForest(oob_score=True)`는 이 남은 데이터로 성능을 추정하므로,
**검증 데이터를 따로 떼지 않고 학습 한 번으로** 일반화 성능을 볼 수 있다.

#### <a id="cross-validation"></a>교차 검증 (Cross Validation)
데이터를 k조각으로 나눠 각 조각을 한 번씩 검증용으로 쓰며 **k번 학습·평가**하는 방법
(`cross_val_score(..., cv=5)`). 한 번의 분할 운에 좌우되지 않고, **평균과 함께 표준편차**를
얻어 추정이 얼마나 불안정한지도 알 수 있다. 분류에서는 `StratifiedKFold`가 자동 적용되어
[클래스 비율](#stratify)을 유지한다. [스케일링](#scaling)과 함께 쓸 때는 fold마다
[누출](#data-leakage)이 반복되지 않도록 반드시 `Pipeline`으로 묶는다.

#### <a id="grid-search"></a>`GridSearchCV` / `RandomizedSearchCV`
[하이퍼파라미터](#hyperparameter) 후보 조합을 [교차 검증](#cross-validation)으로 시험해
가장 좋은 것을 찾아주는 도구. `best_params_`(최적 조합), `best_score_`(그때의 교차 검증 점수),
`best_estimator_`(전체 학습 데이터로 재학습된 모델), `cv_results_`(전체 결과)를 제공한다.

`GridSearchCV`는 **모든 조합**을 시험하므로 파라미터를 추가할수록 곱셈으로 늘어난다(조합 폭발).
`RandomizedSearchCV`는 **무작위로 n개만** 시험하는데, 대부분의 하이퍼파라미터는 성능에 큰 영향이
없어서 훨씬 적은 시간에 비슷한 결과를 낸다. 게다가 목록 대신 **확률 분포**를 줄 수 있어
연속 범위를 탐색할 수 있다.

**`best_score_`를 최종 성능으로 보고하면 안 된다.** 여러 조합 중 최댓값을 고른 값이라
구조적으로 낙관적이다(선택 편향). 성능은 탐색에 쓰지 않은 별도 데이터로 딱 한 번 측정한다.

#### <a id="feature-importance"></a>변수중요도 (Feature Importance)
어떤 컬럼이 예측에 얼마나 기여했는지를 나타내는 값. 트리 모델의 `feature_importances_`는
그 컬럼이 만들어낸 **[불순도](#gini) 감소량의 총합**을 정규화한 것이다(합이 1).

**알려진 편향이 있다 — 고유값이 많은 컬럼을 과대평가한다.** 값의 종류가 많으면 분할 후보가
많아지고 그중 하나쯤은 우연히 잘 맞기 때문이다. 실제로 완전한 난수 컬럼을 넣으면 상위권에 오른다.
결론을 내릴 때는 [순열 중요도](#permutation-importance)를 함께 본다.

[상관계수](#correlation)와는 재는 것이 다르다. 상관계수는 타깃과의 직선 관계만 보지만,
변수중요도는 비선형 관계와 다른 변수와의 조합까지 반영한다. **[데이터 누출](#data-leakage)을
발견하는 주된 수단**이기도 하다.

#### <a id="permutation-importance"></a>순열 중요도 (Permutation Importance)
한 컬럼의 값만 무작위로 섞은 뒤 **성능이 얼마나 떨어지는지**로 중요도를 재는 방법
(`sklearn.inspection.permutation_importance`). 검증 데이터에서 측정하므로 학습 데이터 암기의
영향을 받지 않고, 트리가 아닌 모델에도 쓸 수 있다. 다만 여러 번 섞어 평균 내므로 느리다.

**음수가 나올 수 있다** — 섞었더니 오히려 성능이 좋아졌다는 뜻으로, 그 컬럼이 노이즈에 가깝다는
신호다. 단, 거의 같은 정보를 가진 컬럼이 둘 있으면 하나를 섞어도 다른 하나가 대신하므로
**둘 다 중요하지 않은 것처럼 보일 수 있다.**

#### <a id="correlation"></a>상관계수 (Correlation Coefficient)
두 수치형 변수가 함께 움직이는 정도를 -1 ~ +1로 나타낸 값(`df.corr(numeric_only=True)`).
주의할 점 셋 — ① **직선 관계만** 잡아낸다(U자 관계는 0에 가깝게 나온다),
② **인과관계가 아니다**, ③ 0.9 이상의 높은 상관은 중복 컬럼이거나
[데이터 누출](#data-leakage)의 신호일 수 있다. 문자열 컬럼이 섞여 있으면
`numeric_only=True` 없이는 에러가 난다.

#### <a id="regression-metrics"></a>회귀 평가 지표 (MAE / RMSE / R²)
- **MAE** (평균 절대 오차): 평균(|실제 - 예측|). 원래 단위라 해석이 직관적이고 이상치에 둔감하다
- **MSE / RMSE**: 오차를 제곱해 평균낸 값과 그 제곱근. **큰 오차에 큰 벌점**을 준다.
  10분 틀린 예측 하나를 1분씩 틀린 열 개보다 훨씬 나쁘게 본다
- **R²** (결정 계수): "평균으로 찍는 것보다 얼마나 나은가". 1에 가까울수록 좋고,
  **평균 예측의 R²는 정의상 0**이며, 그보다 못하면 음수가 나온다

"크게 틀리는 것이 특히 곤란하면" RMSE를, "평균적으로 얼마나 틀리는가"가 궁금하면 MAE를 본다.
**어떤 지표든 [기준선](#baseline)과 비교해야 의미가 생긴다.**

#### <a id="classification-metrics"></a>분류 평가 지표 (정확도 / 정밀도 / 재현율 / F1)
[혼동 행렬](#confusion-matrix)의 TP·TN·FP·FN에서 계산한다.

```
정확도 (Accuracy)  = (TP + TN) / 전체      전체 중 맞힌 비율
정밀도 (Precision) = TP / (TP + FP)        양성이라 한 것 중 진짜 양성 비율
재현율 (Recall)    = TP / (TP + FN)        실제 양성 중 찾아낸 비율
F1                 = 정밀도와 재현율의 조화평균
```

**정확도만 보면 안 된다.** 클래스가 불균형하면 다수 클래스로만 찍어도 높게 나온다
(양성 0.1%인 사기 탐지에서 "전부 정상"이라 하면 정확도 99.9%).

**정밀도와 재현율은 상충한다.** 어느 쪽이 중요한지는 문제에 달렸다 — 암 진단은 놓치면 안 되므로
**재현율**, 스팸 필터는 정상 메일을 걸러내면 안 되므로 **정밀도**. `predict_proba`의 임계값을
0.5에서 조정해 균형을 바꿀 수 있다. 불균형 데이터에서는 `classification_report`의
**macro avg**를 봐야 소수 클래스 성능이 드러난다.

#### <a id="confusion-matrix"></a>혼동 행렬 (Confusion Matrix)
실제 클래스(행) vs 예측 클래스(열)를 표로 나타낸 것. 무엇을 어떻게 틀렸는지 보여준다.

| | 예측: 음성 | 예측: 양성 |
|---|---|---|
| **실제: 음성** | TN (True Negative) | **FP** (False Positive, 거짓 경보) |
| **실제: 양성** | **FN** (False Negative, 놓침) | TP (True Positive) |

#### <a id="baseline"></a>기준선 (Baseline)
학습하지 않은 가장 단순한 예측. **모델 점수가 좋은지 나쁜지는 이것과 비교해야 알 수 있다.**
회귀에서는 항상 평균(또는 중앙값)으로 예측하기, 분류에서는 항상 다수 클래스로 찍기.
MAE 3.5분이 좋은 값인지는 기준선이 8.3분이라는 것을 알아야 판단할 수 있다.

#### <a id="residual"></a>잔차 분석 (Residual Analysis)
`잔차 = 실제 - 예측`을 구간별로 나눠 **어디서 많이 틀리는지** 살펴보는 것.
지표 하나가 감추고 있는 문제를 드러낸다. 잔차가 0을 중심으로 대칭이면 편향 없이 예측하는
것이고, 특정 구간에서 잔차 평균이 한쪽으로 쏠려 있으면 **체계적인 편향**이 있다는 뜻이다.

트리 모델은 잎에 남은 데이터의 평균을 예측하므로 **구조적으로 극단값 쪽으로 가지 못한다.**
그래서 큰 값을 과소예측하고 작은 값을 과대예측하는 경향이 나타난다.
대응책으로 타깃 로그 변환, 표본 가중치, 피처 추가 등이 있다.

### 6-3. 신경망 실무

#### <a id="output-layer"></a>출력층과 손실 함수 조합
신경망의 은닉층은 문제 유형과 무관하다. **달라지는 것은 출력층과 손실 함수뿐**이며,
이 조합을 틀리는 것이 Keras에서 가장 흔한 실수다.

| 문제 | 출력층 | 손실 함수 |
|---|---|---|
| 회귀 | `Dense(1)` (활성화 없음) | `mse` / `mae` |
| 이진 분류 | `Dense(1, activation="sigmoid")` | `binary_crossentropy` |
| 다중 분류 (정수 라벨) | `Dense(n, activation="softmax")` | `sparse_categorical_crossentropy` |
| 다중 분류 (원-핫 라벨) | `Dense(n, activation="softmax")` | `categorical_crossentropy` |

회귀에 [sigmoid](#sigmoid)를 걸면 출력이 0~1에 갇혀 **구조적으로 맞힐 수 없다.**
이진 분류에서 `sigmoid` 1개와 `softmax` 2개는 수학적으로 동등하다.

#### <a id="learning-curve"></a>학습 곡선 (Learning Curve)
epoch별 학습/검증 지표의 변화 그래프(`history.history`). **신경망 진단의 기본 도구다.**

| 모양 | 진단 | 대응 |
|---|---|---|
| 둘 다 내려가는 중 | 덜 학습됨 | epoch 늘리기 |
| 나란히 평평 | 수렴 완료 | 모델 확대·피처 추가 |
| **학습은 내려가는데 검증이 올라감** | **[과적합](#overfitting)** | [EarlyStopping](#early-stopping), [Dropout](#dropout) |
| 둘 다 높은 채로 평평 | 과소적합 | 모델 확대 |
| 심하게 요동침 | [학습률](#learning-rate)이 큼 | 학습률 낮추기 |

**과적합 감시는 정확도가 아니라 `val_loss`로 한다.** 손실이 더 민감하게 반응하기 때문이다.
모델이 확신을 키우면 예측은 그대로라 정확도는 안 변하지만 틀렸을 때의 손실은 크게 늘어난다.

#### <a id="early-stopping"></a>`EarlyStopping`
검증 지표가 일정 epoch(`patience`) 동안 나아지지 않으면 학습을 중단하는 콜백.

**`restore_best_weights=True`를 반드시 함께 쓴다.** 이 옵션이 없으면 "멈춘 시점"의 가중치가
남는데, 그때는 이미 `patience`만큼 과적합이 진행된 상태다. 일부러 더 지켜본 구간을
되돌려 놓아야 최적 모델을 얻는다.

#### <a id="batch-size"></a>배치 크기 (`batch_size`) / `BatchNormalization`
**`batch_size`** 는 가중치를 한 번 갱신할 때 쓰는 데이터 수(기본 32). 작으면 갱신이 잦아
빠르지만 불안정하고, 크면 안정적이지만 갱신 횟수가 준다. 보통 32~256.

**`BatchNormalization`** 은 각 층의 출력을 배치 단위로 정규화해 학습을 안정시킨다.
층이 깊은 신경망과 CNN에서는 거의 표준이지만, **층 2~3개짜리 얕은 표 데이터 모델에서는
효과가 없거나 오히려 배치 통계의 노이즈 때문에 해로울 수 있다.**
배치 크기가 아주 작을 때(<16)도 통계가 불안정해 부적합하다.
