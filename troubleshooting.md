# 막혔을 때 보는 문서 (troubleshooting)

노트북이 에러를 뱉거나, 아무 일도 안 일어나거나, 남들은 나온다는 출력이 나에게만 안 나올 때 보는 문서입니다.
**여러 노트북에서 똑같이 반복되는 문제만** 모았습니다.

"코드는 돌아갔는데 결과 숫자가 이상하다"(cost가 안 줄어든다, 정확도가 안 오른다) 같은 것은
**각 노트북의 해당 셀 바로 아래**에 적어뒀습니다. 여기서 찾지 말고 그 자리를 보세요.

---

## 목차

- [1. 가장 먼저 확인할 것](#1-가장-먼저-확인할-것)
- [2. `NameError` / `KeyError` — 변수가 없다고 나옵니다](#2-nameerror--keyerror--변수가-없다고-나옵니다)
- [3. 코드 셀 아래가 비어 있습니다](#3-코드-셀-아래가-비어-있습니다)
- [4. 그래프의 한글이 □□□로 깨집니다](#4-그래프의-한글이-로-깨집니다)
- [5. 패키지 설치가 안 되거나 `ModuleNotFoundError`가 납니다](#5-패키지-설치가-안-되거나-modulenotfounderror가-납니다)
- [6. 데이터를 내려받지 못합니다](#6-데이터를-내려받지-못합니다)
- [7. OpenAI API 키 — 넣는 법과 안 넣어도 되는 곳](#7-openai-api-키--넣는-법과-안-넣어도-되는-곳)
- [8. Docker / PostgreSQL / OpenSearch](#8-docker--postgresql--opensearch)
- [9. 학습이 너무 느립니다 (GPU)](#9-학습이-너무-느립니다-gpu)
- [10. TensorFlow가 경고를 잔뜩 쏟아냅니다](#10-tensorflow가-경고를-잔뜩-쏟아냅니다)
- [11. `project-walkthrough`에서 프로젝트 경로를 못 찾습니다](#11-project-walkthrough에서-프로젝트-경로를-못-찾습니다)
- [12. 저장한 Keras 모델이 다시 열리지 않습니다](#12-저장한-keras-모델이-다시-열리지-않습니다)
- [13. 실행할 때마다 결과가 달라집니다](#13-실행할-때마다-결과가-달라집니다)

---

## 1. 가장 먼저 확인할 것

에러 메시지가 뭐든, 이 세 가지가 원인인 경우가 가장 많습니다.

1. **위에서부터 순서대로 실행했는가.** 아래쪽 셀은 위쪽 셀이 만든 변수를 그대로 씁니다.
2. **첫 번째 셀(설치)과 두 번째 셀(import)을 실행했는가.** 런타임이 한 번 끊기면 처음부터 다시입니다.
3. **에러 메시지의 마지막 줄을 읽었는가.** 파이썬은 원인을 맨 아래에 적습니다. 가운데의 긴 스택은 대개 안 봐도 됩니다.

Colab에서 상태를 통째로 초기화하려면 `런타임 > 세션 다시 시작` 후 첫 셀부터 다시 실행하세요.

---

## 2. `NameError` / `KeyError` — 변수가 없다고 나옵니다

```
NameError: name 'X_train' is not defined
```

거의 항상 **중간부터 실행했기 때문**입니다. 노트북은 위에서 아래로 한 번 흐르도록 쓰여 있습니다.

- 해당 셀 위쪽 셀들을 처음부터 다시 실행하세요(Colab: `런타임 > 이전 셀 실행`).
- `tabular-ml-practice` 03·04번은 02번에서 만든 `prepare_trips()` / `prepare_titanic()`을
  **노트북 안에서 다시 정의**하므로, 02번을 안 봤어도 03번만 따로 실행할 수 있습니다.
  그래도 그 노트북 안에서는 순서대로 실행해야 합니다.

`KeyError: 'duration'` 처럼 **컬럼**이 없다고 나오면, 그 컬럼을 만드는 셀(파생 변수 생성)을
건너뛴 것입니다.

---

## 3. 코드 셀 아래가 비어 있습니다

**정상입니다.** 이 저장소의 노트북은 실행 결과를 저장해두지 않았습니다.
직접 실행해야 출력과 그래프가 나타납니다. 파일을 열자마자 표와 그림이 보이길 기대하지 마세요.

반대로 **실행했는데도 아무것도 안 나온다면**, 그 셀에 `print()`나 그래프가 없는 셀일 수 있습니다
(함수 정의, `import`, `.fit()` 등). 다음 셀로 넘어가면 됩니다.

---

## 4. 그래프의 한글이 □□□로 깨집니다

한글 폰트가 없어서입니다. 노트북 두 번째 셀이 `koreanize-matplotlib`을 쓰고, 없으면
OS에 설치된 한글 폰트(맑은 고딕/AppleGothic/나눔고딕)를 찾도록 되어 있습니다.

- **Colab**: 첫 셀에서 `koreanize-matplotlib`이 설치됩니다. 설치 셀을 건너뛰지 마세요.
- **설치했는데도 깨진다면**: 폰트를 잡는 코드는 `matplotlib`을 처음 쓰기 **전에** 돌아야 합니다.
  `런타임 > 세션 다시 시작` 후 첫 셀부터 다시 실행하세요.
- **로컬**에서 한글 폰트가 없다면: `pip install koreanize-matplotlib`

마이너스 부호가 깨지는 것도 같은 원인이고, `plt.rcParams["axes.unicode_minus"] = False`로
막아뒀습니다.

---

## 5. 패키지 설치가 안 되거나 `ModuleNotFoundError`가 납니다

각 노트북 첫 셀은 **Colab일 때만** 설치를 실행합니다.

```python
IN_COLAB = "google.colab" in sys.modules
if IN_COLAB:
    !pip install -q ...
```

- **로컬에서 `ModuleNotFoundError`가 나면** 설치가 안 된 것이 맞습니다.
  프로젝트 루트에서 `pip install -r requirements.txt`를 한 번 돌리면 모든 노트북이 커버됩니다.
- **설치는 됐는데 import가 안 되면** 런타임이 이전 상태를 들고 있는 경우입니다.
  `런타임 > 세션 다시 시작` 후 다시 실행하세요.
- **`kiwipiepy`(형태소 분석기) 설치가 오래 걸립니다.** Colab 기준 1~2분 걸릴 수 있습니다.
  멈춘 게 아니니 기다리세요. (`rag-pipeline-practice/02`, `project-walkthrough/02`)
- **`tensorflow`는 Colab에 이미 깔려 있습니다.** 로컬이라면 `pip install tensorflow`가 별도로
  필요합니다. (`ml-curriculum/07`, `tabular-ml-practice/04`)

---

## 6. 데이터를 내려받지 못합니다

노트북마다 데이터를 얻는 방법이 다릅니다.

| 노트북 | 데이터 | 어디서 |
|---|---|---|
| `ml-curriculum/04`, `05` | MNIST | `torchvision`이 자동 다운로드 (처음 1~2분) |
| `tabular-ml-practice/00`~`04` | `taxis`, `titanic` | `seaborn.load_dataset()`이 인터넷에서 다운로드 |
| `ml-curriculum/02` | `data/scores.csv` | **노트북이 직접 만듭니다.** 미리 준비할 파일 없음 |
| `text-classification-practice/01`, `02` | KLUE-YNAT | `pd.read_json()`이 GitHub raw에서 직접 내려받습니다 (train 46MB, 10~30초) |

- **셋 다 인터넷 연결이 필요합니다.** 사내망·오프라인 환경이라면 이 셀에서 멈춥니다.
- `ml-curriculum`은 데이터를 `../../../data`(저장소 루트의 `data/`)에 둡니다.
  Colab에서 이 상대 경로가 이상한 위치를 가리켜 권한 오류가 난다면, 해당 셀의
  `root="../../../data"`를 `root="./data"`로 바꾸면 됩니다.
- `tabular-ml-practice`는 파일을 쓰지 않으므로 `data/`에 아무것도 준비할 필요가 없습니다.
- `text-classification-practice`에서 `NameError: name 'YNAT' is not defined`가 나면 **첫 코드 셀을
  건너뛴 것**입니다. 그 셀이 데이터 주소를 정합니다.
- 같은 시리즈에서 다운로드가 오래 걸린다면 정상입니다. 학습 데이터가 46MB라 10~30초쯤 걸립니다.
  `URLError`나 타임아웃이 난다면 사내망에서 GitHub raw가 막힌 것이므로,
  `ynat-v1.1_train.json`을 미리 받아두고 `pd.read_json("ynat-v1.1_train.json")`으로 바꿔 읽으세요.

---

## 7. OpenAI API 키 — 넣는 법과 안 넣어도 되는 곳

### 키가 없어도 됩니다

**`rag-pipeline-practice`와 `project-walkthrough`의 모든 노트북은 API 키 없이 끝까지 실행됩니다.**
키가 없으면 이렇게 대체됩니다.

| 노트북 | 키가 있으면 | 키가 없으면 |
|---|---|---|
| `rag-pipeline-practice/03` | `gpt-4o-mini`로 정형 출력 | 규칙 기반(정규식) 함수로 대체 |
| `rag-pipeline-practice/04` | OpenAI 임베딩 + 실제 답변 생성 | TF-IDF 벡터 + 조립된 프롬프트만 출력 |
| `rag-pipeline-practice/05` | 실제 모델 응답 비교 | 모의(mock) 응답 함수로 재현 |
| `project-walkthrough/03` | `structurer.py`의 실제 LLM 호출 | 규칙 기반(정규식) 대체 함수로 진행 |

`(OPENAI_API_KEY가 없어 …)` 같은 안내가 출력되면 **실패가 아니라 대체 경로로 진행 중**이라는 뜻입니다.

`ml-curriculum`과 `tabular-ml-practice`는 LLM을 쓰지 않으므로 키가 아예 필요 없습니다.

### 키를 실제로 넣고 싶다면

**Colab (권장)** — 왼쪽 사이드바의 🔑 **보안 비밀**에 `OPENAI_API_KEY`를 등록하고,
"노트북 액세스"를 켠 뒤 아래를 **첫 셀 다음에** 실행합니다.

```python
import os
from google.colab import userdata
os.environ["OPENAI_API_KEY"] = userdata.get("OPENAI_API_KEY")
```

**Colab (간단하지만 위험)** — 아래처럼 코드에 직접 적으면 **노트북을 공유하는 순간 키가 새어 나갑니다.**
잠깐 시험할 때만 쓰고, 저장·공유 전에 반드시 지우세요.

```python
import os
os.environ["OPENAI_API_KEY"] = "sk-..."
```

**로컬** — 저장소 루트에 `.env` 파일을 만들고 아래 한 줄을 넣습니다.
노트북이 `load_dotenv()`로 읽어갑니다. `.env`는 `.gitignore`에 들어 있어 커밋되지 않습니다.

```
OPENAI_API_KEY=sk-...
```

### 키를 넣었는데 에러가 납니다

| 메시지 | 뜻 | 할 것 |
|---|---|---|
| `AuthenticationError` / `401` | 키가 틀렸거나 만료됨 | 키를 다시 복사 (앞뒤 공백·따옴표 주의) |
| `RateLimitError` / `429` | 호출이 너무 잦거나 **크레딧 소진** | 결제 상태 확인, 잠시 후 재시도 |
| `insufficient_quota` | 무료 크레딧이 없음 | 키 없이 진행해도 실습은 끝까지 됩니다 |
| `model_not_found` | 계정에서 그 모델을 못 씀 | `CHAT_MODEL` 환경변수로 다른 모델 지정 |

> **비용**: 이 저장소의 실습은 문서 조각 몇 개 수준이라 실제 호출 비용은 매우 작지만, **0은 아닙니다.**
> 비용이 걱정되면 키를 넣지 않고 그대로 진행하세요. 배우는 내용은 같습니다.

---

## 8. Docker / PostgreSQL / OpenSearch

**노트북에는 필요 없습니다.** 인프라가 필요한 것은 `example-projects/`의 실제 프로젝트뿐입니다.

| 위치 | 필요한 것 |
|---|---|
| `notebooks/` 전체 (22권) | **없음.** DB는 SQLite(메모리), 검색은 numpy/TF-IDF로 대체 |
| `example-projects/crawl-storage-example` | PostgreSQL (Docker) |
| `example-projects/preprocess-example` | PostgreSQL + OpenSearch (Docker) |
| `example-projects/rag-regulation-example` | OpenSearch (Docker) + API 키 |

`rag-pipeline-practice/04`의 "실습 6"은 OpenSearch에 **연결을 시도만** 하고, 실패하면
안내를 출력한 뒤 numpy 검색으로 계속 진행합니다.
`OpenSearch에 연결할 수 없습니다 (...)` 출력은 **정상 동작**입니다.

---

## 9. 학습이 너무 느립니다 (GPU)

`ml-curriculum/04`(MNIST), `05`(CNN)는 CPU에서 몇 분 걸립니다.

- **Colab**: `런타임 > 런타임 유형 변경 > 하드웨어 가속기 > GPU`로 바꾸면 훨씬 빨라집니다.
  **바꾸면 세션이 초기화되므로 첫 셀부터 다시 실행해야 합니다.**
- 각 노트북은 `device = torch.device("cuda" if torch.cuda.is_available() else "cpu")`로
  알아서 잡으므로 코드는 고칠 게 없습니다. `device: cuda`가 출력되면 GPU를 쓰는 중입니다.
- GPU 없이도 **모든 노트북이 끝까지 실행됩니다.** 오래 걸릴 뿐입니다.
  각 노트북 첫 셀의 "소요 시간"에 예상치를 적어뒀습니다.

---

## 10. TensorFlow가 경고를 잔뜩 쏟아냅니다

`ml-curriculum/07`, `tabular-ml-practice/04`에서 아래 같은 줄이 여러 개 나옵니다.

```
I tensorflow/core/platform/cpu_feature_guard.cc ... This TensorFlow binary is optimized ...
W external/local_xla/... Unable to register cuFFT factory ...
```

**대문자 `I`(정보)나 `W`(경고)로 시작하면 무시해도 됩니다.** 실제로 멈추는 것은
`Error`/`Traceback`이 있을 때뿐입니다. TensorFlow는 원래 시작할 때 이런 로그를 남깁니다.

---

## 11. `project-walkthrough`에서 프로젝트 경로를 못 찾습니다

```
AssertionError: 프로젝트 경로를 찾지 못했습니다. 저장소 루트에서 노트북을 열었는지 확인하세요.
```

이 시리즈는 설명을 옮겨 적는 대신 **실제 프로젝트 파일을 열어서 보여주기** 때문에,
`example-projects/` 폴더가 옆에 있어야 합니다.

- **Colab**: 첫 셀이 저장소를 통째로 `git clone` 합니다. 그 셀을 건너뛰면 이 에러가 납니다.
  클론이 실패했다면 인터넷 연결과 GitHub 접근을 확인하세요.
- **로컬**: 노트북을 `notebooks/project-walkthrough/NN_xxx/` 위치 그대로 두고 열어야 합니다.
  노트북 파일만 다른 폴더에 복사해두면 3단계 위를 저장소 루트로 계산하는 코드가 어긋납니다.

---

## 12. 저장한 Keras 모델이 다시 열리지 않습니다

`text-classification-practice/02`에서 나오는 문제입니다.

```
model.save("my_model.h5")             # 저장 성공
m = keras.models.load_model("my_model.h5")   # 불러오기도 성공
m.predict(["아무 문장"])               # FailedPreconditionError
```

`TextVectorization`을 **모델 안에 넣은 채** `.h5`로 저장하면 이렇게 됩니다.
**저장과 불러오기는 조용히 성공하고, 예측하는 순간 터집니다.**
`.h5`는 숫자 배열만 담는 옛 포맷이라 이 레이어가 들고 있는 **단어 사전(문자열 표)** 을 복원하지 못합니다.

- **가장 간단한 해결**: `model.save("my_model.keras")` — 최신 Keras 포맷은 전처리 레이어를 그대로 담습니다
- **`.h5`를 꼭 써야 한다면**: 벡터화를 모델 밖으로 빼서 모델은 정수 배열만 받게 하고,
  사전은 `get_vocabulary()`로 꺼내 json 등으로 따로 저장합니다
- 어느 쪽이든 **저장한 뒤 곧바로 `load_model`로 불러와 예측까지 해보세요.**
  저장에 성공했다는 것과 다시 쓸 수 있다는 것은 다릅니다

---

## 13. 실행할 때마다 결과가 달라집니다

무작위가 들어가는 곳(가중치 초기화, 데이터 분할, 드롭아웃) 때문입니다.
노트북은 시드를 고정해뒀습니다 — `torch.manual_seed(0)`, `random_state=42`,
`np.random.default_rng(...)`, `keras.utils.set_random_seed(42)`.

- 그 셀을 **건너뛰었거나**, 셀을 여러 번 반복 실행하면 난수 상태가 달라져 값이 바뀝니다.
  처음부터 순서대로 한 번씩 실행하면 본문에 적힌 숫자와 맞습니다.
- **본문 숫자와 소수점 아래가 조금 다른 것은 정상입니다.** 라이브러리 버전과 하드웨어에 따라
  마지막 자리가 달라집니다. 경향(줄어든다/올라간다)이 같으면 제대로 된 것입니다.
- `ml-curriculum/04`의 XOR처럼 **초기값 운을 타는 경우**도 있습니다. 그 자리에 따로 적어뒀습니다.

---

## 여기에 없는 문제라면

- 용어를 모르겠다 → [glossary.md](glossary.md)
- 어디서부터 봐야 할지 모르겠다 → [README.md](README.md)의 "학습 가이드"
- 출력 숫자가 이상하다 → **그 셀 바로 아래의 "결과 읽는 법"**
