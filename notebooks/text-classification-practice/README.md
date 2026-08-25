# 텍스트 분류 실습 (text-classification-practice)

**짧은 한국어 문장 하나로 주제를 분류하는 전 과정**을 다루는 2개 노트북입니다.
뉴스 기사 제목을 보고 그 기사가 `경제`인지 `스포츠`인지 맞히는 문제를,
기준선 계산부터 최종 성능 보고까지 그대로 따라갑니다.

`tabular-ml-practice`가 **숫자와 범주가 든 표**를 다뤘다면, 이 시리즈는 **글자만 있는 데이터**를 다룹니다.
표 데이터에서는 컬럼 하나가 곧 피처였지만, 텍스트에는 그런 컬럼이 없습니다.
**"글자를 어떻게 숫자로 바꾸는가"** 가 이 시리즈의 절반입니다.

나머지 절반은 **"성능이 올랐다고 말해도 되는가"** 입니다. 텍스트 분류는 손댈 곳이 많아서
숫자가 쉴 새 없이 움직입니다. 그중 무엇이 진짜 개선인지 가려내지 못하면 아무 데나 시간을 쓰게 됩니다.

## 구성

| 노트북 | 다루는 내용 | Colab | 해설 |
|---|---|---|---|
| [01. 텍스트 분류 기준선](01_text_baseline/01_text_baseline.ipynb) | 데이터·라벨 점검, 기준선, BoW·TF-IDF, 로지스틱 회귀, **짝지은 비교로 전처리 판단**, 문자 n-gram, macro f1과 혼동 행렬, 오분류 분석, 3분할과 **분포 이동** | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/text-classification-practice/01_text_baseline/01_text_baseline.ipynb) | [해설](01_text_baseline/01_text_baseline_solutions.ipynb) |
| [02. Keras 텍스트 분류](02_keras_text/02_keras_text.ipynb) | `TextVectorization`(정수 인코딩·패딩), 임베딩, `Conv1D`/`LSTM` 비교, TF-IDF와 정면 비교, **왜 졌는지 OOV로 규명**, 글자 단위로 되찾기, 모델 저장의 함정 | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/text-classification-practice/02_keras_text/02_keras_text.ipynb) | [해설](02_keras_text/02_keras_text_solutions.ipynb) |

두 노트북 끝에는 연습 문제가 6개씩 있고, `_solutions.ipynb`에 정답 코드와 해설이 있습니다.
**먼저 직접 풀어본 뒤** 열어보는 걸 권장합니다.

**순서대로 보세요.** 02번은 01번에서 만든 기준선과 비교하는 것이 핵심이라, 01번을 건너뛰면
"딥러닝이 이기지 못했다"는 이 시리즈의 결론이 와닿지 않습니다.

## 쓰는 데이터 — KLUE-YNAT

**[KLUE-YNAT](https://klue-benchmark.com/tasks/66/overview/description)** 를 씁니다.
연합뉴스 기사 제목에 사람이 주제 라벨을 붙인 공개 데이터셋으로,
한국어 자연어처리 모델을 평가하는 표준 벤치마크 **KLUE**의 일부입니다.

| 항목 | 내용 |
|---|---|
| 입력 | `title` — 기사 제목 (평균 27글자, 6.6단어) |
| 출력 | `label` — `IT과학`·`경제`·`사회`·`생활문화`·`세계`·`스포츠`·`정치` 중 하나 |
| 학습 데이터 | 45,678건 (노트북에서는 **20,000건만** 뽑아 씁니다 — 학습 시간 때문이며, 전체를 쓰면 어떻게 되는지는 01번 연습 문제 5번에서 확인합니다) |
| 평가 데이터 | 9,107건 — 01번 12절에서 **딱 한 번** 씁니다 |
| 출처 | [KLUE-benchmark/KLUE](https://github.com/KLUE-benchmark/KLUE) (GitHub) |
| 라이선스 | CC BY-SA 4.0 |

**미리 준비할 파일이 없습니다.** 노트북 첫 셀이 위 저장소에서 그때그때 내려받습니다
(train 46MB, 10~30초). 저장소에 데이터를 커밋해두지 않았습니다.

> **왜 이 데이터인가.** 짧고, 한국어이고, 주제가 여러 개이고, 무엇보다
> **사람이 붙인 라벨이 얼마나 갈렸는지까지 기록되어 있습니다.** 주석자 세 명이 각각 무엇이라고
> 답했는지가 남아 있어서, **"이 문제의 상한선은 어디인가"** 를 추측이 아니라 데이터로 말할 수 있습니다.
> 만들어낸 라벨 오류를 심어놓은 연습용 데이터로는 할 수 없는 이야기입니다.

## 이 시리즈를 관통하는 주제 — 숫자를 함부로 믿지 않기

두 노트북에 걸쳐 **직관과 결과가 어긋나는 장면**이 반복됩니다. 이것이 이 시리즈의 핵심입니다.

| 어디서 | 당연해 보이는 것 | 실제 결과 |
|---|---|---|
| 01번 3절 | 정답은 정해져 있다 | 주석자 세 명이 **36%에서 갈렸다.** 정확도 100%는 목표가 아니다 |
| 01번 7절 | 정확도가 0.001 올랐으니 개선이다 | 분할을 바꾸면 **0.01씩 흔들린다.** 짝지어 여러 번 재야 판단할 수 있다 |
| 01번 8절 | 단어와 문자를 **둘 다** 쓰면 더 낫다 | 문자만 쓴 쪽이 더 좋았다(0.8455 vs 0.8405) |
| 01번 8절 | 좋은 전처리는 어디서나 좋다 | 같은 정제가 단어 단위 **+0.004**, 문자 단위 **−0.017** |
| 01번 12절 | 테스트 점수가 곧 실전 성능이다 | 분포가 다른 데이터에서 **0.8455 → 0.7639** |
| 02번 5절 | 딥러닝이 고전 모델보다 낫다 | **TF-IDF + 로지스틱 회귀가 9%p 앞선다** |
| 02번 6절 | 신경망이 졌으니 모델을 키워야 한다 | 문제는 모델이 아니라 **토큰 단위**였다 |
| 02번 7절 | 저장하고 불러와졌으면 끝이다 | `.h5`로 저장한 모델이 **예측하는 순간 터진다** |

## 무엇을 알고 있어야 하고, 무엇을 여기서 배우나

**이 시리즈는 아래 왼쪽 칸만 알면 끝까지 갈 수 있게 썼습니다.** 오른쪽 칸은 필요한 자리에서
그때그때 설명하므로 미리 공부하고 올 필요가 없습니다.

| 알고 있다고 전제하는 것 | 여기서 처음 나오면 설명하는 것 |
|---|---|
| pandas: `read_csv`, `head`, `info`, `value_counts` | 학습/검증/테스트 분리, 기준선, 희소 행렬 |
| scikit-learn의 `fit` / `predict` 흐름 | `Pipeline`·`make_union`, BoW·TF-IDF, 문자 n-gram |
| 정확도가 무엇인지 | 정밀도·재현율·macro f1, 혼동 행렬, 예측 확률(`predict_proba`), 짝지은 비교 |
| Keras의 `Sequential`·`compile`·`fit`·`EarlyStopping` (02번) | 함수형 API, `TextVectorization`, 임베딩, OOV, `Conv1D`, 모델 저장 포맷 |

02번의 Keras 기초만 예외입니다. `Sequential`로 모델을 만들어본 적이 없다면
[`tabular-ml-practice/04_dnn_keras`](../tabular-ml-practice/04_dnn_keras/04_dnn_keras.ipynb)를 먼저 보세요.
**함수형 API(`keras.Input` / `keras.Model`)는 04번에 나오지 않으므로 02번 3절에서 따로 설명합니다.**

## 시작하기 전에

- **선수 지식**: pandas 기본기와 scikit-learn의 `fit`/`predict` 흐름.
  낯설다면 [`ml-curriculum/01_basic_classification`](../ml-curriculum/01_basic_classification/01_basic_classification.ipynb)을 먼저 보세요
- **인터넷 연결이 필요합니다.** 첫 셀이 GitHub에서 데이터를 내려받습니다
- **02번만** TensorFlow가 필요합니다(Colab에는 이미 설치되어 있습니다). CPU로 모델 하나에 20~30초입니다
- 낯선 용어는 [glossary.md](../../glossary.md)의 "7. 텍스트 분류 실무" 섹션에서 찾아보세요
- 에러가 나면 [troubleshooting.md](../../troubleshooting.md)를 보세요

## 다른 시리즈와의 관계

| 시리즈 | 관계 |
|---|---|
| [`tabular-ml-practice`](../tabular-ml-practice/README.md) | **같은 흐름의 텍스트 판**. EDA → 전처리 → 모델 → 평가를 텍스트에서 반복합니다 |
| [`ml-curriculum`](../../CURRICULUM.md) 04·06번 | 신경망과 RNN의 **원리**. 이 시리즈는 그것을 텍스트에 적용합니다 |
| [`rag-pipeline-practice`](../rag-pipeline-practice/) | 같은 "텍스트"지만 목적이 다릅니다. 이쪽은 **분류**, 저쪽은 **검색과 생성**(RAG)입니다. 다만 임베딩이라는 개념은 양쪽에 모두 나옵니다 |

## 다음으로 해볼 만한 것

- **사전 학습 한국어 모델**: KLUE-RoBERTa, KoBERT를 파인튜닝하면 같은 데이터에서 정확도가 크게 오릅니다.
  KLUE-YNAT는 원래 그 모델들을 평가하려고 만든 데이터셋이라, 논문에 적힌 점수와 직접 비교해볼 수 있습니다
  (Hugging Face `transformers`)
- **형태소 분석기**(`kiwipiepy`)로 토큰화한 뒤 문자 n-gram과 비교 — 01번 8절에서 미뤄둔 실험입니다
- **제목 대신 본문으로**: 01번 11절에서 "제목만으로는 알 수 없는 기사"가 오답의 한 축이었습니다.
  입력을 늘리면 그 축이 사라지는지 확인해보세요
- **자신의 텍스트 데이터**(고객 문의, 리뷰, 로그 메시지)로 01번의 흐름을 그대로 반복해보기
