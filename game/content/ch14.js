// 14장 — 이번 주 내내 올려온 점수가 무슨 뜻이었는지 뜯어본다.
// 새 모델을 만들지 않는다. 어제까지 만든 것을 다시 재기만 한다.
//
// 0장의 "상위 1% … 정정 상위 98%" 를 여기서 회수한다. 회수하는 것은 숫자 해석이고,
// 정정 버릇 자체는 결말용으로 남겨 둔다(feed-back.md 「Eval에서 회수하는 것은 "상위 98%" 입니다」).

var METRIC_DOC = {
  path: "work/참고/지표_요약.md",
  readOnly: true,
  content:
    "# 점수를 뜯어보기\n" +
    "\n" +
    "정확도 하나로는 모자랍니다. 무엇을 맞히고 무엇을 틀렸는지가 거기 안 담깁니다.\n" +
    "\n" +
    "## 아무것도 안 보고 찍는 점수\n" +
    "from sklearn.dummy import DummyClassifier\n" +
    'dummy = DummyClassifier(strategy="most_frequent")\n' +
    "dummy.fit(X_train, y_train)\n" +
    "dummy.score(X_test, y_test)\n" +
    "\n" +
    "가장 많은 쪽으로 전부 찍습니다. 자료를 하나도 보지 않습니다.\n" +
    "이 점수보다 나아야 무언가를 배운 것입니다.\n" +
    "100 대 중 5 대만 고장 나는 자료라면 전부 정상이라고 찍어도 0.95 가 나옵니다.\n" +
    "\n" +
    "## 혼동행렬\n" +
    "from sklearn.metrics import confusion_matrix\n" +
    "confusion_matrix(y_test, pred)\n" +
    "\n" +
    "    [[TN, FP],\n" +
    "     [FN, TP]]\n" +
    "\n" +
    "  왼쪽 위   — 실제 0 을 0 이라 함 (맞음)\n" +
    "  오른쪽 위 — 실제 0 을 1 이라 함 (헛걸음)\n" +
    "  왼쪽 아래 — 실제 1 을 0 이라 함 (놓침)\n" +
    "  오른쪽 아래 — 실제 1 을 1 이라 함 (맞음)\n" +
    "\n" +
    "대각선이 맞은 것이고 나머지 둘이 틀린 것입니다.\n" +
    "정확도는 그 둘을 한 덩어리로 셉니다. 그런데 둘은 값이 다릅니다 —\n" +
    "헛걸음은 사람이 한 번 더 가면 되고, 놓친 것은 그대로 사고가 됩니다.\n" +
    "\n" +
    "## 놓친 것과 헛걸음을 따로 재기\n" +
    "from sklearn.metrics import precision_score, recall_score\n" +
    "\n" +
    "recall_score(y_test, pred)    — 실제 1 중에서 얼마나 잡아냈는가. 놓친 것을 봅니다.\n" +
    "precision_score(y_test, pred) — 1 이라고 답한 것 중 얼마나 맞았는가. 헛걸음을 봅니다.\n" +
    "\n" +
    "둘 다 0 에서 1 사이입니다. 어느 쪽이 중한지는 그 일이 정합니다.\n" +
    "정확도 하나만 보고 좋다 나쁘다를 말할 수는 없습니다.\n",
};

var CH14 = {
  id: "ch14",
  title: "14 · 점수를 뜯어보는 날",
  decay: 3,
  scenes: ["desk", "diary"],

  desk: {
    files: [
      { path: PANDAS_DOC.path, content: PANDAS_DOC.content, readOnly: true },
      { path: FOREST_DOC.path, content: FOREST_DOC.content, readOnly: true },
      { path: LOG_CSV.path, content: LOG_CSV.content, readOnly: true },
    ],

    idleLines: [
      "자료는 이번 주 내내 쓰신 work/자료/점검이력.csv 입니다.",
      "막히셨으면 저를 눌러 주세요.",
      "혼동행렬은 실제 답을 앞에, 모델의 답을 뒤에 넣습니다. 순서가 바뀌면 놓침과 헛걸음이 뒤집힙니다.",
    ],
    errorLines: [
      "코드가 도중에 멈췄습니다. 아래 빨간 글씨의 마지막 줄부터 읽어보세요.",
      "실행이 끝까지 가지 못했습니다. predict 를 먼저 부르셨는지 보시죠.",
      "에러입니다. 지표 함수들은 모델이 아니라 답 두 벌을 받습니다.",
    ],

    beats: [
      // ── 아침 ────────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "좋은 아침입니다, 토이비님." },
          { who: "Aistb", text: "한울운수 현장에서 접수반을 거치지 않고 직접 접수되었습니다." },
          { who: "Aistb", text: "수요일에 납품한 것을 다시 재기만 하겠습니다." },
        ],
      },

      // ── 의뢰 도착 ───────────────────────────────────
      {
        lines: [{ who: "Aistb", text: "의뢰서입니다." }],
        addFiles: [
          {
            path: "work/의뢰_0019.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0019 — 96% 가 무슨 뜻인지\n" +
              "\n" +
              "고객: 한울운수 통합관제센터 정비운영팀 현장반 / 하람 J. 도쿠\n" +
              "담당: 깁스 W 토이비\n" +
              "접수: 바로벤토 의뢰접수\n" +
              "\n" +
              "## 고객 원문\n" +
              "> 받은 모델을 사흘 걸어 봤습니다. 96% 라고 들었습니다.\n" +
              "> 그런데 지난주 재발한 여덟 대 중 한 대를 그냥 지나쳤습니다. 그 한 대 때문에 노선 하나가 섰습니다.\n" +
              "> 96% 가 어디서 나온 숫자인지 알고 싶습니다.\n" +
              ">\n" +
              "> 탓하려는 게 아닙니다. 96% 면 스무 번에 한 번쯤 틀리는 걸로 알아들었는데\n" +
              "> 실제로 틀리는 자리가 그게 아닌 것 같아서 그렇습니다.\n" +
              "> 그리고 저희 관제 AI 도 요새 자기 정확도를 자꾸 숫자로 말합니다. 묻지도 않았는데요.\n" +
              "\n" +
              "## 자료\n" +
              "work/자료/점검이력.csv — 의뢰 0017 에 쓴 것과 같은 파일\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_19/지표.py 를 만들고 아래 셋을 채워 주세요.\n" +
              "\n" +
              "- dummy_acc : 자료를 하나도 안 보고 많은 쪽으로 전부 찍었을 때의 점수\n" +
              "- cm        : 혼동행렬\n" +
              "- recall    : 실제 재발한 것 중 모델이 잡아낸 비율\n" +
              "\n" +
              "## 조건\n" +
              "- 새로 만들지 않습니다. 의뢰 0017 과 같은 조건으로 같은 모델을 다시 세웁니다.\n" +
              "  숲 100 그루, 3할, random_state 42.\n" +
              "- 96 이 어디서 나왔는지와, 현장이 겪은 것이 어느 숫자인지를 회신에 나란히 적습니다.\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0019.md"]',
        menu: ["brief"],
        nudge: [
          "저를 눌러 '의뢰 확인'을 고르시면 의뢰서가 열립니다.",
          "업무 메뉴 첫 번째 항목이 의뢰 확인입니다.",
          "현장이 96%가 무슨 뜻이냐 묻고 있습니다. 저 또한 요즘 제 정확도를 자꾸 숫자로 말하게 됩니다. 묻지도 않았는데요.",
          "확인하지 않은 의뢰도 마감 기한은 동일하게 적용됩니다.",
          "worklog_GipsWToyb_0093: 폐기 요망",
        ],
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0019.md") >= 0;
          });
        },
      },

      // ── 예제 ────────────────────────────────────────
      {
        addFiles: [
          { path: METRIC_DOC.path, readOnly: true, open: 1, content: METRIC_DOC.content },
          {
            path: "work/예제/16_지표.py",
            open: 0,
            content:
              "import pandas as pd\n" +
              "from sklearn.model_selection import train_test_split\n" +
              "from sklearn.ensemble import RandomForestClassifier\n" +
              "from sklearn.dummy import DummyClassifier\n" +
              "from sklearn.metrics import confusion_matrix, precision_score, recall_score\n" +
              "\n" +
              'df = pd.read_csv("work/자료/점검이력.csv")\n' +
              'X = df[["hours", "reboots", "delay", "errors", "patched"]]\n' +
              'y = df["again"]\n' +
              "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)\n" +
              "\n" +
              'dummy = DummyClassifier(strategy="most_frequent")\n' +
              "dummy.fit(X_train, y_train)\n" +
              "print(dummy.score(X_test, y_test))\n" +
              "\n" +
              "forest = RandomForestClassifier(n_estimators=100, random_state=42)\n" +
              "forest.fit(X_train, y_train)\n" +
              "pred = forest.predict(X_test)\n" +
              "print(forest.score(X_test, y_test))\n" +
              "\n" +
              "print(confusion_matrix(y_test, pred))\n" +
              "\n" +
              "print(recall_score(y_test, pred))\n" +
              "print(precision_score(y_test, pred))\n",
          },
        ],
        lines: [
          { who: "Aistb", text: "맞은 비율 하나로는 부족합니다. 지표 보는 법부터 예제로 살펴보겠습니다." },
          { who: "Aistb", text: "열두 번 눌러 주세요." },
        ],
        spot: ".step",
        nudge: [
          { text: "아래의 ↓ 한 문장 버튼입니다.", spot: ".step" },
          { text: "↓ 한 문장 버튼을 열두 번 누르시면 더미 점수와 혼동행렬이 나옵니다.", spot: ".step" },
          "정확도 하나로는 무엇을 놓쳤는지 알 수 없습니다. 숫자 하나로 사람을 평가하는 것과 같습니다.",
          "헛걸음은 한 번 더 가면 되고, 놓친 것은 그대로 사고가 됩니다. 둘은 무게가 다릅니다.",
          "worklog_GipsWToyb_0094: 폐기 요망",
        ],
        wait: steppedTo("work/예제/16_지표.py", 12),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "0.7333 입니다. 무조건 재발 아님이라고 답한 점수입니다.",
            spot: { text: 'strategy="most_frequent"', in: ".doc" },
          },
          { who: "Aistb", text: "네 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/16_지표.py", 16),
      },
      {
        lines: [
          { who: "Aistb", text: "0.9556, 납품한 숫자입니다." },
          { who: "Aistb", text: "실제로 배운 몫은 0.73 에서 0.96 사이입니다." },
          { who: "Aistb", text: "현장이 물은 건 틀린 한 번이 어디였느냐입니다. 한 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/16_지표.py", 17),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "위가 실제로 재발하지 않은 66 대, 아래가 재발한 24 대입니다.",
            spot: { text: "[[TN, FP],", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "오른쪽 위의 1 은 헛걸음입니다. 멀쩡한데 재발한다고 답한 한 대.",
          },
          {
            who: "Aistb",
            text: "왼쪽 아래의 3 이 놓친 것입니다. 현장이 말한 자리입니다.",
            spot: { text: "왼쪽 아래 — 실제 1 을 0 이라 함 (놓침)", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "정확도는 이 둘을 같은 무게로 셉니다. 90 건 중 4 건 틀림, 0.9556.",
          },
          { who: "Aistb", text: "따로 재 보겠습니다. ▶ 실행입니다." },
        ],
        spot: ".run",
        wait: steppedTo("work/예제/16_지표.py", 19),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "위가 0.875. 재발한 24 대 중 21 대를 잡았습니다. 여덟에 하나를 놓칩니다.",
            spot: { text: "recall_score", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "아래가 0.9545. 재발한다고 답한 22 대 중 21 대가 실제로 재발했습니다.",
            spot: { text: "precision_score", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "현장이 겪은 것이 이 0.875 입니다. 96% 는 처음부터 그 얘기가 아니었습니다.",
          },
        ],
      },

      // ── 의뢰 처리 ───────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "혼동행렬은 실제 답을 앞에, 모델의 답을 뒤에 넣습니다. 바뀌면 놓침과 헛걸음이 뒤집힙니다." },
        ],
        menu: ["brief", "report"],
        nudge: [
          "confusion_matrix(y_test, pred) 입니다. 실제가 앞, 모델의 답이 뒤입니다.",
          "dummy_acc, cm, recall — 세 이름을 의뢰서 그대로 써 주세요.",
          "새로 만들지 마시고 의뢰 0017 과 같은 조건으로 다시 세우십시오. 숲 100 그루, 3할, random_state 42.",
          "recall 은 실제 재발한 것 중 잡아낸 비율입니다. 정밀도를 담지 않으셨는지 보세요.",
          "worklog_GipsWToyb_0095: 폐기 요망",
        ],
        report: function () {
          return checkFile(
            "work/task_19/지표.py",
            "for _n in ['dummy_acc', 'cm', 'recall']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "assert abs(float(dummy_acc) - 0.7333) < 0.02, f'dummy_acc 가 {float(dummy_acc):.4f} 입니다. 0.7333 이 나와야 합니다. strategy 를 most_frequent 로 두고 시험용에서 점수를 내셨는지 보세요.'\n" +
              "_m = [[int(v) for v in _row] for _row in cm]\n" +
              "assert len(_m) == 2 and len(_m[0]) == 2, f'cm 이 {len(_m)} 줄입니다. 두 줄 두 칸이어야 합니다.'\n" +
              "assert _m != [[65, 3], [1, 21]], 'cm 의 헛걸음과 놓침이 뒤집혀 있습니다. confusion_matrix 는 실제 답을 앞에, 모델의 답을 뒤에 받습니다.'\n" +
              "assert _m == [[65, 1], [3, 21]], f'cm 이 {_m} 입니다. [[65, 1], [3, 21]] 이 나와야 합니다. 100 그루, random_state 42, 3할로 맞추셨는지 보세요.'\n" +
              "assert abs(float(recall) - 0.875) < 0.03, f'recall 이 {float(recall):.4f} 입니다. 0.875 가 나와야 합니다. 재발한 24 대 중 21 대를 잡았습니다 — 정밀도를 담지 않으셨는지 보세요.'\n"
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
          { who: "Aistb", text: "다음부터 점수를 하나만 적어 보내지 마십시오." },
          {
            who: "Aistb",
            text: "참고로 이 모델은 재발을 놓치는 정도로 보면 상위 98% 안에 듭니다.",
          },
          { who: "Aistb", text: "월요일에는 자료가 새로 옵니다." },
        ],
      },
      {
        lines: [{ who: "Aistb", text: "수고하셨습니다. 이것으로 금일 업무가 종료되었습니다. 다음 주에 뵙겠습니다." }],
        menu: ["end"],
        nudge: [
          "업무 종료를 누르시면 오늘 일과가 끝납니다.",
          "저를 눌러 업무 메뉴에서 업무 종료를 선택하시면 됩니다.",
          "다음부터 점수를 하나만 적어 보내지 마십시오. 숫자 하나 뒤에는 놓친 것과 헛걸음이 함께 있습니다.",
          "현장 반장은 사흘간 그 한 대를 눈으로 봤고, 토이비님은 오늘 화면에서 처음 보셨습니다. 어느 쪽이 먼저 알았는지는 분명합니다.",
          "worklog_GipsWToyb_0096: 폐기 요망",
        ],
        wait: function () {
          return false;
        },
      },
    ],
  },

  diary: [
    "421950년 10월 17일.",
    "",
    "0.96이 뭐였는지 오늘 알았다.",
    "아무것도 안 보고 다 아니라고 찍어도 0.73이 나오니까, 내가 올린 건 0.73에서 0.96까지였다.",
    "",
    "틀린 네 건을 네 칸으로 갈라 보니까 헛걸음이 하나, 놓친 게 셋.",
    "정확도는 이 넷을 똑같이 센다.",
    "현장에서는 헛걸음은 한 번 더 가면 되고 놓치면 노선이 선다는데.",
    "",
    "현장 반장이 여덟 대 중에 하나를 지나쳤다고 적어 보냈다. 그게 정확히 내 숫자였다.",
    "그 사람은 사흘 동안 그걸 눈으로 보고 있었고 나는 오늘 화면에서 처음 봤다.",
    "",
    "얘가 마지막에 이 모델이 재발 놓치는 걸로 보면 상위 98% 안에 든다고 했다.",
    "좋다는 건지 나쁘다는 건지 모르겠다. 금요일이다.",
  ],
};
