// 4장 — Pandas를 배우는 날. 이름이 섞인 표를 다룬다. 의뢰는 오지 않는다.
// 진행 방식은 1장과 같다. 연습 파일을 한 문장씩 실행하며 결과를 본 뒤, 익힘 문제로 굳힌다.

// 배우는 날과 푸는 날 양쪽에서 같은 것을 내려준다.
var PANDAS_DOC = {
  path: "work/참고/pandas_요약.md",
  readOnly: true,
  content:
    "# Pandas 요약\n" +
    "\n" +
    "import pandas as pd 로 가져옵니다. df 는 표입니다.\n" +
    "표의 세로 한 칸을 열이라고 부르고, 열마다 이름이 붙어 있습니다.\n" +
    "\n" +
    "## 만들기와 훑어보기\n" +
    "pd.DataFrame(딕셔너리) — 열 이름과 값 목록으로 표를 만듭니다.\n" +
    "df.head(3) — 앞에서 세 줄만 봅니다. 표가 길 때 씁니다.\n" +
    "len(df) — 줄이 몇 개인지.\n" +
    "\n" +
    "## 열 고르기\n" +
    'df["count"] — count 열 하나. 값이 세로로 늘어선 목록이 나옵니다(Series).\n' +
    'df[["name", "count"]] — 두 열. 대괄호가 두 겹이면 결과도 표입니다.\n' +
    "\n" +
    "## 조건으로 줄 고르기\n" +
    'df["count"] >= 30 — 줄마다 참/거짓이 나옵니다.\n' +
    'df[df["count"] >= 30] — 그 참/거짓을 다시 대괄호에 넣으면 참인 줄만 남습니다.\n' +
    "\n" +
    "## 계산\n" +
    'df["count"].mean() — 그 열의 평균. sum() max() min() 도 같습니다.\n' +
    'df.groupby("team") — team 이 같은 것끼리 묶습니다.\n' +
    'df.groupby("team")["count"].mean() — 묶은 뒤 count 열의 평균. 무리마다 한 줄씩 나옵니다.\n',
};

var CH04 = {
  id: "ch04",
  title: "4 · 이름이 붙은 표를 배우는 날",
  scenes: ["desk", "diary"],

  desk: {
    files: [],

    idleLines: [
      "참고 문서는 work/참고/ 안에 있습니다.",
      "막히셨으면 저를 눌러 주세요.",
      "어제 쓰신 중단점을 여기서도 그대로 쓰실 수 있습니다.",
    ],
    errorLines: [
      "코드가 도중에 멈췄습니다. 아래 빨간 글씨의 마지막 줄부터 읽어보세요.",
      "실행이 끝까지 가지 못했습니다. 따옴표나 대괄호가 짝이 맞는지 보시죠.",
      "에러입니다. 열 이름의 철자를 먼저 확인해 보시는 편이 빠릅니다.",
    ],

    beats: [
      // ── 아침 ────────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "좋은 아침입니다, 토이비님. 이틀 동안 하신 여섯 건은 각 팀에서 잘 받았다고 합니다." },
          { who: "Aistb", text: "오늘은 다시 배우는 날입니다. 의뢰는 내일 들어옵니다." },
          { who: "Aistb", text: "내일 오는 자료에는 숫자만 있는 것이 아닙니다. 사람 이름이 섞여 있습니다." },
          { who: "Aistb", text: "NumPy 배열은 숫자를 담는 그릇입니다. 글자가 섞이면 Pandas 를 씁니다. 오늘 배우실 것입니다." },
        ],
      },

      // ── 연습 ────────────────────────────────────────
      {
        addFiles: [
          {
            path: PANDAS_DOC.path,
            readOnly: true,
            open: 1,
            content: PANDAS_DOC.content,
          },
          {
            path: "work/연습/07_이름붙은표.py",
            open: 0,
            content:
              "import pandas as pd\n" +
              "\n" +
              "df = pd.DataFrame({\n" +
              '    "name":  ["가온", "노을", "다움", "라온", "마루"],\n' +
              '    "count": [41, 22, 35, 30, 18],\n' +
              '    "team":  ["A", "B", "A", "B", "A"],\n' +
              "})\n" +
              "\n" +
              "print(df)\n" +
              "\n" +
              'print(df["count"])\n' +
              'print(df[["name", "count"]])\n' +
              "\n" +
              'print(df["count"] >= 30)\n' +
              'print(df[df["count"] >= 30])\n' +
              "\n" +
              'print(df["count"].mean())\n' +
              'print(df.groupby("team")["count"].mean())\n',
          },
        ],
        lines: [
          { who: "Aistb", text: "연습 파일입니다. 어제처럼 한 문장씩 보시겠습니다. 세 번 눌러 표가 나올 때까지 가 주세요." },
          { who: "Aistb", text: "처음 한 번은 Pandas 를 가져오느라 몇 초 걸립니다." },
        ],
        spot: ".step",
        nudge: "아래의 ↓ 한 줄 버튼입니다.",
        wait: steppedTo("work/연습/07_이름붙은표.py", 3),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "pd.DataFrame 에 딕셔너리를 넣으면 표가 됩니다. 열 이름이 위에, 줄 번호가 왼쪽에 붙습니다.",
            spot: { text: "pd.DataFrame(딕셔너리)", in: ".doc" },
          },
          { who: "Aistb", text: "열을 고르는 두 가지를 보시겠습니다. 두 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/연습/07_이름붙은표.py", 5),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "열 하나를 부를 때는 이름을 대괄호에 넣습니다. 번호가 아니라 이름으로 부르는 것이 NumPy와 다른 점입니다.",
            spot: { text: 'df["count"]', in: ".doc" },
          },
          {
            who: "Aistb",
            text: "대괄호를 두 겹으로 쓰면 여러 열을 고를 수 있고, 결과도 표로 나옵니다. 위의 출력과 생김새를 비교해 보십시오.",
            spot: { text: 'df[["name", "count"]]', in: ".doc" },
          },
          { who: "Aistb", text: "다음 한 줄이 오늘의 고비입니다. 한 번만 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/연습/07_이름붙은표.py", 6),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "값이 나올 줄 아셨을 텐데 참과 거짓이 줄줄이 나왔습니다. 이 식은 고르는 것이 아니라 줄마다 조건에 맞는지를 답한 것입니다.",
            spot: { text: "dtype: bool", in: ".out" },
          },
          { who: "Aistb", text: "그제 배열에서 하신 것과 같은 방법입니다. 한 번 더 눌러 확인해 보세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/연습/07_이름붙은표.py", 7),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "참인 줄만 남았습니다. 두 단계가 하나로 붙어 있는 것뿐입니다. 안쪽이 참/거짓을 만들고, 바깥쪽이 그것으로 고릅니다.",
            spot: { text: 'df[df["count"] >= 30]', in: ".doc" },
          },
          { who: "Aistb", text: "남은 두 줄은 ▶ 실행으로 보시죠." },
        ],
        spot: ".run",
        wait: steppedTo("work/연습/07_이름붙은표.py", 9),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "열 하나의 평균은 그 열 뒤에 mean() 을 붙이면 됩니다. 배열에 하신 것과 같습니다.",
            spot: { text: 'df["count"].mean()', in: ".doc" },
          },
          {
            who: "Aistb",
            text: "groupby 는 같은 값끼리 묶습니다. team 으로 묶고 count 열의 평균을 내면 팀마다 한 줄씩 나옵니다.",
            spot: { text: 'df.groupby("team")["count"].mean()', in: ".doc" },
          },
        ],
      },

      // ── 익힘 1 ──────────────────────────────────────
      {
        addFiles: [
          {
            path: "work/익힘/05_고르기.py",
            open: 0,
            content:
              "import numpy as np\n" +
              "import pandas as pd\n" +
              "\n" +
              "df = pd.DataFrame({\n" +
              '    "name":  ["가온", "노을", "다움", "라온"],\n' +
              '    "count": [12, 20, 30, 40],\n' +
              '    "team":  ["A", "B", "A", "B"],\n' +
              "})\n" +
              "\n" +
              "# 1) count 열 하나만 골라 counts 에 넣으세요\n" +
              "counts = ...\n" +
              "\n" +
              "# 2) 건수가 20 이상인 사람의 이름만 골라 busy_names 에 넣으세요\n" +
              "busy_names = ...\n" +
              "\n" +
              "# 3) 그런 사람이 몇 명인지 how_many 에 넣으세요\n" +
              "how_many = ...\n" +
              DRILL_CHECKER +
              "확인('1번', counts, [12, 20, 30, 40])\n" +
              "확인('2번', busy_names, ['노을', '다움', '라온'])\n" +
              "확인('3번', how_many, 3)\n" +
              DRILL_TAIL,
          },
        ],
        lines: [
          { who: "Aistb", text: "익힘 문제입니다. 어제와 같은 방식이니 설명은 줄이겠습니다." },
          { who: "Aistb", text: "2번은 조건으로 줄을 고른 다음, 거기서 이름 열 하나를 다시 고르시면 됩니다." },
        ],
        spot: ".run",
        nudge: "조건을 대괄호에 넣어 고르고, 줄 수는 len 으로 셉니다.",
        wait: solvedDrill("work/익힘/05_고르기.py"),
      },

      // ── 익힘 2 ──────────────────────────────────────
      {
        addFiles: [
          {
            path: "work/익힘/06_묶기.py",
            open: 0,
            content:
              "import numpy as np\n" +
              "import pandas as pd\n" +
              "\n" +
              "df = pd.DataFrame({\n" +
              '    "name":  ["가온", "노을", "다움", "라온"],\n' +
              '    "count": [12, 20, 30, 40],\n' +
              '    "team":  ["A", "B", "A", "B"],\n' +
              "})\n" +
              "\n" +
              "# 1) count 열의 평균을 avg 에 넣으세요\n" +
              "avg = ...\n" +
              "\n" +
              "# 2) 팀별 평균 건수를 by_team 에 넣으세요 (A팀 먼저, B팀 나중)\n" +
              "by_team = ...\n" +
              "\n" +
              "# 3) 팀별 합계 건수를 team_sum 에 넣으세요\n" +
              "team_sum = ...\n" +
              DRILL_CHECKER +
              "확인('1번', avg, 25.5)\n" +
              "확인('2번', by_team, [21.0, 30.0])\n" +
              "확인('3번', team_sum, [42, 60])\n" +
              DRILL_TAIL,
          },
        ],
        lines: [
          { who: "Aistb", text: "오늘의 마지막 익힘 문제입니다. 묶는 쪽입니다." },
          { who: "Aistb", text: "평균 대신 합계가 필요하면 mean 자리에 sum 을 넣으시면 됩니다. 참고 문서에 적어 두었습니다." },
        ],
        spot: ".run",
        nudge: 'df.groupby("team")["count"] 까지 쓰신 다음 .mean() 이나 .sum() 을 붙이세요.',
        wait: solvedDrill("work/익힘/06_묶기.py"),
      },

      // ── 마무리 ──────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "오늘은 이 셋입니다. 이름으로 부른다. 조건으로 고른다. 무리로 묶는다." },
          { who: "Aistb", text: "참고 문서는 내일 아침에 같은 것을 다시 올려 드립니다." },
          { who: "Aistb", text: "내일은 인사팀 의뢰 세 건입니다. 오늘 것으로 전부 됩니다." },
        ],
      },
      {
        lines: [{ who: "Aistb", text: "수고하셨습니다. 이것으로 금일 업무가 종료되었습니다. 내일뵙겠습니다." }],
        menu: ["end"],
        nudge: "업무 종료를 누르시면 오늘 일과가 끝납니다.",
        wait: function () {
          return false;
        },
      },
    ],
  },

  diary: [
    "421950년 10월 5일.",
    "",
    "오늘은 Pandas. 표에 이름이 붙어 있어서 번호를 안 세도 된다.",
    "",
    "조건을 쓰면 값이 나올 줄 알았는데 참, 거짓, 참, 거짓이 줄줄이 나왔다.",
    "그걸 다시 대괄호에 넣는다는 게 아직도 좀 이상하다.",
    "이상하지만 되긴 된다. 되는 걸 계속 쓰다 보면 이상하지 않아진다고 한다.",
    "",
    "그런데 배열에서 똑같은 걸 했었다. 그때도 참, 거짓이 나왔다.",
    "같은 방법이 이름 붙은 표에도 그대로 있는 거였다.",
    "",
    "Aistb가 오늘도 정정을 하지 않았다. 이제는 기다리게 된다.",
  ],
};
