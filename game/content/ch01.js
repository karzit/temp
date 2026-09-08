// 1장 — NumPy를 배우는 날. 의뢰는 하나도 오지 않고, 하루 종일 익히기만 한다.
// 여기서 배운 여섯 가지로 다음 날(2장) 여섯 건을 처리한다.
//
// 연습 파일은 한꺼번에 돌리지 않는다. ↓ 한 줄 로 문장 하나씩 실행하고,
// 그때마다 Aistb가 방금 나온 출력을 짚어준다. 설명이 결과보다 앞서지 않게 하기 위해서다.
// 개념 하나가 끝나면 익힘 파일로 직접 한 번 풀어본다.

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

// 익힘 파일을 끝까지 돌려서 전부 맞혔는가.
function solvedDrill(path) {
  return function () {
    var r = IDE.lastRun;
    return !!r && r.ok && r.path === path && (r.output || "").indexOf("전부 맞았습니다") >= 0;
  };
}

// 익힘 파일 아래에 붙는 채점표. 문제마다 맞았는지 알려주고, 다 맞으면 한 줄을 더 찍는다.
var DRILL_CHECKER =
  "\n" +
  "# ── 여기부터는 채점표입니다. 고치지 마세요 ──\n" +
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
    "import numpy as np 로 가져옵니다. arr 는 한 줄짜리 배열, m 은 표 모양 배열입니다.\n" +
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
    "arr.shape — 생김새. 한 줄이면 (5,), 표 모양이면 (줄, 칸).\n" +
    "arr.reshape(4, 3) — 4줄 3칸으로 모양을 바꿉니다. 개수가 딱 맞아야 합니다(4 × 3 = 12).\n" +
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
    "m.mean(axis=0) — 칸별 평균(세로). axis=1 이면 줄별 평균(가로).\n" +
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
          { who: "Aistb", text: "좋은 아침입니다, 토이비님. 출근 확인되었습니다." },
          { who: "Aistb", text: "오늘은 배정된 의뢰가 없습니다. 하루 종일 교육입니다." },
          { who: "Aistb", text: "익히실 도구는 NumPy 하나입니다." },
          {
            who: "Aistb",
            text: "NumPy 는 파이썬이 그대로는 하지 못하던 배열 단위 연산을 가능하게 하는 도구입니다. 값을 하나씩 꺼내 계산하는 대신, 묶음 하나에 계산을 한 번 걸면 안에 든 값 전부가 계산됩니다.",
          },
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
            spot: { text: "[3, 1, 4, 1, 5, 3, 1, 4, 1, 5]", in: ".out" },
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
            spot: { text: "[3 1 4 1 5]", in: ".out" },
          },
          { who: "Aistb", text: "한 번 더 누르시면 이 배열에 2를 곱합니다." },
        ],
        wait: steppedTo("work/연습/01_배열이란.py", 6),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "여섯, 둘, 여덟, 둘, 열. 다섯 개 전부에 곱해졌습니다. 이것이 리스트와 다른 점이고, 오늘 하루를 여기에 쓰는 이유입니다.",
            spot: { text: "[ 6  2  8  2 10]", in: ".out" },
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
            spot: { text: "[13 21 34 41 55]", in: ".out" },
          },
          {
            who: "Aistb",
            text: "숫자 하나가 배열 전체로 퍼지는 것을 브로드캐스팅이라고 부릅니다. 이름은 그런가 보다 하고 넘기셔도 됩니다.",
          },
        ],
      },

      // ── 개념 2: 꺼내기와 줄이기 ─────────────────────
      {
        lines: [
          { who: "Aistb", text: "다음은 배열에서 필요한 부분만 꺼내는 방법입니다." },
          { who: "Aistb", text: "이번에는 다른 실행 방법을 알려드리겠습니다. 중단점입니다." },
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
            spot: { text: "(6,)", in: ".out" },
          },
          {
            who: "Aistb",
            text: "여기서부터가 꺼내는 방법입니다. ▶ 실행을 다시 누르시면 중단점 다음부터 이어서, 이번에는 끝까지 갑니다. 중단점이 하나뿐이니까요.",
          },
        ],
        nudge: "▶ 실행을 다시 누르면 남은 문장이 끝까지 실행됩니다.",
        wait: steppedTo("work/연습/02_꺼내기.py", 12),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
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
        ],
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "sum, mean, max 는 배열 전체를 숫자 하나로 줄입니다. 뒤에 괄호를 붙이는 것을 잊지 마십시오.",
            spot: { text: "arr.mean()", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "argmax 는 조금 다릅니다. 가장 큰 값이 아니라 그 값이 몇 번째 자리인지를 알려줍니다. 41이 가장 큰데 2가 나온 것은 그래서입니다.",
            spot: { text: "그 값의 자리: 2", in: ".out" },
          },
        ],
      },

      // ── 개념 3: 표 모양 ─────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "숫자가 한 줄이 아니라 표 모양으로 들어오는 경우도 있습니다. 그것이 세 번째입니다." },
          { who: "Aistb", text: "세 번 눌러 표의 생김새까지 확인해 주세요." },
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
            spot: { text: "(3, 4)", in: ".out" },
          },
          { who: "Aistb", text: "이제 꺼내는 세 가지입니다. 세 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/연습/03_표모양.py", 6),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
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
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "mean() 만 쓰면 표 전체의 평균입니다. axis=0 을 넣으면 칸별로 세로로, axis=1 을 넣으면 줄별로 가로로 평균을 냅니다.",
            spot: { text: "m.mean(axis=0)", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "출력의 개수를 보시면 됩니다. 칸별은 네 개, 줄별은 세 개입니다.",
            spot: { text: "칸별 평균", in: ".out" },
          },
        ],
      },

      // ── 익힘 1 ──────────────────────────────────────
      {
        addFiles: [
          {
            path: "work/익힘/01_기본.py",
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
              "# 4) m 의 1번 칸 전체(세로)를 col1 에 넣으세요\n" +
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
          { who: "Aistb", text: "익힘 문제입니다. 파일 아래쪽에 채점표가 붙어 있어서, ▶ 실행 하시면 문제마다 맞았는지 그 자리에서 나옵니다." },
          { who: "Aistb", text: "틀려도 기록에 남지 않습니다. 다 맞히실 때까지 기다리겠습니다." },
        ],
        spot: ".run",
        nudge: "... 자리를 채우고 ▶ 실행을 누르면 채점표가 알려줍니다.",
        wait: solvedDrill("work/익힘/01_기본.py"),
      },
      {
        lines: [{ who: "Aistb", text: "오전은 여기까지입니다." }],
      },

      // ── 개념 4: 조건으로 고르기 ─────────────────────
      {
        addFiles: [
          {
            path: "work/연습/04_조건.py",
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
          { who: "Aistb", text: "오후에는 세 가지를 더 하십니다. 첫 번째는 조건으로 고르기입니다." },
          { who: "Aistb", text: "연습 파일입니다. 세 번 눌러 주세요." },
        ],
        spot: ".step",
        nudge: "아래의 ↓ 한 줄 버튼입니다.",
        wait: steppedTo("work/연습/04_조건.py", 3),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "값이 나올 자리에 참과 거짓이 나왔습니다. 이 식은 고른 것이 아니라 값마다 조건에 맞는지를 답한 것입니다.",
            spot: { text: "80 이상인가", in: ".out" },
          },
          { who: "Aistb", text: "고르는 것은 그다음입니다. 한 번 더 눌러 보시죠." },
        ],
        spot: ".step",
        wait: steppedTo("work/연습/04_조건.py", 4),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "그 참/거짓을 다시 대괄호에 넣으면 참인 값만 남습니다. 여섯 개에서 세 개가 되었습니다.",
            spot: { text: "arr[arr >= 80]", in: ".doc" },
          },
          { who: "Aistb", text: "다음 줄은 개수를 셉니다. 한 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/연습/04_조건.py", 5),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "참/거짓에 sum 을 걸면 개수가 나옵니다. 참은 1, 거짓은 0으로 세어지기 때문입니다.",
            spot: { text: "(arr >= 80).sum()", in: ".doc" },
          },
          { who: "Aistb", text: "마지막 한 줄은 ▶ 실행으로 보시죠." },
        ],
        spot: ".run",
        wait: steppedTo("work/연습/04_조건.py", 6),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "where 는 자리마다 둘 중 하나를 고릅니다. 조건에 맞으면 앞의 값, 아니면 뒤의 값입니다.",
            spot: { text: "np.where(조건, 참일 때 값, 거짓일 때 값)", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "84와 92와 80은 80이 되었고, 나머지는 그대로입니다. 골라내는 것과 달리 개수가 줄지 않습니다.",
            spot: { text: "낮춘 값", in: ".out" },
          },
        ],
      },

      // ── 익힘 2 ──────────────────────────────────────
      {
        addFiles: [
          {
            path: "work/익힘/02_조건.py",
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
        lines: [{ who: "Aistb", text: "익힘 문제입니다. 세 문제이고, 방금 보신 것만으로 전부 풀립니다." }],
        spot: ".run",
        nudge: "고르기는 대괄호, 개수는 sum, 값을 바꾸는 것은 where 입니다.",
        wait: solvedDrill("work/익힘/02_조건.py"),
      },

      // ── 개념 5: 줄 세우기 ───────────────────────────
      {
        addFiles: [
          {
            path: "work/연습/05_줄세우기.py",
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
          { who: "Aistb", text: "다음은 줄 세우기입니다. 큰 것부터 몇 개를 뽑는 일이 업무에서 자주 나옵니다." },
          { who: "Aistb", text: "네 번 눌러 크기순 결과까지 봐 주세요." },
        ],
        spot: ".step",
        nudge: "↓ 한 줄 을 네 번 누르시면 크기순 결과가 나옵니다.",
        wait: steppedTo("work/연습/05_줄세우기.py", 4),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "np.sort 는 작은 것부터 늘어놓습니다. 원래 배열은 그대로 있고, 늘어놓은 새 배열이 나옵니다.",
            spot: { text: "np.sort(arr)", in: ".doc" },
          },
          { who: "Aistb", text: "업무에서는 큰 것부터가 필요합니다. 한 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/연습/05_줄세우기.py", 5),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "뒤에 [::-1] 을 붙이면 순서가 뒤집힙니다. 큰 것부터 보는 방법입니다.",
            spot: { text: "arr[::-1]", in: ".doc" },
          },
          { who: "Aistb", text: "그런데 여기까지로는 부족합니다. 값만 늘어섰을 뿐, 누구의 값인지는 사라졌습니다." },
          { who: "Aistb", text: "두 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/연습/05_줄세우기.py", 7),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "argsort 는 값이 아니라 자리 번호를 줍니다. 가장 작은 값이 2번 자리에 있으니 2가 먼저 나온 것입니다.",
            spot: { text: "자리 순서", in: ".out" },
          },
          { who: "Aistb", text: "오전의 argmax 와 같은 식구입니다. 앞에 arg 가 붙으면 값이 아니라 자리입니다." },
          { who: "Aistb", text: "이 자리 번호를 어디에 쓰는지 보시죠. ▶ 실행으로 마지막 줄까지 가 주세요." },
        ],
        spot: ".run",
        wait: steppedTo("work/연습/05_줄세우기.py", 8),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "대괄호에 자리 번호 목록을 넣으면 그 순서대로 꺼내집니다. 숫자를 줄 세운 순서를 이름에 그대로 옮긴 것입니다.",
            spot: { text: "names[order]", in: ".doc" },
          },
          { who: "Aistb", text: "큰 것부터 두 명이 필요하시면, 뒤집고 앞에서 둘을 자르시면 됩니다." },
        ],
      },

      // ── 익힘 3 ──────────────────────────────────────
      {
        addFiles: [
          {
            path: "work/익힘/03_줄세우기.py",
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
          { who: "Aistb", text: "익힘 문제입니다. 두 번째 문제는 세 가지를 이어 붙이셔야 합니다." },
          { who: "Aistb", text: "자리 번호를 만들고, 뒤집고, 앞에서 둘을 자릅니다. 순서대로 하나씩 붙이시면 됩니다." },
        ],
        spot: ".run",
        nudge: "shops[np.argsort(sales)] 까지 만들어 놓고, 거기에 [::-1] 과 [:2] 를 차례로 붙여 보세요.",
        wait: solvedDrill("work/익힘/03_줄세우기.py"),
      },

      // ── 개념 6: 만들기와 모양 바꾸기 ────────────────
      {
        addFiles: [
          {
            path: "work/연습/06_모양바꾸기.py",
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
              'print("줄별 합:", block.sum(axis=1))\n',
          },
        ],
        lines: [
          { who: "Aistb", text: "마지막입니다. 지금까지는 숫자를 직접 적어서 배열을 만드셨습니다. 스물넉 시간치를 손으로 적기는 곤란합니다." },
          { who: "Aistb", text: "세 번 눌러 주세요." },
        ],
        spot: ".step",
        nudge: "↓ 한 줄 을 세 번 누르시면 두 줄이 출력됩니다.",
        wait: steppedTo("work/연습/06_모양바꾸기.py", 3),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "arange 는 0부터 세어 올라간 배열을 만듭니다. 10을 넣으면 10은 들어가지 않고 9까지입니다.",
            spot: { text: "np.arange(10)", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "zeros 는 0으로 채운 자리를 만듭니다. 점 하나가 붙은 0은 소수점이 있는 숫자라는 표시입니다.",
            spot: { text: "0이 다섯 개", in: ".out" },
          },
          { who: "Aistb", text: "다음은 모양 바꾸기입니다. 네 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/연습/06_모양바꾸기.py", 7),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "reshape 는 값을 그대로 두고 줄과 칸만 다시 나눕니다. 열두 개가 4줄 3칸이 되었습니다.",
            spot: { text: "arr.reshape(4, 3)", in: ".doc" },
          },
          { who: "Aistb", text: "4 곱하기 3이 12라서 되는 것입니다. 개수가 맞지 않으면 에러가 납니다." },
          { who: "Aistb", text: "남은 두 줄은 ▶ 실행으로 보시죠." },
        ],
        spot: ".run",
        wait: steppedTo("work/연습/06_모양바꾸기.py", 9),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "줄로 나누고 나면 오전의 axis 가 다시 쓰입니다. 줄별 합이 네 개 나왔습니다.",
            spot: { text: "줄별 합", in: ".out" },
          },
          { who: "Aistb", text: "긴 기록을 덩어리로 잘라 보는 일에 이 둘을 같이 씁니다." },
        ],
      },

      // ── 익힘 4 ──────────────────────────────────────
      {
        addFiles: [
          {
            path: "work/익힘/04_모양.py",
            open: 0,
            content:
              "import numpy as np\n" +
              "\n" +
              "# 1) 0부터 11까지 열두 개짜리 배열을 nums 에 넣으세요\n" +
              "nums = ...\n" +
              "\n" +
              "# 2) nums 를 3줄 4칸으로 바꿔 table 에 넣으세요\n" +
              "table = ...\n" +
              "\n" +
              "# 3) table 의 칸별 합계(세로)를 col_sum 에 넣으세요\n" +
              "col_sum = ...\n" +
              DRILL_CHECKER +
              "확인('1번', nums, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])\n" +
              "확인('2번', table, [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]])\n" +
              "확인('3번', col_sum, [12, 15, 18, 21])\n" +
              DRILL_TAIL,
          },
        ],
        lines: [{ who: "Aistb", text: "오늘의 마지막 익힘 문제입니다. 세 번째는 오전에 배우신 axis 를 쓰십니다." }],
        spot: ".run",
        nudge: "칸별은 세로입니다. 참고 문서의 axis 항목을 보세요.",
        wait: solvedDrill("work/익힘/04_모양.py"),
      },

      // ── 마무리 ──────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "한꺼번에 계산한다. 필요한 부분만 꺼낸다. 하나로 줄인다." },
          { who: "Aistb", text: "조건으로 고른다. 줄 세워서 뽑는다. 모양을 바꿔 덩어리로 본다." },
          { who: "Aistb", text: "내일부터는 의뢰가 들어옵니다. 오늘 하신 것으로 전부 됩니다." },
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
    "하루 종일 배우기만 했다. 일은 하나도 안 했는데 퇴근할 때 더 피곤했다.",
    "",
    "NumPy. 숫자를 한꺼번에 계산하는 도구.",
    "리스트에 2를 곱하면 목록이 두 번 이어 붙는다는 걸 오늘 처음 알았다.",
    "그동안 그럴 일이 없었을 뿐이지, 몰랐던 건 몰랐던 거다.",
    "",
    "익힘 문제라는 게 있었다. 틀리면 그 자리에서 틀렸다고 나온다.",
    "줄 세우는 문제를 네 번 틀렸다. 뒤집는 걸 자꾸 빼먹었다.",
    "네 번째에 맞았을 때 Aistb는 아무 말도 하지 않았다. 그게 나았다.",
    "",
    "내일은 여섯 건이 온다고 한다. 오늘 배운 걸로 다 된다고 했다.",
    "된다고 하니까 되겠지.",
  ],
};
