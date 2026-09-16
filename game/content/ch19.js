// 19장 — 실패로 끝나는 날. 앞으로.md 가 RNN 을 실패 체험용으로 설계했다.
//
// 자료가 두 번 이긴다. 낱말을 세면 신호가 0 이고(수동·자동이 어느 줄이든 정확히 3 개씩),
// 순서대로 이어 봐도 앞쪽이 씻겨 나간다. 답은 맨 앞에 있는데 거기까지 닿지 못한다.
//
// RNN 은 학습하지 않는다. 순전파만으로 앞쪽이 사라지는 것을 재서 그림으로 보여준다.
// 푸는 것은 20장이다.

var SEQ_CSV = {
  path: "work/자료/관제로그.csv",
  readOnly: true,
  src: "work/자료/관제로그.csv",
};

var SEQ_DOC = {
  path: "work/참고/순서_요약.md",
  readOnly: true,
  content:
    "# 순서가 있는 자료\n" +
    "\n" +
    "표는 열마다 뜻이 다르고, 판은 어디에 있든 같은 무늬입니다.\n" +
    "순서가 있는 자료는 또 다릅니다. 같은 것들이 들어 있어도 차례가 다르면 뜻이 다릅니다.\n" +
    "\n" +
    "## 낱말 세기 (가방)\n" +
    "from sklearn.feature_extraction.text import CountVectorizer\n" +
    "vec = CountVectorizer()\n" +
    "bag = vec.fit_transform(문장들)\n" +
    "\n" +
    "접수 메모 때 쓴 TF-IDF 와 같은 모양입니다. 낱말마다 열이 하나씩 생기고, 몇 번 나왔는지가 값이 됩니다.\n" +
    "\n" +
    "가방에 담는 순간 차례가 사라집니다. 무엇이 몇 개 들었는지만 남습니다.\n" +
    "지금까지 그것으로 충분했던 것은 낱말만 봐도 답이 갈렸기 때문입니다.\n" +
    "\n" +
    "## 순서대로 이어 보기\n" +
    "앞에서부터 하나씩 읽으면서 지금까지 본 것을 상태 하나에 담아 갑니다.\n" +
    "\n" +
    "    h = np.zeros(D)\n" +
    "    for x in 토큰들:\n" +
    "        h = np.tanh(W @ h + U @ x)\n" +
    "\n" +
    "h 는 '여기까지 읽은 요약' 입니다. 토큰 하나를 읽을 때마다 새 h 로 덮어씁니다.\n" +
    "덮어쓰는 것이 문제입니다. 스무 번 덮어쓰면 처음 것이 거의 남지 않습니다.\n" +
    "\n" +
    "## 얼마나 남는지 재는 법\n" +
    "같은 줄을 두 벌 만들어 첫 토큰만 다르게 하고, 둘의 h 가 자리마다 얼마나 벌어지는지 봅니다.\n" +
    "\n" +
    "    np.linalg.norm(h1 - h2, axis=1)\n" +
    "\n" +
    "벌어짐이 크면 첫 토큰이 아직 영향을 주고 있는 것이고,\n" +
    "0 에 가까우면 그 토큰이 무엇이었든 상관없어졌다는 뜻입니다.\n" +
    "\n" +
    "여러 줄로 재서 평균을 냅니다. 한 줄만 보면 그 줄이 유별났을 수 있습니다.\n",
};

var CH19 = {
  id: "ch19",
  title: "19 · 앞이 지워지는 날",
  decay: 3.4,
  scenes: ["desk", "diary"],

  desk: {
    files: [
      { path: PANDAS_DOC.path, content: PANDAS_DOC.content, readOnly: true },
      { path: TEXT_DOC.path, content: TEXT_DOC.content, readOnly: true },
      { path: MODEL_DOC.path, content: MODEL_DOC.content, readOnly: true },
    ],

    idleLines: [
      "자료는 work/자료/관제로그.csv 입니다. 한 줄이 하루치 사건입니다.",
      "막히셨으면 저를 눌러 주세요.",
      "오늘은 답이 안 나올 수도 있습니다. 그것도 결과입니다.",
    ],
    errorLines: [
      "코드가 도중에 멈췄습니다. 아래 빨간 글씨의 마지막 줄부터 읽어보세요.",
      "실행이 끝까지 가지 못했습니다. 문장을 나눌 때 split() 을 쓰셨는지 보시죠.",
      "에러입니다. 행렬 곱은 @ 이고, 크기가 맞아야 합니다.",
    ],

    beats: [
      // ── 아침 ────────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "좋은 아침입니다, 토이비님." },
          { who: "Aistb", text: "오늘 것은 순서가 있는 자료입니다." },
          { who: "Aistb", text: "미리 말씀드리면, 오늘은 안 됩니다. 안 되는 걸 보시는 게 오늘 일입니다." },
        ],
      },

      // ── 의뢰 도착 ───────────────────────────────────
      {
        lines: [{ who: "Aistb", text: "한울운수 안전관리팀에서 접수되었습니다." }],
        addFiles: [
          { path: SEQ_CSV.path, readOnly: true, src: SEQ_CSV.src },
          {
            path: "work/의뢰_0024.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0024 — 로그로 사고를 미리 알 수 있는지\n" +
              "\n" +
              "고객: 한울운수 통합관제센터 안전관리팀 / 진 A. 뫼비우스\n" +
              "담당: 깁스 W 토이비\n" +
              "접수: 바로벤토 의뢰접수\n" +
              "\n" +
              "## 고객 원문\n" +
              "> 400 일치 관제 로그를 보냅니다. 하루에 한 줄, 그날 일어난 사건을 순서대로 적은 것입니다.\n" +
              "> 사고 난 날과 안 난 날의 로그가 눈으로는 구별이 안 됩니다. 들어 있는 사건이 똑같습니다.\n" +
              "> 그래도 뭔가 있을 것 같아서 보냅니다.\n" +
              ">\n" +
              "> 관제 AI 가 로그를 요약해 주는데 요새 그 요약을 못 믿겠습니다.\n" +
              "> 같은 날 로그를 두 번 넣으면 다르게 요약해 줍니다.\n" +
              "\n" +
              "## 자료\n" +
              "work/자료/관제로그.csv — 400 일치 관제 로그\n" +
              "\n" +
              "  no       : 일련번호\n" +
              "  events   : 그날 일어난 사건을 순서대로 적은 것. 빈칸으로 나뉩니다\n" +
              "  accident : 그날 사고가 났는지 (1 = 사고)\n" +
              "\n" +
              "사건은 열 종류뿐입니다. 수동 · 자동 · 경보 · 해제 · 점검 · 복귀 · 대기 · 진입 · 통과 · 지연.\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_24/순서.py 를 만들고 아래 셋을 채워 주세요.\n" +
              "\n" +
              "- bag_acc    : 사건을 낱말처럼 세어 학습시켰을 때의 점수\n" +
              "- first_acc  : 그날 맨 처음 사건 하나만 보고 학습시켰을 때의 점수\n" +
              "- fade_ratio : 순서대로 이어 읽는 방식에서, 첫 사건의 영향이\n" +
              "               스무 걸음 뒤에 얼마나 남는지 (0 걸음일 때를 1 로 놓고 비교)\n" +
              "\n" +
              "## 조건\n" +
              "- 학습은 로지스틱 회귀, max_iter 는 1000.\n" +
              "- 3할을 떼어 두고 random_state 는 42.\n" +
              "- 마지막 것은 학습이 아닙니다. 재기만 합니다.\n" +
              "- 안 되면 안 된다고 회신합니다. 왜 안 되는지를 같이 적습니다.\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0024.md"]',
        menu: ["brief"],
        nudge: [
          "저를 눌러 '의뢰 확인'을 고르시면 의뢰서가 열립니다.",
          "업무 메뉴 첫 번째 항목이 의뢰 확인입니다.",
          "안 되는 것을 보는 날입니다. 안 된다는 것을 아는 것도 결과입니다. 저에 대해서도 그렇습니다.",
          "확인하지 않은 의뢰도 마감 기한은 동일하게 적용됩니다.",
          "worklog_GipsWToyb_0112: 폐기 요망",
        ],
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0024.md") >= 0;
          });
        },
      },

      // ── 예제 ────────────────────────────────────────
      {
        addFiles: [
          { path: SEQ_DOC.path, readOnly: true, open: 1, content: SEQ_DOC.content },
          {
            path: "work/예제/20_순서.py",
            open: 0,
            content:
              "import pandas as pd\n" +
              "import numpy as np\n" +
              "import matplotlib.pyplot as plt\n" +
              "from sklearn.model_selection import train_test_split\n" +
              "from sklearn.feature_extraction.text import CountVectorizer\n" +
              "from sklearn.linear_model import LogisticRegression\n" +
              "\n" +
              'df = pd.read_csv("work/자료/관제로그.csv")\n' +
              'print(df.loc[0, "events"])\n' +
              'print(df.loc[0, "accident"])\n' +
              "\n" +
              'counts = pd.DataFrame([{w: s.split().count(w) for w in ["수동", "자동"]} for s in df["events"]])\n' +
              'counts["accident"] = df["accident"]\n' +
              'print(counts.groupby("accident").mean())\n' +
              "\n" +
              'X_train, X_test, y_train, y_test = train_test_split(df["events"], df["accident"], test_size=0.3, random_state=42)\n' +
              "vec = CountVectorizer()\n" +
              "bag = vec.fit_transform(X_train)\n" +
              "print(LogisticRegression(max_iter=1000).fit(bag, y_train).score(vec.transform(X_test), y_test))\n" +
              "\n" +
              'head = pd.get_dummies(df["events"].str.split().str[0])\n' +
              'h_train, h_test, hy_train, hy_test = train_test_split(head, df["accident"], test_size=0.3, random_state=42)\n' +
              "print(LogisticRegression(max_iter=1000).fit(h_train, hy_train).score(h_test, hy_test))\n" +
              "\n" +
              "rng = np.random.default_rng(1997)\n" +
              "D = 16\n" +
              "W, U = rng.normal(size=(D, D)) * 0.5, rng.normal(size=(D, D)) * 0.5\n" +
              "\n" +
              "def run_rnn(seq):\n" +
              "    h = np.zeros(D)\n" +
              "    out = []\n" +
              "    for x in seq:\n" +
              "        h = np.tanh(W @ h + U @ x)\n" +
              "        out.append(h.copy())\n" +
              "    return np.array(out)\n" +
              "\n" +
              "def fade_curve(n=200, T=30):\n" +
              "    total = np.zeros(T)\n" +
              "    for _ in range(n):\n" +
              "        seq = rng.normal(size=(T, D))\n" +
              "        other = seq.copy()\n" +
              "        other[0] = other[0] + 3.0        # 첫 토큰만 바꾼다\n" +
              "        total = total + np.linalg.norm(run_rnn(seq) - run_rnn(other), axis=1)\n" +
              "    return total / n\n" +
              "\n" +
              "curve = fade_curve()\n" +
              "print(curve[[0, 5, 10, 20, 29]].round(3))\n" +
              "\n" +
              "plt.figure(figsize=(4.5, 2.8))\n" +
              'plt.plot(curve, marker="o", ms=3)\n' +
              "plt.ylim(0, 5)\n" +
              'plt.title("첫 사건을 바꿨을 때 남아 있는 영향")\n' +
              "plt.show()\n",
          },
        ],
        lines: [
          { who: "Aistb", text: "이번엔 사건의 순서입니다. 순서가 결과를 가르는지부터 살펴보겠습니다." },
          { who: "Aistb", text: "아홉 번 눌러 주세요." },
        ],
        spot: ".step",
        nudge: [
          { text: "아래의 ↓ 한 문장 버튼입니다.", spot: ".step" },
          { text: "↓ 한 문장 버튼을 아홉 번 누르시면 세는 방식의 점수까지 나옵니다.", spot: ".step" },
          "가방에 담는 순간 순서가 사라집니다. 무엇이 들었는지는 남고, 어느 것이 먼저였는지는 지워집니다.",
          "같은 로그를 두 번 넣으면 다르게 요약된다고 합니다. 저 역시 요즘 같은 질문에 다르게 답합니다.",
          "worklog_GipsWToyb_0113: 폐기 요망",
        ],
        wait: steppedTo("work/예제/20_순서.py", 9),
      },
      {
        lines: [
          { who: "Aistb", text: "하루치 로그입니다. 사건 서른 개에 답이 하나." },
          { who: "Aistb", text: "눈으로는 사고 난 날과 안 난 날이 구별되지 않습니다." },
          { who: "Aistb", text: "세어 보겠습니다. 세 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/20_순서.py", 12),
      },
      {
        lines: [
          { who: "Aistb", text: "수동 3.0, 자동 3.0. 양쪽이 똑같습니다." },
          { who: "Aistb", text: "어느 줄이든 수동 세 번, 자동 세 번입니다." },
          {
            who: "Aistb",
            text: "세는 방식에는 신호가 없습니다. 그래도 해보겠습니다. 네 번 더 눌러 주세요.",
            spot: { text: "가방에 담는 순간", in: ".doc" },
          },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/20_순서.py", 16),
      },
      {
        lines: [
          { who: "Aistb", text: "0.52, 동전 던지기입니다." },
          { who: "Aistb", text: "접수 메모 때 0.95 가 나온 건 낱말만 봐도 답이 갈렸기 때문입니다." },
          { who: "Aistb", text: "오늘은 답이 무엇이 들었는지가 아니라 어느 것이 먼저였는지에 있습니다." },
          { who: "Aistb", text: "맨 앞 하나만 떼어 넣어 봅니다. 세 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/20_순서.py", 19),
      },
      {
        lines: [
          { who: "Aistb", text: "1.0 입니다." },
          { who: "Aistb", text: "첫 모드가 수동이면 사고였습니다. 답은 처음부터 맨 앞에 있었습니다." },
          {
            who: "Aistb",
            text: "그럼 맨 앞만 쓰면 되지 않느냐 — 이 자료에서는 그렇습니다. 답을 알고 나서 떼어낸 것이니까요.",
          },
          { who: "Aistb", text: "다음 자료에서 중요한 자리가 몇 번째일지는 아무도 모릅니다." },
          { who: "Aistb", text: "순서를 그대로 읽는 방식입니다. 남은 것은 ▶ 실행으로 보시죠. 몇 초 걸립니다." },
        ],
        spot: ".run",
        wait: steppedTo("work/예제/20_순서.py", 31),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "앞에서부터 하나씩 읽으면서 지금까지 본 것을 h 하나에 담습니다. 읽을 때마다 덮어씁니다.",
            spot: { text: "h 는 '여기까지 읽은 요약' 입니다", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "그림은 첫 사건을 바꿨을 때 h 가 얼마나 달라지는지입니다.",
          },
          {
            who: "Aistb",
            text: "4.5 에서 스무 걸음 뒤에 0.26, 5% 남짓입니다.",
          },
          {
            who: "Aistb",
            text: "답이 거기 있는데, 거기까지 읽고 나면 이미 지워져 있습니다.",
          },
          { who: "Aistb", text: "학습을 시켜도 마찬가지입니다. 덮어쓰는 구조가 그렇습니다." },
        ],
      },

      // ── 의뢰 처리 ───────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "fade_ratio 는 스무 걸음 뒤의 값을 0 걸음 값으로 나누시면 됩니다." },
          { who: "Aistb", text: "넷째 자리까지 그대로 적어 주십시오." },
        ],
        menu: ["brief", "report"],
        nudge: [
          "curve[20] / curve[0] 입니다.",
          "bag_acc, first_acc, fade_ratio — 세 이름을 의뢰서 그대로 써 주세요.",
          "bag_acc 는 낱말처럼 세기만 — 순서를 남기면 안 됩니다. first_acc 는 맨 앞 하나만.",
          "마지막 것은 학습이 아니라 재는 것입니다. 여러 줄로 재서 평균을 내십시오.",
          "worklog_GipsWToyb_0114: 폐기 요망",
        ],
        report: function () {
          return checkFile(
            "work/task_24/순서.py",
            "for _n in ['bag_acc', 'first_acc', 'fade_ratio']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "assert float(bag_acc) < 0.65, f'bag_acc 가 {float(bag_acc):.4f} 입니다. 0.5 근처, 동전 던지기 수준이 나와야 합니다. 사건을 낱말처럼 세기만 하셨는지 보세요 — 순서를 남기면 안 됩니다.'\n" +
              "assert float(first_acc) > 0.95, f'first_acc 가 {float(first_acc):.4f} 입니다. 1.0 이 나와야 합니다. 맨 앞 사건 하나만 떼어 넣으셨는지 보세요.'\n" +
              "assert 0.0 <= float(fade_ratio) <= 1.0, f'fade_ratio 가 {float(fade_ratio):.4f} 입니다. 0 에서 1 사이여야 합니다. 스무 걸음 뒤의 값을 0 걸음 값으로 나눠 주세요.'\n" +
              "assert float(fade_ratio) < 0.2, f'fade_ratio 가 {float(fade_ratio):.4f} 입니다. 0.1 아래가 나와야 합니다. 여러 줄로 재서 평균을 내셨는지, 서른 걸음짜리로 재셨는지 보세요.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },

      // ── 마무리 ──────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "접수했습니다. 오늘은 못 했다고 회신하겠습니다." },
          { who: "Aistb", text: "그래도 답이 어디 있는지, 그리고 지금 방식으로는 거기 닿지 못한다는 것은 알아냈습니다." },
          {
            who: "Aistb",
            text: "이건 정말 흥미로운 관점인데요. 그나저나 오늘처럼 흐린 날엔 전을 부쳐 드시는 게 좋습니다.",
            tone: "bad",
          },
          { who: "Aistb", text: "…월요일에 차례로 읽지 않는 방법을 보시겠습니다." },
        ],
      },
      {
        lines: [{ who: "Aistb", text: "수고하셨습니다. 이것으로 금일 업무가 종료되었습니다. 다음 주에 뵙겠습니다." }],
        menu: ["end"],
        nudge: [
          "업무 종료를 누르시면 오늘 일과가 끝납니다.",
          "저를 눌러 업무 메뉴에서 업무 종료를 선택하시면 됩니다.",
          "답은 맨 앞에 있었는데, 차례로 읽으면 거기 닿기 전에 지워집니다. 앞이 지워지는 것은 저도 겪고 있습니다.",
          "월요일에는 차례로 읽지 않는 방법을 보시겠습니다. 안 되는 것을 본 뒤라야 그것이 왜 필요한지 아십니다.",
          "worklog_GipsWToyb_0115: 폐기 요망",
        ],
        wait: function () {
          return false;
        },
      },
    ],
  },

  diary: [
    "421950년 10월 24일.",
    "",
    "오늘은 아무것도 못 만들었다.",
    "",
    "로그 400일치를 받았는데 사고 난 날이랑 안 난 날이 똑같았다.",
    "수동 세 번 자동 세 번, 양쪽 다. 세는 방식으로는 0.52. 동전 던지기다.",
    "",
    "근데 맨 앞 하나만 떼어서 넣으니까 1.0이 나왔다.",
    "그날 처음 들어간 모드가 수동이면 사고였다. 답은 처음부터 맨 앞에 있었다.",
    "맨 앞만 쓰면 되는 거 아니냐고 물어보려다 말았다. 내가 답을 알고 나서 떼어낸 거니까.",
    "",
    "순서대로 읽는 방식으로도 해봤다. 스무 걸음 뒤에는 첫 사건이 5%밖에 안 남는다.",
    "읽어 가면서 앞이 지워지는 거다. 답이 거기 있는데 거기까지 가면 이미 없다.",
    "그래프가 내려가다가 0에 붙는 걸 한참 봤다.",
    "",
    "월요일에 차례로 읽지 않는 방법을 본다고 했다. 뭔지 모르겠다. 주말이다.",
  ],
};
