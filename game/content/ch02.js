// 2장 — NumPy를 쓰는 날. 새로 배우는 것은 없고, 어제 익힌 여섯 가지로 의뢰 여섯 건을 처리한다.
// 채점은 checkFile 로 실제 파일을 돌려서 한다. 참고 문서는 어제 것을 그대로 다시 내려준다.
var CH02 = {
  id: "ch02",
  title: "2 · 배열로 일하는 날",
  scenes: ["desk", "diary"],

  desk: {
    files: [{ path: NUMPY_DOC.path, content: NUMPY_DOC.content, readOnly: true }],

    idleLines: [
      "참고 문서는 work/참고/numpy_요약.md 에 있습니다. 어제 것과 같습니다.",
      "막히셨으면 저를 눌러 주세요.",
      "의뢰서는 work 폴더 안에 남아 있습니다. 언제든 다시 여실 수 있습니다.",
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
          { who: "Aistb", text: "좋은 아침입니다, 토이비님. 말씀드린 여섯 건이 모두 들어왔습니다." },
          { who: "Aistb", text: "오늘은 새로 배우실 것이 없습니다. 어제 익히신 것만으로 여섯 건이 전부 처리됩니다." },
          { who: "Aistb", text: "어제 쓰시던 참고 문서를 그대로 다시 올려 두었습니다. 보면서 하셔도 됩니다." },
          { who: "Aistb", text: "한 건씩 드리겠습니다. 끝내신 것은 반드시 완료 보고해 주세요." },
        ],
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
      },

      // ── 의뢰 1: 배달료 ──────────────────────────────
      {
        lines: [{ who: "Aistb", text: "첫 번째 의뢰입니다. 의뢰서와 작업 파일을 함께 넣어 두었습니다." }],
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
              "배달 다섯 건의 거리가 나와 있습니다. 건마다 배달료를 계산해 주세요.\n" +
              "\n" +
              "## 요금 규칙\n" +
              "거리 1km당 1500원, 여기에 기본요금 2000원을 더합니다.\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_02/fee.py 의 fee 를 채우고 실행한 뒤 완료 보고.\n" +
              "\n" +
              "## 참고\n" +
              "다섯 건을 하나씩 계산하지 마세요. 곱하기 한 번과 더하기 한 번이면 끝납니다.\n",
          },
          {
            path: "work/task_02/fee.py",
            open: 0,
            content:
              "import numpy as np\n" +
              "\n" +
              "distance = np.array([2, 5, 1, 8, 3])   # 배달 거리(km)\n" +
              "\n" +
              "# 거리 1km당 1500원 + 기본요금 2000원\n" +
              "fee = ...\n" +
              "\n" +
              "print(fee)\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0002.md"]',
        menu: ["brief"],
        nudge: "저를 눌러 의뢰 확인을 고르시면 의뢰서가 오른쪽에 열립니다.",
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0002.md") >= 0;
          });
        },
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "어제 배우신 곱하기와 더하기 그대로입니다. fee 를 채우고 실행한 뒤 완료 보고해 주세요.",
            spot: { text: "거리 1km당 1500원", in: ".doc" },
          },
        ],
        menu: ["brief", "report"],
        nudge: "distance 에 1500을 곱하고 2000을 더하시면 됩니다.",
        report: function () {
          return checkFile(
            "work/task_02/fee.py",
            "import numpy as np\n" +
              "assert 'fee' in dir(), 'fee 가 없습니다. 변수 이름을 그대로 두셔야 합니다.'\n" +
              "assert not isinstance(fee, type(Ellipsis)), 'fee 가 아직 ... 그대로입니다.'\n" +
              "want = distance * 1500 + 2000\n" +
              "assert np.shape(fee) == np.shape(want), f'fee 가 다섯 건이 아닙니다. 지금은 {np.shape(fee)} 입니다. 배열 전체에 한 번에 계산하면 다섯 개가 그대로 나옵니다.'\n" +
              "assert np.allclose(fee, want), f'값이 다릅니다. 지금 {np.asarray(fee)} 인데 {want} 가 나와야 합니다.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },
      { lines: [{ who: "Aistb", text: "접수했습니다. 곱하기 한 번, 더하기 한 번으로 다섯 건이 끝났습니다." }] },

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
              "최근 이레치 배달 건수입니다. 앞에서부터 하루씩 늘어놓은 순서입니다.\n" +
              "\n" +
              "## 할 일\n" +
              "- recent : 최근 사흘치 건수\n" +
              "- avg    : 그 사흘의 평균\n" +
              "- best   : 이레 가운데 가장 바쁜 날이 몇 번째 날인지 (0부터 셉니다)\n" +
              "\n" +
              "work/task_03/report.py 를 채우고 실행한 뒤 완료 보고.\n" +
              "\n" +
              "## 참고\n" +
              "뒤에서 세는 방법과 자리를 알려주는 함수가 work/참고/numpy_요약.md 에 있습니다.\n",
          },
          {
            path: "work/task_03/report.py",
            open: 0,
            content:
              "import numpy as np\n" +
              "\n" +
              "counts = np.array([31, 45, 28, 52, 39, 47, 33])   # 최근 이레치 배달 건수\n" +
              "\n" +
              "recent = ...   # 최근 사흘치\n" +
              "avg = ...      # 그 평균\n" +
              "best = ...     # 가장 바쁜 날이 몇 번째 날인지\n" +
              "\n" +
              "print(recent, avg, best)\n",
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
        lines: [{ who: "Aistb", text: "세 가지 모두 어제 연습하신 것 안에 있습니다. 채우고 실행한 뒤 완료 보고해 주세요." }],
        menu: ["brief", "report"],
        nudge: "뒤에서 세 개는 counts[-3:], 자리는 argmax 입니다.",
        report: function () {
          return checkFile(
            "work/task_03/report.py",
            "import numpy as np\n" +
              "for _n in ['recent', 'avg', 'best']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 변수 이름을 그대로 두셔야 합니다.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "want = counts[-3:]\n" +
              "assert np.shape(recent) == (3,), f'recent 가 사흘치 세 개가 아닙니다. 지금은 {np.shape(recent)} 입니다.'\n" +
              "assert np.array_equal(recent, want), f'recent 가 {np.asarray(recent)} 입니다. 최근 사흘은 {want} 입니다. 뒤에서 세는 방법을 보세요.'\n" +
              "assert abs(float(avg) - float(want.mean())) < 1e-9, f'avg 가 {avg} 입니다. recent 의 평균인 {want.mean():.4f} 가 나와야 합니다.'\n" +
              "assert int(best) == int(counts.argmax()), f'best 가 {best} 입니다. 가장 바쁜 날은 {int(counts.argmax())}번째 날입니다. 값이 아니라 자리를 구하셔야 합니다.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },
      { lines: [{ who: "Aistb", text: "접수했습니다. 두 건 끝났습니다." }] },

      // ── 의뢰 3: 점심 시간대 ─────────────────────────
      {
        lines: [{ who: "Aistb", text: "세 번째 의뢰입니다. 이번에는 숫자가 한 줄이 아니라 표 모양으로 들어옵니다." }],
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
              "사흘치 배달 건수 기록입니다.\n" +
              "줄 하나가 하루이고, 칸은 왼쪽부터 오전 / 점심 / 저녁 / 야간입니다.\n" +
              "\n" +
              "## 할 일\n" +
              "- lunch     : 점심 칸만 사흘치로\n" +
              "- lunch_avg : 그 평균\n" +
              "- by_slot   : 시간대별 평균 (칸마다 하나씩, 네 개)\n" +
              "\n" +
              "work/task_04/lunch.py 를 채우고 실행한 뒤 완료 보고.\n" +
              "\n" +
              "## 참고\n" +
              "번호는 0부터 세므로 점심은 1번 칸입니다.\n",
          },
          {
            path: "work/task_04/lunch.py",
            open: 0,
            content:
              "import numpy as np\n" +
              "\n" +
              "# 줄 = 하루, 칸 = 오전 / 점심 / 저녁 / 야간\n" +
              "log = np.array([[12, 30, 41,  9],\n" +
              "                [15, 28, 44, 11],\n" +
              "                [10, 33, 39,  7]])\n" +
              "\n" +
              "lunch = ...       # 점심 칸만 세로로\n" +
              "lunch_avg = ...   # 그 평균\n" +
              "by_slot = ...     # 시간대별 평균 (네 개)\n" +
              "\n" +
              "print(lunch, lunch_avg, by_slot)\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0004.md"]',
        menu: ["brief"],
        nudge: "의뢰 확인을 눌러 새 의뢰서를 열어 보세요.",
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0004.md") >= 0;
          });
        },
      },
      {
        lines: [{ who: "Aistb", text: "쉼표 앞이 줄, 뒤가 칸이었습니다. 채우고 실행한 뒤 완료 보고해 주세요." }],
        menu: ["brief", "report"],
        nudge: "점심 칸은 log[:, 1], 시간대별 평균은 axis 를 쓰시면 됩니다.",
        report: function () {
          return checkFile(
            "work/task_04/lunch.py",
            "import numpy as np\n" +
              "for _n in ['lunch', 'lunch_avg', 'by_slot']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 변수 이름을 그대로 두셔야 합니다.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "want = log[:, 1]\n" +
              "assert np.shape(lunch) == (3,), f'lunch 가 사흘치 세 개가 아닙니다. 지금은 {np.shape(lunch)} 입니다. 쉼표 앞이 줄, 뒤가 칸입니다.'\n" +
              "assert np.array_equal(lunch, want), f'lunch 가 {np.asarray(lunch)} 입니다. 점심은 1번 칸이므로 {want} 가 나와야 합니다.'\n" +
              "assert abs(float(lunch_avg) - float(want.mean())) < 1e-9, f'lunch_avg 가 {lunch_avg} 입니다. {want.mean():.4f} 가 나와야 합니다.'\n" +
              "assert np.shape(by_slot) == (4,), f'by_slot 이 네 개가 아닙니다. 지금은 {np.shape(by_slot)} 입니다. 칸별 평균은 axis=0 입니다.'\n" +
              "assert np.allclose(by_slot, log.mean(axis=0)), f'by_slot 이 {np.asarray(by_slot)} 입니다. 칸별 평균은 {log.mean(axis=0)} 입니다.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },
      {
        lines: [
          { who: "Aistb", text: "접수했습니다. 배차 2팀 세 건이 모두 끝났습니다." },
          { who: "Aistb", text: "남은 세 건은 다른 팀에서 온 것입니다." },
        ],
      },

      // ── 의뢰 4: 과열 부품 ───────────────────────────
      {
        lines: [{ who: "Aistb", text: "네 번째 의뢰입니다. 정비 1팀입니다." }],
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
              "배달 로봇 여덟 대의 관절 온도를 잰 기록입니다. 80도부터는 과열로 봅니다.\n" +
              "\n" +
              "## 할 일\n" +
              "- hot       : 80도 이상인 온도만\n" +
              "- hot_count : 그런 부품이 몇 개\n" +
              "- cooled    : 80도 이상은 80으로 낮추고 나머지는 그대로 둔 기록\n" +
              "\n" +
              "work/task_05/heat.py 를 채우고 실행한 뒤 완료 보고.\n" +
              "\n" +
              "## 참고\n" +
              "cooled 는 개수가 줄지 않습니다. 여덟 개 그대로 나와야 합니다.\n",
          },
          {
            path: "work/task_05/heat.py",
            open: 0,
            content:
              "import numpy as np\n" +
              "\n" +
              "temps = np.array([61, 84, 73, 92, 58, 80, 77, 88])   # 여덟 대의 관절 온도\n" +
              "\n" +
              "hot = ...         # 80 이상인 온도만\n" +
              "hot_count = ...   # 그런 부품이 몇 개\n" +
              "cooled = ...      # 80 이상은 80으로, 나머지는 그대로\n" +
              "\n" +
              "print(hot, hot_count)\n" +
              "print(cooled)\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0005.md"]',
        menu: ["brief"],
        nudge: "의뢰 확인을 눌러 새 의뢰서를 열어 보세요.",
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0005.md") >= 0;
          });
        },
      },
      {
        lines: [{ who: "Aistb", text: "어제 익힘 문제로 푸신 세 가지와 같습니다. 채우고 실행한 뒤 완료 보고해 주세요." }],
        menu: ["brief", "report"],
        nudge: "고르기는 대괄호, 개수는 sum, 값을 바꾸는 것은 where 입니다.",
        report: function () {
          return checkFile(
            "work/task_05/heat.py",
            "import numpy as np\n" +
              "for _n in ['hot', 'hot_count', 'cooled']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 변수 이름을 그대로 두셔야 합니다.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
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

      // ── 의뢰 5: 이달의 배달원 ───────────────────────
      {
        lines: [{ who: "Aistb", text: "다섯 번째 의뢰입니다. 인사팀입니다." }],
        addFiles: [
          {
            path: "work/의뢰_0006.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0006 — 이달의 배달원 세 명\n" +
              "\n" +
              "발신: 인사팀\n" +
              "수신: 깁스 W 토이비\n" +
              "\n" +
              "## 상황\n" +
              "배달원 여섯 명의 이번 달 건수입니다. 이름과 건수가 같은 순서로 들어 있습니다.\n" +
              "\n" +
              "## 할 일\n" +
              "- top3        : 건수가 많은 순서로 이름 세 명\n" +
              "- top3_counts : 그 세 명의 건수\n" +
              "\n" +
              "work/task_06/top.py 를 채우고 실행한 뒤 완료 보고.\n" +
              "\n" +
              "## 참고\n" +
              "많은 순서입니다. 적은 순서로 뽑으면 상장이 엉뚱한 사람에게 갑니다.\n",
          },
          {
            path: "work/task_06/top.py",
            open: 0,
            content:
              "import numpy as np\n" +
              "\n" +
              "counts = np.array([31, 45, 28, 52, 39, 47])\n" +
              'names = np.array(["가온", "노을", "다움", "라온", "마루", "바다"])\n' +
              "\n" +
              "top3 = ...          # 건수가 많은 순서로 이름 세 명\n" +
              "top3_counts = ...   # 그 세 명의 건수\n" +
              "\n" +
              "print(top3)\n" +
              "print(top3_counts)\n",
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
        lines: [{ who: "Aistb", text: "어제 두 곳을 뽑아 보셨습니다. 이번에는 세 명이고, 건수도 같이 필요합니다." }],
        menu: ["brief", "report"],
        nudge: "자리 번호를 한 번만 만들어 두면 이름과 건수 양쪽에 같이 쓰실 수 있습니다.",
        report: function () {
          return checkFile(
            "work/task_06/top.py",
            "import numpy as np\n" +
              "for _n in ['top3', 'top3_counts']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 변수 이름을 그대로 두셔야 합니다.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "_order = np.argsort(counts)[::-1]\n" +
              "_names = names[_order][:3]\n" +
              "_counts = counts[_order][:3]\n" +
              "assert len(list(top3)) == 3, f'top3 가 {len(list(top3))} 명입니다. 세 명만 남기셔야 합니다.'\n" +
              "assert list(top3) != list(names[np.argsort(counts)][:3]), '적은 순서로 뽑으셨습니다. 뒤집는 것을 빠뜨리지 않으셨는지 보세요.'\n" +
              "assert list(top3) == list(_names), f'top3 가 {np.asarray(top3)} 입니다. 많은 순서로는 {_names} 입니다.'\n" +
              "assert list(top3_counts) == list(_counts), f'top3_counts 가 {np.asarray(top3_counts)} 입니다. {_counts} 가 나와야 합니다. 이름과 같은 순서여야 합니다.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },
      { lines: [{ who: "Aistb", text: "접수했습니다. 상장은 인사팀이 알아서 만들 것입니다." }] },

      // ── 의뢰 6: 하루 기록 ───────────────────────────
      {
        lines: [{ who: "Aistb", text: "마지막 의뢰입니다. 어제 배우신 것이 여기 다 들어갑니다." }],
        addFiles: [
          {
            path: "work/의뢰_0007.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0007 — 하루 기록을 여섯 시간씩\n" +
              "\n" +
              "발신: 배차 2팀\n" +
              "수신: 깁스 W 토이비\n" +
              "\n" +
              "## 상황\n" +
              "어제 하루의 배달 건수입니다. 0시부터 한 시간에 하나씩, 스물네 개가 순서대로 들어 있습니다.\n" +
              "여섯 시간을 한 덩어리로 봅니다. 새벽 · 오전 · 오후 · 밤 네 덩어리입니다.\n" +
              "\n" +
              "## 할 일\n" +
              "- blocks   : 스물넉 개를 4줄 6칸으로 바꾼 것\n" +
              "- by_block : 덩어리별 합계 (네 개)\n" +
              "- busiest  : 가장 바쁜 덩어리가 몇 번째인지 (0부터)\n" +
              "- quiet    : 건수가 3 이하인 시간이 몇 시간인지\n" +
              "\n" +
              "work/task_07/day.py 를 채우고 실행한 뒤 완료 보고.\n",
          },
          {
            path: "work/task_07/day.py",
            open: 0,
            content:
              "import numpy as np\n" +
              "\n" +
              "# 0시부터 한 시간에 하나씩, 스물네 개\n" +
              "log = np.array([ 0,  0,  1,  0,  2,  3,\n" +
              "                 5,  9, 14, 11,  8,  7,\n" +
              "                 6, 10, 21, 18, 12,  9,\n" +
              "                15, 22, 17, 10,  4,  1])\n" +
              "\n" +
              "blocks = ...     # 4줄 6칸으로\n" +
              "by_block = ...   # 덩어리별 합계\n" +
              "busiest = ...    # 가장 바쁜 덩어리 자리\n" +
              "quiet = ...      # 3 이하인 시간이 몇 시간\n" +
              "\n" +
              "print(blocks)\n" +
              "print(by_block, busiest, quiet)\n",
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
          { who: "Aistb", text: "모양을 바꾸고, 줄별로 더하고, 자리를 찾고, 조건으로 셉니다. 어제 하신 것 그대로입니다." },
          { who: "Aistb", text: "마지막 quiet 은 덩어리가 아니라 원래 기록에서 세십니다." },
        ],
        menu: ["brief", "report"],
        nudge: "덩어리별 합계는 줄별이니 axis=1 입니다.",
        report: function () {
          return checkFile(
            "work/task_07/day.py",
            "import numpy as np\n" +
              "for _n in ['blocks', 'by_block', 'busiest', 'quiet']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 변수 이름을 그대로 두셔야 합니다.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "_b = np.asarray(blocks)\n" +
              "assert _b.shape == (4, 6), f'blocks 가 {_b.shape} 입니다. 4줄 6칸이어야 합니다.'\n" +
              "assert np.array_equal(_b, log.reshape(4, 6)), 'blocks 안의 숫자 순서가 원래 기록과 다릅니다. reshape 는 순서를 바꾸지 않습니다.'\n" +
              "_w = log.reshape(4, 6).sum(axis=1)\n" +
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

      // ── 마무리 ──────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "접수했습니다. 오늘 여섯 건 모두 처리되었습니다." },
          { who: "Aistb", text: "새로 배우신 것은 하나도 없습니다. 어제 것을 오늘 쓰셨을 뿐입니다." },
          { who: "Aistb", text: "내일은 다시 배우는 날입니다. 숫자만 있는 자료가 아니라, 이름이 섞인 자료를 다루게 되십니다." },
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
    "여섯 건. 배달료, 최근 사흘 보고, 점심 시간대, 과열 부품, 이달의 배달원, 하루 기록.",
    "",
    "어제 하루를 통째로 배우는 데 쓴 게 아까웠는데, 오늘 보니 그게 맞았다.",
    "새로 찾아본 게 하나도 없었다. 참고 문서를 두 번쯤 열었을 뿐이다.",
    "",
    "argmax 가 값이 아니라 자리를 준다는 걸 한 번 틀리고 나서 다시 기억했다.",
    "어제도 같은 데서 틀렸다. 두 번 틀린 건 이제 안 틀릴 것 같다.",
    "",
    "내일은 이름이 섞인 자료라고 한다. 숫자만 있는 게 편했는데.",
  ],
};
