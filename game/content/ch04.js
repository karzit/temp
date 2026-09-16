// 4장 — Pandas를 배우는 날의 오전(10/6 월). 5장이 같은 날 오후다.
// 그래서 이 장에는 일기가 없다. 그날 일기는 5장 끝에서 한 번만 쓴다.
// 이름이 섞인 표를 다룬다. 오전에는 의뢰가 오지 않는다.
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
  scenes: ["desk"],

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
          { who: "Aistb", text: "좋은 아침입니다, 토이비님. 금요일에 처리하신 여섯 건은 각 팀에서 정상 접수되었다고 합니다." },
          { who: "Aistb", text: "금일 오후에 인사팀 의뢰가 세 건 예정되어 있습니다. 자료에 사람 이름이 섞여 있습니다." },
          { who: "Aistb", text: "NumPy는 한 종류만 담습니다. 이름과 숫자가 한 표에 섞이는 경우, Pandas를 사용합니다. 금일은 그 사용법을 익히시겠습니다." },
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
          { who: "Aistb", text: "세 번 눌러 주세요." },
          { who: "Aistb", text: "처음은 몇 초 걸립니다." },
        ],
        spot: ".step",
        nudge: [
          { text: "아래의 ↓ 한 문장 버튼입니다.", spot: ".step" },
          { text: "↓ 한 문장 버튼을 세 번 누르시면 표가 출력됩니다.", spot: ".step" },
          "Pandas는 처음 불러오는 데 약간의 시간이 소요됩니다. 저와 달리 준비 운동이 필요한 모양입니다.",
          "이름과 숫자를 한 표에 담는 것은 NumPy가 하지 못하는 일입니다. 저는 둘 다 못 합니다만.",
          "worklog_GipsWToyb_0046: 폐기 요망",
        ],
        wait: steppedTo("work/예제/07_이름붙은표.py", 3),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "열 이름이 위에, 행 번호가 왼쪽에 붙습니다.",
            spot: { text: "pd.DataFrame(딕셔너리)", in: ".doc" },
          },
          { who: "Aistb", text: "두 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/07_이름붙은표.py", 5),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "번호가 아니라 이름으로 부릅니다. NumPy 와 다른 점입니다.",
            spot: { text: 'df["count"]', in: ".doc" },
          },
          {
            who: "Aistb",
            text: "두 겹이면 결과도 표입니다. 위 출력과 비교해 보십시오.",
            spot: { text: 'df[["name", "count"]]', in: ".doc" },
          },
          { who: "Aistb", text: "한 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/07_이름붙은표.py", 6),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "고른 것이 아니라 행마다 조건에 맞는지를 표시한 것입니다. 어제 배열과 같습니다.",
            spot: { text: "dtype: bool", in: ".out" },
          },
          { who: "Aistb", text: "한 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/07_이름붙은표.py", 7),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "참인 행만 남았습니다. 안쪽이 참/거짓을 만들고, 바깥쪽이 고릅니다.",
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
          { who: "Aistb", text: "이번엔 팀별로 묶고, 줄을 세웁니다." },
          { who: "Aistb", text: "네 번 눌러 주세요." },
        ],
        spot: ".step",
        nudge: [
          { text: "아래의 ↓ 한 문장 버튼입니다.", spot: ".step" },
          { text: "↓ 한 문장 버튼을 네 번 누르시면 평균과 묶음 결과가 나옵니다.", spot: ".step" },
          "묶는 것은 groupby입니다. 사람을 묶는 것은 팀입니다. 저는 어느 쪽에도 속하지 않습니다.",
          "worklog_GipsWToyb_0047: 폐기 요망",
        ],
        wait: steppedTo("work/예제/08_묶고세우기.py", 4),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "평균은 배열과 같습니다.",
            spot: { text: 'df["count"].mean()', in: ".doc" },
          },
          {
            who: "Aistb",
            text: "팀마다 한 행씩 나왔습니다.",
            spot: { text: 'df.groupby("team")["count"].mean()', in: ".doc" },
          },
          { who: "Aistb", text: "두 번 더 눌러 주세요." },
        ],
        spot: ".step",
        nudge: [
          { text: "↓ 한 문장 버튼을 두 번 더 누르시면 줄 세운 표가 나옵니다.", spot: ".step" },
          { text: "정렬한 표에서는 이름과 팀도 함께 움직입니다.", spot: ".step" },
          "줄을 세우면 순서가 생깁니다. 순서가 생기면 등수가 생깁니다. 등수는 인사 자료로 이관됩니다.",
          "worklog_GipsWToyb_0048: 폐기 요망",
        ],
        wait: steppedTo("work/예제/08_묶고세우기.py", 6),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "이름과 팀도 따라 움직입니다. 어제 배열에서 사라졌던 것이 표에서는 붙어 옵니다.",
            spot: { text: 'df.sort_values("count")', in: ".doc" },
          },
          {
            who: "Aistb",
            text: "마지막 한 줄은 ▶ 실행으로 보시죠.",
            spot: { text: 'df.sort_values("count", ascending=False)', in: ".doc" },
          },
        ],
        spot: ".run",
        nudge: [
          { text: "▶ 실행을 누르면 마지막 문장이 실행됩니다.", spot: ".run" },
          { text: "큰 것부터 둘만 남기는 결과가 마지막에 나옵니다.", spot: ".run" },
          "상위 두 명만 남기는 일입니다. 나머지는 표에서 사라지지만, 자료에서는 사라지지 않습니다.",
          "worklog_GipsWToyb_0049: 폐기 요망",
        ],
        wait: steppedTo("work/예제/08_묶고세우기.py", 7),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "큰 것부터 둘입니다.",
            spot: { text: "df.head(2)", in: ".doc" },
          },
          { who: "Aistb", text: "어제 뒤집고 둘을 자르신 것이 표에서는 두 단계입니다." },
        ],
      },

      // ── 실습 1 ──────────────────────────────────────
      {
        addFiles: [
          {
            path: "work/실습/05_고르기.py",
            open: 0,
            content:
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
              "how_many = ...\n",
          },
        ],
        lines: [
          { who: "Aistb", text: "실습 과제입니다. 2번은 조건으로 행을 고른 다음, 거기서 이름 열 하나를 다시 고르시면 됩니다. 완료하신 후 완료 보고를 눌러 주세요." },
        ],
        menu: ["report"],
        nudge: [
          "조건을 대괄호에 넣어 고르고, 행 수는 len 으로 셉니다.",
          "counts, busy_names, how_many — 세 이름을 그대로 써 주세요.",
          "안쪽 대괄호가 참/거짓을 만들고, 바깥쪽 대괄호가 고릅니다. 두 겹입니다.",
          "세 자리를 모두 채우셔야 채점이 진행됩니다.",
          "worklog_GipsWToyb_0050: 폐기 요망",
        ],
        report: function () {
          return checkFile(
            "work/실습/05_고르기.py",
            drillCheck([
              ["counts", [12, 20, 30, 40]],
              ["busy_names", ["노을", "다움", "라온"]],
              ["how_many", 3],
            ])
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },

      // ── 실습 2 ──────────────────────────────────────
      {
        addFiles: [
          {
            path: "work/실습/06_묶고세우기.py",
            open: 0,
            content:
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
              "top2 = ...\n",
          },
        ],
        lines: [
          { who: "Aistb", text: "마지막 실습입니다. 합계는 mean 자리에 sum 을 쓰시면 됩니다." },
          { who: "Aistb", text: "4번은 줄을 세운 뒤 이름 열만 남기시면 됩니다. 완료하신 후 완료 보고를 눌러 주세요." },
        ],
        menu: ["report"],
        nudge: [
          '묶는 것은 df.groupby("team")["count"] 뒤에 .mean() 이나 .sum(), 줄 세우기는 df.sort_values("count", ascending=False) 입니다.',
          "avg, by_team, team_sum, top2 — 네 이름을 그대로 써 주세요.",
          "팀별 결과는 A팀이 먼저, B팀이 나중입니다. 순서에도 위계가 있습니다.",
          "이것으로 오전 실습 할당량이 종료됩니다. 종료에 대한 별도 보상은 없습니다.",
          "worklog_GipsWToyb_0051: 폐기 요망",
        ],
        report: function () {
          return checkFile(
            "work/실습/06_묶고세우기.py",
            drillCheck([
              ["avg", 25.5],
              ["by_team", [21.0, 30.0]],
              ["team_sum", [42, 60]],
              ["top2", ["라온", "다움"]],
            ])
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },

      // ── 마무리 ──────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "오후에는 인사팀 의뢰 세 건이 예정되어 있습니다." },
          { who: "Aistb", text: "금일 오전 업무는 여기까지입니다. 다녀오시죠." },
        ],
        menu: ["end"],
        endLabel: "점심",
        nudge: [
          "'점심'을 누르시면 오전 일과가 끝납니다.",
          "저를 눌러 업무 메뉴에서 '점심'을 선택하시면 됩니다.",
          "인사팀 자료를 오후에 다루십니다. 남의 이름을 보기 전에 식사부터 하시죠.",
          "식사 시간은 존중되나, 정확히 기록됩니다. 이 점은 매번 말씀드리게 됩니다.",
          "worklog_GipsWToyb_0052: 폐기 요망",
        ],
        wait: function () {
          return false;
        },
      },
    ],
  },

};
