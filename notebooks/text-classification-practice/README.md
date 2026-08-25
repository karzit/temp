# 텍스트 분류 실습 (text-classification-practice)

**상품명 같은 짧은 한국어 텍스트로 카테고리를 분류하는 전 과정**을 다루는 2개 노트북입니다.
AICE Professional 샘플문항의 Text 문제(**가공식품 카테고리 분류**)와 같은 형태의 문제를
기준선 만들기부터 제출 파일 작성까지 그대로 따라갑니다.

`tabular-ml-practice`가 **숫자와 범주가 든 표**를 다뤘다면, 이 시리즈는 **글자만 있는 데이터**를 다룹니다.
표 데이터에서는 컬럼 하나가 곧 피처였지만, 텍스트에는 그런 컬럼이 없습니다.
**"글자를 어떻게 숫자로 바꾸는가"** 가 이 시리즈의 절반입니다.

## 구성

| 노트북 | 다루는 내용 | Colab | 해설 |
|---|---|---|---|
| [01. 텍스트 분류 기준선](01_text_baseline/01_text_baseline.ipynb) | 클래스 불균형 확인, 기준선(최빈 카테고리), BoW·TF-IDF, 로지스틱 회귀, **전처리 실험**, 문자 n-gram, macro f1과 혼동 행렬, 오분류 분석, 제출 파일 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/text-classification-practice/01_text_baseline/01_text_baseline.ipynb) | [해설](01_text_baseline/01_text_baseline_solutions.ipynb) |
| [02. Keras 텍스트 분류](02_keras_text/02_keras_text.ipynb) | `TextVectorization`(정수 인코딩·패딩), 임베딩, `Conv1D`/`LSTM` 비교, TF-IDF와 정면 비교, **모델 저장의 함정**, 제출 체크리스트 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/text-classification-practice/02_keras_text/02_keras_text.ipynb) | [해설](02_keras_text/02_keras_text_solutions.ipynb) |

두 노트북 끝에는 연습 문제가 6개씩 있고, `_solutions.ipynb`에 정답 코드와 해설이 있습니다.
**먼저 직접 풀어본 뒤** 열어보는 걸 권장합니다.

**순서대로 보세요.** 02번은 01번에서 만든 기준선과 비교하는 것이 핵심이라, 01번을 건너뛰면
"딥러닝이 이기지 못했다"는 이 시리즈의 결론이 와닿지 않습니다.

## 쓰는 데이터

`data/` 폴더의 csv 세 개를 씁니다. 노트북 첫 셀이 Colab이면 내려받고, 로컬이면 `../data`에서 읽습니다.

| 파일 | 내용 | 시험에 있나 |
|---|---|---|
| `02_train.csv` | 상품명 + 카테고리, 5,060행 | ✅ |
| `02_test_x.csv` | 상품명만, 1,500행 | ✅ |
| `02_test_y.csv` | 테스트 정답 | ❌ — **자가 채점용** |

카테고리는 10개(`라면류`, `과자/스낵`, `음료`, `커피/차`, `유제품`, `소스/조미료`, `통조림`,
`냉동식품`, `즉석밥/간편식`, `시리얼/영양바`)이고 건수가 18%~3%로 불균형합니다.

> **합성 데이터입니다.** 실제 시험 데이터는 공개되지 않으므로, 같은 구조(`상품명` → `카테고리`)를
> 규칙으로 만들어 씁니다. 생성 규칙은 [`data/make_dataset.py`](data/make_dataset.py)에 전부 들어 있고,
> `python make_dataset.py`로 다시 만들 수 있습니다. 브랜드명은 실제 상표를 피해 지어낸 이름입니다.
>
> **일부러 지저분하게 만들었습니다** — 결측 10건, 중복 79건, 클래스 불균형, 라벨 오류 3%,
> 그리고 `치즈스틱`·`카레`처럼 두 카테고리에 걸치는 상품명. 깨끗한 데이터에서는 배울 것이 없기 때문입니다.

## 이 시리즈를 관통하는 주제 — "당연해 보이는 것"을 측정하기

두 노트북에 걸쳐 **직관과 결과가 어긋나는 장면**이 반복됩니다. 이것이 이 시리즈의 핵심입니다.

| 어디서 | 당연해 보이는 것 | 실제 결과 |
|---|---|---|
| 01번 6절 | 특수문자·숫자를 지우면 좋아진다 | **0.9037 → 0.8897.** 용량 단위도 신호였다 |
| 01번 7절 | 한국어는 형태소 분석기가 필요하다 | 문자 n-gram(`char_wb`)만으로 충분했다 |
| 01번 8절 | 좋은 모델을 고르는 것이 중요하다 | 세 모델의 차이가 벡터화 방식의 차이보다 작다 |
| 02번 4절 | LSTM이 더 좋은 모델이다 | 짧은 명사 나열에서는 어순 정보가 없어 손해 |
| 02번 5절 | 딥러닝이 고전 모델보다 낫다 | **TF-IDF + 로지스틱 회귀가 대등하거나 앞선다** |
| 02번 6절 | 저장했으면 끝이다 | `.h5`로 저장한 모델이 **다시 열리지 않는다** |

## 시험을 준비한다면

문제지가 요구하는 것은 모델의 성능만이 아닙니다. **형식을 지켰는지**가 함께 채점됩니다.

| 요구 | 어디서 다루나 |
|---|---|
| 정확도 70% 이상 (통과선 63%) | 01번 3절 — 기준선부터 계산 |
| `본인핸드폰번호_2.csv` — 훈련 데이터와 같은 컬럼 구조 | 01번 11절 |
| `본인핸드폰번호_2.h5` — 다른 확장자 가능 | 02번 6절 (`.h5`가 실패하는 경우와 대안) |
| 제출한 코드로 **재현**되는지 | 02번 7절 — seed 고정, 저장·불러오기 확인 |

**전략 하나만 기억하세요.** 먼저 TF-IDF + 선형 모델로 **목표 성능을 확보**한 뒤,
시간이 남으면 신경망을 시도해 더 나은 쪽을 제출합니다. 처음부터 큰 모델을 붙잡고 있다가
시간이 부족해지는 것이 가장 나쁜 경우입니다.

## 시작하기 전에

- **선수 지식**: pandas 기본기와 scikit-learn의 `fit`/`predict` 흐름.
  낯설다면 [`ml-curriculum/01_basic_classification`](../ml-curriculum/01_basic_classification/01_basic_classification.ipynb)을 먼저 보세요
- **02번만** TensorFlow가 필요합니다(Colab에는 이미 설치되어 있습니다). CPU로 모델 하나에 5~10초면 학습됩니다
- Keras의 `Sequential`·`compile`·`fit`·`EarlyStopping`이 처음이라면
  [`tabular-ml-practice/04_dnn_keras`](../tabular-ml-practice/04_dnn_keras/04_dnn_keras.ipynb)를 먼저 보세요
- 낯선 용어는 [glossary.md](../../glossary.md)의 "7. 텍스트 분류 실무" 섹션에서 찾아보세요
- 에러가 나면 [troubleshooting.md](../../troubleshooting.md)를 보세요

## 다른 시리즈와의 관계

| 시리즈 | 관계 |
|---|---|
| [`tabular-ml-practice`](../tabular-ml-practice/README.md) | **같은 흐름의 텍스트 판**. EDA → 전처리 → 모델 → 평가 → 제출을 텍스트에서 반복합니다 |
| [`ml-curriculum`](../../CURRICULUM.md) 04·06번 | 신경망과 RNN의 **원리**. 이 시리즈는 그것을 텍스트에 적용합니다 |
| [`rag-pipeline-practice`](../rag-pipeline-practice/) | 같은 "텍스트"지만 목적이 다릅니다. 이쪽은 **분류**, 저쪽은 **검색과 생성**(RAG)입니다. 다만 임베딩이라는 개념은 양쪽에 모두 나옵니다 |

## 다음으로 해볼 만한 것

- **사전 학습 한국어 모델**: KoBERT, KLUE-RoBERTa를 파인튜닝하면 데이터가 적어도 성능이 크게 오릅니다
  (Hugging Face `transformers`)
- **형태소 분석기**(`kiwipiepy`)로 토큰화한 뒤 TF-IDF와 비교 — 상품명이 아닌 문장 데이터에서 차이가 납니다
- **계층 분류**: 대분류 → 소분류로 나눠 예측하기. 실제 쇼핑몰 카테고리는 3~4단계입니다
- **자신의 텍스트 데이터**(고객 문의, 리뷰, 로그 메시지)로 01번의 흐름을 그대로 반복해보기
