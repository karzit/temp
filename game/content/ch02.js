// 2장 — NumPy를 쓰는 첫날. 어제 배운 여섯 가지 중 앞의 셋으로 배차 2팀 의뢰 세 건을 친다.
//
// 푸는 날에는 코드를 미리 깔아주지 않는다. 의뢰서만 오고, 폴더와 파일을 직접 만들어
// 처음부터 쓴다. 그래서 의뢰서에 자료와 변수 이름, 만들 파일 경로가 다 적혀 있어야 한다.
// 채점도 자료 변수 이름에 기대지 않고 답의 값만 본다.
var CH02 = {
  id: "ch02",
  title: "2 · 배열로 일하는 날",
  scenes: ["desk", "diary"],

  desk: {
    files: [{ path: NUMPY_DOC.path, content: NUMPY_DOC.content, readOnly: true }],

    idleLines: [
      "참고 문서는 work/참고/numpy_요약.md 에 있습니다. 어제 것과 같습니다.",
      "막히셨으면 저를 눌러 주세요.",
      "폴더를 고른 다음 ＋파일 을 누르시면 그 안에 만들어집니다.",
    ],
    errorLines: [
      "코드가 도중에 멈췄습니다. 아래 빨간 글씨의 마지막 줄부터 읽어보세요.",
      "실행이 끝까지 가지 못했습니다. 대괄호가 짝이 맞는지 보시죠.",
      "에러입니다. 변수 이름의 철자를 먼저 확인해 보시는 편이 빠릅니다.",
    ],

    beats: [
      // ── 아침 ────────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "좋은 아침입니다, 토이비님. 배차 2팀에서 세 건이 들어왔습니다." },
          { who: "Aistb", text: "오늘은 교육이 없습니다. 어제 익히신 것으로 처리하시면 됩니다." },
        ],
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
      },

      // ── 의뢰 1: 배달료 ──────────────────────────────
      {
        lines: [{ who: "Aistb", text: "첫 번째 의뢰입니다." }],
        addFiles: [
          {
            path: "work/의뢰_0002.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0002 — 배달료 일괄 계산\n" +
              "\n" +
              "발신: 배차 2팀\n" +
              "수신: 깁스 W 토이비\n" +
              "\n" +
              "## 상황\n" +
              "오늘 배달 다섯 건의 거리입니다. 앞에서부터 순서대로입니다.\n" +
              "\n" +
              "  거리(km) : 2, 5, 1, 8, 3\n" +
              "\n" +
              "## 요금 규칙\n" +
              "거리 1km당 1500원, 여기에 기본요금 2000원을 더합니다.\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_02/fee.py 를 만들고, 다섯 건의 배달료를 fee 에 넣어 주세요.\n" +
              "실행해서 값을 확인한 뒤 완료 보고하시면 됩니다.\n" +
              "\n" +
              "## 참고\n" +
              "다섯 건을 하나씩 계산하지 마세요. 거리를 배열로 만들면 곱하기 한 번과 더하기 한 번으로 끝납니다.\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0002.md"]',
        menu: ["brief"],
        nudge: "저를 눌러 의뢰 확인을 고르시면 의뢰서가 열립니다.",
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0002.md") >= 0;
          });
        },
      },
      {
        lines: [
          { who: "Aistb", text: "오늘은 파일을 깔아드리지 않습니다. 직접 만드셔야 합니다.", spot: '.tree-row[data-path="work"]' },
          { who: "Aistb", text: "work 폴더 안에 task_02, 그 안에 fee.py 입니다. 경로는 의뢰서에도 적혀 있습니다.", spot: '.tree-row[data-path="work"]' },
        ],
        menu: ["brief"],
        nudge: "탐색기에서 work 를 고른 뒤 ＋폴더, 그다음 만든 폴더를 고르고 ＋파일입니다.",
        wait: function () {
          return FS.isFile("work/task_02/fee.py");
        },
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "거리를 배열로 만드시고, 곱하기와 더하기를 한 번씩 걸면 됩니다. 다 되면 완료 보고해 주세요.",
            spot: { text: "거리(km) : 2, 5, 1, 8, 3", in: ".doc" },
          },
        ],
        menu: ["brief", "report"],
        nudge: "np.array 로 거리를 담고, 1500을 곱한 뒤 2000을 더하세요.",
        report: function () {
          return checkFile(
            "work/task_02/fee.py",
            "import numpy as np\n" +
              "assert 'fee' in dir(), 'fee 가 없습니다. 답을 fee 라는 이름에 넣어 주세요.'\n" +
              "assert not isinstance(fee, type(Ellipsis)), 'fee 가 아직 ... 그대로입니다.'\n" +
              "want = np.array([5000, 9500, 3500, 14000, 6500])\n" +
              "assert np.shape(fee) == (5,), f'fee 가 다섯 건이 아닙니다. 지금은 {np.shape(fee)} 입니다. 거리 다섯 개를 배열 하나에 담으셨는지 보세요.'\n" +
              "assert np.allclose(fee, want), f'값이 다릅니다. 지금 {np.asarray(fee)} 인데 {want} 가 나와야 합니다. 거리는 2, 5, 1, 8, 3 입니다.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },
      { lines: [{ who: "Aistb", text: "접수했습니다. 곱하기 한 번, 더하기 한 번으로 다섯 건이 끝났습니다." }] },

      // ── 의뢰 2: 최근 사흘 보고 ──────────────────────
      {
        lines: [{ who: "Aistb", text: "두 번째 의뢰입니다. 이번에는 세 가지를 구하셔야 합니다." }],
        addFiles: [
          {
            path: "work/의뢰_0003.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0003 — 최근 사흘 배달량 보고\n" +
              "\n" +
              "발신: 배차 2팀\n" +
              "수신: 깁스 W 토이비\n" +
              "\n" +
              "## 상황\n" +
              "최근 이레치 배달 건수입니다. 앞에서부터 하루씩 늘어놓은 순서입니다.\n" +
              "\n" +
              "  건수 : 31, 45, 28, 52, 39, 47, 33\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_03/report.py 를 만들고 아래 세 가지를 채워 주세요.\n" +
              "\n" +
              "- recent : 최근 사흘치 건수\n" +
              "- avg    : 그 사흘의 평균\n" +
              "- best   : 이레 가운데 가장 바쁜 날이 몇 번째 날인지 (0부터 셉니다)\n" +
              "\n" +
              "## 참고\n" +
              "뒤에서 세는 방법과 자리를 알려주는 함수가 work/참고/numpy_요약.md 에 있습니다.\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0003.md"]',
        menu: ["brief"],
        nudge: "의뢰 확인을 눌러 새 의뢰서를 열어 보세요.",
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0003.md") >= 0;
          });
        },
      },
      {
        lines: [{ who: "Aistb", text: "세 가지 모두 어제 해 보신 것입니다." }],
        menu: ["brief", "report"],
        nudge: "뒤에서 세 개는 [-3:], 자리는 argmax 입니다. 파일은 work/task_03/report.py 입니다.",
        report: function () {
          return checkFile(
            "work/task_03/report.py",
            "import numpy as np\n" +
              "for _n in ['recent', 'avg', 'best']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "want = np.array([39, 47, 33])\n" +
              "assert np.shape(recent) == (3,), f'recent 가 사흘치 세 개가 아닙니다. 지금은 {np.shape(recent)} 입니다.'\n" +
              "assert np.array_equal(recent, want), f'recent 가 {np.asarray(recent)} 입니다. 최근 사흘은 {want} 입니다. 뒤에서 세는 방법을 보세요.'\n" +
              "assert abs(float(avg) - float(want.mean())) < 0.01, f'avg 가 {avg} 입니다. recent 의 평균인 {want.mean():.4f} 가 나와야 합니다.'\n" +
              "assert int(best) == 3, f'best 가 {best} 입니다. 가장 바쁜 날은 52건인 3번째 날입니다. 값이 아니라 자리를 구하셔야 합니다.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },
      { lines: [{ who: "Aistb", text: "접수했습니다. 두 건 끝났습니다." }] },

      // ── 의뢰 3: 점심 시간대 ─────────────────────────
      {
        lines: [{ who: "Aistb", text: "마지막 의뢰입니다. 이번 자료는 한 줄이 아니라 표 모양입니다." }],
        addFiles: [
          {
            path: "work/의뢰_0004.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0004 — 점심 시간대 배달량 확인\n" +
              "\n" +
              "발신: 배차 2팀\n" +
              "수신: 깁스 W 토이비\n" +
              "\n" +
              "## 상황\n" +
              "사흘치 배달 건수 기록입니다. 행 하나가 하루, 열은 왼쪽부터 오전 / 점심 / 저녁 / 야간입니다.\n" +
              "\n" +
              "  첫째 날 : 12, 30, 41,  9\n" +
              "  둘째 날 : 15, 28, 44, 11\n" +
              "  셋째 날 : 10, 33, 39,  7\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_04/lunch.py 를 만들고 아래 세 가지를 채워 주세요.\n" +
              "\n" +
              "- lunch     : 점심 열만 사흘치로\n" +
              "- lunch_avg : 그 평균\n" +
              "- by_slot   : 시간대별 평균 (열마다 하나씩, 네 개)\n" +
              "\n" +
              "## 참고\n" +
              "대괄호 안에 대괄호를 넣으면 표 모양 배열이 됩니다. 번호는 0부터 세므로 점심은 1번 열입니다.\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0004.md"]',
        menu: ["brief"],
        nudge: "의뢰 확인을 눌러 마지막 의뢰서를 열어 보세요.",
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0004.md") >= 0;
          });
        },
      },
      {
        lines: [
          { who: "Aistb", text: "표는 대괄호 안에 행마다 대괄호를 하나씩 넣어 만듭니다." },
          { who: "Aistb", text: "쉼표 앞이 행, 뒤가 열이었습니다." },
        ],
        menu: ["brief", "report"],
        nudge: "점심 열은 [:, 1], 시간대별 평균은 axis 를 쓰시면 됩니다.",
        report: function () {
          return checkFile(
            "work/task_04/lunch.py",
            "import numpy as np\n" +
              "for _n in ['lunch', 'lunch_avg', 'by_slot']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "table = np.array([[12, 30, 41, 9], [15, 28, 44, 11], [10, 33, 39, 7]])\n" +
              "want = table[:, 1]\n" +
              "assert np.shape(lunch) == (3,), f'lunch 가 사흘치 세 개가 아닙니다. 지금은 {np.shape(lunch)} 입니다. 쉼표 앞이 행, 뒤가 열입니다.'\n" +
              "assert np.array_equal(lunch, want), f'lunch 가 {np.asarray(lunch)} 입니다. 점심은 1번 열이므로 {want} 가 나와야 합니다.'\n" +
              "assert abs(float(lunch_avg) - float(want.mean())) < 0.01, f'lunch_avg 가 {lunch_avg} 입니다. {want.mean():.4f} 가 나와야 합니다.'\n" +
              "assert np.shape(by_slot) == (4,), f'by_slot 이 네 개가 아닙니다. 지금은 {np.shape(by_slot)} 입니다. 열별 평균은 axis=0 입니다.'\n" +
              "assert np.allclose(by_slot, table.mean(axis=0)), f'by_slot 이 {np.asarray(by_slot)} 입니다. 열별 평균은 {table.mean(axis=0)} 입니다.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },

      // ── 마무리 ──────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "접수했습니다. 배차 2팀의 세 건이 모두 끝났습니다." },
          { who: "Aistb", text: "어제 오후에 배우신 셋은 아직 한 번도 안 쓰셨습니다. 그쪽 의뢰는 내일 들어옵니다." },
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
  ],
};
