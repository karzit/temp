// 1장 — NumPy. 업무 보조 3건으로 배열의 전체 그림을 잡는다.
//
// 연습 파일은 한꺼번에 돌리지 않는다. ↓ 한 줄 로 문장 하나씩 실행하고,
// 그때마다 Aistb가 방금 나온 출력을 짚어준다. 설명이 결과보다 앞서지 않게 하기 위해서다.

// 제출한 파일을 실제로 돌려서 채점한다. 통과면 null, 아니면 그 이유를 돌려준다.
function checkFile(path, checkCode) {
  if (!FS.isFile(path)) {
    return Promise.resolve(path + " 가 보이지 않습니다.");
  }
  return runCheck(FS.read(path), checkCode)
    .then(function (r) {
      return r.ok ? null : r.error;
    })
    .catch(function (e) {
      return String(e.message || e);
    });
}

// 그 파일에서 n번째 문장까지 실행했는가.
function steppedTo(path, n) {
  return function () {
    return IDE.stepAt(path) >= n;
  };
}

var CH01 = {
  id: "ch01",
  title: "1 · 배열 다루기",
  scenes: ["desk", "diary"],

  desk: {
    files: [],

    idleLines: [
      "참고 문서는 work/참고/ 안에 있습니다. 언제든 다시 여셔도 됩니다.",
      "막히셨으면 저를 눌러 주세요.",
      "천천히 하셔도 됩니다. 오늘 안에만 끝내면 됩니다.",
    ],
    errorLines: [
      "코드가 도중에 멈췄습니다. 아래 빨간 글씨의 마지막 줄부터 읽어보세요.",
      "실행이 끝까지 가지 못했습니다. 따옴표나 괄호가 짝이 맞는지 보시죠.",
      "에러입니다. 어제도 말씀드렸지만, 저도 하루에 백 번쯤 봅니다.",
    ],

    beats: [
      // ── 아침 ────────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "좋은 아침입니다, 토이비님. 출근 확인되었습니다." },
          { who: "Aistb", text: "오늘 배정된 업무는 업무 보조 3건입니다." },
          {
            who: "Aistb",
            text: "세 건 모두 NumPy 라는 도구 하나로 처리합니다. 한 건씩 드리되, 필요한 사용법을 먼저 익히신 뒤에 드리겠습니다.",
          },
        ],
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "첫 번째 업무를 미리 말씀드리면, 배달 다섯 건의 요금을 계산하는 일입니다. 값 다섯 개에 같은 계산을 반복해야 합니다.",
          },
          {
            who: "Aistb",
            text: "기존 파이썬 코드로도 충분히 수행 가능합니다. 다만 업무 능률 향상을 위해 NumPy 라이브러리를 활용하시는 것을 권해 드립니다.",
          },
          {
            who: "Aistb",
            text: "NumPy 는 파이썬이 그대로는 하지 못하던 배열 단위 연산을 가능하게 하는 도구입니다. 값을 하나씩 꺼내 계산하는 대신, 묶음 하나에 계산을 한 번 걸면 안에 든 값 전부가 계산됩니다.",
          },
          { who: "Aistb", text: "사용법을 익히실 연습 파일을 넣어 두었습니다." },
        ],
      },

      // ── 연습 1: 배열이란 ────────────────────────────
      {
        addFiles: [
          {
            path: "work/참고/numpy_요약.md",
            readOnly: true,
            open: 1,
            content:
              "# NumPy 요약\n" +
              "\n" +
              "import numpy as np 로 가져옵니다. arr 는 한 줄짜리 배열, m 은 표 모양 배열입니다.\n" +
              "\n" +
              "## 만들기\n" +
              "np.array(리스트) — 리스트를 배열로 바꿉니다.\n" +
              "np.array([[1, 2], [3, 4]]) — 리스트 안에 리스트를 넣으면 표 모양이 됩니다.\n" +
              "\n" +
              "## 계산 (값 하나하나에 적용됩니다)\n" +
              "arr * 2 — 모든 값에 2를 곱합니다.\n" +
              "arr + 10 — 모든 값에 10을 더합니다.\n" +
              "arr1 + arr2 — 같은 자리끼리 더합니다.\n" +
              "\n" +
              "## 크기\n" +
              "len(arr) — 값이 몇 개인지.\n" +
              "arr.shape — 생김새. 한 줄이면 (5,), 표 모양이면 (줄, 칸).\n" +
              "\n" +
              "## 꺼내기 (번호는 0부터)\n" +
              "arr[0] — 0번째 값 하나.\n" +
              "arr[-1] — 맨 끝 값. 음수는 뒤에서부터 셉니다.\n" +
              "arr[1:3] — 1번부터 2번까지. 끝 번호는 포함하지 않습니다.\n" +
              "arr[-3:] — 뒤에서 세 개.\n" +
              "m[0] — 0번 줄 전체.\n" +
              "m[:, 1] — 1번 칸 전체(세로). 쉼표 앞이 줄, 뒤가 칸이고 : 는 전부라는 뜻입니다.\n" +
              "m[1, 2] — 1번 줄 2번 칸의 값 하나.\n" +
              "\n" +
              "## 줄여서 하나로\n" +
              "arr.sum() — 합계\n" +
              "arr.mean() — 평균\n" +
              "arr.max() / arr.min() — 가장 큰 값 / 작은 값\n" +
              "arr.argmax() — 가장 큰 값이 몇 번째 자리인지\n" +
              "m.mean(axis=0) — 칸별 평균(세로). axis=1 이면 줄별 평균(가로).\n",
          },
          {
            path: "work/연습/01_배열이란.py",
            open: 0,
            content:
              "import numpy as np\n" +
              "\n" +
              "nums = [3, 1, 4, 1, 5]\n" +
              'print("리스트에 2를 곱하면:", nums * 2)\n' +
              "\n" +
              "arr = np.array(nums)\n" +
              'print("배열로 바꾸면    :", arr)\n' +
              'print("배열에 2를 곱하면:", arr * 2)\n' +
              "\n" +
              'print("10을 더하면      :", arr + 10)\n' +
              'print("배열끼리 더하면  :", arr + np.array([10, 20, 30, 40, 50]))\n',
          },
        ],
        lines: [
          { who: "Aistb", text: "이 파일은 한꺼번에 돌리지 마십시오. 문장 하나씩 실행하면서 보시겠습니다." },
          {
            who: "Aistb",
            text: "아래의 ↓ 한 줄 버튼입니다. 한 번 누를 때마다 문장 하나가 실행되고, 다음에 실행될 줄이 왼쪽에 파랗게 표시됩니다.",
            spot: ".step",
          },
          { who: "Aistb", text: "세 번 눌러 주세요. 리스트에 2를 곱한 결과가 나올 때까지입니다." },
        ],
        nudge: "아래의 ↓ 한 줄 버튼을 눌러 보세요.",
        wait: steppedTo("work/연습/01_배열이란.py", 3),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "보시는 대로입니다. 리스트에 곱하기는 계산이 아니라 목록을 두 번 이어 붙입니다. 값은 하나도 변하지 않았습니다.",
          },
          {
            who: "Aistb",
            text: "파이썬이 그대로는 배열 단위 연산을 하지 못한다는 것이 이런 뜻입니다. 같은 숫자를 NumPy 배열로 바꿔 보시죠. 두 번 더 눌러 주세요.",
          },
        ],
        spot: ".step",
        nudge: "↓ 한 줄 을 두 번 더 누르시면 배열이 출력됩니다.",
        wait: steppedTo("work/연습/01_배열이란.py", 5),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "출력을 비교해 보십시오. 리스트는 값 사이에 쉼표가 있고 배열은 없습니다. 눈으로 구별하는 방법입니다.",
            spot: { text: "np.array(리스트)", in: ".doc" },
          },
          { who: "Aistb", text: "한 번 더 누르시면 이 배열에 2를 곱합니다." },
        ],
        wait: steppedTo("work/연습/01_배열이란.py", 6),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "여섯, 둘, 여덟, 둘, 열. 다섯 개 전부에 곱해졌습니다. 이것이 리스트와 다른 점이고, 오늘 세 건을 처리하는 근거입니다.",
            spot: { text: "arr * 2", in: ".doc" },
          },
          { who: "Aistb", text: "남은 두 줄은 ▶ 실행으로 한 번에 보시죠. 중단점이 없으면 끝까지 갑니다." },
        ],
        spot: ".run",
        nudge: "▶ 실행을 누르면 남은 문장이 끝까지 실행됩니다.",
        wait: steppedTo("work/연습/01_배열이란.py", 8),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "더하기도 같습니다. 그리고 배열끼리 더하면 같은 자리끼리 더해집니다. 3+10, 1+20, 이런 식입니다.",
            spot: { text: "arr1 + arr2", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "숫자 하나가 배열 전체로 퍼지는 것을 브로드캐스팅이라고 부릅니다. 이름은 그런가 보다 하고 넘기셔도 됩니다.",
          },
        ],
      },

      // ── 의뢰 1 ──────────────────────────────────────
      {
        lines: [{ who: "Aistb", text: "첫 번째 의뢰가 도착했습니다. 의뢰서와 작업 파일을 함께 넣어 두었습니다." }],
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
            text: "방금 배우신 곱하기와 더하기 그대로입니다. fee 를 채우고 실행한 뒤 완료 보고해 주세요.",
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

      // ── 연습 2: 꺼내기와 줄이기 ─────────────────────
      {
        lines: [
          { who: "Aistb", text: "두 번째 의뢰는 배열에서 필요한 부분만 꺼내는 일입니다. 그것부터 익히시겠습니다." },
          { who: "Aistb", text: "이번에는 다른 방법을 알려드리겠습니다. 중단점입니다." },
          {
            who: "Aistb",
            text: "왼쪽 줄 번호를 누르면 빨간 점이 생깁니다. ▶ 실행을 누르면 그 줄 앞에서 멈춥니다. 한 줄씩 누르지 않아도 원하는 곳까지 한 번에 갈 수 있습니다.",
          },
          { who: "Aistb", text: "연습 파일의 8번 줄에 중단점을 찍어 주세요." },
        ],
        addFiles: [
          {
            path: "work/연습/02_꺼내기.py",
            open: 0,
            content:
              "import numpy as np\n" +
              "\n" +
              "counts = np.array([12, 30, 41, 9, 22, 35])   # 엿새치 배달 건수\n" +
              "\n" +
              'print("개수   :", len(counts))\n' +
              'print("생김새 :", counts.shape)\n' +
              "\n" +
              'print("첫 번째     :", counts[0])\n' +
              'print("맨 끝       :", counts[-1])\n' +
              'print("1~2번       :", counts[1:3])\n' +
              'print("뒤에서 세 개:", counts[-3:])\n' +
              "\n" +
              'print("합계        :", counts.sum())\n' +
              'print("평균        :", counts.mean())\n' +
              'print("가장 큰 값  :", counts.max())\n' +
              'print("그 값의 자리:", counts.argmax())\n',
          },
        ],
        nudge: "왼쪽 줄 번호 8을 눌러 보세요. 빨간 점이 생깁니다.",
        wait: function () {
          return IDE.hasBreakpoint("work/연습/02_꺼내기.py", 8);
        },
      },
      {
        lines: [{ who: "Aistb", text: "좋습니다. 이제 ▶ 실행을 누르시면 그 앞까지만 실행됩니다." }],
        spot: ".run",
        nudge: "▶ 실행을 누르면 중단점 앞에서 멈춥니다.",
        wait: steppedTo("work/연습/02_꺼내기.py", 4),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "len 은 값이 몇 개인지, shape 는 생김새입니다. 한 줄짜리라 쉼표 뒤가 비어 있습니다. 줄이 하나뿐이라는 뜻입니다.",
            spot: { text: "arr.shape", in: ".doc" },
          },
          { who: "Aistb", text: "여기서부터가 꺼내는 방법입니다. ▶ 실행을 다시 누르시면 중단점 다음부터 이어서 갑니다." },
        ],
        nudge: "▶ 실행을 다시 누르면 이어서 갑니다.",
        wait: steppedTo("work/연습/02_꺼내기.py", 8),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "counts[0] 은 첫 번째 값입니다. 번호는 0부터 셉니다.",
            spot: { text: "arr[0]", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "counts[-1] 은 맨 끝입니다. 음수는 뒤에서부터 세는 표시라, 개수를 몰라도 마지막을 집을 수 있습니다.",
            spot: { text: "arr[-1]", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "counts[1:3] 은 1번부터 2번까지입니다. 끝 번호 3은 포함하지 않습니다. 이 규칙은 파이썬 전체에서 같습니다.",
            spot: { text: "arr[1:3]", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "counts[-3:] 은 뒤에서 세 개입니다. 앞을 비우면 처음부터, 뒤를 비우면 끝까지라는 뜻입니다.",
            spot: { text: "arr[-3:]", in: ".doc" },
          },
          { who: "Aistb", text: "남은 네 줄도 마저 실행해 주세요." },
        ],
        spot: ".run",
        wait: steppedTo("work/연습/02_꺼내기.py", 12),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "sum, mean, max 는 배열 전체를 숫자 하나로 줄입니다. 뒤에 괄호를 붙이는 것을 잊지 마십시오.",
            spot: { text: "arr.mean()", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "argmax 는 조금 다릅니다. 가장 큰 값이 아니라 그 값이 몇 번째 자리인지를 알려줍니다. 41이 가장 큰데 2가 나온 것은 그래서입니다.",
            spot: { text: "arr.argmax()", in: ".doc" },
          },
        ],
      },

      // ── 의뢰 2 ──────────────────────────────────────
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
        lines: [{ who: "Aistb", text: "세 가지 모두 방금 연습한 것 안에 있습니다. 채우고 실행한 뒤 완료 보고해 주세요." }],
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
      { lines: [{ who: "Aistb", text: "접수했습니다. 필요한 부분만 꺼내는 것, 이것이 두 번째입니다." }] },

      // ── 연습 3: 표 모양 ─────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "마지막 의뢰에는 숫자가 한 줄이 아니라 표 모양으로 들어옵니다." },
          { who: "Aistb", text: "연습 파일을 넣었습니다. 세 번 눌러 표의 생김새까지 확인해 주세요." },
        ],
        addFiles: [
          {
            path: "work/연습/03_표모양.py",
            open: 0,
            content:
              "import numpy as np\n" +
              "\n" +
              "# 리스트 안에 리스트를 넣으면 표 모양이 된다\n" +
              "log = np.array([[12, 30, 41,  9],\n" +
              "                [15, 28, 44, 11],\n" +
              "                [10, 33, 39,  7]])\n" +
              "\n" +
              'print("생김새        :", log.shape)\n' +
              'print("0번 줄        :", log[0])\n' +
              'print("1번 칸        :", log[:, 1])\n' +
              'print("1번 줄 2번 칸 :", log[1, 2])\n' +
              "\n" +
              'print("전체 평균     :", log.mean())\n' +
              'print("칸별 평균     :", log.mean(axis=0))\n' +
              'print("줄별 평균     :", log.mean(axis=1))\n',
          },
        ],
        spot: ".step",
        nudge: "↓ 한 줄 을 세 번 누르시면 생김새가 나옵니다.",
        wait: steppedTo("work/연습/03_표모양.py", 3),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "3줄 4칸이라는 뜻이고, 줄 수가 먼저 옵니다. 표를 받으면 가장 먼저 확인하실 것입니다.",
            spot: { text: "np.array([[1, 2], [3, 4]])", in: ".doc" },
          },
          { who: "Aistb", text: "이제 꺼내는 세 가지입니다. 세 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/연습/03_표모양.py", 6),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "log[0] 은 0번 줄 전체입니다. 가로 한 줄이 통째로 나옵니다.",
            spot: { text: "m[0]", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "log[:, 1] 은 1번 칸 전체입니다. 쉼표 앞이 줄, 뒤가 칸이고, 앞의 : 는 모든 줄이라는 뜻이라 세로로 뽑힙니다.",
            spot: { text: "m[:, 1]", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "쉼표 양쪽에 번호를 다 쓰면 값 하나입니다. log[1, 2] 는 1번 줄 2번 칸입니다.",
            spot: { text: "m[1, 2]", in: ".doc" },
          },
          { who: "Aistb", text: "남은 세 줄은 ▶ 실행으로 한 번에 보시죠." },
        ],
        spot: ".run",
        wait: steppedTo("work/연습/03_표모양.py", 9),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "mean() 만 쓰면 표 전체의 평균입니다. axis=0 을 넣으면 칸별로 세로로, axis=1 을 넣으면 줄별로 가로로 평균을 냅니다.",
            spot: { text: "m.mean(axis=0)", in: ".doc" },
          },
          { who: "Aistb", text: "출력의 개수를 보시면 됩니다. 칸별은 네 개, 줄별은 세 개입니다." },
        ],
      },

      // ── 의뢰 3 ──────────────────────────────────────
      {
        lines: [{ who: "Aistb", text: "마지막 의뢰입니다." }],
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
        nudge: "의뢰 확인을 눌러 마지막 의뢰서를 열어 보세요.",
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0004.md") >= 0;
          });
        },
      },
      {
        lines: [{ who: "Aistb", text: "셋 다 방금 연습한 것 안에 있습니다. 채우고 실행한 뒤 완료 보고해 주세요." }],
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

      // ── 마무리 ──────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "접수했습니다. 오늘 배정된 세 건 모두 처리되었습니다." },
          { who: "Aistb", text: "한꺼번에 계산한다. 필요한 부분만 꺼낸다. 하나로 줄인다. 오늘 하신 것은 이 셋입니다." },
          { who: "Aistb", text: "참고 문서는 work/참고/ 에 남겨 두겠습니다. 내일도 쓰시게 됩니다." },
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
    "421950년 10월 2일.",
    "",
    "NumPy. 숫자를 한꺼번에 계산하는 도구.",
    "리스트에 2를 곱하면 목록이 두 번 이어 붙는다는 걸 오늘 처음 알았다.",
    "그동안 그럴 일이 없었을 뿐이지, 몰랐던 건 몰랐던 거다.",
    "",
    "한 줄씩 실행해서 결과를 보고 나서 설명을 들으니 이상하게 잘 들어왔다.",
    "중단점이라는 것도 배웠다. 원하는 데까지만 가서 멈춘다.",
    "",
    "업무 보조 세 건. 배달료, 최근 사흘 보고, 점심 시간대.",
    "argmax 가 값이 아니라 자리를 준다는 걸 한 번 틀리고 나서 알았다.",
  ],
};
