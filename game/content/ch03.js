// 3장 — NumPy 다시. 새 도구를 늘리지 않고, 배열로 골라내고 줄 세우는 것을 손에 익힌다.
//
// 하루의 짜임: 개념 하나를 연습 파일로 보고 → 익힘 문제로 직접 풀고 → 세 건을 실전으로 처리한다.
// 익힘 문제는 파일 안에 채점표가 들어 있어, 실행하면 문제마다 맞았는지 그 자리에서 나온다.

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

var CH03 = {
  id: "ch03",
  title: "3 · 골라내고 줄 세우기",
  scenes: ["desk", "diary"],

  desk: {
    files: [],

    idleLines: [
      "참고 문서는 work/참고/ 안에 있습니다.",
      "막히셨으면 저를 눌러 주세요.",
      "익힘 문제는 몇 번을 다시 실행하셔도 됩니다. 기록에 남지 않습니다.",
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
          { who: "Aistb", text: "좋은 아침입니다, 토이비님. 어제 넘기신 팀별 집계는 인사팀에서 그대로 썼다고 합니다." },
          { who: "Aistb", text: "오늘 들어온 자료에는 이름이 없습니다. 부품 점검 기록이라 숫자뿐입니다." },
          { who: "Aistb", text: "그래서 오늘은 새 도구를 드리지 않습니다. 첫날 쓰신 배열을 하루 더 쓰시게 됩니다." },
          { who: "Aistb", text: "오늘 순서를 먼저 말씀드리겠습니다. 하나 배우고, 익힘 문제로 손에 익히고, 그다음 실전 세 건입니다." },
        ],
      },

      // ── 개념 1: 조건으로 고르기 ─────────────────────
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
              "## 첫날에 쓴 것\n" +
              "np.array(리스트) — 리스트를 배열로 바꿉니다.\n" +
              "arr * 2 / arr + 10 — 값 하나하나에 계산이 걸립니다.\n" +
              "arr[0] / arr[-1] / arr[1:3] / arr[-3:] — 꺼내기. 번호는 0부터, 끝 번호는 포함하지 않습니다.\n" +
              "arr.sum() / arr.mean() / arr.max() — 배열 전체를 숫자 하나로 줄입니다.\n" +
              "arr.argmax() — 가장 큰 값이 몇 번째 자리인지.\n" +
              "m.mean(axis=0) — 칸별(세로). axis=1 이면 줄별(가로).\n" +
              "\n" +
              "## 오늘 것 · 조건으로 고르기\n" +
              "arr >= 80 — 값마다 참/거짓이 나옵니다. 고르는 것이 아닙니다.\n" +
              "arr[arr >= 80] — 그 참/거짓을 다시 대괄호에 넣으면 참인 값만 남습니다.\n" +
              "(arr >= 80).sum() — 참이 몇 개인지. 참은 1, 거짓은 0으로 세어집니다.\n" +
              "np.where(조건, 참일 때 값, 거짓일 때 값) — 자리마다 둘 중 하나를 골라 새 배열을 만듭니다.\n" +
              "\n" +
              "## 오늘 것 · 줄 세우기\n" +
              "np.sort(arr) — 작은 것부터 늘어놓은 새 배열.\n" +
              "arr[::-1] — 순서를 뒤집습니다. 큰 것부터 보려면 sort 뒤에 붙입니다.\n" +
              "np.argsort(arr) — 값이 아니라 자리 번호를 순서대로 줍니다.\n" +
              "names[order] — 대괄호에 자리 번호 목록을 넣으면 그 순서대로 꺼내집니다.\n" +
              "\n" +
              "## 오늘 것 · 만들기와 모양 바꾸기\n" +
              "np.arange(10) — 0부터 9까지 열 개.\n" +
              "np.zeros(5) — 0이 다섯 개.\n" +
              "arr.reshape(4, 3) — 4줄 3칸으로 모양을 바꿉니다. 개수가 딱 맞아야 합니다(4 × 3 = 12).\n",
          },
          {
            path: "work/연습/05_조건.py",
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
          { who: "Aistb", text: "첫날 요약을 다시 올려 두었습니다. 아래쪽 세 칸이 오늘 붙는 것입니다." },
          { who: "Aistb", text: "연습 파일부터 보시죠. 늘 하시던 대로 한 문장씩입니다. 세 번 눌러 주세요." },
        ],
        spot: ".step",
        nudge: "아래의 ↓ 한 줄 버튼입니다.",
        wait: steppedTo("work/연습/05_조건.py", 3),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "값이 나올 자리에 참과 거짓이 나왔습니다. 이 식은 고른 것이 아니라 값마다 조건에 맞는지를 답한 것입니다.",
            spot: { text: "80 이상인가", in: ".out" },
          },
          { who: "Aistb", text: "어제 표에서 하신 것과 같습니다. 배열에서 먼저 쓰던 방법을 표가 물려받은 것입니다." },
          { who: "Aistb", text: "한 번 더 눌러 보시죠." },
        ],
        spot: ".step",
        wait: steppedTo("work/연습/05_조건.py", 4),
      },
      {
        show: [{ path: "work/참고/numpy_요약.md", pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "그 참/거짓을 다시 대괄호에 넣으면 참인 값만 남습니다. 여섯 개에서 세 개가 되었습니다.",
            spot: { text: "arr[arr >= 80]", in: ".doc" },
          },
          { who: "Aistb", text: "다음 줄은 개수를 셉니다. 한 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/연습/05_조건.py", 5),
      },
      {
        show: [{ path: "work/참고/numpy_요약.md", pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "참/거짓에 sum 을 걸면 개수가 나옵니다. 참은 1, 거짓은 0으로 세어지기 때문입니다.",
            spot: { text: "(arr >= 80).sum()", in: ".doc" },
          },
          { who: "Aistb", text: "마지막 한 줄은 ▶ 실행으로 보시죠." },
        ],
        spot: ".run",
        wait: steppedTo("work/연습/05_조건.py", 6),
      },
      {
        show: [{ path: "work/참고/numpy_요약.md", pane: 1 }],
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

      // ── 익힘 1 ──────────────────────────────────────
      {
        addFiles: [
          {
            path: "work/익힘/01_조건.py",
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
        lines: [
          { who: "Aistb", text: "익힘 문제입니다. 세 문제이고, 방금 보신 것만으로 전부 풀립니다." },
          { who: "Aistb", text: "파일 아래쪽에 채점표가 붙어 있습니다. ▶ 실행 하시면 문제마다 맞았는지 그 자리에서 나옵니다." },
          { who: "Aistb", text: "틀려도 아무 일도 일어나지 않습니다. 세 문제를 다 맞히실 때까지 기다리겠습니다." },
        ],
        spot: ".run",
        nudge: "... 자리를 채우고 ▶ 실행을 누르면 채점표가 알려줍니다.",
        wait: solvedDrill("work/익힘/01_조건.py"),
      },
      {
        lines: [{ who: "Aistb", text: "세 문제 모두 맞히셨습니다. 다음으로 넘어가시죠." }],
      },

      // ── 개념 2: 줄 세우기 ───────────────────────────
      {
        addFiles: [
          {
            path: "work/연습/06_줄세우기.py",
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
          { who: "Aistb", text: "두 번째는 줄 세우기입니다. 큰 것부터 몇 개를 뽑는 일이 업무에서 자주 나옵니다." },
          { who: "Aistb", text: "네 번 눌러 크기순 결과까지 봐 주세요." },
        ],
        spot: ".step",
        nudge: "↓ 한 줄 을 네 번 누르시면 크기순 결과가 나옵니다.",
        wait: steppedTo("work/연습/06_줄세우기.py", 4),
      },
      {
        show: [{ path: "work/참고/numpy_요약.md", pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "np.sort 는 작은 것부터 늘어놓습니다. 원래 배열은 그대로 있고, 늘어놓은 새 배열이 나옵니다.",
            spot: { text: "np.sort(arr)", in: ".doc" },
          },
          { who: "Aistb", text: "업무에서는 큰 것부터가 필요합니다. 한 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/연습/06_줄세우기.py", 5),
      },
      {
        show: [{ path: "work/참고/numpy_요약.md", pane: 1 }],
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
        wait: steppedTo("work/연습/06_줄세우기.py", 7),
      },
      {
        show: [{ path: "work/참고/numpy_요약.md", pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "argsort 는 값이 아니라 자리 번호를 줍니다. 가장 작은 값이 2번 자리에 있으니 2가 먼저 나온 것입니다.",
            spot: { text: "자리 순서", in: ".out" },
          },
          { who: "Aistb", text: "첫날의 argmax 와 같은 식구입니다. 앞에 arg 가 붙으면 값이 아니라 자리입니다." },
          { who: "Aistb", text: "이 자리 번호를 어디에 쓰는지 보시죠. ▶ 실행으로 마지막 줄까지 가 주세요." },
        ],
        spot: ".run",
        wait: steppedTo("work/연습/06_줄세우기.py", 8),
      },
      {
        show: [{ path: "work/참고/numpy_요약.md", pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "대괄호에 자리 번호 목록을 넣으면 그 순서대로 꺼내집니다. 숫자를 줄 세운 순서를 이름에 그대로 옮긴 것입니다.",
            spot: { text: "names[order]", in: ".doc" },
          },
          { who: "Aistb", text: "큰 것부터 두 명이 필요하시면, 뒤집고 앞에서 둘을 자르시면 됩니다." },
        ],
      },

      // ── 익힘 2 ──────────────────────────────────────
      {
        addFiles: [
          {
            path: "work/익힘/02_줄세우기.py",
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
        wait: solvedDrill("work/익힘/02_줄세우기.py"),
      },
      {
        lines: [{ who: "Aistb", text: "좋습니다. 오늘 배울 것이 하나 남았습니다." }],
      },

      // ── 개념 3: 만들기와 모양 바꾸기 ────────────────
      {
        addFiles: [
          {
            path: "work/연습/07_모양바꾸기.py",
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
          { who: "Aistb", text: "지금까지는 숫자를 직접 적어서 배열을 만드셨습니다. 스물넉 시간치를 손으로 적기는 곤란합니다." },
          { who: "Aistb", text: "세 번 눌러 주세요." },
        ],
        spot: ".step",
        nudge: "↓ 한 줄 을 세 번 누르시면 두 줄이 출력됩니다.",
        wait: steppedTo("work/연습/07_모양바꾸기.py", 3),
      },
      {
        show: [{ path: "work/참고/numpy_요약.md", pane: 1 }],
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
        wait: steppedTo("work/연습/07_모양바꾸기.py", 7),
      },
      {
        show: [{ path: "work/참고/numpy_요약.md", pane: 1 }],
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
        wait: steppedTo("work/연습/07_모양바꾸기.py", 9),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "줄로 나누고 나면 첫날의 axis 가 다시 쓰입니다. 줄별 합이 네 개 나왔습니다.",
            spot: { text: "줄별 합", in: ".out" },
          },
          { who: "Aistb", text: "긴 기록을 덩어리로 잘라 보는 일에 이 둘을 같이 씁니다. 오늘 마지막 의뢰가 그렇습니다." },
        ],
      },

      // ── 익힘 3 ──────────────────────────────────────
      {
        addFiles: [
          {
            path: "work/익힘/03_모양.py",
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
        lines: [{ who: "Aistb", text: "오늘의 마지막 익힘 문제입니다. 세 번째는 첫날 배우신 axis 를 쓰십니다." }],
        spot: ".run",
        nudge: "칸별은 세로입니다. 첫날 요약의 axis 항목을 보세요.",
        wait: solvedDrill("work/익힘/03_모양.py"),
      },
      {
        lines: [
          { who: "Aistb", text: "익힘은 여기까지입니다. 지금부터가 실제 업무입니다." },
          { who: "Aistb", text: "세 건 모두 방금 푸신 문제와 같은 모양이되, 자료가 실제 기록으로 바뀝니다." },
        ],
      },

      // ── 실전 1 ──────────────────────────────────────
      {
        lines: [{ who: "Aistb", text: "첫 번째 의뢰입니다." }],
        addFiles: [
          {
            path: "work/의뢰_0007.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0007 — 과열 부품 추리기\n" +
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
              "work/task_07/heat.py 를 채우고 실행한 뒤 완료 보고.\n" +
              "\n" +
              "## 참고\n" +
              "cooled 는 개수가 줄지 않습니다. 여덟 개 그대로 나와야 합니다.\n",
          },
          {
            path: "work/task_07/heat.py",
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
        spot: '.tree-row[data-path="work/의뢰_0007.md"]',
        menu: ["brief"],
        nudge: "저를 눌러 의뢰 확인을 고르시면 의뢰서가 오른쪽에 열립니다.",
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0007.md") >= 0;
          });
        },
      },
      {
        lines: [{ who: "Aistb", text: "익힘 1번과 같은 세 가지입니다. 채우고 실행한 뒤 완료 보고해 주세요." }],
        menu: ["brief", "report"],
        nudge: "고르기는 대괄호, 개수는 sum, 값을 바꾸는 것은 where 입니다.",
        report: function () {
          return checkFile(
            "work/task_07/heat.py",
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

      // ── 실전 2 ──────────────────────────────────────
      {
        lines: [{ who: "Aistb", text: "두 번째 의뢰입니다." }],
        addFiles: [
          {
            path: "work/의뢰_0008.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0008 — 이달의 배달원 세 명\n" +
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
              "work/task_08/top.py 를 채우고 실행한 뒤 완료 보고.\n" +
              "\n" +
              "## 참고\n" +
              "많은 순서입니다. 적은 순서로 뽑으면 상장이 엉뚱한 사람에게 갑니다.\n",
          },
          {
            path: "work/task_08/top.py",
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
        spot: '.tree-row[data-path="work/의뢰_0008.md"]',
        menu: ["brief"],
        nudge: "의뢰 확인을 눌러 새 의뢰서를 열어 보세요.",
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0008.md") >= 0;
          });
        },
      },
      {
        lines: [{ who: "Aistb", text: "익힘 2번에서 두 명을 뽑으셨습니다. 이번에는 세 명이고, 건수도 같이 필요합니다." }],
        menu: ["brief", "report"],
        nudge: "자리 번호를 한 번만 만들어 두면 이름과 건수 양쪽에 같이 쓰실 수 있습니다.",
        report: function () {
          return checkFile(
            "work/task_08/top.py",
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

      // ── 실전 3 ──────────────────────────────────────
      {
        lines: [{ who: "Aistb", text: "마지막 의뢰입니다. 오늘 배운 셋이 한 파일에 다 들어갑니다." }],
        addFiles: [
          {
            path: "work/의뢰_0009.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0009 — 하루 기록을 여섯 시간씩\n" +
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
              "work/task_09/day.py 를 채우고 실행한 뒤 완료 보고.\n",
          },
          {
            path: "work/task_09/day.py",
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
        spot: '.tree-row[data-path="work/의뢰_0009.md"]',
        menu: ["brief"],
        nudge: "의뢰 확인을 눌러 마지막 의뢰서를 열어 보세요.",
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0009.md") >= 0;
          });
        },
      },
      {
        lines: [
          { who: "Aistb", text: "모양을 바꾸고, 줄별로 더하고, 자리를 찾고, 조건으로 셉니다. 오늘 하신 것 그대로입니다." },
          { who: "Aistb", text: "마지막 quiet 은 덩어리가 아니라 원래 기록에서 세십니다." },
        ],
        menu: ["brief", "report"],
        nudge: "덩어리별 합계는 줄별이니 axis=1 입니다.",
        report: function () {
          return checkFile(
            "work/task_09/day.py",
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
          { who: "Aistb", text: "접수했습니다. 오늘 세 건 모두 처리되었습니다." },
          { who: "Aistb", text: "조건으로 고른다. 줄 세워서 뽑는다. 모양을 바꿔서 덩어리로 본다. 오늘은 이 셋입니다." },
          { who: "Aistb", text: "새로 드린 도구는 없습니다. 첫날 것을 오늘 더 쓰셨을 뿐입니다." },
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
    "오늘은 새로 배운 도구가 없다. 첫날 것을 더 썼다.",
    "그런데 첫날보다 훨씬 많은 걸 한 것 같다. 이상한 일이다.",
    "",
    "익힘 문제라는 게 나왔다. 틀리면 그 자리에서 틀렸다고 나온다.",
    "두 번째 것을 네 번 틀렸다. 뒤집는 걸 자꾸 빼먹었다.",
    "네 번째에 맞았을 때 Aistb는 아무 말도 하지 않았다. 그게 나았다.",
    "",
    "arg가 붙으면 값이 아니라 자리라고 했다.",
    "첫날 argmax에서 한 번 틀린 걸 기억하고 있었는데, 오늘은 안 틀렸다.",
  ],
};
