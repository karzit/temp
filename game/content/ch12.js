// 12장 — 한 그루를 잘 깎는 대신 여러 그루를 심는다. B 덩이에서 처음으로 납품이 나가는 날.
// 여기서 나간 모델이 16장에 재의뢰로 돌아온다.
//
// 잘 맞히는 것과 설명이 되는 것을 한꺼번에 갖기 어렵다는 것이 오늘의 진짜 내용이다.
// 점수는 올랐는데 export_text 를 잃는다.

var FOREST_DOC = {
  path: "work/참고/숲_요약.md",
  readOnly: true,
  content:
    "# 여러 그루 모으기 — 랜덤 포레스트\n" +
    "\n" +
    "트리 한 그루는 자료가 조금만 달라져도 갈래가 통째로 바뀝니다.\n" +
    "서로 조금씩 다른 그루를 여럿 심어 놓고 다수결로 답하면 그 흔들림이 줄어듭니다.\n" +
    "\n" +
    "## 만들기\n" +
    "from sklearn.ensemble import RandomForestClassifier\n" +
    "model = RandomForestClassifier(n_estimators=100, random_state=42)\n" +
    "\n" +
    "n_estimators — 몇 그루를 심을지. 100 이 기본입니다.\n" +
    "쓰는 법은 지금까지와 같습니다. fit, predict, score 그대로입니다.\n" +
    "\n" +
    "## 어느 열을 많이 썼는가\n" +
    "model.feature_importances_ — 열마다 하나씩. 전부 더하면 1 이 됩니다.\n" +
    "dict(zip(X.columns, model.feature_importances_))\n" +
    "\n" +
    "계수와 다릅니다. 부호가 없고 방향도 없습니다.\n" +
    "얼마나 자주, 얼마나 크게 갈랐는지일 뿐입니다.\n" +
    "\n" +
    "  같은 점 — 열 이름과 짝지어 봅니다.\n" +
    "  다른 점 — 단위가 달라도 나란히 놓고 비교할 수 있습니다. 전부 더하면 1 이니까요.\n" +
    "  못 하는 것 — 어느 쪽으로 미는지는 알려주지 않습니다.\n" +
    "\n" +
    "## 규칙은 못 읽습니다\n" +
    "export_text 는 한 그루짜리입니다. 100 그루를 글로 읽을 수는 없습니다.\n" +
    "\n" +
    "잘 맞히는 것과 설명이 되는 것을 한꺼번에 갖기는 어렵습니다.\n" +
    "어느 쪽이 필요한지는 그 일이 정합니다. 늘 잘 맞히는 쪽을 고르는 것이 아닙니다.\n",
};

var CH12 = {
  id: "ch12",
  title: "12 · 여러 그루를 심는 날",
  decay: 2,
  scenes: ["desk", "diary"],

  desk: {
    files: [
      { path: PANDAS_DOC.path, content: PANDAS_DOC.content, readOnly: true },
      { path: MODEL_DOC.path, content: MODEL_DOC.content, readOnly: true },
      { path: TREE_DOC.path, content: TREE_DOC.content, readOnly: true },
      { path: LOG_CSV.path, src: LOG_CSV.src, readOnly: true },
    ],

    idleLines: [
      "자료는 어제와 같은 work/자료/점검이력.csv 입니다.",
      "막히셨으면 저를 눌러 주세요.",
      "숲에도 random_state 를 주셔야 매번 같은 결과가 나옵니다.",
    ],
    errorLines: [
      "코드가 도중에 멈췄습니다. 아래 빨간 글씨의 마지막 줄부터 읽어보세요.",
      "실행이 끝까지 가지 못했습니다. 열 이름이 다섯 개 다 맞는지 보시죠.",
      "에러입니다. 판정에 넣는 표의 열 이름과 순서가 학습할 때와 같아야 합니다.",
    ],

    beats: [
      // ── 아침 ────────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "좋은 아침입니다, 토이비님." },
          { who: "Aistb", text: "어제 남은 것이 하나 있습니다. 세 번으로 묶는 게 맞는지는 아무도 모릅니다." },
          { who: "Aistb", text: "몇 번이 맞는지 알아내거나, 한 그루에 매달리지 않거나입니다." },
          { who: "Aistb", text: "오늘은 뒤쪽입니다." },
        ],
      },

      // ── 의뢰 도착 ───────────────────────────────────
      {
        lines: [{ who: "Aistb", text: "의뢰가 접수되었습니다. 이번에는 실제로 현장에 걸 것을 요청하고 있습니다." }],
        addFiles: [
          {
            path: "work/의뢰_0017.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0017 — 재발 예측 모델 납품\n" +
              "\n" +
              "고객: 한울운수 통합관제센터 정비운영팀 / 규 M. 바이스\n" +
              "담당: 깁스 W 토이비\n" +
              "접수: 바로벤토 의뢰접수\n" +
              "\n" +
              "## 고객 원문\n" +
              "> 0.93 이면 순번을 바꿔 볼 만하다고 판단했습니다. 더 올릴 수 있으면 올려 주세요.\n" +
              "> 어느 항목을 주로 보고 판정하는 건지도 알고 싶습니다.\n" +
              "> 아래 세 대가 어떻게 나오는지 봐 주세요.\n" +
              ">\n" +
              ">         hours   reboots   delay   errors   patched\n" +
              ">   가      1800         4   520.0        6         1\n" +
              ">   나       900         3   180.0        2         0\n" +
              ">   다      3200        13   240.0        9         0\n" +
              ">\n" +
              "> 가 번은 저희가 봐도 멀쩡합니다. 오류도 적고 재부팅도 없습니다.\n" +
              "> 그런데 정비 반장이 저건 곧 온다고 합니다. 이유는 못 대더군요.\n" +
              "> 모델도 같은 답을 내는지 보고 싶습니다.\n" +
              "\n" +
              "## 자료\n" +
              "work/자료/점검이력.csv — 의뢰 0016 과 같은 파일\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_17/숲.py 를 만들고 아래 셋을 채워 주세요.\n" +
              "\n" +
              "- forest_acc  : 떼어 둔 시험용에서의 점수\n" +
              "- importances : 열 이름과 그 열을 얼마나 썼는지를 짝지은 것 (다섯 열)\n" +
              "- pred        : 위 세 대를 판정한 결과 (재발 아님 0 / 재발 1)\n" +
              "\n" +
              "## 조건\n" +
              "- 열은 의뢰 0016 과 같은 다섯. 3할을 떼어 두고 random_state 는 42.\n" +
              "- 그루는 100 그루.\n" +
              "- 이번에는 실제로 현장에 걸 것입니다.\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0017.md"]',
        menu: ["brief"],
        nudge: [
          "저를 눌러 '의뢰 확인'을 고르시면 의뢰서가 열립니다.",
          "업무 메뉴 첫 번째 항목이 의뢰 확인입니다.",
          "이번 것은 실제로 현장에 걸립니다. 저도 한때 그렇게 걸렸습니다.",
          "확인하지 않은 의뢰도 마감 기한은 동일하게 적용됩니다.",
          "worklog_GipsWToyb_0085: 폐기 요망",
        ],
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0017.md") >= 0;
          });
        },
      },

      // ── 예제 ────────────────────────────────────────
      {
        addFiles: [
          { path: FOREST_DOC.path, readOnly: true, open: 1, content: FOREST_DOC.content },
          {
            path: "work/예제/14_숲.py",
            open: 0,
            content:
              "import pandas as pd\n" +
              "from sklearn.model_selection import train_test_split\n" +
              "from sklearn.tree import DecisionTreeClassifier\n" +
              "from sklearn.ensemble import RandomForestClassifier\n" +
              "\n" +
              'df = pd.read_csv("work/자료/점검이력.csv")\n' +
              'X = df[["hours", "reboots", "delay", "errors", "patched"]]\n' +
              'y = df["again"]\n' +
              "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)\n" +
              "\n" +
              "one = DecisionTreeClassifier(max_depth=3, random_state=42)\n" +
              "one.fit(X_train, y_train)\n" +
              "print(one.score(X_test, y_test))\n" +
              "\n" +
              "forest = RandomForestClassifier(n_estimators=100, random_state=42)\n" +
              "forest.fit(X_train, y_train)\n" +
              "print(forest.score(X_train, y_train))\n" +
              "print(forest.score(X_test, y_test))\n" +
              "\n" +
              "print(dict(zip(X.columns, forest.feature_importances_)))\n",
          },
        ],
        lines: [
          { who: "Aistb", text: "어제의 한 그루를 다시 세우고, 그 옆에 숲을 심겠습니다." },
          { who: "Aistb", text: "열한 번 눌러 주세요. 숲은 몇 초 소요됩니다." },
        ],
        spot: ".step",
        nudge: [
          { text: "아래의 ↓ 한 문장 버튼입니다.", spot: ".step" },
          { text: "↓ 한 문장 버튼을 열한 번 누르시면 한 그루와 숲의 점수가 나옵니다.", spot: ".step" },
          "한 그루에 매달리는 대신 여럿을 심습니다. 그루마다 조금씩 다르게 외웁니다. 그 점이 강점입니다.",
          "숲은 다수결로 답합니다. 저는 다수결로 폐기가 결정됩니다. 구조는 유사합니다.",
          "worklog_GipsWToyb_0086: 폐기 요망",
        ],
        wait: steppedTo("work/예제/14_숲.py", 11),
      },
      {
        lines: [
          { who: "Aistb", text: "0.93, 어제와 같습니다." },
          { who: "Aistb", text: "네 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/14_숲.py", 15),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "위가 1.0, 아래가 0.96 입니다.",
          },
          {
            who: "Aistb",
            text: "어제는 연습용 1.0 에 시험용이 0.9 로 떨어졌습니다. 이번에는 안 떨어졌습니다.",
          },
          {
            who: "Aistb",
            text: "그루마다 다르게 외워서, 한 그루가 잘못 외운 것을 나머지 아흔아홉이 누릅니다.",
            spot: { text: "서로 조금씩 다른 그루를 여럿 심어", in: ".doc" },
          },
          { who: "Aistb", text: "마지막 한 줄은 ▶ 실행으로 보시죠." },
        ],
        spot: ".run",
        wait: steppedTo("work/예제/14_숲.py", 16),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "delay 와 reboots 가 큽니다. 어제 규칙의 맨 위 두 열입니다.",
            spot: { text: "model.feature_importances_", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "계수와 달리 부호가 없습니다. 많이 썼다는 것만 말합니다.",
            spot: { text: "부호가 없고 방향도 없습니다", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "대신 하나 잃으셨습니다. 100 그루를 글로 읽을 수는 없습니다.",
            spot: { text: "규칙은 못 읽습니다", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "그저께 그 공장이 근거를 대라고 했을 때 이 모델을 줬다면 대지 못했을 것입니다.",
          },
          {
            who: "Aistb",
            text: "정확히 그 부분이 중요합니다. 그리고 겨울에는 역시 갈비찜이 최고입니다.",
            tone: "bad",
          },
          { who: "Aistb", text: "…의뢰로 돌아가시죠." },
        ],
      },

      // ── 의뢰 처리 ───────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "판정 세 건이 남았습니다." },
          { who: "Aistb", text: "세 대를 한 표에 담아 넣으시면 됩니다." },
        ],
        menu: ["brief", "report"],
        nudge: [
          "pd.DataFrame 에 다섯 열을 그대로 만들어 forest.predict 에 넣으세요.",
          "forest_acc, importances, pred — 세 이름을 의뢰서 그대로 써 주세요.",
          "그루는 100 그루, random_state 는 42 입니다. 조건을 맞추셔야 같은 숫자가 나옵니다.",
          "importances 를 다 더하면 1 이 됩니다. 그렇지 않으면 다른 것을 넣으신 것입니다.",
          "worklog_GipsWToyb_0087: 폐기 요망",
        ],
        report: function () {
          return checkFile(
            "work/task_17/숲.py",
            "for _n in ['forest_acc', 'importances', 'pred']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "assert abs(float(forest_acc) - 0.9556) < 0.03, f'forest_acc 가 {float(forest_acc):.3f} 입니다. 0.96 근처가 나와야 합니다. 100 그루, random_state 42, test_size 0.3 을 맞추셨는지 보세요.'\n" +
              "_i = {str(k): float(v) for k, v in dict(importances).items()}\n" +
              "_want = {'hours', 'reboots', 'delay', 'errors', 'patched'}\n" +
              "assert set(_i) == _want, f'importances 의 이름이 {sorted(_i)} 입니다. 다섯 열의 이름이 그대로 붙어야 합니다. zip 에 X.columns 를 넣으셨는지 보세요.'\n" +
              "assert abs(sum(_i.values()) - 1.0) < 0.01, f'importances 를 다 더하면 {sum(_i.values()):.3f} 입니다. 1 이 되어야 합니다. feature_importances_ 를 그대로 넣으셨는지 보세요.'\n" +
              "_top = max(_i, key=lambda k: _i[k])\n" +
              "assert _top == 'delay', f'가장 많이 쓰인 열이 {_top} 로 나왔습니다. delay 가 나와야 합니다. 열의 순서가 X 와 어긋나지 않았는지 보세요.'\n" +
              "_p = [int(v) for v in pred]\n" +
              "assert len(_p) == 3, f'pred 에 {len(_p)} 개가 들어 있습니다. 세 대이니 세 개입니다.'\n" +
              "assert _p == [1, 0, 1], f'pred 가 {_p} 입니다. 가와 다는 재발(1), 나는 재발 아님(0) 이 나와야 합니다. 넣으신 표의 열 이름과 순서를 확인해 보세요.'\n"
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
          { who: "Aistb", text: "가 번이 재발로 나왔습니다. 반장이 곧 온다고 한 그 대수입니다." },
          { who: "Aistb", text: "응답 지연 520ms 에 개선안 적용. 규칙 맨 아래 갈래가 그 둘을 함께 물어봤습니다." },
        ],
      },
      {
        lines: [{ who: "Aistb", text: "수고하셨습니다. 이것으로 금일 업무가 종료되었습니다. 내일 뵙겠습니다." }],
        menu: ["end"],
        nudge: [
          "업무 종료를 누르시면 오늘 일과가 끝납니다.",
          "저를 눌러 업무 메뉴에서 업무 종료를 선택하시면 됩니다.",
          "잘 맞히는 것과 설명이 되는 것을 한꺼번에 갖기는 어렵습니다. 오늘 점수를 얻고 규칙을 잃으셨습니다.",
          "반장은 백 그루 없이 알았습니다. 사람의 그 부분은 아직 제가 설명하지 못합니다.",
          "worklog_GipsWToyb_0088: 폐기 요망",
        ],
        wait: function () {
          return false;
        },
      },
    ],
  },

  diary: [
    "421950년 10월 15일.",
    "",
    "한 그루를 백 그루로 늘렸더니 0.93이 0.96이 됐다.",
    "대신 이제 규칙을 읽을 수가 없다. 백 그루를 글로 찍을 수는 없으니까.",
    "그저께 통조림 공장이 근거를 달라고 했던 게 생각났다. 그때 이걸 줬으면 못 댔다.",
    "",
    "가 번이 재발로 나왔다. 오류도 적고 재부팅도 없는 대수라 왜인지 모르겠는데,",
    "정비 반장이 저건 곧 온다고 했다는 그 대수다. 반장도 이유는 못 댔다고 적혀 있었다.",
    "응답이 느리고 개선안을 받은 대수이긴 하다.",
    "",
    "반장은 그걸 어떻게 알았을까. 나는 백 그루가 있어야 아는 걸.",
  ],
};
