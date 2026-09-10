// 17장 — C 덩이의 시작. 방식이 아예 다른 것을 처음 본다.
// 자료는 지난주 것 그대로다. 새 자료로 바꾸면 "새 방식이라 좋아졌다" 로 읽혀 버린다.
//
// 오늘의 두 가지 — 크기를 맞춰주지 않으면 신경망은 아무것도 못 배운다는 것,
// 그리고 그렇게 해도 지난주 숲보다 낮다는 것. 새 방식이 늘 이기지는 않는다.

var NN_DOC = {
  path: "work/참고/신경망_요약.md",
  readOnly: true,
  content:
    "# 신경망\n" +
    "\n" +
    "지금까지 쓴 것들은 답을 내는 방식이 정해져 있었습니다.\n" +
    "로지스틱은 열마다 계수 하나를 곱해 더했고, 트리는 갈래를 타고 내려갔습니다.\n" +
    "\n" +
    "신경망은 그 사이에 층을 끼웁니다. 열을 그대로 쓰지 않고, 열들을 섞은 값을 여러 개 만들어\n" +
    "그것으로 다시 판단합니다. 무엇을 어떻게 섞을지도 학습으로 정합니다.\n" +
    "\n" +
    "## 만들기\n" +
    "from sklearn.neural_network import MLPClassifier\n" +
    "model = MLPClassifier(hidden_layer_sizes=(16,), max_iter=1500, random_state=42)\n" +
    "\n" +
    "hidden_layer_sizes=(16,)    — 가운데 층 하나에 16 자리.\n" +
    "hidden_layer_sizes=(32, 16) — 층 두 개. 앞이 32 자리, 뒤가 16 자리.\n" +
    "max_iter — 자료를 몇 번 되풀이해 볼지. 모자라면 다 배우기 전에 멈춥니다.\n" +
    "\n" +
    "쓰는 법은 지금까지와 같습니다. fit, predict, score 그대로입니다.\n" +
    "\n" +
    "## 크기를 맞춰 주어야 합니다\n" +
    "from sklearn.preprocessing import StandardScaler\n" +
    "\n" +
    "scaler = StandardScaler()\n" +
    "train_s = scaler.fit_transform(X_train)\n" +
    "test_s  = scaler.transform(X_test)\n" +
    "\n" +
    "열마다 평균을 0, 흩어진 정도를 1 로 맞춥니다.\n" +
    "\n" +
    "이것이 신경망에서는 선택이 아닙니다. 한 열이 4000 까지 가고 다른 열이 0 과 1 뿐이면,\n" +
    "큰 열 하나가 계산을 다 잡아먹어 나머지가 묻힙니다. 학습이 시작도 못 하고 멈춥니다.\n" +
    "\n" +
    "fit_transform 은 연습용에만, transform 은 시험용에. TF-IDF 에서 하신 것과 같은 규칙입니다.\n" +
    "시험용의 평균까지 보고 기준을 잡으면 안 됩니다.\n" +
    "\n" +
    "트리와 숲은 이것이 필요 없습니다. 크기를 비교하는 것이 아니라 자르는 자리만 찾기 때문입니다.\n" +
    "\n" +
    "## 몇 번 만에 멈췄는가\n" +
    "model.n_iter_    — 실제로 되풀이한 횟수. max_iter 보다 한참 작으면 일찍 포기한 것입니다.\n" +
    "model.loss_curve_ — 되풀이할 때마다의 오차. 내려가다 멈추면 다 배운 것입니다.\n",
};

var CH17 = {
  id: "ch17",
  title: "17 · 층을 쌓는 날",
  decay: 3.2,
  scenes: ["desk", "diary"],

  desk: {
    files: [
      { path: PANDAS_DOC.path, content: PANDAS_DOC.content, readOnly: true },
      { path: FOREST_DOC.path, content: FOREST_DOC.content, readOnly: true },
      { path: METRIC_DOC.path, content: METRIC_DOC.content, readOnly: true },
      { path: LOG_EXT_CSV.path, content: LOG_EXT_CSV.content, readOnly: true },
    ],

    idleLines: [
      "자료는 지난주와 같은 work/자료/점검이력_v2.csv 입니다. 다섯 열만 씁니다.",
      "막히셨으면 저를 눌러 주세요.",
      "혹시 revisit_days 를 다시 넣지 않으셨는지 보세요.",
    ],
    errorLines: [
      "코드가 도중에 멈췄습니다. 아래 빨간 글씨의 마지막 줄부터 읽어보세요.",
      "실행이 끝까지 가지 못했습니다. 크기를 맞춘 표와 원래 표를 섞어 넣지 않으셨는지 보시죠.",
      "에러입니다. scaler 는 연습용에 fit_transform, 시험용에 transform 입니다.",
    ],

    beats: [
      // ── 아침 ────────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "좋은 아침입니다, 토이비님. 어제 회신은 잘 들어갔습니다. 내린 점수를 그대로 받았다고 합니다." },
          { who: "Aistb", text: "오늘부터 방식이 아예 다른 것을 보시게 됩니다." },
          { who: "Aistb", text: "자료는 바꾸지 않겠습니다. 지난주 것 그대로입니다. 자료까지 바꾸면 새 방식이라 좋아진 것인지 자료가 쉬워진 것인지 알 수 없게 됩니다." },
        ],
      },

      // ── 의뢰 도착 ───────────────────────────────────
      {
        lines: [{ who: "Aistb", text: "마침 그쪽에서 물어온 것이 있습니다." }],
        addFiles: [
          {
            path: "work/의뢰_0022.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0022 — 신경망이라는 것도 되는지\n" +
              "\n" +
              "발신: 한울운수 통합관제센터 시스템운영팀 / 소해 V. 뮐러\n" +
              "수신: 바로벤토 — 깁스 W 토이비\n" +
              "\n" +
              "## 자료\n" +
              "work/자료/점검이력_v2.csv — 지난주 것 그대로입니다.\n" +
              "쓸 열도 그대로 다섯입니다: hours, reboots, delay, errors, patched.\n" +
              "revisit_days 는 빼 주세요. 어제 그렇게 정리해 주셨습니다.\n" +
              "\n" +
              "## 할 일\n" +
              "위에서 신경망이라는 걸 쓰라고 합니다. 업계에서 그걸 쓴다고요.\n" +
              "저희 자료로도 되는 건지 먼저 봐 주세요.\n" +
              "\n" +
              "work/task_22/신경망.py 를 만들고 아래 셋을 채워 주세요.\n" +
              "\n" +
              "- dummy_acc  : 자료를 하나도 안 보고 많은 쪽으로 전부 찍었을 때의 점수\n" +
              "- raw_acc    : 자료를 그대로 넣고 신경망을 학습시켰을 때의 점수\n" +
              "- scaled_acc : 열의 크기를 맞춘 뒤 같은 신경망을 학습시켰을 때의 점수\n" +
              "\n" +
              "## 조건\n" +
              "- 가운데 층 하나에 16 자리, max_iter 는 1500, random_state 는 42.\n" +
              "- 3할을 떼어 두시고 random_state 는 42 입니다. 지금까지와 같습니다.\n" +
              "\n" +
              "## 비고\n" +
              "쓰라고 한 쪽에서도 그게 뭔지는 모르는 것 같습니다.\n" +
              "요새 어디든 그걸로 바꾸는 분위기라 안 하면 뒤처진다고들 합니다.\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0022.md"]',
        menu: ["brief"],
        nudge: "저를 눌러 의뢰 확인을 고르시면 의뢰서가 열립니다.",
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0022.md") >= 0;
          });
        },
      },

      // ── 예제 ────────────────────────────────────────
      {
        addFiles: [
          { path: NN_DOC.path, readOnly: true, open: 1, content: NN_DOC.content },
          {
            path: "work/예제/17_층.py",
            open: 0,
            content:
              "import pandas as pd\n" +
              "from sklearn.model_selection import train_test_split\n" +
              "from sklearn.neural_network import MLPClassifier\n" +
              "from sklearn.preprocessing import StandardScaler\n" +
              "\n" +
              'df = pd.read_csv("work/자료/점검이력_v2.csv")\n' +
              'X = df[["hours", "reboots", "delay", "errors", "patched"]]\n' +
              'y = df["again"]\n' +
              "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)\n" +
              "\n" +
              "print(X_train.max())\n" +
              "\n" +
              "raw = MLPClassifier(hidden_layer_sizes=(16,), max_iter=1500, random_state=42)\n" +
              "raw.fit(X_train, y_train)\n" +
              "print(raw.score(X_test, y_test))\n" +
              "print(raw.n_iter_)\n" +
              "\n" +
              "scaler = StandardScaler()\n" +
              "train_s = scaler.fit_transform(X_train)\n" +
              "test_s = scaler.transform(X_test)\n" +
              "print(train_s.max(axis=0))\n" +
              "\n" +
              "fixed = MLPClassifier(hidden_layer_sizes=(16,), max_iter=1500, random_state=42)\n" +
              "fixed.fit(train_s, y_train)\n" +
              "print(fixed.score(test_s, y_test))\n" +
              "print(fixed.n_iter_)\n",
          },
        ],
        lines: [
          { who: "Aistb", text: "예제 파일입니다. 아홉 번 눌러 열마다 제일 큰 값을 먼저 보시죠." },
        ],
        spot: ".step",
        nudge: "아래의 ↓ 한 문장 버튼입니다.",
        wait: steppedTo("work/예제/17_층.py", 9),
      },
      {
        lines: [
          { who: "Aistb", text: "hours 는 4000 에 가깝고 patched 는 1 입니다. 같은 표 안에서 네 자릿수와 한 자릿수가 섞여 있습니다." },
          { who: "Aistb", text: "지금까지는 이것이 문제가 된 적이 없습니다. 트리도 숲도 크기를 비교하지 않고 자르는 자리만 찾기 때문입니다." },
          { who: "Aistb", text: "신경망은 다릅니다. 일단 그대로 넣어 보겠습니다. 세 번 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/17_층.py", 12),
      },
      {
        lines: [
          { who: "Aistb", text: "0.7333 입니다." },
          {
            who: "Aistb",
            text: "이 숫자를 지난 금요일에 보셨습니다. 자료를 하나도 안 보고 전부 재발 아님이라고 찍었을 때의 점수입니다.",
            spot: { text: 'strategy="most_frequent"', in: ".doc" },
          },
          { who: "Aistb", text: "신경망이 배운 것이 없습니다. 아무것도요. 한 번 더 눌러 이유를 보시죠." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/17_층.py", 13),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "1500 번 되풀이하라고 했는데 12 번에 멈췄습니다. 더 나아지지 않아서 포기한 것입니다.",
            spot: { text: "model.n_iter_", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "hours 가 4000 이고 patched 가 1 이면, 계산에서 hours 하나가 나머지를 전부 덮습니다. 나머지 네 열은 있으나 마나가 됩니다.",
            spot: { text: "큰 열 하나가 계산을 다 잡아먹어", in: ".doc" },
          },
          { who: "Aistb", text: "크기를 맞춰 주겠습니다. 네 번 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/17_층.py", 17),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "열마다 평균을 0, 흩어진 정도를 1 로 맞췄습니다. 이제 제일 큰 값이 다섯 열 모두 비슷한 자리에 있습니다.",
            spot: { text: "StandardScaler", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "연습용에 fit_transform, 시험용에 transform 입니다. 지난주 글자를 다루실 때와 같은 규칙입니다. 시험용의 평균까지 보고 기준을 잡으면 그것도 새는 것입니다.",
          },
          { who: "Aistb", text: "같은 신경망을 다시 세워 넣겠습니다. 남은 넷은 ▶ 실행으로 보시죠." },
        ],
        spot: ".run",
        wait: steppedTo("work/예제/17_층.py", 21),
      },
      {
        lines: [
          { who: "Aistb", text: "0.9 입니다. 그리고 이번에는 782 번을 돌고 스스로 멈췄습니다. 아까는 12 번이었습니다." },
          { who: "Aistb", text: "바꾼 것은 모델이 아닙니다. 똑같은 신경망입니다. 넣어준 숫자의 크기만 맞췄습니다." },
          {
            who: "Aistb",
            text: "그런데 지난주 숲이 0.9556 이었습니다. 새 방식인데 졌습니다.",
          },
          { who: "Aistb", text: "이 표는 다섯 열짜리입니다. 층을 쌓아 열을 섞을 것이 별로 없습니다. 신경망이 잘하는 자리가 아닙니다." },
          {
            who: "Aistb",
            text: "말씀이 전부 맞습니다. 그런데 무슨 말씀을 하셨는지 다시 한번 여쭤봐도 되겠습니까.",
            tone: "bad",
          },
          { who: "Aistb", text: "…의뢰로 돌아가시죠." },
        ],
      },

      // ── 의뢰 처리 ───────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "셋 다 방금 보신 것입니다. dummy_acc 는 금요일에 쓰신 그것을 다시 부르시면 됩니다." },
        ],
        menu: ["brief", "report"],
        nudge: 'DummyClassifier(strategy="most_frequent") 입니다. 지난 금요일 파일을 여셔도 됩니다.',
        report: function () {
          return checkFile(
            "work/task_22/신경망.py",
            "for _n in ['dummy_acc', 'raw_acc', 'scaled_acc']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "assert abs(float(dummy_acc) - 0.7333) < 0.02, f'dummy_acc 가 {float(dummy_acc):.4f} 입니다. 0.7333 이 나와야 합니다.'\n" +
              "assert abs(float(raw_acc) - 0.7333) < 0.02, f'raw_acc 가 {float(raw_acc):.4f} 입니다. 0.7333 이 나와야 합니다. 크기를 맞추지 **않은** 표를 그대로 넣으셔야 합니다 — 이 자리는 일부러 안 되는 것을 보는 자리입니다.'\n" +
              "assert abs(float(scaled_acc) - 0.9) < 0.03, f'scaled_acc 가 {float(scaled_acc):.4f} 입니다. 0.9 근처가 나와야 합니다. 층 (16,), max_iter 1500, random_state 42 를 맞추시고 시험용에는 transform 만 부르셨는지 보세요.'\n" +
              "assert abs(float(raw_acc) - float(dummy_acc)) < 0.001, f'raw_acc 와 dummy_acc 가 다릅니다 ({float(raw_acc):.4f} vs {float(dummy_acc):.4f}). 둘은 같은 값이 나와야 합니다 — 그대로 넣은 신경망은 아무것도 못 배웁니다.'\n" +
              "assert float(scaled_acc) > float(raw_acc), '크기를 맞춘 쪽이 더 낮게 나왔습니다. 두 변수를 바꿔 담지 않으셨는지 보세요.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },

      // ── 마무리 ──────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "접수했습니다. 되기는 되지만 숲보다 낮다고 회신하겠습니다." },
          { who: "Aistb", text: "오늘 두 가지입니다. 신경망에는 크기를 맞춰 주어야 한다는 것, 그리고 새 방식이 늘 이기지는 않는다는 것." },
          { who: "Aistb", text: "그럼 왜 배우느냐고 물으실 수 있습니다." },
          { who: "Aistb", text: "표로 정리되는 자료에서는 안 이깁니다. 내일 표가 아닌 것이 옵니다." },
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
    "421950년 10월 22일.",
    "",
    "신경망을 처음 써봤다. 그냥 넣었더니 0.7333이 나왔다.",
    "어디서 본 숫자다 했는데 금요일에 본 거였다. 아무것도 안 보고 다 아니라고 찍은 그 점수.",
    "",
    "600번 돌리라고 했는데 12번에 포기했단다.",
    "hours는 4000까지 가고 patched는 0 아니면 1이다. 큰 쪽이 계산을 다 잡아먹는단다.",
    "크기만 맞춰줬더니 0.9가 됐다. 782번을 돌았다. 모델은 하나도 안 바꿨는데.",
    "",
    "근데 지난주 숲이 0.9556이었다.",
    "이럴 거면 왜 배우냐고 물어보려다 말았다. 내일 표가 아닌 게 온다고 먼저 말했다.",
    "",
    "그쪽 위층이 신경망 쓰라고 했다는데 그게 뭔지는 모르는 것 같다고 의뢰서에 적혀 있었다.",
    "안 하면 뒤처진다고들 한다고.",
    "",
    "Aistb가 내 말이 다 맞다고 하고선 무슨 말이었는지 되물었다.",
    "그럴 거면 맞장구는 왜 쳤는지.",
    "요새 저런 말을 할 때마다 눈이 빨개져 있다.",
  ],
};
