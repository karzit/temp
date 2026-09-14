// 1장 — NumPy를 배우는 날. 의뢰는 하나도 오지 않고, 하루 종일 익히기만 한다.
// 여기서 배운 다섯 가지로 다음 날(2·3장) 여섯 건을 처리한다.
// 모양 바꾸기는 3장 앞머리로 옮겼다 — 배우는 날과 쓰는 날(의뢰 0006) 사이를 벌리지 않으려고.
//
// 예제 파일은 한꺼번에 돌리지 않는다. ↓ 한 문장 버튼으로 문장 하나씩 실행하고,
// 그때마다 Aistb가 방금 나온 출력을 짚어준다. 설명이 결과보다 앞서지 않게 하기 위해서다.
// 개념 하나가 끝나면 실습 파일로 직접 한 번 풀어본다.

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

// 실습 파일을 끝까지 돌려서 전부 맞혔는가.
function solvedDrill(path) {
  return function () {
    var r = IDE.lastRun;
    return !!r && r.ok && r.path === path && (r.output || "").indexOf("전부 맞았습니다") >= 0;
  };
}

// 실습 파일 아래에 붙는 확인표. 문제마다 맞았는지 알려주고, 다 맞으면 한 줄을 더 찍는다.
var DRILL_CHECKER =
  "\n" +
  "# ── 여기부터는 확인표입니다. 고치지 마세요 ──\n" +
  "맞은 = 0\n" +
  "전체 = 0\n" +
  "\n" +
  "def 확인(번호, 내답, 정답):\n" +
  "    global 맞은, 전체\n" +
  "    전체 = 전체 + 1\n" +
  "    try:\n" +
  "        ok = np.array_equal(np.asarray(내답), np.asarray(정답))\n" +
  "    except Exception:\n" +
  "        ok = False\n" +
  "    if ok:\n" +
  "        맞은 = 맞은 + 1\n" +
  "        print(번호, '맞았습니다')\n" +
  "    elif 내답 is Ellipsis:\n" +
  "        print(번호, '아직 ... 그대로입니다')\n" +
  "    else:\n" +
  "        print(번호, '다시 — 지금은 이렇게 나옵니다:', 내답)\n" +
  "\n";

var DRILL_TAIL =
  "\n" +
  "if 맞은 == 전체:\n" +
  "    print('전부 맞았습니다')\n" +
  "else:\n" +
  "    print(전체, '문제 중', 맞은, '개 맞았습니다. 고쳐서 다시 실행해 보세요.')\n";

// 하루 종일 쓰는 참고 문서. 배우는 날과 푸는 날 양쪽에서 같은 것을 내려준다.
var NUMPY_DOC = {
  path: "work/참고/numpy_요약.md",
  readOnly: true,
  content:
    "# NumPy 요약\n" +
    "\n" +
    "import numpy as np 로 가져옵니다. arr 는 값이 한 줄로 늘어선 배열, m 은 표 모양 배열입니다.\n" +
    "\n" +
    "## 만들기\n" +
    "np.array(리스트) — 리스트를 배열로 바꿉니다.\n" +
    "np.array([[1, 2], [3, 4]]) — 리스트 안에 리스트를 넣으면 표 모양이 됩니다.\n" +
    "np.arange(10) — 0부터 9까지 열 개. 끝 번호는 들어가지 않습니다.\n" +
    "np.zeros(5) — 0이 다섯 개.\n" +
    "\n" +
    "## 계산 (값 하나하나에 적용됩니다)\n" +
    "arr * 2 — 모든 값에 2를 곱합니다.\n" +
    "arr + 10 — 모든 값에 10을 더합니다.\n" +
    "arr1 + arr2 — 같은 자리끼리 더합니다.\n" +
    "\n" +
    "## 크기와 모양\n" +
    "len(arr) — 값이 몇 개인지.\n" +
    "arr.shape — 생김새. 한 줄이면 (5,), 표 모양이면 (행, 열).\n" +
    "arr.reshape(4, 3) — 4행 3열로 모양을 바꿉니다. 개수가 딱 맞아야 합니다(4 × 3 = 12).\n" +
    "\n" +
    "## 꺼내기 (번호는 0부터)\n" +
    "arr[0] — 0번째 값 하나.\n" +
    "arr[-1] — 맨 끝 값. 음수는 뒤에서부터 셉니다.\n" +
    "arr[1:3] — 1번부터 2번까지. 끝 번호는 포함하지 않습니다.\n" +
    "arr[-3:] — 뒤에서 세 개.\n" +
    "m[0] — 0번 행 전체.\n" +
    "m[:, 1] — 1번 열 전체(세로). 쉼표 앞이 행, 뒤가 열이고 : 는 전부라는 뜻입니다.\n" +
    "m[1, 2] — 1번 행 2번 열의 값 하나.\n" +
    "\n" +
    "## 줄여서 하나로\n" +
    "arr.sum() — 합계\n" +
    "arr.mean() — 평균\n" +
    "arr.max() / arr.min() — 가장 큰 값 / 작은 값\n" +
    "arr.argmax() — 가장 큰 값이 몇 번째 자리인지\n" +
    "m.mean(axis=0) — 열별 평균(세로). axis=1 이면 행별 평균(가로).\n" +
    "\n" +
    "## 조건으로 고르기\n" +
    "arr >= 80 — 값마다 참/거짓이 나옵니다. 고르는 것이 아닙니다.\n" +
    "arr[arr >= 80] — 그 참/거짓을 다시 대괄호에 넣으면 참인 값만 남습니다.\n" +
    "(arr >= 80).sum() — 참이 몇 개인지. 참은 1, 거짓은 0으로 세어집니다.\n" +
    "np.where(조건, 참일 때 값, 거짓일 때 값) — 자리마다 둘 중 하나를 골라 새 배열을 만듭니다.\n" +
    "\n" +
    "## 줄 세우기\n" +
    "np.sort(arr) — 작은 것부터 늘어놓은 새 배열.\n" +
    "arr[::-1] — 순서를 뒤집습니다. 큰 것부터 보려면 sort 뒤에 붙입니다.\n" +
    "np.argsort(arr) — 값이 아니라 자리 번호를 순서대로 줍니다.\n" +
    "names[order] — 대괄호에 자리 번호 목록을 넣으면 그 순서대로 꺼내집니다.\n",
};

var CH01 = {
  id: "ch01",
  title: "1 · 배열 배우는 날",
  scenes: ["desk", "diary"],

  desk: {
    files: [],

    idleLines: [
      "참고 문서는 work/참고/ 안에 있습니다. 언제든 다시 여셔도 됩니다.",
      "막히셨으면 저를 눌러 주세요.",
      "천천히 하셔도 됩니다. 오늘은 넘길 일이 없습니다.",
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
          { who: "Aistb", text: "좋은 아침입니다, 토이비님." },
          { who: "Aistb", text: "내일 배차 2팀에서 세 건이 들어옵니다. 배달 요금 계산처럼, 값 여러 개에 같은 계산을 거는 일입니다." },
          { who: "Aistb", text: "파이썬만으로도 되지만 능률을 위해 NumPy 를 권해 드립니다. 오늘은 그 사용법입니다." },
        ],
      },

      // ── 개념 1: 배열이란 ────────────────────────────
      {
        addFiles: [
          {
            path: NUMPY_DOC.path,
            readOnly: true,
            open: 1,
            content: NUMPY_DOC.content,
          },
          {
            path: "work/예제/01_배열이란.py",
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
          { who: "Aistb", text: "먼저 파이썬 리스트로, 값마다 2를 곱해 보겠습니다." },
          {
            who: "Aistb",
            text: "↓ 한 문장을 누르면 한 줄씩 실행됩니다.",
            spot: ".step",
          },
          { who: "Aistb", text: "세 번 눌러 주세요." },
        ],
        nudge: "아래의 ↓ 한 문장 버튼을 눌러 보세요.",
        wait: steppedTo("work/예제/01_배열이란.py", 3),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "이쪽을 보시면, 리스트에 곱하기를 했더니 계산이 아니라 목록이 두 번 이어 붙었습니다.",
            spot: { text: "[3, 1, 4, 1, 5, 3, 1, 4, 1, 5]", in: ".out" },
          },
          {
            who: "Aistb",
            text: "두 번 더 눌러 주세요.",
          },
        ],
        spot: ".step",
        nudge: "↓ 한 문장 버튼을 두 번 더 누르시면 배열이 출력됩니다.",
        wait: steppedTo("work/예제/01_배열이란.py", 5),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "쉼표가 사라졌습니다. 배열입니다.",
            spot: { text: "[3 1 4 1 5]", in: ".out" },
          },
          { who: "Aistb", text: "한 번 더 눌러 주세요." },
        ],
        wait: steppedTo("work/예제/01_배열이란.py", 6),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "이제 값마다 곱해졌습니다. 다섯 개 전부.",
            spot: { text: "[ 6  2  8  2 10]", in: ".out" },
          },
          { who: "Aistb", text: "남은 두 줄은 ▶ 실행으로 한 번에 보시죠." },
        ],
        spot: ".run",
        nudge: "▶ 실행을 누르면 남은 문장이 끝까지 실행됩니다.",
        wait: steppedTo("work/예제/01_배열이란.py", 8),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "더하기도 같습니다. 배열끼리는 같은 자리끼리 더해집니다.",
            spot: { text: "[13 21 34 41 55]", in: ".out" },
          },
        ],
      },

      // ── 개념 2: 꺼내기와 줄이기 ─────────────────────
      {
        lines: [
          { who: "Aistb", text: "다음은 배열에서 필요한 부분만 꺼내는 것입니다. 그 전에 실행 방법을 하나 더 알려드립니다." },
          { who: "Aistb", text: "줄 번호를 누르면 중단점입니다. 한 문장씩 누르지 않아도 ▶ 실행이 그 앞에서 멈춥니다." },
          { who: "Aistb", text: "8번 줄에 찍어 주세요." },
        ],
        addFiles: [
          {
            path: "work/예제/02_꺼내기.py",
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
          return IDE.hasBreakpoint("work/예제/02_꺼내기.py", 8);
        },
      },
      {
        lines: [{ who: "Aistb", text: "▶ 실행을 누르시면 그 앞까지만 갑니다." }],
        spot: ".run",
        nudge: "▶ 실행을 누르면 중단점 앞에서 멈춥니다.",
        wait: steppedTo("work/예제/02_꺼내기.py", 4),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "(6,) 은 한 줄에 여섯 개라는 뜻입니다.",
            spot: { text: "(6,)", in: ".out" },
          },
          {
            who: "Aistb",
            text: "▶ 실행을 다시 누르면 끝까지 갑니다.",
          },
        ],
        nudge: "▶ 실행을 다시 누르면 남은 문장이 끝까지 실행됩니다.",
        wait: steppedTo("work/예제/02_꺼내기.py", 12),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "번호는 0부터 셉니다.",
            spot: { text: "arr[0]", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "음수는 뒤에서부터입니다.",
            spot: { text: "arr[-1]", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "1:3 은 1번부터 2번까지입니다. 끝 번호는 들어가지 않습니다.",
            spot: { text: "arr[1:3]", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "뒤를 비우면 끝까지입니다.",
            spot: { text: "arr[-3:]", in: ".doc" },
          },
        ],
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "sum, mean, max 는 배열 전체를 숫자 하나로 줄입니다.",
            spot: { text: "arr.mean()", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "argmax 는 값이 아니라 자리입니다. 41이 가장 큰데 2가 나온 것은 그래서입니다.",
            spot: { text: "그 값의 자리: 2", in: ".out" },
          },
        ],
      },

      // ── 개념 3: 표 모양 ─────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "이번엔 표 모양입니다. 리스트 안에 리스트를 넣으면 행과 열이 생깁니다." },
          { who: "Aistb", text: "세 번 눌러 주세요." },
        ],
        addFiles: [
          {
            path: "work/예제/03_표모양.py",
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
              'print("0번 행        :", log[0])\n' +
              'print("1번 열        :", log[:, 1])\n' +
              'print("1번 행 2번 열 :", log[1, 2])\n' +
              "\n" +
              'print("전체 평균     :", log.mean())\n' +
              'print("열별 평균     :", log.mean(axis=0))\n' +
              'print("행별 평균     :", log.mean(axis=1))\n',
          },
        ],
        spot: ".step",
        nudge: "↓ 한 문장 버튼을 세 번 누르시면 생김새가 나옵니다.",
        wait: steppedTo("work/예제/03_표모양.py", 3),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "3행 4열입니다. 행이 먼저입니다.",
            spot: { text: "(3, 4)", in: ".out" },
          },
          { who: "Aistb", text: "세 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/03_표모양.py", 6),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "log[0] 은 0번 행 전체입니다.",
            spot: { text: "m[0]", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "쉼표 앞이 행, 뒤가 열입니다. : 는 전부라는 뜻이라 1번 열이 세로로 나왔습니다.",
            spot: { text: "m[:, 1]", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "양쪽에 번호를 다 쓰면 값 하나입니다.",
            spot: { text: "m[1, 2]", in: ".doc" },
          },
          { who: "Aistb", text: "남은 세 줄은 ▶ 실행으로 한 번에 보시죠." },
        ],
        spot: ".run",
        wait: steppedTo("work/예제/03_표모양.py", 9),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "axis=0 은 열별, axis=1 은 행별입니다.",
            spot: { text: "m.mean(axis=0)", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "열별은 네 개, 행별은 세 개 나왔습니다.",
            spot: { text: "열별 평균", in: ".out" },
          },
        ],
      },

      // ── 실습 1 ──────────────────────────────────────
      {
        addFiles: [
          {
            path: "work/실습/01_기본.py",
            open: 0,
            content:
              "import numpy as np\n" +
              "\n" +
              "scores = np.array([10, 20, 30, 40, 50])\n" +
              "m = np.array([[1, 2, 3],\n" +
              "              [4, 5, 6]])\n" +
              "\n" +
              "# 1) scores 의 모든 값에 10을 더해 plus_ten 에 넣으세요\n" +
              "plus_ten = ...\n" +
              "\n" +
              "# 2) scores 의 뒤에서 두 개를 last_two 에 넣으세요\n" +
              "last_two = ...\n" +
              "\n" +
              "# 3) scores 의 평균을 avg 에 넣으세요\n" +
              "avg = ...\n" +
              "\n" +
              "# 4) m 의 1번 열 전체(세로)를 col1 에 넣으세요\n" +
              "col1 = ...\n" +
              DRILL_CHECKER +
              "확인('1번', plus_ten, [20, 30, 40, 50, 60])\n" +
              "확인('2번', last_two, [40, 50])\n" +
              "확인('3번', avg, 30.0)\n" +
              "확인('4번', col1, [2, 5])\n" +
              DRILL_TAIL,
          },
        ],
        lines: [
          { who: "Aistb", text: "실습 과제입니다. ▶ 실행을 누르면 확인표가 채점합니다." },
        ],
        spot: ".run",
        nudge: "... 자리를 채우고 ▶ 실행을 누르면 확인표가 알려줍니다.",
        wait: solvedDrill("work/실습/01_기본.py"),
      },
      {
        lines: [{ who: "Aistb", text: "오전은 여기까지입니다." }],
      },

      // ── 개념 4: 조건으로 고르기 ─────────────────────
      {
        addFiles: [
          {
            path: "work/예제/04_조건.py",
            open: 0,
            content:
              "import numpy as np\n" +
              "\n" +
              "temps = np.array([61, 84, 73, 92, 58, 80])   # 부품 여섯 개의 온도\n" +
              "\n" +
              'print("80 이상인가:", temps >= 80)\n' +
              'print("골라내면   :", temps[temps >= 80])\n' +
              'print("몇 개인가  :", (temps >= 80).sum())\n' +
              "\n" +
              'print("낮춘 값    :", np.where(temps >= 80, 80, temps))\n',
          },
        ],
        lines: [
          { who: "Aistb", text: "오후입니다. 이번엔 조건으로 값을 고릅니다." },
          { who: "Aistb", text: "세 번 눌러 주세요." },
        ],
        spot: ".step",
        nudge: "아래의 ↓ 한 문장 버튼입니다.",
        wait: steppedTo("work/예제/04_조건.py", 3),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "이쪽을 보시면, 고른 것이 아니라 값마다 조건에 맞는지를 표시한 것입니다.",
            spot: { text: "80 이상인가", in: ".out" },
          },
          { who: "Aistb", text: "한 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/04_조건.py", 4),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "그것을 다시 대괄호에 넣으면 참인 값만 남습니다. 여섯 개에서 세 개.",
            spot: { text: "arr[arr >= 80]", in: ".doc" },
          },
          { who: "Aistb", text: "한 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/04_조건.py", 5),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "sum 을 걸면 개수입니다. 참이 1로 세어집니다.",
            spot: { text: "(arr >= 80).sum()", in: ".doc" },
          },
          { who: "Aistb", text: "마지막 한 줄은 ▶ 실행으로 보시죠." },
        ],
        spot: ".run",
        wait: steppedTo("work/예제/04_조건.py", 6),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "80 이상은 80이 되고 나머지는 그대로입니다. 개수가 줄지 않습니다.",
            spot: { text: "낮춘 값", in: ".out" },
          },
        ],
      },

      // ── 실습 2 ──────────────────────────────────────
      {
        addFiles: [
          {
            path: "work/실습/02_조건.py",
            open: 0,
            content:
              "import numpy as np\n" +
              "\n" +
              "scores = np.array([72, 55, 90, 61, 48, 83])   # 여섯 명의 점수\n" +
              "\n" +
              "# 1) 60점 이상인 점수만 골라 pass_scores 에 넣으세요\n" +
              "pass_scores = ...\n" +
              "\n" +
              "# 2) 60점 이상인 사람이 몇 명인지 pass_count 에 넣으세요\n" +
              "pass_count = ...\n" +
              "\n" +
              "# 3) 60점 미만은 60으로 올리고 나머지는 그대로 둔 배열을 fixed 에 넣으세요\n" +
              "fixed = ...\n" +
              DRILL_CHECKER +
              "확인('1번', pass_scores, [72, 90, 61, 83])\n" +
              "확인('2번', pass_count, 4)\n" +
              "확인('3번', fixed, [72, 60, 90, 61, 60, 83])\n" +
              DRILL_TAIL,
          },
        ],
        lines: [{ who: "Aistb", text: "실습 과제입니다." }],
        spot: ".run",
        nudge: "고르기는 대괄호, 개수는 sum, 값을 바꾸는 것은 where 입니다.",
        wait: solvedDrill("work/실습/02_조건.py"),
      },

      // ── 개념 5: 줄 세우기 ───────────────────────────
      {
        addFiles: [
          {
            path: "work/예제/05_줄세우기.py",
            open: 0,
            content:
              "import numpy as np\n" +
              "\n" +
              "counts = np.array([31, 45, 28, 52, 39])\n" +
              'names = np.array(["가온", "노을", "다움", "라온", "마루"])\n' +
              "\n" +
              'print("크기순      :", np.sort(counts))\n' +
              'print("큰 것부터   :", np.sort(counts)[::-1])\n' +
              "\n" +
              "order = np.argsort(counts)\n" +
              'print("자리 순서   :", order)\n' +
              'print("그 순서의 이름:", names[order])\n',
          },
        ],
        lines: [
          { who: "Aistb", text: "마지막입니다. 크기순으로 줄을 세웁니다." },
          { who: "Aistb", text: "네 번 눌러 주세요." },
        ],
        spot: ".step",
        nudge: "↓ 한 문장 버튼을 네 번 누르시면 크기순 결과가 나옵니다.",
        wait: steppedTo("work/예제/05_줄세우기.py", 4),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          { who: "Aistb", text: "한 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/05_줄세우기.py", 5),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          { who: "Aistb", text: "그런데 값만 늘어섰을 뿐, 누구의 값인지는 사라졌습니다." },
          { who: "Aistb", text: "두 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/05_줄세우기.py", 7),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "argsort 는 값이 아니라 자리 번호입니다.",
            spot: { text: "자리 순서", in: ".out" },
          },
          { who: "Aistb", text: "▶ 실행으로 마지막 줄까지 가 주세요." },
        ],
        spot: ".run",
        wait: steppedTo("work/예제/05_줄세우기.py", 8),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "숫자를 줄 세운 순서대로 이름이 나왔습니다.",
            spot: { text: "names[order]", in: ".doc" },
          },
        ],
      },

      // ── 실습 3 ──────────────────────────────────────
      {
        addFiles: [
          {
            path: "work/실습/03_줄세우기.py",
            open: 0,
            content:
              "import numpy as np\n" +
              "\n" +
              "sales = np.array([12, 47, 25, 38, 19])\n" +
              'shops = np.array(["가게A", "가게B", "가게C", "가게D", "가게E"])\n' +
              "\n" +
              "# 1) sales 를 큰 것부터 늘어놓아 desc 에 넣으세요\n" +
              "desc = ...\n" +
              "\n" +
              "# 2) 가장 많이 판 가게 두 곳의 이름을 순서대로 top2 에 넣으세요\n" +
              "top2 = ...\n" +
              DRILL_CHECKER +
              "확인('1번', desc, [47, 38, 25, 19, 12])\n" +
              "확인('2번', top2, ['가게B', '가게D'])\n" +
              DRILL_TAIL,
          },
        ],
        lines: [
          { who: "Aistb", text: "실습 과제입니다. 두 번째는 자리 번호를 만들고, 뒤집고, 앞에서 둘을 자릅니다." },
        ],
        spot: ".run",
        nudge: "shops[np.argsort(sales)] 까지 만들어 놓고, 거기에 [::-1] 과 [:2] 를 차례로 붙여 보세요.",
        wait: solvedDrill("work/실습/03_줄세우기.py"),
      },

      // ── 마무리 ──────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "내일부터는 의뢰가 들어옵니다." },
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
    "421950년 10월 2일.",
    "",
    "하루 종일 배우기만 했는데 왜 더 피곤하지.",
    "",
    "리스트에 2를 곱하면 두 배가 되는 게 아니라 목록이 두 번 이어 붙는다.",
    "몰랐다. 아니 이걸 누가 알아. 곱하기라며.",
    "",
    "점심 먹으러 휴게실 갔더니 냉장고에 이름표 붙은 도시락이 네 개 있었다.",
    "나도 내일부터 싸 올까.",
    "",
    "줄 세우는 문제를 네 번 틀렸다. 뒤집는 걸 자꾸 까먹어서.",
    "네 번째에 맞았는데 Aistb가 아무 말도 안 했다. 그게 나았다.",
    "뭐라고 했으면 더 창피했을 듯.",
  ],
};
