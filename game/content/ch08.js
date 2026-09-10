// 8장 — 처음으로 모델을 만들어 보는 날. 자료는 작게 잘라 온 표본을 쓴다.
// 여기서 배우는 것은 네 토막이다 — 무엇을 보고 무엇을 맞힐지 나누기, 시험용 떼어 두기,
// 학습시키기, 점수 내기. 이 넷을 그대로 9장의 큰 건에 쓴다.

var SAMPLE_CSV = {
  path: "work/자료/시험표본.csv",
  readOnly: true,
  content:
  [
    "temp,minutes,result",
    "112.5,6.5,불합격",
    "113.2,14.4,불합격",
    "116.2,12.5,합격",
    "122.3,11.0,합격",
    "115.0,8.2,불합격",
    "116.1,6.6,불합격",
    "115.6,7.9,불합격",
    "122.6,15.3,합격",
    "124.4,11.5,합격",
    "124.1,8.4,합격",
    "113.6,8.9,불합격",
    "113.4,9.7,불합격",
    "119.3,15.1,합격",
    "112.1,13.8,불합격",
    "120.2,15.2,합격",
    "120.2,11.8,합격",
    "124.7,12.1,합격",
    "112.0,11.6,불합격",
    "124.5,7.8,합격",
    "122.9,7.8,합격",
    "117.4,8.3,합격",
    "113.7,10.4,불합격",
    "116.5,15.4,합격",
    "120.8,12.1,합격",
  ].join("\n") + "\n",
};

var MODEL_DOC = {
  path: "work/참고/모델_요약.md",
  readOnly: true,
  content:
    "# 모델 만들기 요약\n" +
    "\n" +
    "지금까지는 자료를 손질했습니다. 여기서부터는 손질한 자료로 맞히는 것을 만듭니다.\n" +
    "\n" +
    "## 무엇을 보고 무엇을 맞히는가\n" +
    "X — 보고 판단할 열들. 표 모양이라 대괄호가 두 겹입니다.\n" +
    "y — 맞혀야 할 답 한 열. 열 하나라 대괄호가 한 겹입니다.\n" +
    "\n" +
    'X = df[["temp", "minutes"]]\n' +
    'y = df["fail"]\n' +
    "\n" +
    "y 는 숫자여야 합니다. 어제 글자를 0 과 1 로 바꿔 둔 것이 이 때문입니다.\n" +
    "\n" +
    "## 연습용과 시험용으로 나누기\n" +
    "from sklearn.model_selection import train_test_split\n" +
    "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)\n" +
    "\n" +
    "test_size=0.3 — 3할을 시험용으로 떼어 둡니다.\n" +
    "random_state=42 — 나누는 방식을 고정합니다. 주지 않으면 실행할 때마다 결과가 달라집니다.\n" +
    "답을 이미 보여준 자료로 시험을 보면 점수에 의미가 없습니다. 그래서 미리 떼어 둡니다.\n" +
    "\n" +
    "## 학습\n" +
    "from sklearn.linear_model import LogisticRegression\n" +
    "model = LogisticRegression()\n" +
    "model.fit(X_train, y_train)   — 연습용만 넣습니다. 시험용은 보여주지 않습니다.\n" +
    "\n" +
    "## 예측과 점수\n" +
    "model.predict(X_test) — 떼어 둔 것을 맞혀 봅니다. 0 과 1 이 줄줄이 나옵니다.\n" +
    "model.score(X_test, y_test) — 그중 몇 할을 맞혔는지. 0 에서 1 사이의 값입니다.\n" +
    "\n" +
    "## 새로 들어온 것 판정하기\n" +
    'model.predict(pd.DataFrame({"temp": [124.0], "minutes": [12.0]}))\n' +
    "학습할 때 쓴 열과 이름도 순서도 같아야 합니다. 한 번에 여러 건을 넣어도 됩니다.\n",
};

var CH08 = {
  id: "ch08",
  title: "8 · 처음으로 맞히게 하는 날",
  scenes: ["desk", "diary"],

  desk: {
    files: [
      { path: PANDAS_DOC.path, content: PANDAS_DOC.content, readOnly: true },
      { path: CLEAN_DOC.path, content: CLEAN_DOC.content, readOnly: true },
    ],

    idleLines: [
      "참고 문서는 work/참고/모델_요약.md 입니다.",
      "막히셨으면 저를 눌러 주세요.",
      "학습에 넣은 열과 판정에 넣는 열은 이름도 순서도 같아야 합니다.",
    ],
    errorLines: [
      "코드가 도중에 멈췄습니다. 아래 빨간 글씨의 마지막 줄부터 읽어보세요.",
      "실행이 끝까지 가지 못했습니다. X 는 대괄호가 두 겹인지 보시죠.",
      "에러입니다. y 에 글자가 들어가 있지 않은지 확인해 보세요.",
    ],

    beats: [
      // ── 아침 ────────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "좋은 아침입니다, 토이비님. 어제 보내신 정리본은 잘 받았다고 합니다." },
          { who: "Aistb", text: "어제 마지막에 합격을 0, 불합격을 1 로 바꾸셨습니다. 오늘 그 이유를 보시게 됩니다." },
          { who: "Aistb", text: "지금까지 하신 것은 이미 나와 있는 판정을 정리하는 일이었습니다. 오늘은 아직 나오지 않은 판정을 맞히는 것을 만듭니다." },
        ],
      },

      // ── 의뢰 도착 ───────────────────────────────────
      {
        lines: [{ who: "Aistb", text: "마침 시험해 볼 만한 건이 하나 들어와 있습니다." }],
        addFiles: [
          { path: SAMPLE_CSV.path, readOnly: true, content: SAMPLE_CSV.content },
          {
            path: "work/의뢰_0013.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0013 — 표본으로 예측이 되는지 확인\n" +
              "\n" +
              "발신: 가공식품안전원 검정과 / 하르 T. 예비\n" +
              "수신: 바로벤토 — 깁스 W 토이비\n" +
              "\n" +
              "## 자료\n" +
              "work/자료/시험표본.csv — 살균 기록 스물네 건입니다. 손질은 끝나 있습니다.\n" +
              "\n" +
              "  temp    : 살균 온도 (℃)\n" +
              "  minutes : 살균 시간 (분)\n" +
              "  result  : 합격 / 불합격\n" +
              "\n" +
              "## 할 일\n" +
              "온도와 시간만 보고 합격 여부를 맞힐 수 있는지 알고 싶습니다.\n" +
              "work/task_13/시험.py 를 만들고 아래 둘을 채워 주세요.\n" +
              "\n" +
              "- acc  : 떼어 둔 시험용에서 몇 할을 맞혔는지 (0 ~ 1)\n" +
              "- pred : 아래 두 건을 판정한 결과 (합격 0 / 불합격 1)\n" +
              "\n" +
              "      온도 124.0 / 시간 12.0\n" +
              "      온도 113.0 / 시간  8.0\n" +
              "\n" +
              "## 참고\n" +
              "떼어 두는 비율은 3할, random_state 는 42 로 맞춰 주세요. 저희 쪽 숫자와 대조해 보려고 합니다.\n" +
              "\n" +
              "## 비고\n" +
              "요즘 판정 AI 관련 문의가 부쩍 늘어 저희도 기준을 다시 잡는 중입니다.\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0013.md"]',
        menu: ["brief"],
        nudge: "저를 눌러 의뢰 확인을 고르시면 의뢰서가 열립니다.",
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0013.md") >= 0;
          });
        },
      },

      // ── 예제 ────────────────────────────────────────
      {
        addFiles: [
          { path: MODEL_DOC.path, readOnly: true, open: 1, content: MODEL_DOC.content },
          {
            path: "work/예제/10_첫모델.py",
            open: 0,
            content:
              "import pandas as pd\n" +
              "from sklearn.model_selection import train_test_split\n" +
              "from sklearn.linear_model import LogisticRegression\n" +
              "\n" +
              'df = pd.read_csv("work/자료/시험표본.csv")\n' +
              'df["fail"] = df["result"].map({"합격": 0, "불합격": 1})\n' +
              "\n" +
              'X = df[["temp", "minutes"]]\n' +
              'y = df["fail"]\n' +
              "\n" +
              "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)\n" +
              "print(len(X_train), len(X_test))\n" +
              "\n" +
              "model = LogisticRegression()\n" +
              "model.fit(X_train, y_train)\n" +
              "\n" +
              "print(model.predict(X_test))\n" +
              "print(list(y_test))\n" +
              "\n" +
              "print(model.score(X_test, y_test))\n",
          },
        ],
        lines: [
          { who: "Aistb", text: "예제 파일입니다. 한 문장씩 보시겠습니다." },
          { who: "Aistb", text: "두 번째 줄에서 도구를 처음 내려받습니다. 지금까지 것보다 큽니다. 이십 초쯤 걸릴 수 있으니 화면이 멈춘 것처럼 보여도 기다려 주세요." },
          { who: "Aistb", text: "일곱 번 눌러 X 와 y 가 만들어질 때까지 가 주세요." },
        ],
        spot: ".step",
        nudge: "아래의 ↓ 한 문장 버튼입니다. 도구를 받는 동안은 잠시 기다리셔야 합니다.",
        wait: steppedTo("work/예제/10_첫모델.py", 7),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "X 는 보고 판단할 것들입니다. 온도와 시간 두 열을 표 모양으로 골랐기 때문에 대괄호가 두 겹입니다.",
            spot: { text: 'X = df[["temp", "minutes"]]', in: ".doc" },
          },
          {
            who: "Aistb",
            text: "y 는 맞혀야 할 답입니다. 한 열이라 대괄호가 한 겹입니다. 어제 만드신 fail 열이 여기 들어갑니다.",
            spot: { text: 'y = df["fail"]', in: ".doc" },
          },
          { who: "Aistb", text: "다음 두 줄이 오늘의 고비입니다. 두 번 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/10_첫모델.py", 9),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "스물네 행을 열여섯과 여덟으로 갈랐습니다. 열여섯만 가지고 배우게 하고, 여덟은 감춰 둡니다.",
            spot: { text: "test_size=0.3", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "감추는 이유는 간단합니다. 답을 이미 보여준 문제로 시험을 보면 점수가 실력이 아닙니다.",
          },
          {
            who: "Aistb",
            text: "random_state 는 나누는 방식을 고정합니다. 이것이 없으면 같은 코드를 두 번 돌려도 점수가 달라집니다.",
            spot: { text: "random_state=42", in: ".doc" },
          },
          { who: "Aistb", text: "이제 학습입니다. 두 번 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/10_첫모델.py", 11),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "fit 이 학습입니다. 연습용 열여섯 행만 들어갔습니다. 화면에는 아무것도 나오지 않았지만 model 안이 바뀌었습니다.",
            spot: { text: "model.fit(X_train, y_train)", in: ".doc" },
          },
          { who: "Aistb", text: "무슨 일이 일어났는지는 지금 설명하지 않겠습니다. 먼저 되는 것을 보시는 편이 낫습니다." },
          { who: "Aistb", text: "맞혀 보겠습니다. 두 번 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/10_첫모델.py", 13),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "위가 모델이 맞힌 것이고 아래가 실제 답입니다. 감춰 둔 여덟 건이었습니다.",
            spot: { text: "model.predict(X_test)", in: ".doc" },
          },
          { who: "Aistb", text: "몇 할을 맞혔는지는 마지막 한 줄입니다. ▶ 실행으로 보시죠." },
        ],
        spot: ".run",
        wait: steppedTo("work/예제/10_첫모델.py", 14),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "score 는 그중 몇 할을 맞혔는지입니다. 1.0 이면 여덟 건을 다 맞힌 것입니다.",
            spot: { text: "model.score(X_test, y_test)", in: ".doc" },
          },
          { who: "Aistb", text: "여덟 건은 적은 수입니다. 이 점수를 그대로 믿으실 것은 아닙니다. 다만 오늘은 되는 것까지만 보시면 됩니다." },
        ],
      },

      // ── 의뢰 처리 ───────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "의뢰로 돌아가시죠. 점수 하나와 판정 두 건입니다." },
          { who: "Aistb", text: "새로 들어온 것을 판정하실 때는 표 모양으로 넣으셔야 합니다. 열 이름과 순서가 학습할 때와 같아야 합니다." },
        ],
        menu: ["brief", "report"],
        nudge: 'pd.DataFrame({"temp": [...], "minutes": [...]}) 를 만들어 model.predict 에 넣으시면 두 건이 한 번에 나옵니다.',
        report: function () {
          return checkFile(
            "work/task_13/시험.py",
            "for _n in ['acc', 'pred']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "assert 0.0 <= float(acc) <= 1.0, f'acc 가 {acc} 입니다. 0 에서 1 사이의 값이어야 합니다. score 가 내주는 값을 그대로 넣어 주세요.'\n" +
              "assert float(acc) >= 0.7, f'acc 가 {float(acc):.2f} 입니다. 떼어 두는 비율 0.3 과 random_state 42 를 맞추셨는지, 학습에 X_train 만 넣으셨는지 보세요.'\n" +
              "_p = [int(v) for v in pred]\n" +
              "assert len(_p) == 2, f'pred 에 {len(_p)} 개가 들어 있습니다. 두 건을 한 번에 넣으면 두 개가 나옵니다.'\n" +
              "assert _p == [0, 1], f'pred 가 {_p} 입니다. 124도 12분은 합격(0), 113도 8분은 불합격(1) 이 나와야 합니다. 넣으신 열 이름과 순서를 확인해 보세요.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },

      // ── 마무리 ──────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "접수했습니다." },
          { who: "Aistb", text: "오늘 하신 것은 네 토막입니다. 무엇을 보고 무엇을 맞힐지 나누고, 시험용을 떼어 두고, 학습시키고, 점수를 냅니다." },
          { who: "Aistb", text: "내일은 이 네 토막을 스물네 행이 아니라 어제 정리하신 표에 쓰시게 됩니다. 도와드리지 않아도 되는 일입니다." },
        ],
      },
      {
        lines: [{ who: "Aistb", text: "수고하셨습니다. 이것으로 금일 업무가 종료되었습니다. 내일 뵙겠습니다." }],
        menu: ["end"],
        nudge: "업무 종료를 누르시면 오늘 일과가 끝납니다.",
        wait: function () {
          return false;
        },
      },
    ],
  },

  diary: [
    "421950년 10월 9일.",
    "",
    "fit 한 줄 돌렸는데 아무것도 안 나왔다. 에러도 안 났다.",
    "잘못한 줄 알고 세 번쯤 다시 돌렸다. 원래 그런 거였다.",
    "됐으면 됐다고 한 줄이라도 찍어주든가.",
    "",
    "여덟 개를 감춰놓고 그걸로 시험을 봤다. 전부 맞혔다.",
    "Aistb는 여덟 개는 적은 수라 그대로 믿을 건 아니라고 했다.",
    "그래도 되긴 됐다.",
  ],
};
