// 4장 — Pandas를 배우는 날. 이름이 섞인 표를 다룬다. 의뢰는 오지 않는다.
// 진행 방식은 1장과 같다. 예제 파일을 한 문장씩 실행하며 결과를 본 뒤, 실습 과제로 굳힌다.

// 배우는 날과 푸는 날 양쪽에서 같은 것을 내려준다.
var PANDAS_DOC = {
  path: "work/참고/pandas_요약.md",
  readOnly: true,
  content:
    "# Pandas 요약\n" +
    "\n" +
    "import pandas as pd 로 가져옵니다. df 는 표입니다.\n" +
    "표의 세로 한 줄을 열이라고 부르고, 열마다 이름이 붙어 있습니다.\n" +
    "\n" +
    "## 만들기와 훑어보기\n" +
    "pd.DataFrame(딕셔너리) — 열 이름과 값 목록으로 표를 만듭니다.\n" +
    "df.head(3) — 앞에서 세 행만 봅니다. 표가 길 때 씁니다.\n" +
    "len(df) — 행이 몇 개인지.\n" +
    "\n" +
    "## 열 고르기\n" +
    'df["count"] — count 열 하나. 값이 세로로 늘어선 목록이 나옵니다(Series).\n' +
    'df[["name", "count"]] — 두 열. 대괄호가 두 겹이면 결과도 표입니다.\n' +
    "\n" +
    "## 조건으로 행 고르기\n" +
    'df["count"] >= 30 — 행마다 참/거짓이 나옵니다.\n' +
    'df[df["count"] >= 30] — 그 참/거짓을 다시 대괄호에 넣으면 참인 행만 남습니다.\n' +
    "\n" +
    "## 계산\n" +
    'df["count"].mean() — 그 열의 평균. sum() max() min() 도 같습니다.\n' +
    'df.groupby("team") — team 이 같은 것끼리 묶습니다.\n' +
    'df.groupby("team")["count"].mean() — 묶은 뒤 count 열의 평균. 무리마다 한 행씩 나옵니다.\n' +
    "\n" +
    "## 줄 세우기\n" +
    'df.sort_values("count") — count 열을 기준으로 작은 것부터 늘어놓은 새 표.\n' +
    'df.sort_values("count", ascending=False) — 큰 것부터.\n' +
    "df.head(2) — 앞에서 두 행. 줄 세운 뒤에 붙이면 상위 두 개가 됩니다.\n",
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
          { who: "Aistb", text: "오늘 자료에는 숫자만 있는 것이 아닙니다. 사람 이름이 섞여 있습니다." },
          { who: "Aistb", text: "NumPy 배열은 숫자를 담는 그릇입니다. 글자가 섞이면 Pandas 를 씁니다." },
        ],
      },

      // ── 예제 ────────────────────────────────────────
      {
        addFiles: [
          {
            path: PANDAS_DOC.path,
            readOnly: true,
            open: 1,
            content: PANDAS_DOC.content,
          },
          {
            path: "work/예제/07_이름붙은표.py",
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
              'print(df[df["count"] >= 30])\n',
          },
        ],
        lines: [
          { who: "Aistb", text: "예제 파일입니다. 어제처럼 한 문장씩 보시겠습니다. 세 번 눌러 표가 나올 때까지 가 주세요." },
          { who: "Aistb", text: "처음 한 번은 Pandas 를 가져오느라 몇 초 걸립니다." },
        ],
        spot: ".step",
        nudge: "아래의 ↓ 한 문장 버튼입니다.",
        wait: steppedTo("work/예제/07_이름붙은표.py", 3),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "pd.DataFrame 에 딕셔너리를 넣으면 표가 됩니다. 열 이름이 위에, 행 번호가 왼쪽에 붙습니다.",
            spot: { text: "pd.DataFrame(딕셔너리)", in: ".doc" },
          },
          { who: "Aistb", text: "열을 고르는 두 가지를 보시겠습니다. 두 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/07_이름붙은표.py", 5),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "열 하나를 부를 때는 이름을 대괄호에 넣습니다. 번호가 아니라 이름으로 부르는 것이 NumPy 와 다른 점입니다.",
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
        wait: steppedTo("work/예제/07_이름붙은표.py", 6),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "값이 나올 줄 아셨을 텐데 참과 거짓이 줄줄이 나왔습니다. 이 식은 고르는 것이 아니라 행마다 조건에 맞는지를 답한 것입니다.",
            spot: { text: "dtype: bool", in: ".out" },
          },
          { who: "Aistb", text: "어제 배열에서 하신 것과 같은 방법입니다. 한 번 더 눌러 확인해 보세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/07_이름붙은표.py", 7),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "참인 행만 남았습니다. 두 단계가 하나로 붙어 있는 것뿐입니다. 안쪽이 참/거짓을 만들고, 바깥쪽이 그것으로 고릅니다.",
            spot: { text: 'df[df["count"] >= 30]', in: ".doc" },
          },
        ],
      },

      // ── 예제 2: 묶기와 줄 세우기 ────────────────────
      {
        addFiles: [
          {
            path: "work/예제/08_묶고세우기.py",
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
              'print(df["count"].mean())\n' +
              'print(df.groupby("team")["count"].mean())\n' +
              "\n" +
              'print(df.sort_values("count"))\n' +
              'print(df.sort_values("count", ascending=False))\n' +
              'print(df.sort_values("count", ascending=False).head(2))\n',
          },
        ],
        lines: [
          { who: "Aistb", text: "묶는 것과 줄 세우는 것이 남았습니다. 네 번 눌러 주세요." },
        ],
        spot: ".step",
        nudge: "아래의 ↓ 한 문장 버튼입니다.",
        wait: steppedTo("work/예제/08_묶고세우기.py", 4),
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
            text: "groupby 는 같은 값끼리 묶습니다. team 으로 묶고 count 열의 평균을 내면 팀마다 한 행씩 나옵니다.",
            spot: { text: 'df.groupby("team")["count"].mean()', in: ".doc" },
          },
          { who: "Aistb", text: "줄 세우기가 남았습니다. 두 번 더 눌러 주세요." },
        ],
        spot: ".step",
        nudge: "↓ 한 문장 버튼을 두 번 더 누르시면 줄 세운 표가 나옵니다.",
        wait: steppedTo("work/예제/08_묶고세우기.py", 6),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "sort_values 에 기준이 될 열 이름을 넣으면 그 열로 줄을 세웁니다. 이름과 팀도 따라 움직입니다.",
            spot: { text: 'df.sort_values("count")', in: ".doc" },
          },
          {
            who: "Aistb",
            text: "어제 배열에서는 값만 늘어서고 누구 것인지는 사라졌습니다. 표는 행이 통째로 따라오므로 그 걱정이 없습니다.",
          },
          {
            who: "Aistb",
            text: "ascending=False 를 붙이면 큰 것부터입니다. 마지막 한 줄은 ▶ 실행으로 보시죠.",
            spot: { text: 'df.sort_values("count", ascending=False)', in: ".doc" },
          },
        ],
        spot: ".run",
        nudge: "▶ 실행을 누르면 마지막 문장이 실행됩니다.",
        wait: steppedTo("work/예제/08_묶고세우기.py", 7),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "줄을 세운 뒤 head 를 붙이면 앞에서 몇 개만 남습니다. 큰 것부터 둘입니다.",
            spot: { text: "df.head(2)", in: ".doc" },
          },
          { who: "Aistb", text: "어제 뒤집고 앞에서 둘을 자르신 것과 같은 자리입니다. 표에서는 두 단계로 끝납니다." },
        ],
      },

      // ── 실습 1 ──────────────────────────────────────
      {
        addFiles: [
          {
            path: "work/실습/05_고르기.py",
            open: 0,
            content:
              "import numpy as np   # 아래 확인표에서 씁니다\n" +
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
          { who: "Aistb", text: "실습 과제입니다. 2번은 조건으로 행을 고른 다음, 거기서 이름 열 하나를 다시 고르시면 됩니다." },
        ],
        spot: ".run",
        nudge: "조건을 대괄호에 넣어 고르고, 행 수는 len 으로 셉니다.",
        wait: solvedDrill("work/실습/05_고르기.py"),
      },

      // ── 실습 2 ──────────────────────────────────────
      {
        addFiles: [
          {
            path: "work/실습/06_묶고세우기.py",
            open: 0,
            content:
              "import numpy as np   # 아래 확인표에서 씁니다\n" +
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
              "\n" +
              "# 4) 건수가 많은 순서로 두 명의 이름을 top2 에 넣으세요\n" +
              "top2 = ...\n" +
              DRILL_CHECKER +
              "확인('1번', avg, 25.5)\n" +
              "확인('2번', by_team, [21.0, 30.0])\n" +
              "확인('3번', team_sum, [42, 60])\n" +
              "확인('4번', top2, ['라온', '다움'])\n" +
              DRILL_TAIL,
          },
        ],
        lines: [
          { who: "Aistb", text: "마지막 실습 과제입니다. 평균 대신 합계가 필요하면 mean 자리에 sum 을 넣으시면 됩니다." },
          { who: "Aistb", text: "4번은 줄을 세운 뒤 이름 열만 남기시면 됩니다." },
        ],
        spot: ".run",
        nudge: '묶는 것은 df.groupby("team")["count"] 뒤에 .mean() 이나 .sum(), 줄 세우기는 df.sort_values("count", ascending=False) 입니다.',
        wait: solvedDrill("work/실습/06_묶고세우기.py"),
      },

      // ── 마무리 ──────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "이름으로 부른다. 조건으로 고른다. 무리로 묶는다. 줄 세워서 뽑는다. 오늘은 이 넷입니다." },
          { who: "Aistb", text: "내일은 인사팀 의뢰 세 건입니다." },
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
    "421950년 10월 5일.",
    "",
    "조건을 쓰면 값이 나올 줄 알았는데 참 거짓 참 거짓이 줄줄이 나왔다.",
    "그걸 또 대괄호에 넣으란다. 대괄호 안에 대괄호. 근데 되네.",
    "",
    "그러고 보니 배열에서도 똑같았다. 그때도 참 거짓이 나왔었다.",
    "같은 거였잖아. 알아채는 데 이틀 걸렸다.",
    "",
    "Aistb가 오늘도 정정을 안 했다.",
    "첫날엔 그렇게 하더니. 이제 좀 기다리게 된다.",
  ],
};
