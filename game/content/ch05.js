// 5장 — Pandas를 쓰는 날. 어제 배운 것으로 인사팀 의뢰 세 건을 처리한다.
// 푸는 날이므로 코드는 깔아주지 않는다. 표도 의뢰서를 보고 직접 만든다.
var CH05 = {
  id: "ch05",
  title: "5 · 표로 일하는 날",
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
          { who: "Aistb", text: "자료는 세 건 모두 같은 표입니다. 첫 의뢰서에 적힌 표를 만들어 두시면 나머지 두 건에도 그대로 쓰십니다." },
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
              "## 자료\n" +
              "이번 달 배달원 다섯 명의 실적입니다. 열 이름은 name, count, team 으로 해주세요.\n" +
              "\n" +
              "  name  : 가온, 노을, 다움, 라온, 마루\n" +
              "  count :   41,   22,   35,   30,   47\n" +
              "  team  :    A,    B,    A,    B,    B\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_08/busy.py 를 만들고, 위 자료로 표를 만든 뒤 아래 두 가지를 채워 주세요.\n" +
              "\n" +
              "- busy     : 배달 건수가 30 이상인 사람만 남긴 표\n" +
              "- how_many : 그런 사람이 몇 명인지\n" +
              "\n" +
              "## 참고\n" +
              "표는 pd.DataFrame 에 딕셔너리를 넣어 만듭니다. 줄이 몇 개인지는 len 으로 셉니다.\n",
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
        lines: [
          { who: "Aistb", text: "표부터 만드셔야 합니다. 어제 연습 파일의 첫 문장과 같은 모양입니다." },
          { who: "Aistb", text: "그다음은 어제 익힘 문제로 푸신 두 단계 그대로입니다. 다 되면 완료 보고해 주세요." },
        ],
        menu: ["brief", "report"],
        nudge: "조건을 대괄호에 넣어 고르고, 그 결과를 len 으로 세시면 됩니다.",
        report: function () {
          return checkFile(
            "work/task_08/busy.py",
            "import pandas as pd\n" +
              "for _n in ['busy', 'how_many']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "assert isinstance(busy, pd.DataFrame), 'busy 가 표가 아닙니다. 조건을 대괄호에 넣으면 표가 그대로 나옵니다.'\n" +
              "assert 'name' in busy.columns and 'count' in busy.columns, f'열 이름이 다릅니다. 지금 {list(busy.columns)} 입니다. name, count, team 으로 만들어 주세요.'\n" +
              "_want = ['가온', '다움', '라온', '마루']\n" +
              "assert list(busy['name']) == _want, f\"busy 에 {list(busy['name'])} 가 남았습니다. 30 이상인 사람은 {_want} 입니다.\"\n" +
              "assert int(how_many) == 4, f'how_many 가 {how_many} 입니다. 4 명이 나와야 합니다.'\n"
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
              "## 자료\n" +
              "의뢰 0008 과 같은 표입니다.\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_09/team.py 를 만들고, 건수가 30 이상인 사람만 남긴 뒤\n" +
              "팀별 평균 건수를 result 에 넣어 주세요.\n" +
              "\n" +
              "## 참고\n" +
              "조건으로 줄을 고른 다음, 그 뒤에 묶어서 평균 내는 것을 이어 붙이면 됩니다.\n",
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
        lines: [{ who: "Aistb", text: "고르는 것과 묶는 것, 두 가지를 이어 붙이면 됩니다." },
          { who: "Aistb", text: "표는 또 필요합니다. 앞서 만드신 파일을 열어 표 만드는 부분을 복사해 쓰셔도 됩니다. 실제 업무에서도 그렇게 합니다." }],
        menu: ["brief", "report"],
        nudge: 'df[조건] 뒤에 .groupby("team")["count"].mean() 을 그대로 이어 붙이세요.',
        report: function () {
          return checkFile(
            "work/task_09/team.py",
            "import pandas as pd\n" +
              "assert 'result' in dir(), 'result 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "assert not isinstance(result, type(Ellipsis)), 'result 가 아직 ... 그대로입니다.'\n" +
              "assert isinstance(result, pd.Series), '결과가 표 전체로 나왔습니다. groupby 뒤에 [\\\"count\\\"] 를 붙여 건수 열 하나만 골라 주세요.'\n" +
              "_want = {'A': 38.0, 'B': 38.5}\n" +
              "assert set(result.index) == set(_want), f'팀 이름이 왼쪽에 와야 합니다. 지금 인덱스는 {list(result.index)} 입니다.'\n" +
              "for _t in _want:\n" +
              "    assert abs(float(result[_t]) - _want[_t]) < 0.01, f'{_t}팀 평균이 {float(result[_t]):.2f} 입니다. {_want[_t]:.2f} 가 나와야 합니다. 30 미만인 사람이 걸러졌는지 보세요.'\n"
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
              "## 자료\n" +
              "의뢰 0008 과 같은 표입니다.\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_10/summary.py 를 만들고, 다섯 명 전체를 대상으로 두 가지를 구해 주세요.\n" +
              "\n" +
              "- total_avg   : 전체 평균 건수\n" +
              "- by_team_sum : 팀별 합계 건수\n" +
              "\n" +
              "## 참고\n" +
              "평균 대신 합계가 필요하면 mean 자리에 sum 을 넣습니다.\n",
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
              "    assert _n in dir(), f'{_n} 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "assert abs(float(total_avg) - 35.0) < 0.01, f'total_avg 가 {total_avg} 입니다. 다섯 명 전체 평균은 35.00 입니다. 거르지 않고 그대로 평균 내시면 됩니다.'\n" +
              "assert isinstance(by_team_sum, pd.Series), 'by_team_sum 이 표로 나왔습니다. groupby 뒤에 [\\\"count\\\"] 를 붙여 건수 열 하나만 골라 주세요.'\n" +
              "_want = {'A': 76, 'B': 99}\n" +
              "assert set(by_team_sum.index) == set(_want), f'팀 이름이 왼쪽에 와야 합니다. 지금 인덱스는 {list(by_team_sum.index)} 입니다.'\n" +
              "for _t in _want:\n" +
              "    assert int(by_team_sum[_t]) == _want[_t], f'{_t}팀이 {float(by_team_sum[_t]):.1f} 입니다. 합계는 {_want[_t]} 입니다. 평균이 아니라 합계입니다.'\n"
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
    "421950년 10월 6일.",
    "",
    "인사팀 세 건. 우수 배달원, 팀별 평균, 마감 요약.",
    "",
    "같은 표를 세 번 만들었다. 세 번째에는 안 보고도 썼다.",
    "처음엔 귀찮았는데, 세 번 치고 나니 손이 기억한다.",
    "",
    "mean 자리에 sum 을 넣으면 합계가 된다는 걸 오늘 처음 써봤다.",
    "어제 참고 문서에서 본 줄인데, 읽을 때는 그냥 지나갔다.",
    "",
    "다음 주에는 무엇을 배우게 될까. 아직 안 알려준다.",
  ],
};
