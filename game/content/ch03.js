// 3장 — NumPy를 쓰는 둘째 날. 어제 오후에 배운 셋(조건 · 줄 세우기 · 모양 바꾸기)을 쓴다.
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
          { who: "Aistb", text: "좋은 아침입니다, 토이비님. 정비 1팀과 배차 2팀에서 세 건이 들어왔습니다." },
          { who: "Aistb", text: "뒤로 갈수록 겹쳐 쓰실 것이 늘어납니다." },
        ],
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
      },

      // ── 의뢰 1: 과열 부품 ───────────────────────────
      {
        lines: [{ who: "Aistb", text: "첫 번째 의뢰입니다. 정비 1팀입니다." }],
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
        nudge: "저를 눌러 의뢰 확인을 고르시면 의뢰서가 오른쪽에 열립니다.",
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0005.md") >= 0;
          });
        },
      },
      {
        lines: [{ who: "Aistb", text: "어제 익힘 문제로 푸신 세 가지와 같습니다." }],
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
      { lines: [{ who: "Aistb", text: "접수했습니다. 정비 1팀으로 넘기겠습니다." }] },

      // ── 의뢰 2: 하루 기록 ───────────────────────────
      {
        lines: [{ who: "Aistb", text: "두 번째 의뢰입니다. 이번에는 두 가지를 이어 붙이셔야 합니다." }],
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
              "- blocks   : 열두 개를 4줄 3칸으로 바꾼 것\n" +
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
          { who: "Aistb", text: "모양을 바꾸고, 줄별로 더하고, 자리를 찾고, 조건으로 셉니다. 어제 하신 것 그대로입니다." },
        ],
        menu: ["brief", "report"],
        nudge: "덩어리별 합계는 줄별이니 axis=1 입니다.",
        report: function () {
          return checkFile(
            "work/task_06/half.py",
            "import numpy as np\n" +
              "for _n in ['blocks', 'by_block', 'busiest', 'quiet']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "log = np.array([0, 1, 2, 5, 9, 14, 11, 21, 18, 15, 4, 1])\n" +
              "_b = np.asarray(blocks)\n" +
              "assert _b.shape == (4, 3), f'blocks 가 {_b.shape} 입니다. 4줄 3칸이어야 합니다.'\n" +
              "assert np.array_equal(_b, log.reshape(4, 3)), 'blocks 안의 숫자 순서가 의뢰서와 다릅니다. reshape 는 순서를 바꾸지 않습니다.'\n" +
              "_w = log.reshape(4, 3).sum(axis=1)\n" +
              "assert np.shape(by_block) == (4,), f'by_block 이 {np.shape(by_block)} 입니다. 덩어리마다 하나씩 네 개여야 합니다. 줄별 합계는 axis=1 입니다.'\n" +
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
              "로봇 네 대의 하루 기록입니다. 줄 하나가 로봇 한 대, 칸은 시간대 0~3번의 배달 건수입니다.\n" +
              "이름은 줄과 같은 순서입니다.\n" +
              "\n" +
              "  이름 : 1호, 2호, 3호, 4호\n" +
              "\n" +
              "  1호 :  8, 15,  9,  4\n" +
              "  2호 : 11, 20, 12,  7\n" +
              "  3호 :  5, 11,  6,  3\n" +
              "  4호 : 13, 22, 15,  8\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_07/robots.py 를 만들고 아래 네 가지를 채워 주세요.\n" +
              "\n" +
              "- totals      : 로봇마다 하루 합계 (네 개)\n" +
              "- busy_names  : 하루 합계가 50 이상인 로봇의 이름\n" +
              "- top2        : 합계가 많은 순서로 로봇 이름 두 대\n" +
              "- peak_slot   : 네 대를 합쳐 가장 바쁜 시간대가 몇 번 칸인지\n" +
              "\n" +
              "## 참고\n" +
              "네 가지 모두 배우신 것들의 조합입니다. 새 함수는 없습니다.\n" +
              "이름은 글자이므로 np.array([\"1호\", ...]) 처럼 따옴표를 붙여 담습니다.\n",
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
          { who: "Aistb", text: "먼저 totals 부터 만드십시오. 나머지 셋은 전부 totals 를 놓고 시작합니다." },
          {
            who: "Aistb",
            text: "그리고 하나만 알려드리겠습니다. 참/거짓 목록은 다른 배열의 대괄호에도 넣을 수 있습니다. 길이만 같으면 됩니다.",
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
              "_names = np.array(['1호', '2호', '3호', '4호'])\n" +
              "_log = np.array([[8, 15, 9, 4], [11, 20, 12, 7], [5, 11, 6, 3], [13, 22, 15, 8]])\n" +
              "_t = _log.sum(axis=1)\n" +
              "assert np.shape(totals) == (4,), f'totals 가 {np.shape(totals)} 입니다. 로봇마다 하나씩 네 개여야 합니다. 줄별 합계는 axis=1 입니다.'\n" +
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
              "assert int(peak_slot) == int(_slot.argmax()), f'peak_slot 이 {peak_slot} 입니다. 시간대별 합계는 {_slot} 이므로 {int(_slot.argmax())}번 칸이 가장 바쁩니다.'\n"
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
          { who: "Aistb", text: "배운 것 하나로 풀리는 일은 많지 않습니다. 마지막 건이 그것입니다." },
          { who: "Aistb", text: "내일 자료에는 숫자만 있지 않습니다. 이름이 섞여 있습니다." },
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
    "421950년 10월 4일.",
    "",
    "과열 부품, 반나절 기록, 그리고 로봇 종합 점검표.",
    "",
    "마지막 게 어려웠다. 어려운데 새로 나온 건 하나도 없었다.",
    "합계를 내고, 그걸로 조건을 만들고, 그 조건을 이름 쪽에 넣는다.",
    "따로따로는 다 아는 건데 붙이려니까 손이 멈췄다.",
    "",
    "Aistb가 먼저 totals 부터 만들라고 했다. 그러고 나니 나머지는 그 위에 얹기만 하면 됐다.",
    "어려운 건 순서를 모를 때 어려운 거였다.",
    "",
    "내일은 이름이 섞인 자료라고 한다. 숫자만 있는 게 편했는데.",
  ],
};
