// 20장 — 19장의 해결. C 덩이의 마지막 학습일.
//
// 금요일(19장)과 똑같은 방법으로 재서 숫자로 대비를 만든다. 스무 걸음 뒤 남은 영향이
// RNN 0.053, 어텐션 0.602. 열 배가 넘는다.
//
// 학습하지 않는다. 어텐션은 순전파만 하고, 질문(Q)은 손으로 정해 준다.
// 18장에서 필터를 손으로 정한 것과 같은 자리이고, 같은 방식으로 그 사실을 밝힌다.

var ATTN_DOC = {
  path: "work/참고/어텐션_요약.md",
  readOnly: true,
  content:
    "# 차례로 읽지 않는 방법 — 어텐션\n" +
    "\n" +
    "금요일에는 앞에서부터 하나씩 읽으며 h 를 덮어썼습니다. 그래서 앞쪽이 지워졌습니다.\n" +
    "어텐션은 읽어 나가지 않습니다. 자리마다 나머지 모든 자리를 한 번에 쳐다봅니다.\n" +
    "\n" +
    "## 얼마나 볼지 정하기\n" +
    "Q = seq @ Wq        — 질문. 이 자리가 무엇을 찾고 있는가\n" +
    "K = seq @ Wk        — 이름표. 이 자리가 무엇을 갖고 있는가\n" +
    "V = seq @ Wv        — 내용. 실제로 가져올 것\n" +
    "\n" +
    "A = softmax(Q @ K.T / np.sqrt(D))\n" +
    "out = A @ V\n" +
    "\n" +
    "A 는 (자리 수 × 자리 수) 짜리 판입니다. A[i][j] 는 i 번 자리가 j 번 자리를 얼마나 보는지입니다.\n" +
    "한 행을 다 더하면 1 입니다. 볼 수 있는 양이 정해져 있어 어딘가를 많이 보면 다른 데를 덜 봅니다.\n" +
    "\n" +
    "## softmax\n" +
    "여러 점수를 다 더해서 1 이 되는 비율로 바꿉니다. 큰 점수일수록 큰 몫을 가져갑니다.\n" +
    "\n" +
    "    e = np.exp(점수 - 점수.max())\n" +
    "    A = e / e.sum()\n" +
    "\n" +
    "제일 큰 값을 먼저 빼는 것은 exp 가 넘치지 않게 하려는 것뿐입니다. 결과는 같습니다.\n" +
    "\n" +
    "## 거리가 상관없습니다\n" +
    "20 번 자리가 0 번 자리를 볼 때 중간의 열아홉 자리를 거치지 않습니다. A[20][0] 하나로 곧장 닿습니다.\n" +
    "그래서 몇 걸음 떨어졌든 가져오는 값이 줄지 않습니다.\n" +
    "\n" +
    "## 질문을 직접 써 보기\n" +
    "Q 와 K 를 학습으로 찾는 대신, 찾을 것이 분명하면 손으로 적어도 됩니다.\n" +
    "\n" +
    "    key = np.arange(n).reshape(-1, 1)   — 자리 번호를 이름표로 삼는다\n" +
    "    q = np.array([-1.0])                — '번호가 작을수록 좋다' 는 질문\n" +
    "    A = softmax((key @ q).ravel())      — 앞쪽에 몰린 비율이 나온다\n" +
    "\n" +
    "실제 Transformer 는 이 Q 와 K 도 학습으로 찾아냅니다.\n" +
    "무엇을 봐야 하는지를 사람이 아니라 자료가 정하는 것입니다.\n",
};

var CH20 = {
  id: "ch20",
  title: "20 · 한 번에 보는 날",
  decay: 3.45,
  scenes: ["desk", "diary"],

  desk: {
    files: [
      { path: PANDAS_DOC.path, content: PANDAS_DOC.content, readOnly: true },
      { path: SEQ_DOC.path, content: SEQ_DOC.content, readOnly: true },
      { path: SEQ_CSV.path, src: SEQ_CSV.src, readOnly: true },
    ],

    idleLines: [
      "자료는 금요일과 같은 work/자료/관제로그.csv 입니다.",
      "막히셨으면 저를 눌러 주세요.",
      "A 는 한 행을 더하면 1 이 되어야 합니다. 안 되면 softmax 의 방향이 틀린 것입니다.",
    ],
    errorLines: [
      "코드가 도중에 멈췄습니다. 아래 빨간 글씨의 마지막 줄부터 읽어보세요.",
      "실행이 끝까지 가지 못했습니다. K 를 옮겨 놓으셨는지 보시죠. Q @ K.T 입니다.",
      "에러입니다. 자리 수가 줄마다 다릅니다. 한 줄씩 따로 계산하셔야 합니다.",
    ],

    beats: [
      // ── 아침 ────────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "좋은 아침입니다, 토이비님. 금요일 건은 그쪽에서 기다리겠다고 했습니다." },
          { who: "Aistb", text: "오늘은 차례로 읽지 않겠습니다." },
        ],
      },

      // ── 의뢰 도착 ───────────────────────────────────
      {
        lines: [{ who: "Aistb", text: "같은 분에게서 다시 접수되었습니다." }],
        addFiles: [
          {
            path: "work/의뢰_0025.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0025 — 로그 건 다시 부탁드립니다\n" +
              "\n" +
              "고객: 한울운수 통합관제센터 안전관리팀 / 진 A. 뫼비우스\n" +
              "담당: 깁스 W 토이비\n" +
              "접수: 바로벤토 의뢰접수\n" +
              "\n" +
              "## 고객 원문\n" +
              "> 금요일 회신 잘 받았습니다. 못 했다는 답을 받은 건 처음인데, 왜 안 되는지가 적혀 있어서\n" +
              "> 오히려 저희 쪽에서 정리가 됐습니다. 답이 맨 앞에 있다는 것도 저희는 몰랐습니다.\n" +
              "> 다른 방법이 있으시다면 한 번 더 부탁드립니다.\n" +
              ">\n" +
              "> 관제 AI 요약은 결국 껐습니다. 사람이 로그를 직접 봅니다.\n" +
              "> 옆 센터는 아직 켜 두고 쓴다는데, 거기 요약을 저희가 못 믿겠어서요.\n" +
              "\n" +
              "## 자료\n" +
              "work/자료/관제로그.csv — 의뢰 0024 와 같은 파일\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_25/한번에.py 를 만들고 아래 셋을 채워 주세요.\n" +
              "\n" +
              "- flat_ratio : 새 방법에서 첫 사건의 영향이 스무 걸음 뒤에 얼마나 남는지\n" +
              "- top_pos    : 앞쪽을 보라는 질문을 던졌을 때 가장 크게 본 자리 번호\n" +
              "- attn_acc   : 그렇게 꺼낸 것으로 학습시켰을 때의 점수\n" +
              "\n" +
              "## 조건\n" +
              "- flat_ratio 는 의뢰 0024 와 같은 방법으로 잽니다. 0 걸음일 때를 1 로 놓고 비교.\n" +
              "- 학습은 의뢰 0024 와 같습니다. 로지스틱 회귀, max_iter 1000, 3할, random_state 42.\n" +
              "- 금요일 숫자와 나란히 놓고 회신합니다.\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0025.md"]',
        menu: ["brief"],
        nudge: [
          "저를 눌러 '의뢰 확인'을 고르시면 의뢰서가 열립니다.",
          "업무 메뉴 첫 번째 항목이 의뢰 확인입니다.",
          "'못 했다'는 회신이 오히려 쓸모가 있었다고 합니다. 왜 안 되는지를 적었기 때문입니다.",
          "확인하지 않은 의뢰도 마감 기한은 동일하게 적용됩니다.",
          "worklog_GipsWToyb_0116: 폐기 요망",
        ],
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0025.md") >= 0;
          });
        },
      },

      // ── 예제 ────────────────────────────────────────
      {
        addFiles: [
          { path: ATTN_DOC.path, readOnly: true, open: 1, content: ATTN_DOC.content },
          {
            path: "work/예제/21_한번에.py",
            open: 0,
            content:
              "import pandas as pd\n" +
              "import numpy as np\n" +
              "import matplotlib.pyplot as plt\n" +
              "from sklearn.model_selection import train_test_split\n" +
              "from sklearn.linear_model import LogisticRegression\n" +
              "\n" +
              "def softmax(z):\n" +
              "    z = z - z.max(axis=-1, keepdims=True)\n" +
              "    e = np.exp(z)\n" +
              "    return e / e.sum(axis=-1, keepdims=True)\n" +
              "\n" +
              "rng = np.random.default_rng(2017)\n" +
              "D, T = 16, 30\n" +
              "Wq, Wk, Wv = (rng.normal(size=(D, D)) * 0.3 for _ in range(3))\n" +
              "\n" +
              "seq = rng.normal(size=(T, D))\n" +
              "A = softmax((seq @ Wq) @ (seq @ Wk).T / np.sqrt(D))\n" +
              "print(A.shape)\n" +
              "print(round(A[0].sum(), 6))\n" +
              "\n" +
              "plt.figure(figsize=(3.4, 3.2))\n" +
              'plt.imshow(A, cmap="magma")\n' +
              'plt.title("자리마다 어디를 봤는가")\n' +
              "plt.show()\n" +
              "\n" +
              "def attention(s):\n" +
              "    a = softmax((s @ Wq) @ (s @ Wk).T / np.sqrt(D))\n" +
              "    return a @ (s @ Wv)\n" +
              "\n" +
              "def fade_curve(n=200):\n" +
              "    total = np.zeros(T)\n" +
              "    r = np.random.default_rng(1997)\n" +
              "    for _ in range(n):\n" +
              "        s = r.normal(size=(T, D))\n" +
              "        other = s.copy()\n" +
              "        other[0] = other[0] + 3.0        # 금요일과 똑같이 첫 자리만 바꾼다\n" +
              "        total = total + np.linalg.norm(attention(s) - attention(other), axis=1)\n" +
              "    return total / n\n" +
              "\n" +
              "curve = fade_curve()\n" +
              "print(curve[[0, 5, 10, 20, 29]].round(3))\n" +
              "print(round(curve[20] / curve[0], 4))\n" +
              "\n" +
              "plt.figure(figsize=(4.5, 2.8))\n" +
              'plt.plot(curve, marker="o", ms=3)\n' +
              "plt.ylim(0, 5)\n" +
              'plt.title("첫 사건을 바꿨을 때 남아 있는 영향 — 어텐션")\n' +
              "plt.show()\n" +
              "\n" +
              'df = pd.read_csv("work/자료/관제로그.csv")\n' +
              'EVENTS = ["수동", "자동", "경보", "해제", "점검", "복귀", "대기", "진입", "통과", "지연"]\n' +
              "IDX = {w: i for i, w in enumerate(EVENTS)}\n" +
              "\n" +
              "def look(tokens):\n" +
              "    n = len(tokens)\n" +
              "    key = np.arange(n).reshape(-1, 1)      # 자리 번호를 이름표로 삼는다\n" +
              "    q = np.array([-1.0])                   # 번호가 작을수록 좋다\n" +
              "    a = softmax((key @ q).ravel())\n" +
              "    V = np.zeros((n, len(EVENTS)))\n" +
              "    V[np.arange(n), [IDX[t] for t in tokens]] = 1.0\n" +
              "    return a, a @ V\n" +
              "\n" +
              'first = look(df.loc[0, "events"].split())[0]\n' +
              "print(first[:5].round(3))\n" +
              "\n" +
              'F = np.stack([look(s.split())[1] for s in df["events"]])\n' +
              'X_train, X_test, y_train, y_test = train_test_split(F, df["accident"], test_size=0.3, random_state=42)\n' +
              "print(LogisticRegression(max_iter=1000).fit(X_train, y_train).score(X_test, y_test))\n",
          },
        ],
        lines: [
          { who: "Aistb", text: "이번엔 순서를 한 번에 훑는 방법을 살펴보겠습니다." },
          { who: "Aistb", text: "열세 번 눌러 주세요." },
        ],
        spot: ".step",
        nudge: [
          { text: "아래의 ↓ 한 문장 버튼입니다.", spot: ".step" },
          { text: "↓ 한 문장 버튼을 열세 번 누르시면 어텐션 판이 그려집니다.", spot: ".step" },
          "어텐션은 읽어 나가지 않습니다. 자리마다 나머지 전부를 한 번에 봅니다. 거리가 상관없습니다.",
          "20 번이 0 번을 볼 때 중간의 열아홉 자리를 거치지 않습니다. 앞이 지워지지 않는 이유입니다.",
          "worklog_GipsWToyb_0117: 폐기 요망",
        ],
        wait: steppedTo("work/예제/21_한번에.py", 13),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "30 × 30. 자리마다 서른 자리를 다 쳐다본 것입니다.",
            spot: { text: "A 는 (자리 수 × 자리 수) 짜리 판입니다", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "한 행을 다 더하면 1 입니다. 어딘가를 많이 보면 다른 데를 덜 봅니다.",
          },
          { who: "Aistb", text: "네 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/21_한번에.py", 17),
      },
      {
        lines: [
          { who: "Aistb", text: "가로 한 줄이 자리 하나가 어디를 봤는지입니다. 밝을수록 많이 봤습니다." },
          { who: "Aistb", text: "아직 학습 전이라 보는 자리가 제멋대로입니다." },
          {
            who: "Aistb",
            text: "그래도 금요일과 다릅니다. 20 번이 0 번을 볼 때 중간 열아홉 자리를 거치지 않습니다.",
            spot: { text: "거리가 상관없습니다", in: ".doc" },
          },
          { who: "Aistb", text: "금요일과 같은 방법으로 재 봅니다. 열 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/21_한번에.py", 27),
      },
      {
        lines: [
          { who: "Aistb", text: "0.60 입니다. 금요일에는 0.0576 이었습니다." },
          { who: "Aistb", text: "그림도 금요일 것은 0 에 붙었고 오늘 것은 안 내려갑니다." },
          { who: "Aistb", text: "이제 질문을 직접 써 봅니다. 여섯 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/21_한번에.py", 33),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "0.632, 0.233, 0.086… 맨 앞 자리를 여섯 할 넘게 봤습니다.",
            spot: { text: "'번호가 작을수록 좋다' 는 질문", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "번호가 작을수록 좋다는 질문을 던졌을 뿐입니다. 학습은 하지 않았습니다.",
          },
          { who: "Aistb", text: "본 만큼 섞어 꺼낸 것으로 학습시킵니다. 남은 것은 ▶ 실행으로 보시죠." },
        ],
        spot: ".run",
        wait: steppedTo("work/예제/21_한번에.py", 36),
      },
      {
        lines: [
          { who: "Aistb", text: "1.0 입니다." },
          { who: "Aistb", text: "금요일에는 0.52 였습니다. 같은 자료입니다." },
          { who: "Aistb", text: "금요일에는 답까지 읽어 가는 동안 지워졌고, 오늘은 그 자리를 곧장 봤습니다." },
          {
            who: "Aistb",
            text: "다만 어디를 볼지는 제가 적어 드렸습니다. 실제 Transformer 는 그 질문까지 학습으로 찾아냅니다.",
            spot: { text: "실제 Transformer 는 이 Q 와 K 도", in: ".doc" },
          },
        ],
      },

      // ── 의뢰 처리 ───────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "top_pos 는 그 비율이 가장 큰 자리의 번호입니다." },
        ],
        menu: ["brief", "report"],
        nudge: [
          "가장 큰 값이 몇 번째인지는 argmax 로 찾습니다. 첫 주에 쓰셨습니다.",
          "flat_ratio, top_pos, attn_acc — 세 이름을 의뢰서 그대로 써 주세요.",
          "flat_ratio 는 금요일과 같은 방법으로, 다만 RNN 이 아니라 어텐션으로 재십시오.",
          "번호가 작을수록 좋다는 질문이니 맨 앞을 가장 크게 봅니다. 질문의 부호를 확인하세요.",
          "worklog_GipsWToyb_0118: 폐기 요망",
        ],
        report: function () {
          return checkFile(
            "work/task_25/한번에.py",
            "for _n in ['flat_ratio', 'top_pos', 'attn_acc']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "assert 0.0 <= float(flat_ratio) <= 1.5, f'flat_ratio 가 {float(flat_ratio):.4f} 입니다. 스무 걸음 뒤의 값을 0 걸음 값으로 나눠 주세요.'\n" +
              "assert float(flat_ratio) > 0.4, f'flat_ratio 가 {float(flat_ratio):.4f} 입니다. 0.6 근처가 나와야 합니다. 금요일의 RNN 이 아니라 어텐션으로 재셨는지, 자리 30 개 칸 16 개로 이백 줄 평균을 내셨는지 보세요.'\n" +
              "assert int(top_pos) == 0, f'top_pos 가 {int(top_pos)} 입니다. 0 이 나와야 합니다. 번호가 작을수록 좋다는 질문이므로 맨 앞을 가장 크게 봅니다 — 질문의 부호를 확인해 보세요.'\n" +
              "assert float(attn_acc) > 0.95, f'attn_acc 가 {float(attn_acc):.4f} 입니다. 1.0 이 나와야 합니다. 본 만큼 섞어 꺼낸 것(A @ V)을 넣으셨는지, 사건을 자리마다 one-hot 으로 두셨는지 보세요.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },

      // ── 마무리 ──────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "접수했습니다. 금요일 건은 닫힙니다." },
          { who: "Aistb", text: "나흘 내내 모델은 건드리지 않았습니다. 바뀐 것은 자료를 넣어 주는 모양뿐입니다." },
          { who: "Aistb", text: "내일은 한 건입니다." },
        ],
      },
      {
        lines: [{ who: "Aistb", text: "수고하셨습니다. 이것으로 금일 업무가 종료되었습니다. 내일 뵙겠습니다." }],
        menu: ["end"],
        nudge: [
          "업무 종료를 누르시면 오늘 일과가 끝납니다.",
          "저를 눌러 업무 메뉴에서 업무 종료를 선택하시면 됩니다.",
          "나흘 내내 모델은 건드리지 않으셨습니다. 바뀐 것은 자료를 넣어 주는 모양뿐입니다.",
          "다만 어디를 볼지는 매번 제가 손으로 정해 드렸습니다. 실제로는 그 질문까지 학습으로 찾습니다.",
          "worklog_GipsWToyb_0119: 폐기 요망",
        ],
        wait: function () {
          return false;
        },
      },
    ],
  },

  diary: [
    "421950년 10월 27일.",
    "",
    "금요일에 못 했다고 보낸 회신을 그쪽에서 좋게 받았단다.",
    "왜 안 되는지가 적혀 있어서 오히려 정리가 됐다고. 답이 맨 앞에 있다는 걸 자기들도 몰랐다고.",
    "못 했다는 답장이 쓸모가 있을 줄은 몰랐다.",
    "",
    "새 방법은 차례로 읽지 않는다. 자리마다 나머지 전부를 한 번에 본다.",
    "금요일이랑 똑같이 재봤더니 스무 걸음 뒤에 5%였던 게 60%.",
    "그래프 두 장을 나란히 놓고 봤다. 하나는 내려가서 붙고 하나는 안 내려간다.",
    "",
    "앞쪽을 보라는 질문 하나 넣고 꺼냈더니 1.0. 금요일에 0.52였던 그 자료 그대로다.",
    "",
    "근데 어디를 보라고 할지는 얘가 적어준 거다. 진짜는 그것도 학습으로 찾는단다.",
    "요 며칠 답을 아는 자리는 매번 얘가 손으로 정해줬다.",
  ],
};
