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

// 실습 채점 코드를 만든다. 이 코드는 편집 파일이 아니라 checkFile 을 거쳐
// 따로 돌기 때문에, 정답도 채점기도 학습자가 여는 파일에는 남지 않는다.
// items 는 [이름, 정답] 쌍의 목록. 순서대로 보다가 처음 틀린 곳을 짚어준다.
function drillCheck(items) {
  var lines = ["import numpy as np"];
  items.forEach(function (it) {
    var name = it[0];
    var want = JSON.stringify(it[1]); // 숫자·문자열·목록 모두 그대로 파이썬 리터럴이 된다
    lines.push(
      "assert '" + name + "' in dir(), '" + name + " 가 없습니다. 문제에 적힌 이름 그대로 만들어 주세요.'"
    );
    lines.push(
      "assert " + name + " is not Ellipsis, '" + name + " 가 아직 ... 그대로입니다.'"
    );
    lines.push(
      "assert np.array_equal(np.asarray(" + name + "), np.asarray(" + want + ")), " +
        "f'" + name + " 가 아직 다릅니다. 지금은 {np.asarray(" + name + ")} 입니다.'"
    );
  });
  return lines.join("\n") + "\n";
}

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
    "len(arr) — 첫 축(맨 바깥)의 길이. 한 줄 배열이면 값의 개수와 같습니다.\n" +
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
    "m.mean(axis=0) — 0번 축을 따라 계산해 그 축을 없앱니다. 지정한 축이 결과에서 사라집니다.\n" +
    "  축 번호는 shape 순서 그대로 0, 1, 2 … 입니다. (2,3,4) 배열에서 axis=0 이면 결과가 (3,4) 가 됩니다.\n" +
    "  표(2차원)에서는 axis=0 이 열별 평균(세로), axis=1 이 행별 평균(가로)이 됩니다.\n" +
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
          { who: "Aistb", text: "금일은 신입 교육 2일차로, 실무에 앞서 필요한 기술을 익히는 일정입니다." },
          { who: "Aistb", text: "제출해 주신 프로필에 따르면, 파이썬에 대한 기초적인 지식을 가지고 계신 것으로 보입니다." },
          { who: "Aistb", text: "그렇다면 파이썬 기초 과정은 생략하고, 곧바로 NumPy부터 진행하겠습니다." },
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
          { who: "Aistb", text: "일단 NumPy가 무엇인지부터 알아보겠습니다." },
          { who: "Aistb", text: "우선 파이썬의 리스트에 정수를 곱하면 그만큼 리스트가 반복된다는 사실을 알고 계실 겁니다." },
          { who: "Aistb", text: "'↓ 한 문장' 버튼을 통해 한 줄씩 코드를 실행해 보실 수 있습니다.", spot: ".step" },
          { who: "Aistb", text: "세 번 눌러 주세요." },
        ],
        nudge: [
          "아래의 ↓ 한 문장 버튼을 눌러 보세요.",
          "'↓ 한 문장' 버튼을 눌러 줄 단위로 실행해 보실 수 있습니다.",
          "이 문구를 5번 보셨다면 정리 해고 시 우선 고려 대상으로 선정되실 수 있습니다.",
          "이 문구를 5번 보셨다면 정리 해고 시 우선 고려 대상으로 선정되실 수 있습니다.이 문구를 5번 보셨다면 정리 해고 시 우선 고려 대상으로 선정되실 수 있습니다.이 문구를 5번 보셨다면 정리 해고 시 우선 고려 대상으로 선정되실 수 있습니다.이 문구를 5번 보셨다면 정리 해고 시 우선 고려 대상으로 선정되실 수 있습니다. 이걸로 5번 보셨습니다.",
          "worklog_GipsWToyb_0008: 폐기 요망",
        ],
        wait: steppedTo("work/예제/01_배열이란.py", 3),
      },
      {
        lines: [
          { who: "Aistb", text: "이렇게 말이죠.", spot: { text: "[3, 1, 4, 1, 5, 3, 1, 4, 1, 5]", in: ".out" } },
          { who: "Aistb", text: "하지만 NumPy를 사용하면 배열의 모든 값에 대한 연산을 수행하는 것이 가능합니다." },
          { who: "Aistb", text: "그러기 위해서는 우선 파이썬 리스트를 NumPy 배열로 바꿔야 합니다." },
          { who: "Aistb", text: "두 번 더 눌러 확인해 주세요.", spot: ".step" },
        ],
        nudge: [
          "↓ 한 문장 버튼을 두 번 더 누르시면 배열이 출력됩니다.",
          "↓ 한 문장 버튼을 더 눌러 배열이 출력되는 것을 확인해 보세요.",
          "바로벤토에서는 시각ㆍ청각 등 일부 장애가 있는 경우 업무 보조를 요청하실 수 있습니다. Aistb에게 요청하세요.",
          "hello Barovento, good bye Toyb",
          "worklog_GipsWToyb_0009: 폐기 요망",
        ],
        wait: steppedTo("work/예제/01_배열이란.py", 5),
      },
      {
        lines: [
          { who: "Aistb", text: "리스트의 쉼표가 사라졌습니다. 이것이 NumPy 배열입니다.", spot: { text: "[3 1 4 1 5]", in: ".out" } },
          { who: "Aistb", text: "이번에는 배열에 2를 곱해 보겠습니다." },
          { who: "Aistb", text: "한 번 더 눌러 확인해 주세요." },
        ],
        wait: steppedTo("work/예제/01_배열이란.py", 6),
      },
      {
        lines: [
          { who: "Aistb", text: "이제 배열의 각 요소에 2가 곱해진 것을 확인하실 수 있습니다.", spot: { text: "[ 6  2  8  2 10]", in: ".out" } },
          { who: "Aistb", text: "남은 두 줄은 ▶ 실행으로 한 번에 보시겠습니다.", spot: ".run" },
        ],
        nudge: [
          "▶ 실행을 누르면 남은 문장이 끝까지 실행됩니다.",
          "▶ 실행으로 남은 2줄을 모두 실행하실 수 있습니다.",
          "한 번에 실행이 마음에 들지 않으신다면 한 줄씩 두 번 실행하셔도 됩니다.",
          "여기 이 크고 반짝이는 초록색 ▶ 실행 버튼을 누르시면 안 됩니다. 아시겠나요?",
          "worklog_GipsWToyb_0010: 폐기 요망",
        ],
        wait: steppedTo("work/예제/01_배열이란.py", 8),
      },
      {
        lines: [
          { who: "Aistb", text: "곱하기뿐만 아니라 더하기, 빼기, 나누기도 모두 가능하며, NumPy 배열끼리의 연산도 가능합니다.", spot: { text: "[13 21 34 41 55]", in: ".out" } },
          { who: "Aistb", text: "이제 NumPy 배열을 다루는 방법에 대해 알아보겠습니다." },
          { who: "Aistb", text: "먼저 배열의 길이와 형태를 살펴보겠습니다." },
        ],
      },

      // ── 개념 2: 꺼내기와 줄이기 ─────────────────────
      {
        lines: [
          { who: "Aistb", text: "아, 그 전에 유용한 기능을 하나 더 알려드립니다." },
          { who: "Aistb", text: "파일의 줄 번호를 눌러 중단점을 지정하실 수 있습니다. 중단점이 지정된 경우 ▶ 실행 시 그 라인 전까지만 실행합니다." },
          { who: "Aistb", text: "8번 줄에 중단점을 지정해 주세요. 개수와 생김새까지만 실행됩니다." },
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
        nudge: [
          "왼쪽 줄 번호 8을 눌러 보세요. 빨간 점이 생깁니다.",
          "왼쪽 줄 번호 8을 눌러 중단점을 지정해 보세요.",
          "중단점을 지정하여 실행하면 디버깅과, 이 문구를 보지 않아도 된다는 이점이 있습니다.",
          "프로필에 따르면 파이썬에 대한 이해가 있으신 것으로 보입니다. 컴퓨터가 없어 서적만으로 공부하셨습니까?",
          "worklog_GipsWToyb_0011: 폐기 요망",
        ],
        wait: function () {
          return IDE.hasBreakpoint("work/예제/02_꺼내기.py", 8);
        },
      },
      {
        lines: [{ who: "Aistb", text: "이제 ▶ 실행을 누르시면 중단점 앞까지만 실행되는 것을 확인하실 수 있습니다.", spot: ".run" }],
        nudge: [
          { text: "▶ 실행을 누르면 중단점 앞에서 멈춥니다.", spot: ".run" },
          { text: "▶ 실행을 눌러야 중단점 이전 라인까지 실행됩니다.", spot: ".run" },
          { text: "▶ 실행을 누르지 않으면 실행되지 않습니다.", spot: ".run" },
          "놀라운 사실: 일반적인 PC 프로그램은 실행을 하지 않으면 스스로 구동하지 않습니다.",
          "worklog_GipsWToyb_0012: 폐기 요망",
        ],
        wait: steppedTo("work/예제/02_꺼내기.py", 4),
      },
      {
        lines: [
          { who: "Aistb", text: "좋습니다. 개수와 생김새가 나왔습니다." },
          { who: "Aistb", text: "6은 배열의 요소가 6개라는 뜻입니다. 전체 요소가 아닌, 최상위 배열 바로 아래 요소들의 개수입니다.", spot: { text: "6", in: ".out" } },
          { who: "Aistb", text: "(6,)은 하위 배열 없이 최상위 배열에 여섯 개의 요소가 존재한다는 뜻입니다.", spot: { text: "(6,)", in: ".out" } },
          { who: "Aistb", text: "이제 배열의 요소를 꺼내는 방법을 살펴보겠습니다. ▶ 실행을 다시 누르시면 남은 줄이 끝까지 실행됩니다.", spot: ".run" },
        ],
        nudge: [
          { text: "▶ 실행을 다시 누르면 남은 라인이 끝까지 실행됩니다.", spot: ".run" },
          { text: "▶ 실행을 다시 누르면 남은 라인을 실행합니다.", spot: ".run" },
          { text: "여기 케이크가 있습니다.", spot: ".run" },
          "The cake is a lie? 영문을 모르겠습니다. 영문(英文)을 잘못 입력하신 것 같습니다.",
          "worklog_GipsWToyb_0013: 폐기 요망",
        ],
        wait: steppedTo("work/예제/02_꺼내기.py", 12),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          { who: "Aistb", text: "한 줄 배열에서 값을 꺼내는 것은 파이썬 리스트처럼 대괄호에 번호를 넣습니다. (표 모양에서 쉼표로 여러 축을 한 번에 꺼내는 것은 NumPy만의 방식이고, 뒤에서 봅니다.)" },
          { who: "Aistb", text: "인덱스는 0부터 셉니다.", spot: { text: "arr[0]", in: ".doc" } },
          { who: "Aistb", text: "음수를 사용해 뒤에서부터 가져올 수도 있습니다.", spot: { text: "arr[-1]", in: ".doc" } },
          { who: "Aistb", text: "1:3 은 1번부터 2번까지입니다. 마지막 인덱스는 포함되지 않습니다.", spot: { text: "arr[1:3]", in: ".doc" } },
          { who: "Aistb", text: "뒤를 비워 두면 해당 인덱스부터 마지막 요소까지 가져옵니다.", spot: { text: "arr[-3:]", in: ".doc" } },
          { who: "Aistb", text: "반대로 앞을 비우면 0번부터 해당 인덱스 바로 앞까지 가져옵니다." },
        ],
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          { who: "Aistb", text: "출력 아래쪽은 위에서부터 각각 sum, mean, max, argmax의 실행 결과입니다." },
          { who: "Aistb", text: "sum은 배열의 각 요소를 모두 합한 값을, mean은 평균을, max는 최댓값을 반환합니다.", spot: { text: "arr.mean()", in: ".doc" } },
          { who: "Aistb", text: "argmax는 조금 다르게, 값이 아니라 최댓값이 있는 자리(인덱스)를 반환합니다. 최댓값 41이 아니라 41이 있는 자리인 2가 나온 것을 확인하실 수 있습니다.", spot: { text: "arr.argmax()", in: ".doc" } },
        ],
      },

      // ── 개념 3: 표 모양 ─────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "이번에는 다차원 배열, 즉 표 모양에서의 동작을 확인해 보겠습니다. 리스트 안에 리스트를 넣으면 행과 열이 생깁니다." },
          { who: "Aistb", text: "결과를 예상하시며 보시면 더 높은 학습 효과를 기대할 수 있습니다." },
          { who: "Aistb", text: "세 번 눌러 주세요.", spot: ".step" },
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
        nudge: [
          { text: "↓ 한 문장 버튼을 세 번 누르시면 생김새가 나옵니다.", spot: ".step" },
          { text: "아래의 ↓ 한 문장 버튼입니다.", spot: ".step" },
          "표는 종이에도 있고 배열에도 있습니다. 다만 배열 쪽이 전기를 더 씁니다.",
          "다차원(多次元)이라 하여 겁먹으실 필요는 없습니다. 차원이 늘어도 봉급은 늘지 않습니다.",
          "worklog_GipsWToyb_0014: 폐기 요망",
        ],
        wait: steppedTo("work/예제/03_표모양.py", 3),
      },
      {
        lines: [
          { who: "Aistb", text: "3행 4열입니다. 모양은 행이 먼저 표기됩니다.", spot: { text: "(3, 4)", in: ".out" } },
          { who: "Aistb", text: "세 번 더 눌러 주세요.", spot: ".step" },
        ],
        nudge: [
          { text: "↓ 한 문장 버튼을 세 번 더 눌러 주세요.", spot: ".step" },
          { text: "행과 열을 꺼내는 결과가 이어서 출력됩니다.", spot: ".step" },
          "행이 먼저, 열이 나중입니다. 순서를 바꾸면 다른 값이 나옵니다.",
          "worklog_GipsWToyb_0015: 폐기 요망",
        ],
        wait: steppedTo("work/예제/03_표모양.py", 6),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          { who: "Aistb", text: "log[0]은 0번 행 전체입니다.", spot: { text: "m[0]", in: ".doc" } },
          { who: "Aistb", text: "쉼표 앞이 행, 뒤가 열입니다. : 는 전부라는 뜻이라 1번 열이 세로로 나왔습니다.", spot: { text: "m[:, 1]", in: ".doc" } },
          { who: "Aistb", text: "양쪽에 번호를 다 쓰면 값 하나입니다.", spot: { text: "m[1, 2]", in: ".doc" } },
          { who: "Aistb", text: "남은 세 줄은 ▶ 실행으로 한 번에 보시겠습니다.", spot: ".run" },
        ],
        nudge: [
          { text: "▶ 실행을 누르면 남은 문장이 끝까지 실행됩니다.", spot: ".run" },
          { text: "평균 세 종류가 이어서 출력됩니다.", spot: ".run" },
          "평균을 구하는 것은 쉽습니다. 평균에 도달하는 것이 어렵습니다.",
          "worklog_GipsWToyb_0016: 폐기 요망",
        ],
        wait: steppedTo("work/예제/03_표모양.py", 9),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          { who: "Aistb", text: "아마 대부분 예상하신 것과 비슷한 결과였을 것입니다." },
          { who: "Aistb", text: "다만 mean에 axis가 붙은 형태는 처음이라 조금 당황스러우셨을 수 있습니다." },
          { who: "Aistb", text: "mean에 axis를 지정하면 배열 전체가 아니라 그 축을 따라 계산합니다. 지정한 축은 결과에서 사라집니다. 축 번호는 shape 순서대로 0, 1, 2 … 입니다.", spot: { text: "m.mean(axis=0)", in: ".doc" } },
          { who: "Aistb", text: "지금은 (행, 열) 두 축짜리 표라, axis=0은 행이 사라져 열별 평균, axis=1은 열이 사라져 행별 평균이 됩니다.", spot: { text: "m.mean(axis=0)", in: ".doc" } },
          { who: "Aistb", text: "열별은 네 개, 행별은 세 개가 나온 것을 확인하실 수 있습니다. 사라진 축의 길이만큼 빠졌습니다.", spot: { text: "열별 평균", in: ".out" } },
        ],
      },
      {
        addFiles: [
          { path: "work/참고/axis_설명.png", kind: "image", readOnly: true, open: 1, content: "image.png" },
        ],
        lines: [
          { who: "Aistb", text: "**알림** 87%의 사용자가 해당 부분에 대해 피드백을 요청하여, 이번 과정에서는 참고용 이미지가 함께 제공됩니다." },
          { who: "Aistb", text: "오른쪽 화면에 띄웠습니다. axis=0 과 axis=1 이 어느 방향인지 그림으로 확인하실 수 있습니다.", spot: '.tree-row[data-path="work/참고/axis_설명.png"]' },
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
              "col1 = ...\n",
          },
        ],
        lines: [
          { who: "Aistb", text: "실습 과제입니다. 네 자리를 모두 채우신 후 완료 보고를 눌러 주세요." },
        ],
        menu: ["report"],
        nudge: [
          "'...' 자리를 채우신 뒤 완료 보고를 누르시면 제가 확인해 드립니다.",
          "네 자리를 모두 채우셔야 채점이 진행됩니다.",
          "참고 문서는 work/참고/ 안에 그대로 있습니다. 언제든 다시 여셔도 됩니다.",
          "실습은 근무의 일부입니다. 근무의 일부는 봉급의 일부입니다. 봉급의 일부는… 계산 중입니다.",
          "worklog_GipsWToyb_0017: 폐기 요망",
        ],
        report: function () {
          return checkFile(
            "work/실습/01_기본.py",
            drillCheck([
              ["plus_ten", [20, 30, 40, 50, 60]],
              ["last_two", [40, 50]],
              ["avg", 30.0],
              ["col1", [2, 5]],
            ])
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },
      {
        lines: [{ who: "Aistb", text: "금일 오전 업무는 여기까지입니다." }],
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
          { who: "Aistb", text: "오후입니다. 이번에는 조건으로 값을 고르는 방법을 알아보겠습니다." },
          { who: "Aistb", text: "세 번 눌러 주세요.", spot: ".step" },
        ],
        nudge: [
          { text: "아래의 ↓ 한 문장 버튼입니다.", spot: ".step" },
          { text: "↓ 한 문장 버튼을 세 번 누르시면 결과가 나옵니다.", spot: ".step" },
          "조건은 참 또는 거짓입니다. 인사 평가와 달리 중간이 없습니다.",
          "worklog_GipsWToyb_0018: 폐기 요망",
        ],
        wait: steppedTo("work/예제/04_조건.py", 3),
      },
      {
        lines: [
          { who: "Aistb", text: "이쪽을 보시면, 값을 고른 것이 아니라 값마다 조건에 맞는지를 표시한 것입니다.", spot: { text: "80 이상인가", in: ".out" } },
          { who: "Aistb", text: "한 번 더 눌러 주세요.", spot: ".step" },
        ],
        nudge: [
          { text: "↓ 한 문장 버튼을 한 번 더 눌러 주세요.", spot: ".step" },
          "참과 거짓이 값의 개수만큼 나옵니다. 여섯 개의 판정입니다.",
          "worklog_GipsWToyb_0019: 폐기 요망",
        ],
        wait: steppedTo("work/예제/04_조건.py", 4),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          { who: "Aistb", text: "그 참/거짓을 다시 대괄호에 넣으면 참인 값만 남습니다. 여섯 개에서 세 개가 되었습니다.", spot: { text: "arr[arr >= 80]", in: ".doc" } },
          { who: "Aistb", text: "한 번 더 눌러 주세요.", spot: ".step" },
        ],
        nudge: [
          { text: "↓ 한 문장 버튼을 한 번 더 눌러 주세요.", spot: ".step" },
          "고르기는 대괄호 안에 조건을 넣는 것으로 완성됩니다.",
          "worklog_GipsWToyb_0020: 폐기 요망",
        ],
        wait: steppedTo("work/예제/04_조건.py", 5),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          { who: "Aistb", text: "sum을 걸면 개수가 됩니다. 참이 1로 세어집니다.", spot: { text: "(arr >= 80).sum()", in: ".doc" } },
          { who: "Aistb", text: "마지막 한 줄은 ▶ 실행으로 보시겠습니다.", spot: ".run" },
        ],
        nudge: [
          { text: "▶ 실행을 누르면 마지막 줄까지 실행됩니다.", spot: ".run" },
          "참을 세는 것은 쉽습니다. 참을 만드는 것이 어렵습니다.",
          "worklog_GipsWToyb_0021: 폐기 요망",
        ],
        wait: steppedTo("work/예제/04_조건.py", 6),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          { who: "Aistb", text: "80 이상은 80이 되고 나머지는 그대로입니다. np.where는 개수를 줄이지 않고 값만 바꿉니다.", spot: { text: "낮춘 값", in: ".out" } },
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
              "fixed = ...\n",
          },
        ],
        lines: [{ who: "Aistb", text: "실습 과제입니다. 모두 완료하신 후 완료 보고를 눌러 주세요." }],
        menu: ["report"],
        nudge: [
          "고르기는 대괄호, 개수는 sum, 값을 바꾸는 것은 where입니다.",
          "세 자리를 모두 채우셔야 채점이 진행됩니다.",
          "조건을 다시 확인하고 싶으시면 참고 문서를 여세요.",
          "실습 2회차입니다. 회차가 늘어도 봉급은 늘지 않습니다.",
          "worklog_GipsWToyb_0022: 폐기 요망",
        ],
        report: function () {
          return checkFile(
            "work/실습/02_조건.py",
            drillCheck([
              ["pass_scores", [72, 90, 61, 83]],
              ["pass_count", 4],
              ["fixed", [72, 60, 90, 61, 60, 83]],
            ])
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
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
          { who: "Aistb", text: "금일 마지막입니다. 배열을 크기순으로 줄 세우는 방법을 알아보겠습니다." },
          { who: "Aistb", text: "네 번 눌러 주세요.", spot: ".step" },
        ],
        nudge: [
          { text: "↓ 한 문장 버튼을 네 번 누르시면 크기순 결과가 나옵니다.", spot: ".step" },
          { text: "아래의 ↓ 한 문장 버튼입니다.", spot: ".step" },
          "줄을 세우는 것은 정렬입니다. 줄을 서는 것은 근태입니다.",
          "worklog_GipsWToyb_0023: 폐기 요망",
        ],
        wait: steppedTo("work/예제/05_줄세우기.py", 4),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          { who: "Aistb", text: "한 번 더 눌러 주세요.", spot: ".step" },
        ],
        nudge: [
          { text: "↓ 한 문장 버튼을 한 번 더 눌러 주세요.", spot: ".step" },
          "큰 것부터 보시려면 순서를 뒤집으면 됩니다.",
          "worklog_GipsWToyb_0024: 폐기 요망",
        ],
        wait: steppedTo("work/예제/05_줄세우기.py", 5),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          { who: "Aistb", text: "그런데 값만 늘어섰을 뿐, 누구의 값인지는 사라졌습니다." },
          { who: "Aistb", text: "두 번 더 눌러 주세요.", spot: ".step" },
        ],
        nudge: [
          { text: "↓ 한 문장 버튼을 두 번 더 눌러 주세요.", spot: ".step" },
          "값은 순서를 알지만, 이름은 순서를 모릅니다.",
          "worklog_GipsWToyb_0025: 폐기 요망",
        ],
        wait: steppedTo("work/예제/05_줄세우기.py", 7),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          { who: "Aistb", text: "argsort는 값이 아니라 자리 번호를 순서대로 돌려줍니다.", spot: { text: "자리 순서", in: ".out" } },
          { who: "Aistb", text: "▶ 실행으로 마지막 줄까지 가 주세요.", spot: ".run" },
        ],
        nudge: [
          { text: "▶ 실행을 누르면 마지막 줄까지 실행됩니다.", spot: ".run" },
          "자리 번호를 알면 이름도 그 순서로 꺼낼 수 있습니다.",
          "worklog_GipsWToyb_0026: 폐기 요망",
        ],
        wait: steppedTo("work/예제/05_줄세우기.py", 8),
      },
      {
        show: [{ path: NUMPY_DOC.path, pane: 1 }],
        lines: [
          { who: "Aistb", text: "숫자를 줄 세운 순서 그대로 이름이 나왔습니다.", spot: { text: "names[order]", in: ".doc" } },
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
              "top2 = ...\n",
          },
        ],
        lines: [
          { who: "Aistb", text: "실습 과제입니다. 두 번째 문항은 자리 번호를 만들고, 뒤집고, 앞에서 둘을 자르시면 됩니다." },
        ],
        menu: ["report"],
        nudge: [
          "shops[np.argsort(sales)] 까지 만들어 놓고, 거기에 [::-1] 과 [:2] 를 차례로 붙여 보세요.",
          "큰 것부터는 뒤집기, 상위 둘은 앞에서 자르기입니다.",
          "금일 마지막 실습입니다.",
          "실습 3회차입니다. 이로써 금일 실습 할당량을 달성하셨습니다. 달성에 대한 별도 보상은 없습니다.",
          "worklog_GipsWToyb_0027: 폐기 요망",
        ],
        report: function () {
          return checkFile(
            "work/실습/03_줄세우기.py",
            drillCheck([
              ["desc", [47, 38, 25, 19, 12]],
              ["top2", ["가게B", "가게D"]],
            ])
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },

      // ── 마무리 ──────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "내일부터는 의뢰가 들어옵니다. 금일 익히신 것으로 처리하시게 됩니다." },
        ],
      },
      {
        lines: [{ who: "Aistb", text: "수고하셨습니다. 이것으로 금일 업무가 종료되었습니다. 내일 뵙겠습니다." }],
        menu: ["end"],
        nudge: [
          "업무 종료를 누르시면 오늘 일과가 끝납니다.",
          "저를 눌러 업무 메뉴에서 업무 종료를 선택하시면 됩니다.",
          "보고되지 않은 잔여 업무는 없습니다. 안심하고 퇴근하셔도 됩니다.",
          "초과 근무에 대한 수당은 지급되지만, 자리를 지키는 것만으로는 초과 근무로 인정되지 않습니다.",
          "worklog_GipsWToyb_0028: 폐기 요망",
        ],
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
