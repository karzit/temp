// 4장 — Pandas를 쓰는 날. 어제 배운 것으로 인사팀 의뢰 세 건을 처리한다.
var CH04 = {
  id: "ch04",
  title: "4 · 표로 일하는 날",
  scenes: ["desk", "diary"],

  desk: {
    files: [{ path: PANDAS_DOC.path, content: PANDAS_DOC.content, readOnly: true }],

    idleLines: [
      "참고 문서는 work/참고/pandas_요약.md 에 있습니다. 어제 것과 같습니다.",
      "막히셨으면 저를 눌러 주세요.",
      "열 이름의 철자가 한 글자만 달라도 표는 못 찾습니다.",
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
          { who: "Aistb", text: "좋은 아침입니다, 토이비님. 오늘은 인사팀 세 건입니다." },
          { who: "Aistb", text: "어제 배우신 것만으로 전부 됩니다. 참고 문서도 그대로 올려 두었습니다." },
          { who: "Aistb", text: "자료는 세 건 모두 같은 표입니다. 배달원 여섯 명의 이번 달 실적입니다." },
        ],
        show: [{ path: PANDAS_DOC.path, pane: 1 }],
      },

      // ── 의뢰 1 ──────────────────────────────────────
      {
        lines: [{ who: "Aistb", text: "첫 번째 의뢰입니다." }],
        addFiles: [
          {
            path: "work/의뢰_0008.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0008 — 우수 배달원 집계\n" +
              "\n" +
              "발신: 인사팀\n" +
              "수신: 깁스 W 토이비\n" +
              "\n" +
              "## 상황\n" +
              "이번 달 배달원 여섯 명의 실적입니다.\n" +
              "\n" +
              "## 할 일\n" +
              "- busy     : 배달 건수가 30 이상인 사람만 남긴 표\n" +
              "- how_many : 그런 사람이 몇 명인지\n" +
              "\n" +
              "work/task_08/busy.py 를 채우고 실행한 뒤 완료 보고.\n" +
              "\n" +
              "## 참고\n" +
              "줄이 몇 개인지는 len 으로 셉니다.\n",
          },
          {
            path: "work/task_08/busy.py",
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
        spot: '.tree-row[data-path="work/의뢰_0008.md"]',
        menu: ["brief"],
        nudge: "저를 눌러 의뢰 확인을 고르시면 의뢰서가 오른쪽에 열립니다.",
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0008.md") >= 0;
          });
        },
      },
      {
        lines: [{ who: "Aistb", text: "어제 익힘 문제로 푸신 두 단계 그대로입니다. 채우고 실행한 뒤 완료 보고해 주세요." }],
        menu: ["brief", "report"],
        nudge: "조건을 대괄호에 넣어 고르고, 그 결과를 len 으로 세시면 됩니다.",
        report: function () {
          return checkFile(
            "work/task_08/busy.py",
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
            path: "work/의뢰_0009.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0009 — 팀별 실적 정리\n" +
              "\n" +
              "발신: 인사팀\n" +
              "수신: 깁스 W 토이비\n" +
              "\n" +
              "## 할 일\n" +
              "건수가 30 이상인 사람만 남기고, 팀별 평균 건수를 구해 주세요.\n" +
              "work/task_09/team.py 의 result 를 채우고 실행한 뒤 완료 보고.\n" +
              "\n" +
              "## 참고\n" +
              "조건으로 줄을 고른 다음, 그 뒤에 묶어서 평균 내는 것을 이어 붙이면 됩니다.\n",
          },
          {
            path: "work/task_09/team.py",
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
        spot: '.tree-row[data-path="work/의뢰_0009.md"]',
        menu: ["brief"],
        nudge: "의뢰 확인을 눌러 새 의뢰서를 열어 보세요.",
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0009.md") >= 0;
          });
        },
      },
      {
        lines: [{ who: "Aistb", text: "고르는 것과 묶는 것, 두 가지를 이어 붙이면 됩니다." }],
        menu: ["brief", "report"],
        nudge: 'df[조건] 뒤에 .groupby("team")["count"].mean() 을 그대로 이어 붙이세요.',
        report: function () {
          return checkFile(
            "work/task_09/team.py",
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
      { lines: [{ who: "Aistb", text: "접수했습니다. 한 건 남았습니다." }] },

      // ── 의뢰 3 ──────────────────────────────────────
      {
        lines: [{ who: "Aistb", text: "마지막 의뢰입니다. 거르는 것 없이 전체를 봅니다." }],
        addFiles: [
          {
            path: "work/의뢰_0010.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0010 — 이번 달 마감 요약\n" +
              "\n" +
              "발신: 인사팀\n" +
              "수신: 깁스 W 토이비\n" +
              "\n" +
              "## 할 일\n" +
              "여섯 명 전체를 대상으로 두 가지를 구해 주세요.\n" +
              "\n" +
              "- total_avg   : 전체 평균 건수\n" +
              "- by_team_sum : 팀별 합계 건수\n" +
              "\n" +
              "work/task_10/summary.py 를 채우고 실행한 뒤 완료 보고.\n" +
              "\n" +
              "## 참고\n" +
              "평균 대신 합계가 필요하면 mean 자리에 sum 을 넣습니다.\n",
          },
          {
            path: "work/task_10/summary.py",
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
              "total_avg = ...     # 여섯 명 전체의 평균 건수\n" +
              "by_team_sum = ...   # 팀별 합계 건수\n" +
              "\n" +
              "print(total_avg)\n" +
              "print(by_team_sum)\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0010.md"]',
        menu: ["brief"],
        nudge: "의뢰 확인을 눌러 마지막 의뢰서를 열어 보세요.",
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0010.md") >= 0;
          });
        },
      },
      {
        lines: [{ who: "Aistb", text: "조건은 없습니다. 전체 평균 하나와 팀별 합계 하나입니다." }],
        menu: ["brief", "report"],
        nudge: '팀별 합계는 df.groupby("team")["count"].sum() 입니다.',
        report: function () {
          return checkFile(
            "work/task_10/summary.py",
            "import pandas as pd\n" +
              "for _n in ['total_avg', 'by_team_sum']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 변수 이름을 그대로 두셔야 합니다.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "_avg = df['count'].mean()\n" +
              "assert abs(float(total_avg) - float(_avg)) < 0.01, f'total_avg 가 {total_avg} 입니다. 여섯 명 전체 평균은 {_avg:.2f} 입니다. 거르지 않고 그대로 평균 내시면 됩니다.'\n" +
              "assert isinstance(by_team_sum, pd.Series), 'by_team_sum 이 표로 나왔습니다. groupby 뒤에 [\\\"count\\\"] 를 붙여 건수 열 하나만 골라 주세요.'\n" +
              "_want = df.groupby('team')['count'].sum()\n" +
              "assert set(by_team_sum.index) == set(_want.index), f'팀 이름이 왼쪽에 와야 합니다. 지금 인덱스는 {list(by_team_sum.index)} 입니다.'\n" +
              "for _t in _want.index:\n" +
              "    assert int(by_team_sum[_t]) == int(_want[_t]), f'{_t}팀이 {float(by_team_sum[_t]):.1f} 입니다. 합계는 {_want[_t]} 입니다. 평균이 아니라 합계입니다.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },

      // ── 마무리 ──────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "접수했습니다. 오늘 세 건 모두 처리되었습니다." },
          { who: "Aistb", text: "이름으로 부른다. 조건으로 고른다. 무리로 묶는다. 어제 배우신 셋이 그대로 쓰였습니다." },
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
    "인사팀 세 건. 우수 배달원, 팀별 평균, 마감 요약.",
    "",
    "배우는 날 다음에 푸는 날이 오는 게 이제 익숙하다.",
    "배울 때는 이걸 어디다 쓰나 싶은데, 다음날 그걸로만 하루가 간다.",
    "",
    "mean 자리에 sum 을 넣으면 합계가 된다는 걸 오늘 처음 써봤다.",
    "어제 참고 문서에서 본 줄인데, 읽을 때는 그냥 지나갔다.",
    "",
    "다음 주에는 무엇을 배우게 될까. 아직 안 알려준다.",
  ],
};
