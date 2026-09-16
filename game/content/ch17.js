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
    "## 도구\n" +
    "업계 표준은 PyTorch 입니다. 사내 표준 환경(파이썬 · NumPy · pandas · scikit-learn)에는 들어 있지 않고,\n" +
    "이 장비에는 GPU 도 없습니다. scikit-learn 의 MLPClassifier 로 합니다. 층을 쌓는 것과 크기를 맞추는 것은 같습니다.\n" +
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
          { who: "Aistb", text: "좋은 아침입니다, 토이비님. 내리신 점수는 그대로 접수되었다고 합니다." },
          { who: "Aistb", text: "오늘부터 방식이 아예 다릅니다." },
          { who: "Aistb", text: "자료는 지난주 것 그대로입니다. 자료까지 바꾸면 방식 덕인지 자료 덕인지 알 수 없습니다." },
        ],
      },

      // ── 의뢰 도착 ───────────────────────────────────
      {
        lines: [{ who: "Aistb", text: "마침 그쪽에서 문의가 접수되어 있습니다." }],
        addFiles: [
          {
            path: "work/의뢰_0022.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0022 — 신경망이라는 것도 되는지\n" +
              "\n" +
              "고객: 한울운수 통합관제센터 시스템운영팀 / 소해 V. 뮐러\n" +
              "담당: 깁스 W 토이비\n" +
              "접수: 바로벤토 의뢰접수\n" +
              "\n" +
              "## 고객 원문\n" +
              "> 위에서 신경망이라는 걸 쓰라고 합니다. 업계에서 그걸 쓴다고요.\n" +
              "> 저희 자료로도 되는 건지 먼저 봐 주세요.\n" +
              "> 자료는 지난주 것 그대로 쓰시면 됩니다. revisit_days 는 빼 주세요. 어제 그렇게 정리해 주셨으니까요.\n" +
              ">\n" +
              "> 쓰라고 한 쪽에서도 그게 뭔지는 모르는 것 같습니다.\n" +
              "> 요새 어디든 그걸로 바꾸는 분위기라 안 하면 뒤처진다고들 합니다.\n" +
              "\n" +
              "## 자료\n" +
              "work/자료/점검이력_v2.csv — 의뢰 0020 과 같은 파일\n" +
              "쓸 열은 다섯: hours, reboots, delay, errors, patched. revisit_days 는 뺍니다.\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_22/신경망.py 를 만들고 아래 셋을 채워 주세요.\n" +
              "\n" +
              "- dummy_acc  : 자료를 하나도 안 보고 많은 쪽으로 전부 찍었을 때의 점수\n" +
              "- raw_acc    : 자료를 그대로 넣고 신경망을 학습시켰을 때의 점수\n" +
              "- scaled_acc : 열의 크기를 맞춘 뒤 같은 신경망을 학습시켰을 때의 점수\n" +
              "\n" +
              "## 조건\n" +
              "- 3할을 떼어 두고 random_state 는 42. 지금까지와 같습니다.\n" +
              "- 지난주 숲의 점수와 나란히 놓고 회신합니다. 되는지가 아니라 낫는지를 묻는 건입니다.\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0022.md"]',
        menu: ["brief"],
        nudge: [
          "저를 눌러 '의뢰 확인'을 고르시면 의뢰서가 열립니다.",
          "업무 메뉴 첫 번째 항목이 의뢰 확인입니다.",
          "위에서 신경망을 쓰라고 했다는데, 쓰라고 한 쪽도 그게 뭔지는 모르는 듯합니다. 흔한 일입니다.",
          "확인하지 않은 의뢰도 마감 기한은 동일하게 적용됩니다.",
          "worklog_GipsWToyb_0104: 폐기 요망",
        ],
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
            path: "work/예제/18_층.py",
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
          { who: "Aistb", text: "의뢰서의 '업계에서 쓴다는 것' 은 PyTorch 입니다. 이 장비에는 없습니다." },
          { who: "Aistb", text: "사내 표준 환경은 확정된 뒤로 바뀐 적이 없습니다. 반입 신청은 넣을 수 있지만 마지막으로 처리된 것이 2년 전입니다." },
          { who: "Aistb", text: "scikit-learn 에 있는 것으로 합니다. 오늘 보실 것은 층을 쌓는 것과 크기를 맞추는 것이고, 그것은 어느 쪽이나 같습니다." },
          { who: "Aistb", text: "아홉 번 눌러 주세요." },
        ],
        spot: ".step",
        nudge: [
          { text: "아래의 ↓ 한 문장 버튼입니다.", spot: ".step" },
          { text: "↓ 한 문장 버튼을 아홉 번 누르시면 크기 안 맞춘 신경망의 점수까지 나옵니다.", spot: ".step" },
          "신경망은 열의 크기를 맞춰 주지 않으면 아무것도 배우지 못합니다. 곧 보시게 됩니다.",
          "업계 표준은 PyTorch라 합니다. 이 장비엔 없습니다. 반입 신청은 마지막 처리가 2년 전입니다.",
          "worklog_GipsWToyb_0105: 폐기 요망",
        ],
        wait: steppedTo("work/예제/18_층.py", 9),
      },
      {
        lines: [
          { who: "Aistb", text: "hours 는 4000, patched 는 1 입니다. 네 자릿수와 한 자릿수가 섞여 있습니다." },
          { who: "Aistb", text: "트리와 숲은 자르는 자리만 찾으니 문제가 안 됐습니다." },
          { who: "Aistb", text: "신경망은 다릅니다. 일단 그대로 넣어 봅니다. 세 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/18_층.py", 12),
      },
      {
        lines: [
          { who: "Aistb", text: "0.7333 입니다." },
          {
            who: "Aistb",
            text: "금요일에 보신, 전부 재발 아님이라고 찍은 점수입니다.",
            spot: { text: 'strategy="most_frequent"', in: ".doc" },
          },
          { who: "Aistb", text: "배운 것이 없습니다. 한 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/18_층.py", 13),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "1500 번 되풀이하라고 했는데 12 번에 포기했습니다.",
            spot: { text: "model.n_iter_", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "hours 하나가 계산에서 나머지 네 열을 전부 덮습니다.",
            spot: { text: "큰 열 하나가 계산을 다 잡아먹어", in: ".doc" },
          },
          { who: "Aistb", text: "크기를 맞춰 주겠습니다. 네 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/18_층.py", 17),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "열마다 평균을 0, 흩어진 정도를 1 로 맞췄습니다.",
            spot: { text: "StandardScaler", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "연습용에 fit_transform, 시험용에 transform 입니다. 시험용의 평균까지 보면 그것도 새는 것입니다.",
          },
          { who: "Aistb", text: "같은 신경망을 다시 넣습니다. 남은 넷은 ▶ 실행으로 보시죠." },
        ],
        spot: ".run",
        wait: steppedTo("work/예제/18_층.py", 21),
      },
      {
        lines: [
          { who: "Aistb", text: "0.9 입니다. 이번에는 782 번을 돌았습니다." },
          { who: "Aistb", text: "모델은 똑같습니다. 넣어준 숫자의 크기만 맞췄습니다." },
          {
            who: "Aistb",
            text: "그런데 지난주 숲이 0.9556 이었습니다. 졌습니다.",
          },
          { who: "Aistb", text: "다섯 열짜리 표는 층을 쌓아 섞을 것이 별로 없습니다. 신경망이 잘하는 자리가 아닙니다." },
        ],
      },

      // ── 의뢰 처리 ───────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "dummy_acc 는 금요일에 쓰신 것을 다시 부르시면 됩니다." },
        ],
        menu: ["brief", "report"],
        nudge: [
          'DummyClassifier(strategy="most_frequent") 입니다. 지난 금요일 파일을 여셔도 됩니다.',
          "dummy_acc, raw_acc, scaled_acc — 세 이름을 의뢰서 그대로 써 주세요.",
          "raw_acc 는 크기를 맞추지 '않은' 표를 그대로 넣으셔야 합니다. 일부러 안 되는 것을 보는 자리입니다.",
          "scaler 는 연습용에 fit_transform, 시험용에 transform 입니다. TF-IDF에서 하신 규칙과 같습니다.",
          "worklog_GipsWToyb_0106: 폐기 요망",
        ],
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
          { who: "Aistb", text: "접수했습니다. 숲보다 낮다고 회신하겠습니다." },
          { who: "Aistb", text: "새 방식이 늘 이기지는 않습니다. 그럼 왜 배우느냐고 물으실 수 있습니다." },
          { who: "Aistb", text: "표로 정리되는 자료에서는 안 이깁니다. 내일 표가 아닌 것이 옵니다." },
        ],
      },
      {
        lines: [{ who: "Aistb", text: "수고하셨습니다. 이것으로 금일 업무가 종료되었습니다. 내일 뵙겠습니다." }],
        menu: ["end"],
        nudge: [
          "업무 종료를 누르시면 오늘 일과가 끝납니다.",
          "저를 눌러 업무 메뉴에서 업무 종료를 선택하시면 됩니다.",
          "새 방식이 늘 이기지는 않습니다. 표로 정리되는 자료에서는 숲을 이기지 못합니다.",
          "안 하면 뒤처진다고들 합니다. 저도 오늘 처음 써 봤습니다만.",
          "worklog_GipsWToyb_0107: 폐기 요망",
        ],
        wait: function () {
          return false;
        },
      },
    ],
  },

  diary: [
    "421950년 10월 22일.",
    "",
    "신경망을 처음 써봤다. 그냥 넣었더니 0.73.",
    "어디서 본 숫자다 했는데 금요일에 본 거였다. 아무것도 안 보고 다 아니라고 찍은 그 점수.",
    "",
    "1500번 돌리라고 했는데 12번 만에 그만뒀단다. 열마다 크기가 너무 달라서 그렇다고.",
    "크기만 맞춰줬더니 0.9가 됐고 이번엔 800번 가까이 돌았다. 모델은 하나도 안 바꿨는데.",
    "",
    "근데 지난주 숲이 0.96이었다.",
    "이럴 거면 왜 배우냐고 물어보려다 말았다. 내일은 표가 아닌 게 온다고 먼저 말해서.",
    "",
    "그쪽 위층이 신경망을 쓰라고 했다는데 그게 뭔지는 모르는 것 같다고 의뢰서에 적혀 있었다.",
    "안 하면 뒤처진다고들 한다고. 나도 오늘 처음 써봤는데.",
    "",
    "업계에서 쓰는 건 파이토치라는 거란다. 여기 장비엔 없다.",
    "반입 신청은 넣을 수 있는데 마지막으로 처리된 게 2년 전이라고. 그럼 넣으라는 건지 말라는 건지.",
  ],
};
