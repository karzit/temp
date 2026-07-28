# 정형 데이터 실전 워크플로우 (tabular-ml-practice)

**지저분한 실제 표 데이터를 받아서 예측 모델을 만들기까지의 전 과정**을 다루는 5개 노트북입니다.

`ml-curriculum`이 "머신러닝이 어떻게 작동하는가"(경사 하강법, 역전파를 직접 구현)를 다룬다면,
이 시리즈는 **"현실의 데이터로 실제로 어떻게 하는가"**를 다룹니다. 결측치·이상치·문자열 범주가
섞인 데이터를 정리하고, 모델을 고르고, 성능을 제대로 평가하고, 무엇이 잘못됐는지 진단하는 방법입니다.

## 구성

| 노트북 | 다루는 내용 | Colab | 해설 |
|---|---|---|---|
| [00. 이 시리즈에서 쓰는 pandas 문법](00_pandas_for_tabular/00_pandas_for_tabular.ipynb) | `pd.to_datetime`·`.dt`, `isnull`/`dropna`/`fillna`, `value_counts`·`quantile`, `groupby`·`transform`, `get_dummies`, `cut`/`map`/`where` — **01~04번에 나오는 문법만 모은 사전** | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/tabular-ml-practice/00_pandas_for_tabular/00_pandas_for_tabular.ipynb) | 확인 문제 5개 (정답 포함) |
| [01. 데이터 탐색과 시각화](01_eda_visualization/01_eda_visualization.ipynb) | `info`/`describe`로 문제 찾기, 그래프 선택 기준, `countplot`·`histplot`·`boxplot`·`jointplot`·`heatmap`, `subplots`, 데이터 누출 감지 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/tabular-ml-practice/01_eda_visualization/01_eda_visualization.ipynb) | [해설](01_eda_visualization/01_eda_visualization_solutions.ipynb) |
| [02. 전처리](02_preprocessing/02_preprocessing.ipynb) | 처리 순서, 이상치(도메인 규칙·IQR), 결측치(삭제·대체), 컬럼 정리, 원-핫 인코딩, `train_test_split`·`stratify`, 스케일러 3종과 데이터 누출 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/tabular-ml-practice/02_preprocessing/02_preprocessing.ipynb) | [해설](02_preprocessing/02_preprocessing_solutions.ipynb) |
| [03. 트리 모델과 평가](03_tree_models/03_tree_models.ipynb) | 결정 트리의 분할 원리, 과적합과 하이퍼파라미터, 랜덤 포레스트, 회귀·분류 평가 지표, 교차 검증, `GridSearchCV`, 변수중요도 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/tabular-ml-practice/03_tree_models/03_tree_models.ipynb) | [해설](03_tree_models/03_tree_models_solutions.ipynb) |
| [04. 신경망 (Keras)](04_dnn_keras/04_dnn_keras.ipynb) | `Sequential`, 문제 유형별 출력층·손실 함수, 스케일링의 필요성, 학습 곡선 진단, `EarlyStopping`·`Dropout`, 트리 모델과 비교 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/tabular-ml-practice/04_dnn_keras/04_dnn_keras.ipynb) | [해설](04_dnn_keras/04_dnn_keras_solutions.ipynb) |

01~04번 끝에는 연습 문제 6개가 있고, `_solutions.ipynb`에 정답 코드와 해설이 있습니다.
**먼저 직접 풀어본 뒤** 열어보는 걸 권장합니다.

> **00번은 문법 사전입니다.** 01번을 읽다가 `pd.to_datetime`이나 `get_dummies`가 낯설면
> 그때 찾아봐도 되고, 처음에 20~30분 들여 한 번 훑고 시작해도 됩니다.

## 쓰는 데이터

성격이 다른 두 공개 데이터셋을 씁니다. 회귀와 분류는 전처리부터 평가 지표까지 조금씩 다르기 때문에,
두 경우를 다 보는 편이 나중에 헷갈리지 않습니다.

**네 노트북 모두 1부에서 택시로 한 바퀴 돌고, 2부에서 타이타닉으로 넘어갑니다.**

| 노트북 | 1부 (택시 · 회귀) | 2부 (타이타닉 · 분류) |
|---|---|---|
| 01 | EDA 전 과정 | 결측 77%일 때의 판단, 범주별 비교(`boxplot`·`hue`) |
| 02 | 답이 정해진 전처리 → `prepare_trips()` | 판단이 필요한 경우들 → `prepare_titanic()` |
| 03 | 분산 기준 분할, MAE·R², **변수중요도로 누출 잡기** | 지니 불순도, **정확도의 함정**, 정밀도·재현율 |
| 04 | 스케일링·`Sequential`·`EarlyStopping` | 출력층/손실 함수 교체, 429건에서의 과적합 |

| 이름 | 데이터 | 예측 대상 | 문제 유형 |
|---|---|---|---|
| `trips` | 뉴욕 택시 운행 기록 6,433건 (seaborn `taxis`) | `duration` — 이동 시간(분) | **회귀** |
| `titanic` | 타이타닉 탑승자 891명 (seaborn `titanic`) | `survived` — 생존 여부(0/1) | **분류** |

둘 다 결측치·이상치·문자열 범주를 **실제로** 가지고 있습니다. 교재용으로 꾸며낸 것이 아니라
seaborn이 내장한 원본 그대로이며, 첫 실행 시 인터넷에서 내려받습니다(별도 파일 준비 불필요).

## 이 시리즈를 관통하는 주제 — 데이터 누출

네 노트북에 걸쳐 **데이터 누출(data leakage)** 이 반복해서 등장합니다. 실무에서 가장 흔하면서도
발견하기 어려운 실패이기 때문입니다.

| 노트북 | 어떤 누출 | 어떻게 발견 |
|---|---|---|
| 01 | `speed`가 `duration`으로 계산된 값, `alive`가 `survived`와 동일 | **"예측 시점에 알 수 있는 값인가?"** 라고 물어봄 |
| 02 | 분리 전에 스케일링하면 검증 데이터 정보가 학습에 섞임 | `fit`은 학습 데이터에만 |
| 03 | **`fare`가 변수중요도의 88%** — 뉴욕 택시 요금에는 시간 요금이 포함됨 | 변수중요도가 상식과 어긋남 |
| 03 | `GridSearchCV`를 전체 데이터로 돌리고 `best_score_`를 최종 성능으로 보고 | 탐색 점수 0.825 vs 실제 0.777 |

03번에서 `fare`를 제거하자 MAE가 **1.19분 → 3.55분**으로 3배 나빠집니다. 실망스러워 보이지만
**그쪽이 실제로 쓸 수 있는 성능**입니다. 이 장면이 시리즈의 핵심입니다.

## 시작하기 전에

- **선수 지식**: pandas/NumPy 기본기(`head`/`info`/`describe`, 열 선택, `groupby`). 낯설다면
  [`ml-curriculum/00_python_essentials`](../ml-curriculum/00_python_essentials/00_python_essentials.ipynb)의
  실습 2를 먼저 보세요.
- 그 위에 필요한 **표 데이터 전용 문법**(날짜 변환, 결측치, 인코딩, 구간 나누기)은
  이 시리즈의 [00번](00_pandas_for_tabular/00_pandas_for_tabular.ipynb)에서 다룹니다.
- **04번만** TensorFlow가 필요합니다(Colab에는 이미 설치되어 있습니다). 01~03은
  pandas·seaborn·scikit-learn만 있으면 됩니다.
- 각 노트북 첫 셀이 Colab 여부를 감지해 필요한 패키지를 설치합니다. 로컬 실행이라면
  프로젝트 루트의 `requirements.txt`를 쓰세요.
- 낯선 용어는 [glossary.md](../../glossary.md)에서 찾아보세요.

## `ml-curriculum`과의 관계

겹치는 주제가 있지만 접근이 다릅니다. **순서는 상관없고, 둘 다 보면 서로를 보완합니다.**

| 주제 | `ml-curriculum` | `tabular-ml-practice` |
|---|---|---|
| 분류 | Logistic/Softmax Regression을 **수식부터 직접 구현** | 트리 모델로 **실제 데이터를 분류하고 제대로 평가** |
| 신경망 | XOR, MNIST로 **역전파와 활성화 함수의 원리** | 표 데이터에서 **과적합을 진단하고 통제** |
| 데이터 | Iris, MNIST (이미 정리된 상태) | **결측치·이상치·문자열이 섞인 원본** |
| 프레임워크 | PyTorch 중심 (07번만 Keras) | scikit-learn 중심 (04번만 Keras) |

`ml-curriculum/01_basic_classification`이 scikit-learn 파이프라인을 Iris로 한 바퀴 훑는다면,
이 시리즈는 **그 각 단계에서 실제로 무슨 일이 벌어지는지**를 파고듭니다.

## 다음으로 해볼 만한 것

- **부스팅 계열 모델**: XGBoost, LightGBM, CatBoost — 표 데이터에서 랜덤 포레스트보다
  대개 한 단계 더 나은 성능을 냅니다
- **`Pipeline`과 `ColumnTransformer`**: 전처리와 모델을 하나로 묶어 데이터 누출을 구조적으로 차단
- **SHAP**: 변수중요도보다 정교한 모델 해석 — "이 예측에서 각 변수가 얼마나 기여했는가"
- **자신의 CSV 데이터**로 01~04의 흐름을 그대로 반복해보기
