// 3장 — 2장과 같은 날(10/3 금)의 오후. 어제 오후에 배운 둘(조건 · 줄 세우기)에
// 모양 바꾸기를 더해 쓴다. 모양 바꾸기는 1장에서 옮겨 왔다 — 배우고 바로 의뢰 0006 에서 쓴다.
// 그날 일기는 여기 하나뿐이다 — 오전(2장) 몫까지 같이 적는다.
// 마지막 한 건은 종합이다 — 한 줄에 두세 가지를 겹쳐 써야 풀린다. 오늘의 고비는 거기다.
// 2장과 마찬가지로 코드는 깔아주지 않는다. 의뢰서에 자료와 이름이 다 적혀 있다.
var CH03 = {
  id: "ch03",
  title: "3 · 겹쳐 쓰는 날",
  scenes: ["desk", "diary"],

  desk: {
    files: [{ path: NUMPY_DOC.path, content: NUMPY_DOC.content, readOnly: true }],

    idleLines: [
      "참고 문서는 work/참고/numpy_요약.md 에 있습니다.",
      "막히셨으면 저를 눌러 주세요.",
      "한 줄에 다 쓰려 하지 마시고, 중간 결과를 변수에 담아 두고 보셔도 됩니다.",
    ],
    errorLines: [
      "코드가 도중에 멈췄습니다. 아래 빨간 글씨의 마지막 줄부터 읽어보세요.",
      "실행이 끝까지 가지 못했습니다. 대괄호가 짝이 맞는지 보시죠.",
      "에러입니다. 겹쳐 쓰신 것을 두 줄로 나눠서 하나씩 확인해 보세요.",
    ],

    beats: [
      // ── 아침 ────────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "식사는 하셨습니까. 점심 동안 정비 1팀과 배차 2팀에서 세 건이 더 들어왔습니다." },
        ],
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
      },

      // ── 개념: 만들기와 모양 바꾸기 (1장에서 옮겨 옴) ──
      {
        addFiles: [
          {
            path: "work/예제/06_모양바꾸기.py",
            open: 0,
            content:
              "import numpy as np\n" +
              "\n" +
              'print("0부터 아홉까지:", np.arange(10))\n' +
              'print("0이 다섯 개  :", np.zeros(5))\n' +
              "\n" +
              "hours = np.arange(12)\n" +
              'print("생김새 :", hours.shape)\n' +
              "\n" +
              "block = hours.reshape(4, 3)\n" +
              "print(block)\n" +
              'print("생김새 :", block.shape)\n' +
              'print("행별 합:", block.sum(axis=1))\n',
          },
        ],
        lines: [
          { who: "Aistb", text: "그 전에 하나 더입니다. 긴 기록은 손으로 적을 수 없습니다." },
          { who: "Aistb", text: "세 번 눌러 주세요." },
        ],
        spot: ".step",
        nudge: "↓ 한 문장 버튼을 세 번 누르시면 두 줄이 출력됩니다.",
        wait: steppedTo("work/예제/06_모양바꾸기.py", 3),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "10을 넣으면 9까지입니다.",
            spot: { text: "np.arange(10)", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "0. 은 소수점이 있는 0입니다.",
            spot: { text: "0이 다섯 개", in: ".out" },
          },
          { who: "Aistb", text: "네 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/06_모양바꾸기.py", 7),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "열두 개가 4행 3열이 되었습니다.",
            spot: { text: "arr.reshape(4, 3)", in: ".doc" },
          },
          { who: "Aistb", text: "개수가 맞지 않으면 에러입니다." },
          { who: "Aistb", text: "남은 두 줄은 ▶ 실행으로 보시죠." },
        ],
        spot: ".run",
        wait: steppedTo("work/예제/06_모양바꾸기.py", 9),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "행별 합이 네 개 나왔습니다. 어제의 axis 입니다.",
            spot: { text: "행별 합", in: ".out" },
          },
          { who: "Aistb", text: "긴 기록을 덩어리로 잘라 볼 때 이 둘을 같이 씁니다." },
        ],
      },

      // ── 실습 4 ──────────────────────────────────────
      {
        addFiles: [
          {
            path: "work/실습/04_모양.py",
            open: 0,
            content:
              "import numpy as np\n" +
              "\n" +
              "# 1) 0부터 11까지 열두 개짜리 배열을 nums 에 넣으세요\n" +
              "nums = ...\n" +
              "\n" +
              "# 2) nums 를 3행 4열로 바꿔 table 에 넣으세요\n" +
              "table = ...\n" +
              "\n" +
              "# 3) table 의 열별 합계(세로)를 col_sum 에 넣으세요\n" +
              "col_sum = ...\n",
          },
        ],
        lines: [{ who: "Aistb", text: "실습 과제입니다. 세 번째는 axis 입니다. 다 되면 완료 보고입니다." }],
        menu: ["report"],
        nudge: "열별은 세로입니다. 참고 문서의 axis 항목을 보세요.",
        report: function () {
          return checkFile(
            "work/실습/04_모양.py",
            drillCheck([
              ["nums", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]],
              ["table", [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]]],
              ["col_sum", [12, 15, 18, 21]],
            ])
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },


      // ── 의뢰 1: 과열 부품 ───────────────────────────
      {
        lines: [{ who: "Aistb", text: "첫 번째 의뢰입니다." }],
        addFiles: [
          {
            path: "work/의뢰_0005.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0005 — 과열 부품 추리기\n" +
              "\n" +
              "발신: 정비 1팀\n" +
              "수신: 깁스 W 토이비\n" +
              "\n" +
              "## 상황\n" +
              "배달 로봇 여덟 대의 관절 온도입니다. 80도부터는 과열로 봅니다.\n" +
              "순서는 1966호, 1972호, 1986호, 1997호, 2011호, 2012호, 2016호, 2017호입니다.\n" +
              "\n" +
              "  온도 : 61, 84, 73, 92, 58, 80, 77, 88\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_05/heat.py 를 만들고 아래 세 가지를 채워 주세요.\n" +
              "\n" +
              "- hot       : 80도 이상인 온도만\n" +
              "- hot_count : 그런 부품이 몇 개\n" +
              "- cooled    : 80도 이상은 80으로 낮추고 나머지는 그대로 둔 기록\n" +
              "\n" +
              "## 참고\n" +
              "cooled 는 개수가 줄지 않습니다. 여덟 개 그대로 나와야 합니다.\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0005.md"]',
        menu: ["brief"],
        nudge: "저를 눌러 의뢰 확인을 고르시면 의뢰서가 열립니다.",
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0005.md") >= 0;
          });
        },
      },
      {
        lines: [{ who: "Aistb", text: "어제 실습 과제로 푸신 세 가지와 같습니다." }],
        menu: ["brief", "report"],
        nudge: "고르기는 대괄호, 개수는 sum, 값을 바꾸는 것은 where 입니다.",
        report: function () {
          return checkFile(
            "work/task_05/heat.py",
            "import numpy as np\n" +
              "for _n in ['hot', 'hot_count', 'cooled']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "temps = np.array([61, 84, 73, 92, 58, 80, 77, 88])\n" +
              "want = temps[temps >= 80]\n" +
              "assert np.asarray(hot).dtype != bool, 'hot 에 참/거짓 목록이 들어 있습니다. 그것을 다시 대괄호에 넣으셔야 값이 골라집니다.'\n" +
              "assert np.array_equal(np.asarray(hot), want), f'hot 이 {np.asarray(hot)} 입니다. 80 이상인 온도는 {want} 입니다.'\n" +
              "assert int(hot_count) == len(want), f'hot_count 가 {hot_count} 입니다. {len(want)} 개가 나와야 합니다.'\n" +
              "_c = np.asarray(cooled)\n" +
              "assert _c.shape == temps.shape, f'cooled 가 {_c.shape} 입니다. 값을 골라내지 마시고 바꾸기만 하셔야 여덟 개가 그대로 남습니다.'\n" +
              "assert np.array_equal(_c, np.where(temps >= 80, 80, temps)), f'cooled 가 {_c} 입니다. 80 이상만 80이 되고 나머지는 그대로여야 합니다.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },
      { lines: [{ who: "Aistb", text: "접수했습니다." }] },

      // ── 의뢰 2: 하루 기록 ───────────────────────────
      {
        lines: [{ who: "Aistb", text: "두 번째 의뢰입니다." }],
        addFiles: [
          {
            path: "work/의뢰_0006.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0006 — 반나절 기록을 세 시간씩\n" +
              "\n" +
              "발신: 배차 2팀\n" +
              "수신: 깁스 W 토이비\n" +
              "\n" +
              "## 상황\n" +
              "어제 낮 열두 시간의 배달 건수입니다. 한 시간에 하나씩, 순서대로 열두 개입니다.\n" +
              "\n" +
              "  건수 : 0, 1, 2, 5, 9, 14, 11, 21, 18, 15, 4, 1\n" +
              "\n" +
              "세 시간을 한 덩어리로 봅니다. 덩어리는 모두 네 개가 됩니다.\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_06/half.py 를 만들고 아래 네 가지를 채워 주세요.\n" +
              "\n" +
              "- blocks   : 열두 개를 4행 3열로 바꾼 것\n" +
              "- by_block : 덩어리별 합계 (네 개)\n" +
              "- busiest  : 가장 바쁜 덩어리가 몇 번째인지 (0부터)\n" +
              "- quiet    : 건수가 3 이하인 시간이 몇 시간인지\n" +
              "\n" +
              "## 참고\n" +
              "quiet 은 덩어리가 아니라 원래 열두 개에서 세십니다.\n",
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
        lines: [
          { who: "Aistb", text: "모양을 바꾸고, 행별로 더하고, 자리를 찾고, 조건으로 셉니다." },
        ],
        menu: ["brief", "report"],
        nudge: "덩어리별 합계는 행별이니 axis=1 입니다.",
        report: function () {
          return checkFile(
            "work/task_06/half.py",
            "import numpy as np\n" +
              "for _n in ['blocks', 'by_block', 'busiest', 'quiet']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "log = np.array([0, 1, 2, 5, 9, 14, 11, 21, 18, 15, 4, 1])\n" +
              "_b = np.asarray(blocks)\n" +
              "assert _b.shape == (4, 3), f'blocks 가 {_b.shape} 입니다. 4행 3열이어야 합니다.'\n" +
              "assert np.array_equal(_b, log.reshape(4, 3)), 'blocks 안의 숫자 순서가 의뢰서와 다릅니다. reshape 는 순서를 바꾸지 않습니다.'\n" +
              "_w = log.reshape(4, 3).sum(axis=1)\n" +
              "assert np.shape(by_block) == (4,), f'by_block 이 {np.shape(by_block)} 입니다. 덩어리마다 하나씩 네 개여야 합니다. 행별 합계는 axis=1 입니다.'\n" +
              "assert np.array_equal(np.asarray(by_block), _w), f'by_block 이 {np.asarray(by_block)} 입니다. {_w} 가 나와야 합니다.'\n" +
              "assert int(busiest) == int(_w.argmax()), f'busiest 가 {busiest} 입니다. 값이 아니라 몇 번째 덩어리인지를 넣으셔야 합니다. arg 가 붙은 것을 쓰시면 됩니다.'\n" +
              "assert int(quiet) == int((log <= 3).sum()), f'quiet 이 {quiet} 입니다. 3 이하인 시간은 {int((log <= 3).sum())} 시간입니다.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },
      { lines: [{ who: "Aistb", text: "접수했습니다. 한 건 남았습니다." }] },

      // ── 의뢰 3: 종합 ────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "마지막 의뢰입니다. 이번 것은 한 줄에 두세 가지를 겹쳐 쓰셔야 합니다." },
        ],
        addFiles: [
          {
            path: "work/의뢰_0007.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0007 — 로봇 네 대 종합 점검표\n" +
              "\n" +
              "발신: 정비 1팀\n" +
              "수신: 깁스 W 토이비\n" +
              "\n" +
              "## 상황\n" +
              "로봇 네 대의 하루 기록입니다. 행 하나가 로봇 한 대, 열은 시간대 0~3번의 배달 건수입니다.\n" +
              "이름은 행과 같은 순서입니다.\n" +
              "\n" +
              "  이름 : 1966호, 1986호, 2012호, 2017호\n" +
              "\n" +
              "  1966호 :  8, 15,  9,  4\n" +
              "  1986호 : 11, 20, 12,  7\n" +
              "  2012호 :  5, 11,  6,  3\n" +
              "  2017호 : 13, 22, 15,  8\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_07/robots.py 를 만들고 아래 네 가지를 채워 주세요.\n" +
              "\n" +
              "- totals      : 로봇마다 하루 합계 (네 개)\n" +
              "- busy_names  : 하루 합계가 50 이상인 로봇의 이름\n" +
              "- top2        : 합계가 많은 순서로 로봇 이름 두 대\n" +
              "- peak_slot   : 네 대를 합쳐 가장 바쁜 시간대가 몇 번 열인지\n" +
              "\n" +
              "## 참고\n" +
              "네 가지 모두 배우신 것들의 조합입니다. 새 함수는 없습니다.\n" +
              "이름은 글자이므로 np.array([\"1966호\", ...]) 처럼 따옴표를 붙여 담습니다.\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0007.md"]',
        menu: ["brief"],
        nudge: "의뢰 확인을 눌러 마지막 의뢰서를 열어 보세요.",
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0007.md") >= 0;
          });
        },
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "참/거짓 목록은 다른 배열의 대괄호에도 넣을 수 있습니다.",
            spot: { text: "arr[arr >= 80]", in: ".doc" },
          },
          { who: "Aistb", text: "합계로 만든 참/거짓을 이름 쪽 대괄호에 넣으면, 그 조건에 맞는 이름만 남습니다." },
        ],
        menu: ["brief", "report"],
        nudge: "totals 를 먼저 만들어 두고, busy_names 는 names[조건], top2 는 자리 번호로 이름을 꺼내시면 됩니다.",
        report: function () {
          return checkFile(
            "work/task_07/robots.py",
            "import numpy as np\n" +
              "for _n in ['totals', 'busy_names', 'top2', 'peak_slot']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "_names = np.array(['1966호', '1986호', '2012호', '2017호'])\n" +
              "_log = np.array([[8, 15, 9, 4], [11, 20, 12, 7], [5, 11, 6, 3], [13, 22, 15, 8]])\n" +
              "_t = _log.sum(axis=1)\n" +
              "assert np.shape(totals) == (4,), f'totals 가 {np.shape(totals)} 입니다. 로봇마다 하나씩 네 개여야 합니다. 행별 합계는 axis=1 입니다.'\n" +
              "assert np.array_equal(np.asarray(totals), _t), f'totals 가 {np.asarray(totals)} 입니다. {_t} 가 나와야 합니다.'\n" +
              "_busy = _names[_t >= 50]\n" +
              "assert np.asarray(busy_names).dtype.kind in 'US', f'busy_names 에 이름이 아니라 {np.asarray(busy_names)} 가 들어 있습니다. 조건으로 만든 참/거짓을 이름 배열의 대괄호에 넣어 보세요.'\n" +
              "assert list(busy_names) == list(_busy), f'busy_names 가 {np.asarray(busy_names)} 입니다. 합계가 50 이상인 로봇은 {_busy} 입니다.'\n" +
              "_order = np.argsort(_t)[::-1]\n" +
              "assert len(list(top2)) == 2, f'top2 가 {len(list(top2))} 대입니다. 두 대만 남기셔야 합니다.'\n" +
              "assert list(top2) != list(_names[np.argsort(_t)][:2]), '적은 순서로 뽑으셨습니다. 뒤집는 것을 빠뜨리지 않으셨는지 보세요.'\n" +
              "assert list(top2) == list(_names[_order][:2]), f'top2 가 {np.asarray(top2)} 입니다. 많은 순서로는 {_names[_order][:2]} 입니다.'\n" +
              "_slot = _log.sum(axis=0)\n" +
              "assert int(peak_slot) != int(_t.argmax()), 'peak_slot 은 로봇이 아니라 시간대입니다. 세로로 더하셔야 합니다(axis=0).'\n" +
              "assert int(peak_slot) == int(_slot.argmax()), f'peak_slot 이 {peak_slot} 입니다. 시간대별 합계는 {_slot} 이므로 {int(_slot.argmax())}번 열이 가장 바쁩니다.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },

      // ── 마무리 ──────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "접수했습니다. 여섯 건 다 끝났습니다." },
        ],
      },
      {
        lines: [{ who: "Aistb", text: "수고하셨습니다. 이것으로 금일 업무가 종료되었습니다. 월요일에 뵙겠습니다." }],
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
    "오늘부터 빈 파일에서 시작.",
    "처음엔 뭐부터 써야 되나 싶었는데 쓰고 보니 어제 친 거랑 거의 똑같았다.",
    "아니 그럼 어제 그거 미리 준 거잖아.",
    "",
    "배차 2팀에 답장 보냈더니 자동응답이 왔다.",
    "\"담당자 부재중. 복귀 예정일 미정.\"",
    "",
    "argmax 또 틀렸다. 어제도 여기서 틀렸는데.",
    "값이 아니라 자리를 준다니까. 자리를. 이제 진짜 안 틀린다.",
    "",
    "오후 마지막 게 어려웠다. 근데 새로 나온 건 하나도 없었다. 그게 더 짜증난다.",
    "다 아는 건데 붙이려니까 손이 안 움직였다.",
    "",
    "Aistb가 totals 부터 만들라고 했다. 그러니까 나머지는 그냥 얹으면 됐다.",
    "아니 그럼 그걸 처음부터 말해주지.",
  ],
};
