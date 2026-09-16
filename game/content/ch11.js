// 11장 — 자료가 커지고, 계수로는 설명이 안 되는 것이 나온다.
// 로지스틱으로 먼저 해보고 잘 안 되는 것을 본 뒤에 트리로 넘어간다. 순서를 바꾸면 트리가 왜 필요한지 모른다.
// 오늘의 볼거리는 export_text 다 — 모델이 배운 규칙이 글로 그대로 나온다.

// B 덩이를 관통하는 자료. 11장부터 16장까지 같은 파일을 본다.
var LOG_CSV = {
  path: "work/자료/점검이력.csv",
  readOnly: true,
  src: "work/자료/점검이력.csv",
};

var TREE_DOC = {
  path: "work/참고/트리_요약.md",
  readOnly: true,
  content:
    "# 결정 트리 요약\n" +
    "\n" +
    "트리는 예/아니오 질문을 이어 붙여 답을 정합니다.\n" +
    "계수 하나로 답을 내는 것이 아니라 갈래를 타고 내려갑니다.\n" +
    "그래서 무리마다 신호가 다를 때도 잡아냅니다 — 한쪽은 이 열로, 다른 쪽은 저 열로 가릅니다.\n" +
    "\n" +
    "## 만들기\n" +
    "from sklearn.tree import DecisionTreeClassifier\n" +
    "model = DecisionTreeClassifier(random_state=42)\n" +
    "\n" +
    "쓰는 법은 지금까지와 같습니다. fit, predict, score 그대로입니다.\n" +
    "random_state 는 여기에도 줍니다. 없으면 같은 자료로도 매번 다른 트리가 나옵니다.\n" +
    "\n" +
    "## 배운 규칙 읽기\n" +
    "from sklearn.tree import export_text\n" +
    "print(export_text(model, feature_names=list(X.columns)))\n" +
    "\n" +
    "무엇을 보고 갈랐는지 글로 나옵니다.\n" +
    "조건이 그 열의 값으로 그대로 적혀 있어서, 단위가 섞여도 읽힙니다.\n" +
    "\n" +
    "## 깊이\n" +
    "DecisionTreeClassifier(max_depth=3, random_state=42) — 질문을 세 번까지만 하게 합니다.\n" +
    "제한을 두지 않으면 트리는 연습용을 다 맞힐 때까지 계속 갈라집니다.\n" +
    "\n" +
    "## 두 점수를 나란히 봅니다\n" +
    "model.score(X_train, y_train) — 배운 것으로 본 점수\n" +
    "model.score(X_test, y_test)   — 감춰 둔 것으로 본 점수\n" +
    "\n" +
    "앞이 1.0 인데 뒤가 한참 낮으면 규칙을 찾은 것이 아니라 답을 외운 것입니다.\n" +
    "지금까지는 뒤쪽만 봤습니다. 앞쪽도 같이 봐야 무슨 일이 일어났는지 압니다.\n" +
    "\n" +
    "## 로지스틱에 경고가 뜰 때\n" +
    "LogisticRegression(max_iter=1000)\n" +
    "숫자 폭이 큰 열이 섞이면 기본 횟수 안에 계산이 안 끝나고 경고가 나옵니다.\n" +
    "횟수를 늘려 주면 됩니다.\n",
};

var CH11 = {
  id: "ch11",
  title: "11 · 규칙으로 가르는 날",
  decay: 1,
  scenes: ["desk", "diary"],

  desk: {
    files: [
      { path: PANDAS_DOC.path, content: PANDAS_DOC.content, readOnly: true },
      { path: MODEL_DOC.path, content: MODEL_DOC.content, readOnly: true },
      { path: COEF_DOC.path, content: COEF_DOC.content, readOnly: true },
    ],

    idleLines: [
      "자료는 work/자료/점검이력.csv 입니다. 300 행입니다.",
      "막히셨으면 저를 눌러 주세요.",
      "트리에도 random_state 를 주셔야 합니다. 없으면 매번 달라집니다.",
    ],
    errorLines: [
      "코드가 도중에 멈췄습니다. 아래 빨간 글씨의 마지막 줄부터 읽어보세요.",
      "실행이 끝까지 가지 못했습니다. 열 이름이 다섯 개 다 맞는지 보시죠.",
      "에러입니다. export_text 의 feature_names 는 목록이어야 합니다. list 로 감싸셨는지 보세요.",
    ],

    beats: [
      // ── 아침 ────────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "좋은 아침입니다, 토이비님. 오늘은 자료가 큽니다. 300 행입니다." },
          { who: "Aistb", text: "사람이 눈으로 훑어 규칙을 찾을 크기가 아닙니다. …원래 그런 일을 하라고 있는 것이 이쪽입니다." },
        ],
      },

      // ── 의뢰 도착 ───────────────────────────────────
      {
        lines: [{ who: "Aistb", text: "한울운수 통합관제센터에서 접수되었습니다. 신규 고객사입니다." }],
        addFiles: [
          { path: LOG_CSV.path, readOnly: true, src: LOG_CSV.src },
          {
            path: "work/의뢰_0016.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0016 — 재발 예측이 되는지 확인\n" +
              "\n" +
              "고객: 한울운수 통합관제센터 관제운영팀 / 노아 S. 림\n" +
              "담당: 깁스 W 토이비\n" +
              "접수: 바로벤토 의뢰접수\n" +
              "\n" +
              "## 고객 원문\n" +
              "> 저희가 굴리는 관제 AI 300 대의 점검 이력을 보냅니다.\n" +
              "> 재발할 대수를 미리 알면 정비 순번을 바꿀 수 있습니다. 되는 일인지 먼저 봐 주세요.\n" +
              "> 개선안을 적용한 쪽과 안 한 쪽이 실제로 얼마나 다른지도 알고 싶습니다.\n" +
              ">\n" +
              "> 재발이 유난히 잦아진 건 두 달쯤 됐습니다. 300 대 중 90 대가 넘습니다.\n" +
              "> 개선안은 업계에서 도는 걸 받아서 적용하고 있습니다. 다들 그렇게 합니다.\n" +
              "\n" +
              "## 자료\n" +
              "work/자료/점검이력.csv — 관제 AI 300 대의 점검 이력\n" +
              "\n" +
              "  id      : 점검 번호\n" +
              "  hours   : 마지막 점검까지 누적 가동 시간\n" +
              "  reboots : 그 기간의 재부팅 횟수\n" +
              "  delay   : 평균 응답 지연 (ms)\n" +
              "  errors  : 하루 평균 오류 건수\n" +
              "  patched : 배포된 개선안을 적용했는지 (1 = 적용)\n" +
              "  again   : 점검 후 30일 안에 같은 증상이 재발했는지 (1 = 재발)\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_16/재발.py 를 만들고 아래 셋을 채워 주세요.\n" +
              "\n" +
              "- logi_acc   : 지금까지 쓰던 방식으로 낸 점수\n" +
              "- tree_acc   : 다른 방식으로 낸 점수\n" +
              "- by_patched : patched 값별 재발률 (300 건 전체 기준)\n" +
              "\n" +
              "## 조건\n" +
              "- 3할을 떼어 두고 random_state 는 42.\n" +
              "- 두 점수 중 나은 쪽으로 회신하고, 정식 의뢰가 오면 그쪽으로 진행합니다.\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0016.md"]',
        menu: ["brief"],
        nudge: [
          "저를 눌러 '의뢰 확인'을 고르시면 의뢰서가 열립니다.",
          "업무 메뉴 첫 번째 항목이 의뢰 확인입니다.",
          "300 행입니다. 눈으로 훑어 규칙을 찾을 크기가 아닙니다. 그런 일을 하라고 있는 것이 이쪽입니다.",
          "확인하지 않은 의뢰도 마감 기한은 동일하게 적용됩니다.",
          "worklog_GipsWToyb_0081: 폐기 요망",
        ],
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0016.md") >= 0;
          });
        },
      },

      // ── 예제 ────────────────────────────────────────
      {
        addFiles: [
          { path: TREE_DOC.path, readOnly: true, open: 1, content: TREE_DOC.content },
          {
            path: "work/예제/13_트리.py",
            open: 0,
            content:
              "import pandas as pd\n" +
              "from sklearn.model_selection import train_test_split\n" +
              "from sklearn.linear_model import LogisticRegression\n" +
              "from sklearn.tree import DecisionTreeClassifier, export_text\n" +
              "\n" +
              'df = pd.read_csv("work/자료/점검이력.csv")\n' +
              "print(len(df))\n" +
              'print(df["again"].value_counts())\n' +
              "\n" +
              'X = df[["hours", "reboots", "delay", "errors", "patched"]]\n' +
              'y = df["again"]\n' +
              "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)\n" +
              "\n" +
              "logi = LogisticRegression(max_iter=1000)\n" +
              "logi.fit(X_train, y_train)\n" +
              "print(logi.score(X_test, y_test))\n" +
              "\n" +
              "tree = DecisionTreeClassifier(random_state=42)\n" +
              "tree.fit(X_train, y_train)\n" +
              "print(tree.score(X_train, y_train))\n" +
              "print(tree.score(X_test, y_test))\n" +
              "\n" +
              "small = DecisionTreeClassifier(max_depth=3, random_state=42)\n" +
              "small.fit(X_train, y_train)\n" +
              "print(small.score(X_test, y_test))\n" +
              "\n" +
              "print(export_text(small, feature_names=list(X.columns)))\n",
          },
        ],
        lines: [
          { who: "Aistb", text: "지금까지 쓰시던 방식으로 먼저 해보겠습니다." },
          { who: "Aistb", text: "일곱 번 눌러 주세요." },
        ],
        spot: ".step",
        nudge: [
          { text: "아래의 ↓ 한 문장 버튼입니다.", spot: ".step" },
          { text: "↓ 한 문장 버튼을 일곱 번 누르시면 로지스틱 점수까지 나옵니다.", spot: ".step" },
          "잘 안 되는 것을 먼저 보셔야, 다음 것이 왜 필요한지 아십니다. 순서에는 이유가 있습니다.",
          "300 대 중 90 대가 재발했습니다. 다들 그렇게 한다는 개선안을 받아서 말이죠.",
          "worklog_GipsWToyb_0082: 폐기 요망",
        ],
        wait: steppedTo("work/예제/13_트리.py", 7),
      },
      {
        lines: [
          { who: "Aistb", text: "300 건 중 재발이 91 건입니다. 열에 셋입니다." },
          { who: "Aistb", text: "아무것도 안 보고 전부 재발 아님이라고 답해도 열에 일곱은 맞습니다." },
          { who: "Aistb", text: "0.73 보다 위인지를 봐야 합니다." },
          { who: "Aistb", text: "여섯 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/13_트리.py", 13),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "0.8 입니다. 0.73 보다 조금 나은 정도입니다.",
          },
          {
            who: "Aistb",
            text: "이 자료는 무리마다 재발 신호가 다릅니다. 한 열에 계수 하나로는 '어느 무리에서' 를 적을 수 없습니다.",
          },
          { who: "Aistb", text: "갈라서 물어보는 방식으로 바꾸겠습니다. 네 번 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/13_트리.py", 17),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "위가 1.0, 아래가 0.9 입니다.",
            spot: { text: "앞이 1.0 인데 뒤가 한참 낮으면", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "연습용 210 건은 전부 맞혔는데 감춰 둔 것에서는 0.9 입니다.",
          },
          {
            who: "Aistb",
            text: "규칙을 찾은 것이 아니라 답을 외운 것입니다. 제한이 없으면 연습용을 다 맞힐 때까지 계속 갈라집니다.",
          },
          { who: "Aistb", text: "질문 횟수를 세 번으로 묶어 보겠습니다. 세 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/13_트리.py", 20),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "0.93 입니다. **덜 외우게 했더니 더 잘 맞혔습니다.**",
            spot: { text: "max_depth=3", in: ".doc" },
          },
          { who: "Aistb", text: "마지막 한 줄은 ▶ 실행으로 보시죠." },
        ],
        spot: ".run",
        wait: steppedTo("work/예제/13_트리.py", 21),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "모델이 배운 것이 글로 나왔습니다. 조건을 따라 내려가면 끝의 class 가 답입니다.",
            spot: { text: "export_text", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "재부팅으로 가른 다음 양쪽 모두 patched 를 다시 물어봅니다. 같은 열을 두 번 쓰되 자리가 다릅니다.",
          },
          {
            who: "Aistb",
            text: "이것이 계수로 안 되던 것입니다.",
          },
        ],
      },

      // ── 의뢰 처리 ───────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "tree_acc 는 깊이를 세 번으로 묶은 쪽입니다." },
          { who: "Aistb", text: "by_patched 는 자료 전체를 patched 로 묶어 again 의 평균을 내시면 됩니다." },
        ],
        menu: ["brief", "report"],
        nudge: [
          'df.groupby("patched")["again"].mean() 입니다. 0 과 1 의 평균이 곧 재발률입니다.',
          "logi_acc, tree_acc, by_patched — 세 이름을 의뢰서 그대로 써 주세요.",
          "tree_acc 는 깊이를 세 번으로 묶은 쪽입니다. 두 변수를 바꿔 담지 않으셨는지 보세요.",
          "by_patched 는 연습용만이 아니라 300 건 전체로 내셔야 합니다.",
          "worklog_GipsWToyb_0083: 폐기 요망",
        ],
        report: function () {
          return checkFile(
            "work/task_16/재발.py",
            "for _n in ['logi_acc', 'tree_acc', 'by_patched']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "assert abs(float(logi_acc) - 0.8) < 0.03, f'logi_acc 가 {float(logi_acc):.3f} 입니다. 0.80 근처가 나와야 합니다. 다섯 열을 다 넣고 random_state 42, test_size 0.3 으로 맞추셨는지 보세요.'\n" +
              "assert abs(float(tree_acc) - 0.9333) < 0.03, f'tree_acc 가 {float(tree_acc):.3f} 입니다. 0.93 근처가 나와야 합니다. max_depth=3 과 random_state=42 를 둘 다 주셨는지 보세요.'\n" +
              "assert float(tree_acc) > float(logi_acc), f'트리 쪽이 더 낮게 나왔습니다 ({float(tree_acc):.3f} vs {float(logi_acc):.3f}). 두 변수를 바꿔 담지 않으셨는지 보세요.'\n" +
              "_b = dict(by_patched)\n" +
              "assert set(int(k) for k in _b) == {0, 1}, f'by_patched 의 이름이 {sorted(_b)} 입니다. patched 로 묶으면 0 과 1 두 줄이 나옵니다.'\n" +
              "_b = {int(k): float(v) for k, v in _b.items()}\n" +
              "assert abs(_b[0] - 0.2679) < 0.01 and abs(_b[1] - 0.3485) < 0.01, f'by_patched 가 {{0: {_b[0]:.3f}, 1: {_b[1]:.3f}}} 입니다. 0.268 과 0.348 이 나와야 합니다. 연습용만 쓰지 마시고 300 건 전체로 내 주세요.'\n"
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
          { who: "Aistb", text: "몇 번으로 묶는 것이 맞는지는 아직 아무도 모릅니다. 세 번이 좋았던 것은 이 자료에서였을 뿐입니다." },
          { who: "Aistb", text: "내일은 한 그루를 잘 깎는 대신 여러 그루를 심어 보겠습니다." },
        ],
      },
      {
        lines: [{ who: "Aistb", text: "수고하셨습니다. 이것으로 금일 업무가 종료되었습니다. 내일 뵙겠습니다." }],
        menu: ["end"],
        nudge: [
          "업무 종료를 누르시면 오늘 일과가 끝납니다.",
          "저를 눌러 업무 메뉴에서 업무 종료를 선택하시면 됩니다.",
          "덜 외우게 했더니 더 잘 맞혔습니다. 이 대목은 오래 기억해 두실 만합니다.",
          "몇 번으로 묶는 것이 맞는지는 아직 아무도 모릅니다. 세 번이 좋았던 것은 이 자료에서였을 뿐입니다.",
          "worklog_GipsWToyb_0084: 폐기 요망",
        ],
        wait: function () {
          return false;
        },
      },
    ],
  },

  diary: [
    "421950년 10월 14일.",
    "",
    "300행짜리를 받았다. 열었더니 숫자가 화면을 꽉 채워서 스크롤을 내리다 말았다.",
    "다 볼 생각을 접었다.",
    "",
    "하던 대로 하니까 0.8이 나왔다. 괜찮네 했는데,",
    "아무것도 안 보고 전부 아니라고만 찍어도 0.73이란다.",
    "그럼 내가 한 건 거의 없는 거였다.",
    "",
    "트리라는 걸로 바꿨더니 연습용을 전부 맞혔다. 잘된 줄 알았는데 그게 외운 거라고.",
    "질문을 세 번까지만 하게 묶으니까 0.93.",
    "덜 하게 했더니 더 잘한다.",
    "",
    "한울운수는 300대 중에 90대 넘게 재발했다고 적어 놨다.",
    "개선안은 업계에서 도는 걸 받아 쓴다고. 다들 그런단다.",
  ],
};
