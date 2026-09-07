// 2장 — Pandas. 이름이 섞인 표를 다룬다.
// 진행 방식은 1장과 같다. 연습 파일을 한 문장씩 실행하며 결과를 본 뒤 의뢰를 받는다.
var CH02 = {
  id: "ch02",
  title: "2 · 이름이 붙은 표",
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
      {
        lines: [
          { who: "Aistb", text: "좋은 아침입니다, 토이비님. 어제 하신 세 건은 배차 2팀에서 잘 받았다고 합니다." },
          { who: "Aistb", text: "오늘 자료에는 숫자만 있는 것이 아닙니다. 사람 이름이 섞여 있습니다." },
          { who: "Aistb", text: "NumPy 배열은 숫자를 담는 그릇입니다. 글자가 섞이면 Pandas 를 씁니다. 오늘 배우실 것입니다." },
        ],
      },

      // ── 연습 ────────────────────────────────────────
      {
        addFiles: [
          {
            path: "work/참고/pandas_요약.md",
            readOnly: true,
            open: 1,
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
          },
          {
            path: "work/연습/04_이름붙은표.py",
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
        wait: steppedTo("work/연습/04_이름붙은표.py", 3),
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
        wait: steppedTo("work/연습/04_이름붙은표.py", 5),
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
        wait: steppedTo("work/연습/04_이름붙은표.py", 6),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "값이 나올 줄 아셨을 텐데 참과 거짓이 줄줄이 나왔습니다. 이 식은 고르는 것이 아니라 줄마다 조건에 맞는지를 답한 것입니다.",
            spot: { text: "dtype: bool", in: ".out" },
          },
          { who: "Aistb", text: "그 답을 다시 대괄호에 넣으면 그때 골라집니다. 한 번 더 눌러 확인해 보세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/연습/04_이름붙은표.py", 7),
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
        wait: steppedTo("work/연습/04_이름붙은표.py", 9),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "열 하나의 평균은 그 열 뒤에 mean() 을 붙이면 됩니다. 어제 배열에 하신 것과 같습니다.",
            spot: { text: 'df["count"].mean()', in: ".doc" },
          },
          {
            who: "Aistb",
            text: "groupby 는 같은 값끼리 묶습니다. team 으로 묶고 count 열의 평균을 내면 팀마다 한 줄씩 나옵니다.",
            spot: { text: 'df.groupby("team")["count"].mean()', in: ".doc" },
          },
        ],
      },

      // ── 의뢰 1 ──────────────────────────────────────
      {
        lines: [{ who: "Aistb", text: "첫 번째 의뢰입니다." }],
        addFiles: [
          {
            path: "work/의뢰_0005.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0005 — 우수 배달원 집계\n" +
              "\n" +
              "발신: 인사팀\n" +
              "수신: 깁스 W 토이비\n" +
              "\n" +
              "## 상황\n" +
              "이번 달 배달원 여섯 명의 실적입니다.\n" +
              "\n" +
              "## 할 일\n" +
              "- busy   : 배달 건수가 30 이상인 사람만 남긴 표\n" +
              "- how_many : 그런 사람이 몇 명인지\n" +
              "\n" +
              "work/task_05/busy.py 를 채우고 실행한 뒤 완료 보고.\n" +
              "\n" +
              "## 참고\n" +
              "줄이 몇 개인지는 len 으로 셉니다.\n",
          },
          {
            path: "work/task_05/busy.py",
            open: 0,
            content:
              "import pandas as pd\n" +
              "\n" +
              "df = pd.DataFrame({\n" +
              '    "name":  ["가온", "노을", "다움", "라온", "마루", "바다"],\n' +
              '    "count": [41, 22, 35, 30, 18, 47],\n' +
              '    "team":  ["A", "B", "A", "B", "A", "B"],\n' +
              "})\n" +
              "\n" +
              "busy = ...       # 30건 이상인 사람만\n" +
              "how_many = ...   # 그런 사람이 몇 명\n" +
              "\n" +
              "print(busy)\n" +
              "print(how_many)\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0005.md"]',
        menu: ["brief"],
        nudge: "저를 눌러 의뢰 확인을 고르시면 의뢰서가 오른쪽에 열립니다.",
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0005.md") >= 0;
          });
        },
      },
      {
        lines: [{ who: "Aistb", text: "방금 본 두 단계 그대로입니다. 채우고 실행한 뒤 완료 보고해 주세요." }],
        menu: ["brief", "report"],
        nudge: "조건을 대괄호에 넣어 고르고, 그 결과를 len 으로 세시면 됩니다.",
        report: function () {
          return checkFile(
            "work/task_05/busy.py",
            "import pandas as pd\n" +
              "for _n in ['busy', 'how_many']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 변수 이름을 그대로 두셔야 합니다.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "want = df[df['count'] >= 30]\n" +
              "assert isinstance(busy, pd.DataFrame), 'busy 가 표가 아닙니다. 조건을 대괄호에 넣으면 표가 그대로 나옵니다.'\n" +
              "assert list(busy['name']) == list(want['name']), f\"busy 에 {list(busy['name'])} 가 남았습니다. 30 이상인 사람은 {list(want['name'])} 입니다.\"\n" +
              "assert int(how_many) == len(want), f'how_many 가 {how_many} 입니다. {len(want)} 명이 나와야 합니다.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },
      { lines: [{ who: "Aistb", text: "접수했습니다." }] },

      // ── 의뢰 2 ──────────────────────────────────────
      {
        lines: [{ who: "Aistb", text: "두 번째 의뢰입니다. 같은 자료를 팀 단위로 봅니다." }],
        addFiles: [
          {
            path: "work/의뢰_0006.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0006 — 팀별 실적 정리\n" +
              "\n" +
              "발신: 인사팀\n" +
              "수신: 깁스 W 토이비\n" +
              "\n" +
              "## 할 일\n" +
              "건수가 30 이상인 사람만 남기고, 팀별 평균 건수를 구해 주세요.\n" +
              "work/task_06/team.py 의 result 를 채우고 실행한 뒤 완료 보고.\n" +
              "\n" +
              "## 참고\n" +
              "조건으로 줄을 고른 다음, 그 뒤에 묶어서 평균 내는 것을 이어 붙이면 됩니다.\n",
          },
          {
            path: "work/task_06/team.py",
            open: 0,
            content:
              "import pandas as pd\n" +
              "\n" +
              "df = pd.DataFrame({\n" +
              '    "name":  ["가온", "노을", "다움", "라온", "마루", "바다"],\n' +
              '    "count": [41, 22, 35, 30, 18, 47],\n' +
              '    "team":  ["A", "B", "A", "B", "A", "B"],\n' +
              "})\n" +
              "\n" +
              "# 30건 이상만 남기고, 팀별 평균 건수\n" +
              "result = ...\n" +
              "\n" +
              "print(result)\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0006.md"]',
        menu: ["brief"],
        nudge: "의뢰 확인을 눌러 새 의뢰서를 열어 보세요.",
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0006.md") >= 0;
          });
        },
      },
      {
        lines: [{ who: "Aistb", text: "고르는 것과 묶는 것, 두 가지를 이어 붙이면 됩니다." }],
        menu: ["brief", "report"],
        nudge: 'df[조건] 뒤에 .groupby("team")["count"].mean() 을 그대로 이어 붙이세요.',
        report: function () {
          return checkFile(
            "work/task_06/team.py",
            "import pandas as pd\n" +
              "assert not isinstance(result, type(Ellipsis)), 'result 가 아직 ... 그대로입니다.'\n" +
              "assert isinstance(result, pd.Series), '결과가 표 전체로 나왔습니다. groupby 뒤에 [\\\"count\\\"] 를 붙여 건수 열 하나만 골라 주세요.'\n" +
              "want = df[df['count'] >= 30].groupby('team')['count'].mean()\n" +
              "assert set(result.index) == set(want.index), f'팀 이름이 왼쪽에 와야 합니다. 지금 인덱스는 {list(result.index)} 입니다.'\n" +
              "for _t in want.index:\n" +
              "    assert abs(float(result[_t]) - float(want[_t])) < 0.01, f'{_t}팀 평균이 {result[_t]:.2f} 입니다. {want[_t]:.2f} 가 나와야 합니다. 30 미만인 사람이 걸러졌는지 보세요.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },

      // ── 마무리 ──────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "접수했습니다. 오늘 두 건 모두 처리되었습니다." },
          { who: "Aistb", text: "이름으로 부른다. 조건으로 고른다. 무리로 묶는다. 오늘은 이 셋입니다." },
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
    "421950년 10월 3일.",
    "",
    "오늘은 Pandas. 표에 이름이 붙어 있어서 번호를 안 세도 된다.",
    "",
    "조건을 쓰면 값이 나올 줄 알았는데 참, 거짓, 참, 거짓이 줄줄이 나왔다.",
    "그걸 다시 대괄호에 넣는다는 게 아직도 좀 이상하다.",
    "이상하지만 되긴 된다. 되는 걸 계속 쓰다 보면 이상하지 않아진다고 한다.",
    "",
    "Aistb가 오늘도 정정을 하지 않았다. 이제는 기다리게 된다.",
  ],
};
