// 7장 — 어제 센 것을 실제로 손질하는 날. 자료는 어제와 같은 파일이다.
// 손질은 원본을 바꾸지 않는다는 것과, 글자를 숫자로 바꿔 두는 것 두 가지가 핵심이다.
// 여기서 만든 표가 9장에서 모델의 재료가 된다.

var CLEAN_DOC = {
  path: "work/참고/손질_요약.md",
  readOnly: true,
  content:
    "# 자료 손질 요약\n" +
    "\n" +
    "손질은 원본을 바꾸지 않습니다. 손질한 결과가 새 표로 나오고,\n" +
    "그것을 변수에 받아 두어야 남습니다. 받지 않으면 그냥 사라집니다.\n" +
    "\n" +
    "## 겹치는 행 버리기\n" +
    "df.drop_duplicates() — 앞에 똑같은 행이 이미 있었던 행을 버린 새 표.\n" +
    "\n" +
    "## 빈칸\n" +
    "df.dropna() — 빈칸이 하나라도 있는 행을 버린 새 표.\n" +
    'df["weight"].fillna(340) — 그 열의 빈칸을 340 으로 채운 새 열.\n' +
    "버릴지 채울지는 자료를 보고 정합니다. 몇 개 안 되면 버리는 편이 간단합니다.\n" +
    "\n" +
    "## 범위를 벗어난 값 버리기\n" +
    'df[(df["temp"] >= 100) & (df["temp"] <= 140)] — 두 조건을 다 만족하는 행만 남긴 새 표.\n' +
    "& 는 '그리고' 입니다. 어제 쓰신 | 와 마찬가지로 각각을 괄호로 감싸야 합니다.\n" +
    "\n" +
    "## 글자를 숫자로\n" +
    'df["result"].map({"합격": 0, "불합격": 1}) — 값을 표대로 바꿔치기한 새 열.\n' +
    "\n" +
    "## 새 열 붙이기\n" +
    'df["fail"] = ... — 그 이름의 열이 없으면 새로 생기고, 있으면 덮어씁니다.\n' +
    "열을 붙이는 것은 버리기 전에 해 두는 편이 편합니다.\n" +
    "\n" +
    "## 손질한 뒤에는 다시 셉니다\n" +
    "len(df), df.isna().sum(), df.duplicated().sum() — 어제 쓰신 것 그대로입니다.\n" +
    "고쳤다고 생각한 것이 실제로 고쳐졌는지는 세어봐야 압니다.\n",
};

var CH07 = {
  id: "ch07",
  title: "7 · 자료를 손질하는 날",
  scenes: ["desk", "diary"],

  desk: {
    files: [
      { path: PANDAS_DOC.path, content: PANDAS_DOC.content, readOnly: true },
      { path: EDA_DOC.path, content: EDA_DOC.content, readOnly: true },
      { path: INSPECT_CSV.path, content: INSPECT_CSV.content, readOnly: true },
    ],

    idleLines: [
      "자료는 어제와 같은 파일입니다. work/자료/검사기록.csv 입니다.",
      "막히셨으면 저를 눌러 주세요.",
      "손질한 결과를 변수에 받으셨는지 확인해 보세요. 받지 않으면 남지 않습니다.",
    ],
    errorLines: [
      "코드가 도중에 멈췄습니다. 아래 빨간 글씨의 마지막 줄부터 읽어보세요.",
      "실행이 끝까지 가지 못했습니다. 조건 각각을 괄호로 감싸셨는지 보시죠.",
      "에러입니다. 열 이름의 철자를 먼저 확인해 보시는 편이 빠릅니다.",
    ],

    beats: [
      // ── 아침 ────────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "좋은 아침입니다, 토이비님. 어제 보내신 숫자를 보고 같은 곳에서 다시 연락이 왔습니다." },
          { who: "Aistb", text: "오늘은 버리는 날입니다. 자료는 어제 것입니다." },
        ],
        show: [{ path: INSPECT_CSV.path, pane: 1 }],
      },

      // ── 의뢰 도착 ───────────────────────────────────
      {
        lines: [{ who: "Aistb", text: "의뢰가 들어왔습니다." }],
        addFiles: [
          {
            path: "work/의뢰_0012.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0012 — 검사 기록 정리\n" +
              "\n" +
              "고객: 런천미트연구소 3라인 관리 / 유리 D. 하만\n" +
              "담당: 깁스 W 토이비\n" +
              "접수: 바로벤토 의뢰접수\n" +
              "\n" +
              "## 고객 원문\n" +
              "> 어제 보내주신 숫자는 잘 봤습니다.\n" +
              "> 쓸 수 없는 행을 걷어내고, 나중에 학습에 넣을 수 있는 모양으로 만들어 주세요.\n" +
              "> 온도는 100~140℃, 중량은 300~400g 를 벗어날 수 없는 공정입니다.\n" +
              "> 그 밖의 값은 전부 기록이 잘못 들어간 것이니 고치지 마시고 버려 주세요.\n" +
              ">\n" +
              "> 판정 AI가 언제부터 이랬는지 물어보셨는데, 저희도 정확히는 모릅니다.\n" +
              "> 8월까지는 아무 말이 없었습니다.\n" +
              "\n" +
              "## 자료\n" +
              "work/자료/검사기록.csv — 어제 것과 같은 파일\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_12/손질.py 를 만들고, 손질을 마친 표를 clean 에 넣어 주세요.\n" +
              "\n" +
              "걷어낼 것은 이렇습니다.\n" +
              "\n" +
              "- 앞에 똑같은 행이 이미 있었던 행\n" +
              "- weight 가 비어 있는 행\n" +
              "- temp 가 100 미만이거나 140 초과인 행\n" +
              "- weight 가 300 미만이거나 400 초과인 행\n" +
              "\n" +
              "그리고 열을 하나 더해 주세요.\n" +
              "\n" +
              "- fail : result 가 합격이면 0, 불합격이면 1\n" +
              "\n" +
              "## 조건\n" +
              "- 잘못 들어간 값은 고치지 않고 버립니다. 고객 요청입니다.\n" +
              "- fail 열은 고객이 요청한 것이 아니라 이쪽에서 덧붙이는 것입니다.\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0012.md"]',
        menu: ["brief"],
        nudge: "저를 눌러 의뢰 확인을 고르시면 의뢰서가 열립니다.",
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0012.md") >= 0;
          });
        },
      },

      // ── 예제 ────────────────────────────────────────
      {
        addFiles: [
          { path: CLEAN_DOC.path, readOnly: true, open: 1, content: CLEAN_DOC.content },
          {
            path: "work/예제/10_손질.py",
            open: 0,
            content:
              "import pandas as pd\n" +
              "\n" +
              'df = pd.read_csv("work/자료/검사기록.csv")\n' +
              "print(len(df))\n" +
              "\n" +
              "clean = df.drop_duplicates()\n" +
              "print(len(clean))\n" +
              "\n" +
              "clean = clean.dropna()\n" +
              "print(len(clean))\n" +
              "\n" +
              'clean = clean[(clean["temp"] >= 100) & (clean["temp"] <= 140)]\n' +
              "print(len(clean))\n" +
              "\n" +
              'df["fail"] = df["result"].map({"합격": 0, "불합격": 1})\n' +
              'print(df[["result", "fail"]].head())\n',
          },
        ],
        lines: [
          { who: "Aistb", text: "먼저 예제로 손질 순서를 보겠습니다. 중복, 빈칸, 범위 밖을 차례로 덜어냅니다." },
          { who: "Aistb", text: "다섯 번 눌러 주세요." },
        ],
        spot: ".step",
        nudge: "아래의 ↓ 한 문장 버튼입니다.",
        wait: steppedTo("work/예제/10_손질.py", 5),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "겹치는 행이 빠졌습니다. 어제 세셨던 만큼입니다.",
            spot: { text: "df.drop_duplicates()", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "drop_duplicates 는 df 를 건드리지 않았습니다.",
          },
          {
            who: "Aistb",
            text: "새 표를 내놓았고, clean 에 받아 두었기 때문에 남았습니다.",
          },
          { who: "Aistb", text: "받지 않으면 그냥 사라집니다. 네 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/10_손질.py", 9),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "열이 아니라 행 단위로 버립니다.",
            spot: { text: "df.dropna()", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "어제 999를 찾은 조건을 이번에는 남기는 데 썼습니다.",
            spot: { text: "& 는 '그리고' 입니다", in: ".doc" },
          },
          { who: "Aistb", text: "남은 두 줄은 ▶ 실행으로 보시죠." },
        ],
        spot: ".run",
        wait: steppedTo("work/예제/10_손질.py", 11),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "합격은 0, 불합격은 1 이 되었습니다.",
            spot: { text: 'df["result"].map', in: ".doc" },
          },
          { who: "Aistb", text: "숫자로 바꾸는 이유는 내일 아시게 됩니다." },
        ],
      },

      // ── 실습 ────────────────────────────────────────
      {
        addFiles: [
          {
            path: "work/실습/08_걷어내기.py",
            open: 0,
            content:
              "import pandas as pd\n" +
              "\n" +
              "df = pd.DataFrame({\n" +
              '    "no":    [1, 2, 2, 3, 4],\n' +
              '    "value": [10.0, 20.0, 20.0, None, 500.0],\n' +
              '    "grade": ["정상", "정상", "정상", "정상", "이상"],\n' +
              "})\n" +
              "\n" +
              "# 1) 겹치는 행을 버린 표의 행 수를 a 에 넣으세요\n" +
              "a = ...\n" +
              "\n" +
              "# 2) 거기서 빈칸이 있는 행까지 버린 표의 행 수를 b 에 넣으세요\n" +
              "b = ...\n" +
              "\n" +
              "# 3) 거기서 value 가 100 이하인 행만 남긴 표의 행 수를 c 에 넣으세요\n" +
              "c = ...\n" +
              "\n" +
              "# 4) 원래 표의 grade 를 정상 0, 이상 1 로 바꾼 것을 g 에 넣으세요\n" +
              "g = ...\n",
          },
        ],
        lines: [
          { who: "Aistb", text: "실습 과제입니다. 1번부터 3번까지는 앞의 결과 위에 이어서 손질하시면 됩니다. 다 되면 완료 보고입니다." },
        ],
        menu: ["report"],
        nudge: "중간 결과를 변수에 받아 두고 그 위에 다음 손질을 얹으세요.",
        report: function () {
          return checkFile(
            "work/실습/08_걷어내기.py",
            drillCheck([
              ["a", 4],
              ["b", 3],
              ["c", 2],
              ["g", [0, 0, 0, 0, 1]],
            ])
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },

      // ── 의뢰 처리 ───────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "버릴 것이 네 가지, 더할 열이 하나입니다." },
          { who: "Aistb", text: "예제에서는 온도만 봤습니다. 중량도 같은 방식으로 한 번 더 걸러 주셔야 합니다." },
        ],
        menu: ["brief", "report"],
        nudge: "fail 열은 버리기 전에 df 에 붙여 두시면 뒤가 편합니다.",
        report: function () {
          return checkFile(
            "work/task_12/손질.py",
            "import pandas as pd\n" +
              "assert 'clean' in dir(), 'clean 이 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "assert not isinstance(clean, type(Ellipsis)), 'clean 이 아직 ... 그대로입니다.'\n" +
              "assert isinstance(clean, pd.DataFrame), 'clean 이 표가 아닙니다. 손질한 결과를 그대로 넣어 주세요.'\n" +
              "assert 'fail' in clean.columns, f'clean 에 fail 열이 없습니다. 지금 열은 {list(clean.columns)} 입니다.'\n" +
              "assert int(clean.duplicated().sum()) == 0, f'아직 겹치는 행이 {int(clean.duplicated().sum())} 개 남아 있습니다.'\n" +
              "assert int(clean.isna().sum().sum()) == 0, f'아직 빈칸이 {int(clean.isna().sum().sum())} 개 남아 있습니다.'\n" +
              "assert float(clean['temp'].max()) <= 140 and float(clean['temp'].min()) >= 100, f\"temp 가 {float(clean['temp'].min())} ~ {float(clean['temp'].max())} 입니다. 100 ~ 140 을 벗어난 행이 남아 있습니다.\"\n" +
              "assert float(clean['weight'].max()) <= 400 and float(clean['weight'].min()) >= 300, f\"weight 가 {float(clean['weight'].min())} ~ {float(clean['weight'].max())} 입니다. 중량도 한 번 더 걸러 주세요.\"\n" +
              "assert len(clean) == 55, f'clean 이 {len(clean)} 행입니다. 55 행이 남아야 합니다. 버릴 것 네 가지를 모두 적용하셨는지 보세요.'\n" +
              "assert set(int(v) for v in clean['fail'].unique()) == {0, 1}, f\"fail 에 {sorted(clean['fail'].unique())} 가 들어 있습니다. 합격은 0, 불합격은 1 입니다.\"\n" +
              "assert int(clean['fail'].sum()) == 19, f\"불합격이 {int(clean['fail'].sum())} 개로 세어집니다. 19 개여야 합니다. 0 과 1 이 뒤바뀌지 않았는지 보세요.\"\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },

      // ── 마무리 ──────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "접수했습니다. 정리본으로 회신하겠습니다." },
          { who: "Aistb", text: "62행이 55행이 되었습니다." },
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
    "421950년 10월 8일.",
    "",
    "중복을 버리고 다시 세어봤는데 숫자가 그대로였다.",
    "한참 들여다보다가 알았다. 버린 결과를 아무 데도 안 받아놨다.",
    "df 는 그대로 있고 버려진 표만 어디론가 사라진 거였다.",
    "",
    "합격을 0, 불합격을 1 로 바꿔놨다. 왜 그러는지는 안 알려줬다.",
    "내일 알게 된다고만 했다.",
    "아니 그럴 거면 그냥 오늘 알려주지.",
  ],
};
