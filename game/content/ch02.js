// 2장 — NumPy를 쓰는 첫날의 오전(10/3 금). 3장이 같은 날 오후다.
// 그래서 이 장에는 일기가 없다. 그날 일기는 3장 끝에서 한 번만 쓴다.
// 어제 배운 다섯 가지로 배차 2팀 의뢰 세 건을 친다.
//
// 이 장부터 자료는 CSV 파일로 온다. 의뢰서와 함께 work/자료/○○.csv 가 도착하고,
// np.loadtxt 로 읽어 배열에 담는다(첫 의뢰에서 Aistb가 한 번 설명한다).
// 푸는 날에는 코드를 미리 깔아주지 않는다. 폴더와 파일을 직접 만들어 처음부터 쓴다.
// 채점은 같은 CSV를 다시 읽어 값만 비교한다 — 자료 변수 이름에 기대지 않는다.
var CH02 = {
  id: "ch02",
  title: "2 · 배열로 일하는 날",
  scenes: ["desk"],

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
          { who: "Aistb", text: "좋은 아침입니다, 토이비님. 금일은 업무 숙련을 위해 다른 팀의 업무 지원을 수행해 보시겠습니다." },
          { who: "Aistb", text: "마침 배차 2팀에서 요청한 업무 세 건이 접수되어 있으니, 이를 해결해 보시겠습니다." },
        ],
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
      },

      // ── 의뢰 1: 배달료 ──────────────────────────────
      {
        lines: [{ who: "Aistb", text: "첫 번째 의뢰입니다. 확인해 보시겠습니다." }],
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
              "금일 배달 건별 거리 자료입니다. 총 40건이며, work/자료/거리.csv 로 전달되었습니다.\n" +
              "한 줄에 한 건씩, 앞에서부터 순서대로입니다.\n" +
              "\n" +
              "## 요금 규칙\n" +
              "거리 1km당 1500원, 여기에 기본요금 2000원을 더합니다.\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_02/fee.py 를 만들고, 거리 자료를 읽어 40건의 배달료를 fee 에 넣어 주세요.\n" +
              "실행해서 값을 확인한 뒤 완료 보고하시면 됩니다.\n" +
              "\n" +
              "## 참고\n" +
              '자료는 np.loadtxt("work/자료/거리.csv") 로 배열에 담을 수 있습니다.\n' +
              "40건을 하나씩 계산하지 마세요. 배열로 담으면 곱하기 한 번과 더하기 한 번으로 끝납니다.\n",
          },
          {
            path: "work/자료/거리.csv",
            readOnly: true,
            src: "work/자료/거리.csv",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0002.md"]',
        menu: ["brief"],
        nudge: [
          "저를 눌러 '의뢰 확인'을 고르시면 의뢰서가 열립니다.",
          "업무 메뉴 첫 번째 항목이 의뢰 확인입니다.",
          "의뢰서를 열지 않으면 의뢰 내용을 확인하실 수 없습니다. 당연한 이야기지만요.",
          "확인하지 않은 의뢰도 마감 기한은 동일하게 적용됩니다.",
          "worklog_GipsWToyb_0029: 폐기 요망",
        ],
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0002.md") >= 0;
          });
        },
      },
      {
        lines: [
          { who: "Aistb", text: "이번 자료는 기존 실습과 달리 CSV 파일로 전달되었습니다. work/자료/거리.csv 를 확인해 보십시오.", spot: '.tree-row[data-path="work/자료/거리.csv"]' },
          { who: "Aistb", text: 'CSV는 값을 줄바꿈이나 쉼표로 나열해 둔 자료 파일입니다. np.loadtxt("work/자료/거리.csv") 로 읽으시면 배열 하나에 그대로 담깁니다.' },
          { who: "Aistb", text: "금일부터는 작업 파일도 직접 생성하셔야 합니다. 경로는 의뢰서에 기재되어 있습니다.", spot: '.tree-row[data-path="work"]' },
        ],
        menu: ["brief"],
        nudge: [
          { text: "탐색기에서 work 를 고른 뒤 ＋폴더, 그다음 만든 폴더를 고르고 ＋파일입니다.", spot: '.tree-row[data-path="work"]' },
          "만들 폴더와 파일의 경로는 의뢰서에 그대로 적혀 있습니다.",
          "파일은 저절로 생성되지 않습니다. 저 역시 대신 만들어 드릴 수 없습니다. 규정입니다.",
          "빈 화면을 오래 바라본다고 하여 파일이 생성되지는 않습니다. 실험은 이미 끝났습니다.",
          "worklog_GipsWToyb_0030: 폐기 요망",
        ],
        wait: function () {
          return FS.isFile("work/task_02/fee.py");
        },
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "거리를 읽어 배열로 만드시면 됩니다. 완료하신 후 완료 보고를 눌러 주세요.",
          },
        ],
        menu: ["brief", "report"],
        nudge: [
          'np.loadtxt("work/자료/거리.csv") 로 담고, 1500을 곱한 뒤 2000을 더하세요.',
          "40건을 하나씩 계산하지 마세요. 배열이면 곱하기 한 번, 더하기 한 번입니다.",
          "손으로 마흔 번 계산하실 수도 있습니다. 다만 그러라고 어제 배열을 배우신 것은 아닙니다.",
          "배차 2팀도 이 분량을 암산으로 처리하리라 기대하지는 않았을 겁니다. 아마도요.",
          "worklog_GipsWToyb_0031: 폐기 요망",
        ],
        report: function () {
          return checkFile(
            "work/task_02/fee.py",
            "import numpy as np\n" +
              "assert 'fee' in dir(), 'fee 가 없습니다. 답을 fee 라는 이름에 넣어 주세요.'\n" +
              "assert not isinstance(fee, type(Ellipsis)), 'fee 가 아직 ... 그대로입니다.'\n" +
              'dist = np.loadtxt("work/자료/거리.csv")\n' +
              "want = dist * 1500 + 2000\n" +
              "assert np.shape(fee) == np.shape(want), f'fee 가 40건이 아닙니다. 지금은 {np.shape(fee)} 입니다. 거리 전체를 배열 하나에 담으셨는지 보세요.'\n" +
              "assert np.allclose(fee, want), '값이 다릅니다. 거리 1km당 1500원에 기본요금 2000원을 더하셨는지 확인해 보세요.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },
      { lines: [{ who: "Aistb", text: "접수했습니다." }] },

      // ── 의뢰 2: 최근 사흘 보고 ──────────────────────
      {
        lines: [{ who: "Aistb", text: "두 번째 의뢰입니다." }],
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
              "이번 달 일별 배달 건수입니다. 총 30일치이며, work/자료/일별건수.csv 로 전달되었습니다.\n" +
              "한 줄에 하루씩, 앞에서부터 날짜 순입니다.\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_03/report.py 를 만들고 자료를 읽어 아래 세 가지를 채워 주세요.\n" +
              "\n" +
              "- recent : 최근 사흘치 건수\n" +
              "- avg    : 그 사흘의 평균\n" +
              "- best   : 한 달 가운데 가장 바쁜 날이 몇 번째 날인지 (0부터 셉니다)\n" +
              "\n" +
              "## 참고\n" +
              'np.loadtxt("work/자료/일별건수.csv") 로 읽으시면 됩니다.\n' +
              "뒤에서 세는 방법과 자리를 알려주는 함수가 work/참고/numpy_요약.md 에 있습니다.\n",
          },
          {
            path: "work/자료/일별건수.csv",
            readOnly: true,
            src: "work/자료/일별건수.csv",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0003.md"]',
        menu: ["brief"],
        nudge: [
          "'의뢰 확인'을 눌러 새 의뢰서를 열어 보세요.",
          "두 번째 의뢰서가 업무 메뉴에 도착해 있습니다.",
          "새 의뢰가 도착할 때마다 저를 눌러 확인하시면 됩니다.",
          "의뢰가 쌓이는 속도와 처리하는 속도가 같아야 재고가 늘지 않습니다. 재고는 곧 인력입니다.",
          "worklog_GipsWToyb_0032: 폐기 요망",
        ],
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0003.md") >= 0;
          });
        },
      },
      {
        lines: [{ who: "Aistb", text: "읽는 방법은 같습니다. 세 가지 모두 어제 실습하신 것입니다." }],
        menu: ["brief", "report"],
        nudge: [
          "먼저 np.loadtxt 로 건수를 읽으세요. 파일은 work/task_03/report.py 입니다.",
          "뒤에서 세 개는 [-3:], 자리는 argmax 입니다.",
          "recent, avg, best — 세 이름을 의뢰서에 적힌 그대로 써 주세요.",
          "가장 바쁜 날은 '값'이 아니라 '자리'를 구하는 것입니다. argmax를 떠올려 보세요.",
          "어제의 실습과 금일의 의뢰는 자료의 양만 다릅니다. 구조는 동일합니다. 저처럼요.",
          "worklog_GipsWToyb_0033: 폐기 요망",
        ],
        report: function () {
          return checkFile(
            "work/task_03/report.py",
            "import numpy as np\n" +
              "for _n in ['recent', 'avg', 'best']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              'counts = np.loadtxt("work/자료/일별건수.csv")\n' +
              "want = counts[-3:]\n" +
              "assert np.shape(recent) == (3,), f'recent 가 사흘치 세 개가 아닙니다. 지금은 {np.shape(recent)} 입니다.'\n" +
              "assert np.array_equal(recent, want), f'recent 가 {np.asarray(recent)} 입니다. 최근 사흘은 {want} 입니다. 뒤에서 세는 방법을 보세요.'\n" +
              "assert abs(float(avg) - float(want.mean())) < 0.01, f'avg 가 {avg} 입니다. recent 의 평균인 {want.mean():.4f} 가 나와야 합니다.'\n" +
              "assert int(best) == int(counts.argmax()), f'best 가 {best} 입니다. 가장 바쁜 날의 자리(0부터)를 구하셔야 합니다. 값이 아니라 자리입니다.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },
      { lines: [{ who: "Aistb", text: "접수했습니다. 두 건 완료되었습니다." }] },

      // ── 의뢰 3: 점심 시간대 ─────────────────────────
      {
        lines: [{ who: "Aistb", text: "마지막 의뢰입니다. 이번에는 표 모양입니다." }],
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
              "이번 달 시간대별 배달 건수 기록입니다. 총 30일치이며, work/자료/시간대.csv 로 전달되었습니다.\n" +
              "행 하나가 하루, 열은 왼쪽부터 오전 / 점심 / 저녁 / 야간입니다.\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_04/lunch.py 를 만들고 자료를 읽어 아래 세 가지를 채워 주세요.\n" +
              "\n" +
              "- lunch     : 점심 열만 30일치로\n" +
              "- lunch_avg : 그 평균\n" +
              "- by_slot   : 시간대별 평균 (열마다 하나씩, 네 개)\n" +
              "\n" +
              "## 참고\n" +
              '표는 쉼표로 나뉘어 있으니 np.loadtxt("work/자료/시간대.csv", delimiter=",") 로 읽으면 표 모양 배열이 됩니다.\n' +
              "번호는 0부터 세므로 점심은 1번 열입니다.\n",
          },
          {
            path: "work/자료/시간대.csv",
            readOnly: true,
            src: "work/자료/시간대.csv",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0004.md"]',
        menu: ["brief"],
        nudge: [
          "'의뢰 확인'을 눌러 마지막 의뢰서를 열어 보세요.",
          "금일의 마지막 의뢰서입니다.",
          "표 모양이라 하여 특별히 다르지는 않습니다. 읽을 때 delimiter 만 붙이면 됩니다.",
          "마지막 의뢰를 남겨 두고 퇴근하실 수는 없습니다. 규정이 아니라, 그렇게 되어 있습니다.",
          "worklog_GipsWToyb_0034: 폐기 요망",
        ],
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0004.md") >= 0;
          });
        },
      },
      {
        lines: [
          { who: "Aistb", text: '표는 np.loadtxt(경로, delimiter=",") 로 읽습니다. 쉼표 앞이 행, 뒤가 열이었습니다. 기억하고 계시리라 믿습니다.' },
        ],
        menu: ["brief", "report"],
        nudge: [
          "점심 열은 [:, 1], 시간대별 평균은 axis 를 쓰시면 됩니다.",
          "lunch, lunch_avg, by_slot — 세 이름을 의뢰서 그대로 써 주세요.",
          "점심은 0부터 세어 1번 열입니다. 배가 고프시더라도 번호는 정확히 세어 주세요.",
          "열별 평균은 axis=0 입니다. 축을 헷갈리시면 밥이 아니라 저녁이 나옵니다.",
          "worklog_GipsWToyb_0035: 폐기 요망",
        ],
        report: function () {
          return checkFile(
            "work/task_04/lunch.py",
            "import numpy as np\n" +
              "for _n in ['lunch', 'lunch_avg', 'by_slot']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              'table = np.loadtxt("work/자료/시간대.csv", delimiter=",")\n' +
              "want = table[:, 1]\n" +
              "assert np.shape(lunch) == np.shape(want), f'lunch 가 30일치가 아닙니다. 지금은 {np.shape(lunch)} 입니다. 쉼표 앞이 행, 뒤가 열입니다.'\n" +
              "assert np.array_equal(lunch, want), f'lunch 가 {np.asarray(lunch)} 입니다. 점심은 1번 열이므로 그 열이 나와야 합니다.'\n" +
              "assert abs(float(lunch_avg) - float(want.mean())) < 0.01, f'lunch_avg 가 {lunch_avg} 입니다. 점심 열의 평균인 {want.mean():.4f} 가 나와야 합니다.'\n" +
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
          { who: "Aistb", text: "접수했습니다. 세 건 모두 완료되었습니다." },
          { who: "Aistb", text: "금일 오전 업무는 여기까지입니다. 다녀오시죠." },
        ],
        menu: ["end"],
        endLabel: "점심",
        nudge: [
          "'점심'을 누르시면 오전 일과가 끝납니다.",
          "저를 눌러 업무 메뉴에서 '점심'을 선택하시면 됩니다.",
          "식사는 업무 능률 향상을 위한 정당한 절차입니다. 다녀오셔도 됩니다.",
          "바로벤토는 직원의 식사 시간을 존중합니다. 다만 그 시간 역시 정확히 기록됩니다.",
          "worklog_GipsWToyb_0036: 폐기 요망",
        ],
        wait: function () {
          return false;
        },
      },
    ],
  },

};
