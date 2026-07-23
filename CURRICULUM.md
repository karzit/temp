# 학습 커리큘럼: 모두를 위한 머신러닝과 딥러닝 (시즌 1)

이 프로젝트의 노트북들은 김성훈 교수님의 강의 [모두를 위한 머신러닝과 딥러닝](https://hunkim.github.io/ml/)(시즌 1)의 커리큘럼 순서를 따라, 이론 요약 + 실습 코드로 재구성한 것입니다. 원본 강의는 TensorFlow 1.x로 실습하지만, 여기서는 최신 환경(Colab)에서 바로 실행되도록 **scikit-learn + PyTorch** 기반으로 다시 작성했습니다.

> 원본 강의 자료: https://hunkim.github.io/ml/ · 원본 코드: [hunkim/DeepLearningZeroToAll](https://github.com/hunkim/DeepLearningZeroToAll)

## 구성

| 노트북 | 원본 강의 | 다루는 내용 | 이론 | 실습 | Colab | 연습문제 해설 |
|---|---|---|---|---|---|---|
| [00_python_essentials/00_python_essentials.ipynb](notebooks/ml-curriculum/00_python_essentials/00_python_essentials.ipynb) | (사전 준비) | [NumPy](glossary.md#numpy) 배열/행렬 연산, [Pandas](glossary.md#pandas) DataFrame, [PyTorch](glossary.md#pytorch) 텐서와 autograd | - | ✅ | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/ml-curriculum/00_python_essentials/00_python_essentials.ipynb) | [해설](notebooks/ml-curriculum/00_python_essentials/00_python_essentials_solutions.ipynb) |
| [01_basic_classification/01_basic_classification.ipynb](notebooks/ml-curriculum/01_basic_classification/01_basic_classification.ipynb) | (사전 준비) | scikit-learn 파이프라인 감 잡기 | - | ✅ | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/ml-curriculum/01_basic_classification/01_basic_classification.ipynb) | - |
| [02_linear_regression/02_linear_regression.ipynb](notebooks/ml-curriculum/02_linear_regression/02_linear_regression.ipynb) | Lec 1–4 | ML 기본 개념, Linear Regression, [Cost 함수](glossary.md#cost-function), [Gradient Descent](glossary.md#gradient-descent), 다중 변수 | ✅ | ✅ | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/ml-curriculum/02_linear_regression/02_linear_regression.ipynb) | [해설](notebooks/ml-curriculum/02_linear_regression/02_linear_regression_solutions.ipynb) |
| [03_classification/03_classification.ipynb](notebooks/ml-curriculum/03_classification/03_classification.ipynb) | Lec 5–6 | [Logistic Regression](glossary.md#logistic-regression), [Softmax Regression](glossary.md#softmax-regression)(다중 분류), [Cross-Entropy](glossary.md#cross-entropy) | ✅ | ✅ | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/ml-curriculum/03_classification/03_classification.ipynb) | [해설](notebooks/ml-curriculum/03_classification/03_classification_solutions.ipynb) |
| [04_neural_networks/04_neural_networks.ipynb](notebooks/ml-curriculum/04_neural_networks/04_neural_networks.ipynb) | Lec 7–10 | [학습률](glossary.md#learning-rate)/[Overfitting](glossary.md#overfitting)/[Regularization](glossary.md#regularization), [XOR](glossary.md#xor-problem)과 [Backpropagation](glossary.md#backpropagation), [ReLU](glossary.md#relu), [가중치 초기화](glossary.md#weight-initialization), [Dropout](glossary.md#dropout), MNIST | ✅ | ✅ | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/ml-curriculum/04_neural_networks/04_neural_networks.ipynb) | [해설](notebooks/ml-curriculum/04_neural_networks/04_neural_networks_solutions.ipynb) |
| [05_cnn/05_cnn.ipynb](notebooks/ml-curriculum/05_cnn/05_cnn.ipynb) | Lec 11 | [Convolution](glossary.md#convolution), [Pooling](glossary.md#pooling), [CNN](glossary.md#cnn)으로 이미지 분류 | ✅ | ✅ | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/ml-curriculum/05_cnn/05_cnn.ipynb) | [해설](notebooks/ml-curriculum/05_cnn/05_cnn_solutions.ipynb) |
| [06_rnn/06_rnn.ipynb](notebooks/ml-curriculum/06_rnn/06_rnn.ipynb) | Lec 12 | [RNN](glossary.md#rnn) 기본, Char-RNN("hihello"), 시계열 예측 | ✅ | ✅ | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/ml-curriculum/06_rnn/06_rnn.ipynb) | [해설](notebooks/ml-curriculum/06_rnn/06_rnn_solutions.ipynb) |

각 `_solutions.ipynb`는 본문 노트북 끝의 "연습 문제"에 대한 정답 코드 + 해설입니다. 먼저 직접 풀어본 뒤 참고하는 걸 권장합니다.

용어가 낯설다면 **[glossary.md](glossary.md)**(통합 용어집)의 "2. ML/DL 이론" 섹션을 참고하세요.

## 학습 순서 제안

0. **00**: NumPy/Pandas/PyTorch가 처음이거나 오래 안 써봤다면 먼저 손에 익힙니다. 익숙하다면 건너뛰어도 됩니다.
1. **02 → 03**: 지도학습의 기본 축인 회귀와 분류를 손코드(numpy)로 먼저 이해하고, scikit-learn으로 검증합니다.
2. **04**: 신경망이 왜 필요한지(XOR 문제)부터 시작해서, 딥러닝 실무 팁(ReLU, Dropout, 초기화)까지 PyTorch로 직접 구현합니다.
3. **05 → 06**: 이미지(CNN), 시퀀스(RNN) 데이터로 확장합니다.

각 노트북은 Colab에서 바로 열어 실행할 수 있도록 첫 셀에 환경 감지 + 패키지 설치 코드가 포함되어 있습니다 (프로젝트 루트 [README.md](README.md)의 "Colab에서 열기" 참고).

## 범위에서 제외한 부분

원본 사이트의 **시즌 RL(강화학습)**과 **시즌 NLP**는 별도 시즌으로, 이 커리큘럼(시즌 1: 딥러닝 기본)을 먼저 끝낸 뒤 확장하는 것을 권장하여 이번 구성에는 포함하지 않았습니다. 필요하면 이후에 `notebooks/ml-curriculum/07_reinforcement_learning/` 등으로 이어서 추가할 수 있습니다. 정식 노트북은 아니지만, RL 개념을 미리 눈으로 보고 싶다면 [`frozen-lake-viz/`](frozen-lake-viz)에 브라우저에서 바로 여는 Q-Learning 시각화 데모가 있습니다.
