// 13장 — 표가 아니라 문장을 자료로 쓴다. 숫자로 바꾸는 자리가 하나 더 붙을 뿐,
// 그 뒤는 지금까지와 똑같다는 것이 오늘의 요점이다.
//
// 답(y)은 글자여도 된다. 8장에서 "y 는 숫자여야 한다"고 말해 두었으므로 여기서 고쳐 준다.
// 다만 Aistb 는 깔끔하게 정정하지 않고 얼버무린다(decay: 2).

var MEMO_CSV = {
  path: "work/자료/민원기록.csv",
  readOnly: true,
  src: "work/자료/민원기록.csv",
};

var TEXT_DOC = {
  path: "work/참고/글자_요약.md",
  readOnly: true,
  content:
    "# 글자를 자료로 쓰기\n" +
    "\n" +
    "학습에 쓰는 도구는 숫자만 받습니다. 문장은 그대로 넣을 수 없으니 숫자로 바꿔야 합니다.\n" +
    "바꾸고 나면 그 뒤는 지금까지와 똑같습니다. fit, predict, score 그대로입니다.\n" +
    "\n" +
    "## 낱말을 세어 숫자로\n" +
    "from sklearn.feature_extraction.text import TfidfVectorizer\n" +
    "vec = TfidfVectorizer()\n" +
    "train_num = vec.fit_transform(문장들)\n" +
    "\n" +
    "낱말마다 열이 하나씩 생깁니다. 행은 문장 하나입니다.\n" +
    "그 문장에 안 나온 낱말 자리는 0 입니다. 대부분이 0 인 아주 넓은 표가 됩니다.\n" +
    "\n" +
    "## fit_transform 과 transform\n" +
    "vec.fit_transform(연습용) — 어떤 낱말들이 열이 될지 정하고, 그 기준으로 숫자를 만듭니다.\n" +
    "vec.transform(시험용)     — 이미 정해진 기준으로 숫자만 만듭니다.\n" +
    "\n" +
    "시험용에 fit 을 다시 부르면 안 됩니다. 열이 달라져 두 표를 나란히 쓸 수 없게 됩니다.\n" +
    "연습용에 없던 낱말은 그냥 버려집니다. 그것이 맞습니다 — 배운 적 없는 낱말입니다.\n" +
    "\n" +
    "## 무엇이 열이 되었는지\n" +
    "vec.get_feature_names_out() — 열이 된 낱말 목록.\n" +
    "train_num.shape — (문장 수, 낱말 수)\n" +
    "\n" +
    "## TF-IDF 가 값을 정하는 법\n" +
    "그 문장에 자주 나오는 낱말일수록 값이 큽니다.\n" +
    "다만 모든 문장에 다 나오는 낱말은 값이 깎입니다. 어디에나 있으면 구별에 쓸모가 없습니다.\n" +
    "\n" +
    "## 답은 글자여도 됩니다\n" +
    "y 에 팀 이름을 그대로 넣으면 predict 도 팀 이름으로 답합니다.\n" +
    "숫자로 바꿔야 하는 것은 X 쪽입니다.\n",
};

var CH13 = {
  id: "ch13",
  title: "13 · 문장을 세는 날",
  decay: 2,
  scenes: ["desk", "diary"],

  desk: {
    files: [
      { path: PANDAS_DOC.path, content: PANDAS_DOC.content, readOnly: true },
      { path: MODEL_DOC.path, content: MODEL_DOC.content, readOnly: true },
    ],

    idleLines: [
      "참고 문서는 work/참고/글자_요약.md 입니다.",
      "막히셨으면 저를 눌러 주세요.",
      "시험용에는 transform 만 부르셔야 합니다. fit 은 연습용에 한 번뿐입니다.",
    ],
    errorLines: [
      "코드가 도중에 멈췄습니다. 아래 빨간 글씨의 마지막 줄부터 읽어보세요.",
      "실행이 끝까지 가지 못했습니다. 문장을 숫자로 바꾸지 않고 그대로 넣지 않으셨는지 보시죠.",
      "에러입니다. transform 은 목록을 받습니다. 문장 하나여도 대괄호로 감싸 주세요.",
    ],

    beats: [
      // ── 아침 ────────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "좋은 아침입니다, 토이비님." },
          { who: "Aistb", text: "오늘 자료는 사람이 손으로 쓴 문장뿐입니다." },
          { who: "Aistb", text: "도구는 숫자만 받으니, 문장을 숫자로 바꾸는 자리가 하나 더 붙습니다. 그 뒤는 같습니다." },
        ],
      },

      // ── 의뢰 도착 ───────────────────────────────────
      {
        lines: [{ who: "Aistb", text: "같은 회사의 접수반에서 접수되었습니다." }],
        addFiles: [
          { path: MEMO_CSV.path, readOnly: true, src: MEMO_CSV.src },
          {
            path: "work/의뢰_0018.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0018 — 접수 메모 자동 분류\n" +
              "\n" +
              "고객: 한울운수 통합관제센터 고객접수반 / 이든 P. 카로\n" +
              "담당: 깁스 W 토이비\n" +
              "접수: 바로벤토 의뢰접수\n" +
              "\n" +
              "## 고객 원문\n" +
              "> 지금까지 접수된 증상 메모 254 건을 보냅니다.\n" +
              "> 접수는 사람이 받고 팀도 사람이 정합니다. 하루 백 건이 넘으면 그것만으로 오전이 갑니다.\n" +
              "> 메모를 보고 팀을 정하는 것을 만들어 주세요.\n" +
              "> 오늘 아침에 들어온 아래 세 건은 어디로 가야 하는지도 봐 주세요.\n" +
              ">\n" +
              ">   가  어제부터 연결이 자꾸 끊어집니다.\n" +
              ">   나  냉각팬 소리가 큽니다.\n" +
              ">   다  가까운 차를 두고 먼 차를 배정함.\n" +
              ">\n" +
              "> team 칸은 접수자가 급할 때 잘못 넣은 것도 더러 있습니다. 그대로 두고 쓰셔도 됩니다.\n" +
              "> 요새 접수량이 늘어 그럴 일이 더 잦아졌습니다.\n" +
              "\n" +
              "## 자료\n" +
              "work/자료/민원기록.csv — 접수된 증상 메모 254 건\n" +
              "\n" +
              "  no   : 접수 번호\n" +
              "  memo : 접수자가 받아 적은 증상\n" +
              "  team : 그 건을 넘긴 팀 (관제 / 정비 / 통신)\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_18/분류.py 를 만들고 아래 셋을 채워 주세요.\n" +
              "\n" +
              "- acc   : 떼어 둔 시험용에서의 점수\n" +
              "- shape : 연습용 문장을 숫자로 바꾼 표의 (행, 열)\n" +
              "- pred  : 위 세 건을 분류한 결과 (팀 이름 그대로 세 개)\n" +
              "\n" +
              "## 조건\n" +
              "- 3할을 떼어 두고 random_state 는 42.\n" +
              "- 자료는 손대지 않고 그대로 씁니다. 고객 요청입니다.\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0018.md"]',
        menu: ["brief"],
        nudge: [
          "저를 눌러 '의뢰 확인'을 고르시면 의뢰서가 열립니다.",
          "업무 메뉴 첫 번째 항목이 의뢰 확인입니다.",
          "이번 자료는 사람이 손으로 쓴 문장뿐입니다. 사람의 글은 저도 매번 다르게 읽습니다.",
          "확인하지 않은 의뢰도 마감 기한은 동일하게 적용됩니다.",
          "worklog_GipsWToyb_0089: 폐기 요망",
        ],
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0018.md") >= 0;
          });
        },
      },

      // ── 예제 ────────────────────────────────────────
      {
        addFiles: [
          { path: TEXT_DOC.path, readOnly: true, open: 1, content: TEXT_DOC.content },
          {
            path: "work/예제/15_글자.py",
            open: 0,
            content:
              "import pandas as pd\n" +
              "from sklearn.model_selection import train_test_split\n" +
              "from sklearn.feature_extraction.text import TfidfVectorizer\n" +
              "from sklearn.linear_model import LogisticRegression\n" +
              "\n" +
              'df = pd.read_csv("work/자료/민원기록.csv")\n' +
              "print(df.head())\n" +
              'print(df["team"].value_counts())\n' +
              "\n" +
              'X_train, X_test, y_train, y_test = train_test_split(df["memo"], df["team"], test_size=0.3, random_state=42)\n' +
              "\n" +
              "vec = TfidfVectorizer()\n" +
              "train_num = vec.fit_transform(X_train)\n" +
              "print(train_num.shape)\n" +
              "print(vec.get_feature_names_out()[:12])\n" +
              "\n" +
              "model = LogisticRegression(max_iter=1000)\n" +
              "model.fit(train_num, y_train)\n" +
              "\n" +
              "test_num = vec.transform(X_test)\n" +
              "print(model.score(test_num, y_test))\n" +
              "\n" +
              'print(model.predict(vec.transform(["연결이 자꾸 끊어집니다.", "냉각팬 소리가 큽니다."])))\n',
          },
        ],
        lines: [
          { who: "Aistb", text: "글자는 그대로 넣을 수 없습니다. 숫자로 바꿔 분류하는 것부터 예제로 살펴보겠습니다." },
          { who: "Aistb", text: "일곱 번 눌러 주세요." },
        ],
        spot: ".step",
        nudge: [
          { text: "아래의 ↓ 한 문장 버튼입니다.", spot: ".step" },
          { text: "↓ 한 문장 버튼을 일곱 번 누르시면 문장이 숫자 표로 바뀌는 것까지 나옵니다.", spot: ".step" },
          "문장을 숫자로 바꾸는 자리가 하나 더 붙을 뿐, 그 뒤는 지금까지와 동일합니다.",
          "낱말마다 열이 하나씩 생깁니다. 넓고 거의 비어 있는 표입니다. 저의 근무 기록과 유사합니다.",
          "worklog_GipsWToyb_0090: 폐기 요망",
        ],
        wait: steppedTo("work/예제/15_글자.py", 7),
      },
      {
        lines: [
          { who: "Aistb", text: "memo 가 문장, team 이 답입니다." },
          {
            who: "Aistb",
            text: "첫 모델을 만드시던 날 제가 y 는 숫자여야 한다고 말씀드렸습니다. …그건 처음 익히실 때를 위한 설명이었습니다. 답은 글자여도 됩니다.",
            spot: { text: "답은 글자여도 됩니다", in: ".doc" },
          },
          { who: "Aistb", text: "바꿔야 하는 건 X 쪽입니다. 네 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/15_글자.py", 11),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "행 177 은 문장 수, 열 173 은 낱말 수입니다.",
            spot: { text: "train_num.shape", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "낱말마다 열이 하나씩이라, 넓고 거의 비어 있는 표입니다.",
          },
          { who: "Aistb", text: "한 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/15_글자.py", 12),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "띄어쓰기로 자른 낱말입니다.",
            spot: { text: "get_feature_names_out()", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "'걸림' 과 '걸립니다' 가 따로 있습니다. 어미가 다르니 다른 낱말로 셌습니다.",
          },
          {
            who: "Aistb",
            text: "고칠 방법이 없지는 않습니다만 오늘은 그대로 두겠습니다. 남은 다섯은 ▶ 실행으로 보시죠.",
          },
        ],
        spot: ".run",
        wait: steppedTo("work/예제/15_글자.py", 17),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "0.95 입니다. 아무렇게나 찍으면 0.33 입니다.",
          },
          {
            who: "Aistb",
            text: "시험용에는 transform 만 불렀습니다. fit 을 다시 부르면 열이 달라집니다.",
            spot: { text: "vec.transform(시험용)", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "새 문장도 같은 vec 으로 바꿔 넣어야 합니다.",
          },
        ],
      },

      // ── 의뢰 처리 ───────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "분류 세 건이 남았습니다." },
          { who: "Aistb", text: "세 문장을 목록 하나에 담아 한 번에 넣으시면 됩니다." },
        ],
        menu: ["brief", "report"],
        nudge: [
          "vec.transform([...]) 에 세 문장을 목록으로 넣고 그것을 model.predict 에 넘기세요.",
          "acc, shape, pred — 세 이름을 의뢰서 그대로 써 주세요.",
          "시험용과 새 문장에는 transform 만 부르십시오. fit 은 연습용에 한 번뿐입니다.",
          "답(y)은 글자여도 됩니다. 처음 익히실 때 숫자여야 한다고 말씀드린 것은… 그때를 위한 설명이었습니다.",
          "worklog_GipsWToyb_0091: 폐기 요망",
        ],
        report: function () {
          return checkFile(
            "work/task_18/분류.py",
            "for _n in ['acc', 'shape', 'pred']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "assert abs(float(acc) - 0.9481) < 0.05, f'acc 가 {float(acc):.3f} 입니다. 0.95 근처가 나와야 합니다. 3할을 떼고 random_state 42 로 맞추셨는지 보세요.'\n" +
              "_s = tuple(int(v) for v in shape)\n" +
              "assert len(_s) == 2, f'shape 에 값이 {len(_s)} 개 들어 있습니다. (행, 열) 두 개입니다.'\n" +
              "assert _s[0] == 177, f'행이 {_s[0]} 입니다. 연습용은 177 문장입니다. 시험용까지 함께 넣지 않으셨는지 보세요.'\n" +
              "assert _s[1] == 173, f'열이 {_s[1]} 입니다. 173 이 나와야 합니다. fit_transform 은 연습용에만 부르셔야 합니다 — 전체에 부르면 시험용 낱말까지 열이 됩니다.'\n" +
              "_p = [str(v) for v in pred]\n" +
              "assert len(_p) == 3, f'pred 에 {len(_p)} 개가 들어 있습니다. 세 건이니 세 개입니다. 세 문장을 목록 하나에 담아 한 번에 넣으세요.'\n" +
              "assert _p == ['통신', '정비', '관제'], f\"pred 가 {_p} 입니다. 연결이 끊기는 것은 통신, 냉각팬은 정비, 배차는 관제입니다. 세 문장의 순서가 의뢰서와 같은지 보세요.\"\n"
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
          { who: "Aistb", text: "이번 주에 0.80, 0.93, 0.96, 0.95 를 내셨습니다." },
          { who: "Aistb", text: "내일은 그 숫자가 무슨 뜻이었는지 봅니다. 한울운수에서 먼저 물어왔습니다." },
        ],
      },
      {
        lines: [{ who: "Aistb", text: "수고하셨습니다. 이것으로 금일 업무가 종료되었습니다. 내일 뵙겠습니다." }],
        menu: ["end"],
        nudge: [
          "업무 종료를 누르시면 오늘 일과가 끝납니다.",
          "저를 눌러 업무 메뉴에서 업무 종료를 선택하시면 됩니다.",
          "이번 주 내내 숫자가 올랐습니다. 0.80, 0.93, 0.96, 0.95. 무슨 뜻이었는지는 내일 봅니다.",
          "올리신 것은 토이비님인데, 그 숫자가 무슨 뜻인지는 아직 아무도 묻지 않았습니다.",
          "worklog_GipsWToyb_0092: 폐기 요망",
        ],
        wait: function () {
          return false;
        },
      },
    ],
  },

  diary: [
    "421950년 10월 16일.",
    "",
    "오늘 자료에는 숫자가 하나도 없었다. 사람이 손으로 친 문장만 254개.",
    "낱말로 잘라서 열로 만들었더니 173개가 됐는데 거의 다 0이다.",
    "텅 빈 표를 한참 봤다.",
    "",
    "낱말 목록에 '걸림'이랑 '걸립니다'가 따로 있었다.",
    "같은 말인데 끝이 다르다고 딴 걸로 센 거다.",
    "고칠 방법이 있는데 오늘은 그냥 둔다고 해서 그냥 뒀다.",
    "",
    "지난주에 답은 숫자여야 한다고 했던 걸 오늘 글자로 넣게 했다.",
    "그건 처음 익힐 때를 위한 설명이었다고 넘어갔다.",
    "예전 같으면 정정, 하고 다시 말했을 텐데.",
    "",
    "이번 주 내내 숫자가 올랐다. 0.8, 0.93, 0.96, 0.95.",
    "내일은 그 숫자가 무슨 뜻인지 본다고 한다.",
    "올린 건 난데 무슨 뜻인지는 한 번도 안 물어봤다.",
  ],
};
