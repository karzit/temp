// 1장 — 라이브러리 사용법. 업무 보조 3건을 처리하며 NumPy와 Pandas를 손에 익힌다.
//
// 순서는 항상 같다: 사용법을 먼저 배우고(연습 파일을 실행해 결과를 눈으로 본다),
// 그 다음에 그것으로 실제 의뢰를 처리한다.
// 배운 함수는 work/참고/ 아래 문서로 남아서 언제든 다시 열어볼 수 있다.

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

// 연습 파일을 고치지 않고 그대로 실행했는지 본다.
function ranFile(path) {
  return function () {
    var r = IDE.lastRun;
    return !!r && r.ok && r.path === path;
  };
}

var CH01 = {
  id: "ch01",
  title: "1 · 라이브러리 사용법",
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
          { who: "Aistb", text: "좋은 아침입니다, 깁스텁님. 출근 확인되었습니다." },
          { who: "Aistb", text: "어제 배우신 조작은 손에 익으셨을 겁니다. 오늘부터는 도구를 배우십니다." },
          { who: "Aistb", text: "오늘 배정된 업무는 업무 보조 3건입니다." },
          { who: "Aistb", text: "한 건씩 드리겠습니다. 다만 의뢰를 드리기 전에, 그 일에 필요한 도구 사용법을 먼저 익히시게 됩니다." },
        ],
      },
      {
        lines: [
          { who: "Aistb", text: "첫 번째 업무에 필요한 것은 NumPy 입니다." },
          { who: "Aistb", text: "숫자 다섯 개를 담는 것은 파이썬 리스트로도 됩니다. 다만 리스트에 2를 곱하면 값이 두 배가 되는 것이 아니라 목록이 두 번 이어 붙습니다." },
          { who: "Aistb", text: "NumPy 가 주는 배열은 담는 방식은 비슷한데 계산이 다릅니다. 그 차이를 먼저 보시겠습니다." },
        ],
      },

      // ── NumPy 사용법 (1차원) ────────────────────────
      {
        lines: [
          { who: "Aistb", text: "왼쪽 탐색기에 참고 문서와 연습 파일을 넣어 두었습니다. 참고 문서는 오른쪽 화면에 펼쳐 두었습니다." },
          { who: "Aistb", text: "참고 문서에는 오늘 쓰실 함수가 정리되어 있습니다. 외우실 필요 없습니다. 필요할 때 열어보시면 됩니다." },
        ],
        addFiles: [
          {
            path: "work/참고/numpy_요약.md",
            readOnly: true,
            open: 1,
            content:
              "# NumPy 요약\n" +
              "\n" +
              "import numpy as np 로 가져옵니다. 아래에서 arr 는 배열, m 은 표 모양 배열입니다.\n" +
              "\n" +
              "## 만들기\n" +
              "np.array(리스트) — 리스트를 배열로 바꿉니다.\n" +
              "np.array([[1, 2], [3, 4]]) — 리스트 안에 리스트를 넣으면 표 모양이 됩니다.\n" +
              "\n" +
              "## 계산 (전부 값 하나하나에 적용됩니다)\n" +
              "arr * 2 — 모든 값에 2를 곱합니다.\n" +
              "arr + 10 — 모든 값에 10을 더합니다.\n" +
              "arr1 + arr2 — 같은 자리끼리 더합니다.\n" +
              "\n" +
              "## 크기\n" +
              "len(arr) — 값이 몇 개인지.\n" +
              "arr.shape — 생김새. 한 줄이면 (5,), 표 모양이면 (줄, 칸).\n" +
              "\n" +
              "## 꺼내기\n" +
              "arr[0] — 0번째 값 하나. 번호는 0부터 셉니다.\n" +
              "arr[1:3] — 1번부터 2번까지. 끝 번호는 포함하지 않습니다.\n" +
              "m[0] — 0번 줄 전체.\n" +
              "m[:, 1] — 1번 칸 전체(세로). 쉼표 앞이 줄, 뒤가 칸이고 : 는 전부라는 뜻입니다.\n" +
              "m[1, 2] — 1번 줄 2번 칸의 값 하나.\n" +
              "\n" +
              "## 줄여서 하나로\n" +
              "arr.sum() — 합계\n" +
              "arr.mean() — 평균\n" +
              "arr.max() / arr.min() — 가장 큰 값 / 작은 값\n" +
              "m.mean(axis=0) — 칸별 평균(세로로 계산). axis=1 이면 줄별 평균.\n",
          },
          {
            path: "work/연습/numpy_1차원.py",
            open: true,
            content:
              "import numpy as np\n" +
              "\n" +
              "nums = [3, 1, 4, 1, 5]\n" +
              "arr = np.array(nums)          # 리스트 -> 배열\n" +
              "\n" +
              'print("리스트 :", nums)\n' +
              'print("배열   :", arr)\n' +
              "\n" +
              'print("곱하기 :", arr * 2)\n' +
              'print("더하기 :", arr + 10)\n' +
              'print("배열끼리:", arr + np.array([10, 20, 30, 40, 50]))\n' +
              "\n" +
              'print("개수   :", len(arr))\n' +
              'print("생김새 :", arr.shape)\n' +
              "\n" +
              'print("첫 번째:", arr[0])\n' +
              'print("1~2번  :", arr[1:3])\n' +
              "\n" +
              'print("합계   :", arr.sum())\n' +
              'print("평균   :", arr.mean())\n' +
              'print("최대   :", arr.max(), " 최소:", arr.min())\n',
          },
        ],
        spot: '.tree-row[data-path="work/참고/numpy_요약.md"]',
      },
      {
        lines: [
          { who: "Aistb", text: "연습 파일에는 배울 것이 전부 적혀 있습니다. 고치지 마시고 그대로 한 번 실행해 주세요." },
          { who: "Aistb", text: "결과를 보면서 하나씩 설명드리겠습니다." },
        ],
        spot: ".run",
        nudge: "왼쪽에 열린 numpy_1차원.py 를 고르고 아래의 ▶ 실행을 누르세요.",
        wait: ranFile("work/연습/numpy_1차원.py"),
      },
      {
        show: [{ path: "work/참고/numpy_요약.md", pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "np.array 는 리스트를 배열로 바꿉니다. 출력을 보시면 리스트는 값 사이에 쉼표가 있고 배열은 없습니다. 이것이 눈으로 구별하는 방법입니다.",
            spot: { text: "np.array(리스트)", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "배열에 2를 곱하면 다섯 개 전부에 곱해집니다. 10을 더해도 마찬가지입니다. 하나씩 세지 않습니다.",
            spot: { text: "arr * 2", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "배열끼리 더하면 같은 자리끼리 더해집니다. 3+10, 1+20, 이런 식입니다.",
            spot: { text: "arr1 + arr2", in: ".doc" },
          },
        ],
      },
      {
        show: [{ path: "work/참고/numpy_요약.md", pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "len 은 값이 몇 개인지, shape 는 생김새입니다. 한 줄짜리라 (5,) 로 나왔습니다. 뒤에 표 모양을 다룰 때 다시 보시게 됩니다.",
            spot: { text: "arr.shape", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "값 하나를 꺼낼 때는 arr[0]. 번호는 0부터 셉니다. 첫 번째가 0번입니다.",
            spot: { text: "arr[0]", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "여러 개를 꺼낼 때는 arr[1:3]. 1번부터 2번까지입니다. 끝 번호 3은 포함하지 않습니다. 이 규칙은 파이썬 전체에서 같습니다.",
            spot: { text: "arr[1:3]", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "sum, mean, max, min 은 배열 전체를 숫자 하나로 줄입니다. 뒤에 괄호를 붙이는 것을 잊지 마세요.",
            spot: { text: "arr.mean()", in: ".doc" },
          },
        ],
      },

      // ── 의뢰 1 ──────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "여기까지가 첫 번째 도구입니다. 이제 실제 업무로 해보시겠습니다." },
          { who: "Aistb", text: "첫 번째 의뢰가 도착했습니다. 의뢰서와 작업 파일을 함께 넣어 두었습니다." },
        ],
        addFiles: [
          {
            path: "work/의뢰_0002.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0002 — 배달료 일괄 계산\n" +
              "\n" +
              "발신: 배차 2팀\n" +
              "수신: 아이비 W 깁스텁\n" +
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
              "다섯 건을 하나씩 계산하지 마세요. 배열에 곱하기와 더하기를 한 번씩 하면 끝납니다.\n" +
              "함수가 기억나지 않으면 work/참고/numpy_요약.md 를 여세요.\n",
          },
          {
            path: "work/task_02/fee.py",
            open: true,
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
            text: "거리 1km당 1500원, 기본요금 2000원. 방금 배우신 곱하기와 더하기 그대로입니다.",
            spot: { text: "거리 1km당 1500원", in: ".doc" },
          },
          { who: "Aistb", text: "fee 를 채우고 실행한 뒤 완료 보고해 주세요." },
        ],
        menu: ["brief", "report"],
        nudge: "distance 에 1500을 곱하고 2000을 더하시면 됩니다. 끝나면 완료 보고입니다.",
        report: function () {
          return checkFile(
            "work/task_02/fee.py",
            "import numpy as np\n" +
              "assert 'fee' in dir(), 'fee 가 없습니다. 변수 이름을 그대로 두셔야 합니다.'\n" +
              "assert not isinstance(fee, type(Ellipsis)), 'fee 가 아직 ... 그대로입니다.'\n" +
              "want = distance * 1500 + 2000\n" +
              "assert np.shape(fee) == np.shape(want), f'fee 가 다섯 건이 아닙니다. 지금은 {np.shape(fee)} 입니다. 배열 전체에 한 번에 계산하면 다섯 개가 그대로 나옵니다.'\n" +
              "assert np.allclose(fee, want), f'값이 다릅니다. 지금 {np.asarray(fee)} 인데 {want} 가 나와야 합니다. 1500을 곱하고 2000을 더했는지 보세요.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },
      {
        lines: [
          { who: "Aistb", text: "접수했습니다. 곱하기 한 번, 더하기 한 번으로 다섯 건이 전부 계산되었습니다." },
        ],
      },

      // ── NumPy 사용법 (표 모양) ──────────────────────
      {
        lines: [
          { who: "Aistb", text: "다음 의뢰에는 숫자가 한 줄이 아니라 표 모양으로 들어옵니다." },
          { who: "Aistb", text: "표를 다루는 법을 먼저 익히시겠습니다. 연습 파일을 하나 더 넣었습니다. 그대로 실행해 주세요." },
        ],
        addFiles: [
          {
            path: "work/연습/numpy_표.py",
            open: true,
            content:
              "import numpy as np\n" +
              "\n" +
              "# 리스트 안에 리스트를 넣으면 표 모양이 된다\n" +
              "m = np.array([[12, 30, 41,  9],\n" +
              "              [15, 28, 44, 11],\n" +
              "              [10, 33, 39,  7]])\n" +
              "\n" +
              'print("생김새      :", m.shape)\n' +
              'print("0번 줄      :", m[0])\n' +
              'print("1번 칸      :", m[:, 1])\n' +
              'print("1번 줄 2번 칸:", m[1, 2])\n' +
              "\n" +
              'print("전체 평균   :", m.mean())\n' +
              'print("칸별 평균   :", m.mean(axis=0))\n',
          },
        ],
        spot: ".run",
        nudge: "numpy_표.py 를 열고 ▶ 실행을 누르세요.",
        wait: ranFile("work/연습/numpy_표.py"),
      },
      {
        show: [{ path: "work/참고/numpy_요약.md", pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "shape 가 (3, 4) 로 나왔습니다. 3줄 4칸이라는 뜻입니다. 줄 수가 먼저 옵니다.",
            spot: { text: "arr.shape", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "m[0] 은 0번 줄 전체입니다. 가로 한 줄이 통째로 나옵니다.",
            spot: { text: "m[0]", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "m[:, 1] 은 1번 칸 전체입니다. 쉼표 앞이 줄, 뒤가 칸입니다. 앞의 : 는 모든 줄이라는 뜻이라 세로로 뽑힙니다.",
            spot: { text: "m[:, 1]", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "쉼표 양쪽에 번호를 다 쓰면 값 하나입니다. m[1, 2] 는 1번 줄 2번 칸입니다.",
            spot: { text: "m[1, 2]", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "mean() 은 표 전체의 평균입니다. axis=0 을 넣으면 칸별로, axis=1 을 넣으면 줄별로 평균을 냅니다.",
            spot: { text: "m.mean(axis=0)", in: ".doc" },
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
              "# 의뢰 0003 — 점심 시간대 배달량 확인\n" +
              "\n" +
              "발신: 배차 2팀\n" +
              "수신: 아이비 W 깁스텁\n" +
              "\n" +
              "## 상황\n" +
              "사흘치 배달 건수 기록입니다.\n" +
              "줄 하나가 하루이고, 칸은 왼쪽부터 오전 / 점심 / 저녁 / 야간입니다.\n" +
              "\n" +
              "## 할 일\n" +
              "점심 칸만 사흘치로 뽑고(lunch), 그 평균(avg)을 구해 주세요.\n" +
              "work/task_03/log.py 를 채우고 실행한 뒤 완료 보고.\n" +
              "\n" +
              "## 참고\n" +
              "번호는 0부터 세므로 점심은 1번 칸입니다.\n" +
              "칸을 세로로 뽑는 법과 평균 내는 법은 work/참고/numpy_요약.md 에 있습니다.\n",
          },
          {
            path: "work/task_03/log.py",
            open: true,
            content:
              "import numpy as np\n" +
              "\n" +
              "# 줄 = 하루, 칸 = 오전 / 점심 / 저녁 / 야간\n" +
              "log = np.array([[12, 30, 41,  9],\n" +
              "                [15, 28, 44, 11],\n" +
              "                [10, 33, 39,  7]])\n" +
              "\n" +
              "lunch = ...   # 점심 칸만 세로로\n" +
              "avg = ...     # 그 평균\n" +
              "\n" +
              "print(lunch, avg)\n",
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
        lines: [
          {
            who: "Aistb",
            text: "점심은 왼쪽에서 두 번째이니 1번 칸입니다. 방금 연습하신 그대로 하시면 됩니다.",
            spot: { text: "번호는 0부터 세므로", in: ".doc" },
          },
        ],
        menu: ["brief", "report"],
        nudge: "lunch 는 log[:, 1], avg 는 그 뒤에 .mean() 을 붙이면 됩니다.",
        report: function () {
          return checkFile(
            "work/task_03/log.py",
            "import numpy as np\n" +
              "assert not isinstance(lunch, type(Ellipsis)), 'lunch 가 아직 ... 그대로입니다.'\n" +
              "assert not isinstance(avg, type(Ellipsis)), 'avg 가 아직 ... 그대로입니다.'\n" +
              "want = log[:, 1]\n" +
              "assert np.shape(lunch) == np.shape(want), f'lunch 가 사흘치 세 개가 아닙니다. 지금은 {np.shape(lunch)} 입니다. 쉼표 앞이 줄, 뒤가 칸입니다.'\n" +
              "assert np.array_equal(lunch, want), f'lunch 가 {np.asarray(lunch)} 입니다. 점심은 1번 칸이므로 {want} 가 나와야 합니다.'\n" +
              "assert abs(float(avg) - float(want.mean())) < 1e-9, f'avg 가 {avg} 입니다. lunch 의 평균인 {want.mean():.4f} 가 나와야 합니다.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },
      { lines: [{ who: "Aistb", text: "접수했습니다. 표에서 필요한 부분만 꺼내는 것, 이것이 두 번째입니다." }] },

      // ── Pandas 사용법 ───────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "마지막 자료에는 숫자만 있는 것이 아니라 사람 이름이 섞여 있습니다." },
          { who: "Aistb", text: "NumPy 배열은 숫자를 담는 그릇입니다. 글자가 섞이면 Pandas 를 씁니다." },
          { who: "Aistb", text: "Pandas 요약과 연습 파일을 넣었습니다. 연습 파일을 그대로 실행해 주세요. 처음이라 가져오는 데 잠깐 걸립니다." },
        ],
        addFiles: [
          {
            path: "work/참고/pandas_요약.md",
            readOnly: true,
            open: 1,
            content:
              "# Pandas 요약\n" +
              "\n" +
              "import pandas as pd 로 가져옵니다. 아래에서 df 는 표입니다.\n" +
              "표의 세로 한 칸을 열이라고 부르고, 열마다 이름이 붙어 있습니다.\n" +
              "\n" +
              "## 만들기와 훑어보기\n" +
              "pd.DataFrame(딕셔너리) — 열 이름과 값 목록으로 표를 만듭니다.\n" +
              "df.head(3) — 앞에서 세 줄만 봅니다. 표가 길 때 씁니다.\n" +
              "\n" +
              "## 열 고르기\n" +
              'df["count"] — count 열 하나. 한 줄로 세워진 값 목록이 나옵니다(Series).\n' +
              'df[["name", "count"]] — 두 열. 대괄호가 두 겹이면 결과도 표입니다.\n' +
              "\n" +
              "## 조건으로 줄 고르기\n" +
              'df["count"] >= 30 — 줄마다 참/거짓이 나옵니다.\n' +
              'df[df["count"] >= 30] — 그 참/거짓을 다시 대괄호에 넣으면 참인 줄만 남습니다.\n' +
              "\n" +
              "## 계산\n" +
              'df["count"].mean() — 그 열의 평균. sum() max() min() 도 같습니다.\n' +
              'df.groupby("team") — team 이 같은 것끼리 묶습니다.\n' +
              'df.groupby("team")["count"].mean() — 묶은 뒤 count 열의 평균. 팀마다 한 줄씩 나옵니다.\n',
          },
          {
            path: "work/연습/pandas_기초.py",
            open: true,
            content:
              "import pandas as pd\n" +
              "\n" +
              "df = pd.DataFrame({\n" +
              '    "name":  ["가온", "노을", "다움", "라온", "마루"],\n' +
              '    "count": [41, 22, 35, 30, 18],\n' +
              '    "team":  ["A", "B", "A", "B", "A"],\n' +
              "})\n" +
              "\n" +
              'print("[표 전체]")\n' +
              "print(df)\n" +
              "\n" +
              'print("\\n[앞에서 세 줄]")\n' +
              "print(df.head(3))\n" +
              "\n" +
              'print("\\n[count 열 하나]")\n' +
              'print(df["count"])\n' +
              "\n" +
              'print("\\n[두 열만]")\n' +
              'print(df[["name", "count"]])\n' +
              "\n" +
              'print("\\n[조건: count가 30 이상인가]")\n' +
              'print(df["count"] >= 30)\n' +
              "\n" +
              'print("\\n[조건에 맞는 줄만]")\n' +
              'print(df[df["count"] >= 30])\n' +
              "\n" +
              'print("\\n[count 평균]", df["count"].mean())\n' +
              "\n" +
              'print("\\n[팀별 평균]")\n' +
              'print(df.groupby("team")["count"].mean())\n',
          },
        ],
        spot: ".run",
        nudge: "pandas_기초.py 를 열고 ▶ 실행을 누르세요.",
        wait: ranFile("work/연습/pandas_기초.py"),
      },
      {
        show: [{ path: "work/참고/pandas_요약.md", pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "pd.DataFrame 에 딕셔너리를 넣으면 표가 됩니다. 열 이름이 위에, 줄 번호가 왼쪽에 붙습니다.",
            spot: { text: "pd.DataFrame(딕셔너리)", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "표가 길면 head(3) 으로 앞부분만 봅니다. 오늘은 다섯 줄뿐이라 차이가 작습니다.",
            spot: { text: "df.head(3)", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "열 하나를 부를 때는 이름을 대괄호에 넣습니다. 번호가 아니라 이름으로 부르는 것이 NumPy와 다른 점입니다.",
            spot: { text: 'df["count"]', in: ".doc" },
          },
          {
            who: "Aistb",
            text: "대괄호를 두 겹으로 쓰면 여러 열을 고를 수 있고, 결과도 표로 나옵니다.",
            spot: { text: 'df[["name", "count"]]', in: ".doc" },
          },
        ],
      },
      {
        show: [{ path: "work/참고/pandas_요약.md", pane: 1 }],
        lines: [
          {
            who: "Aistb",
            text: "여기가 오늘의 고비입니다. df[\"count\"] >= 30 은 값을 고르는 것이 아니라 줄마다 참/거짓을 만듭니다. 출력에 True와 False가 늘어선 것을 보셨을 겁니다.",
            spot: { text: 'df["count"] >= 30', in: ".doc" },
          },
          {
            who: "Aistb",
            text: "그 참/거짓을 다시 대괄호에 넣으면 참인 줄만 남습니다. 두 단계가 하나로 붙어 있는 것뿐입니다.",
            spot: { text: 'df[df["count"] >= 30]', in: ".doc" },
          },
          {
            who: "Aistb",
            text: "groupby 는 같은 값끼리 묶습니다. team 으로 묶고 count 열의 평균을 내면 팀마다 한 줄씩 나옵니다.",
            spot: { text: 'df.groupby("team")["count"].mean()', in: ".doc" },
          },
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
              "# 의뢰 0004 — 팀별 실적 정리\n" +
              "\n" +
              "발신: 배차 2팀\n" +
              "수신: 아이비 W 깁스텁\n" +
              "\n" +
              "## 상황\n" +
              "배달원 다섯 명의 이름, 배달 건수, 소속 팀이 있습니다.\n" +
              "\n" +
              "## 할 일\n" +
              "건수가 30 이상인 사람만 남기고, 팀별 평균 건수를 구해 주세요.\n" +
              "work/task_04/team.py 의 result 를 채우고 실행한 뒤 완료 보고.\n" +
              "\n" +
              "## 참고\n" +
              "조건으로 줄을 고른 다음, 그 뒤에 묶어서 평균 내는 것을 이어 붙이면 됩니다.\n" +
              "쓰는 법은 work/참고/pandas_요약.md 에 있습니다.\n",
          },
          {
            path: "work/task_04/team.py",
            open: true,
            content:
              "import pandas as pd\n" +
              "\n" +
              "df = pd.DataFrame({\n" +
              '    "name":  ["가온", "노을", "다움", "라온", "마루"],\n' +
              '    "count": [41, 22, 35, 30, 18],\n' +
              '    "team":  ["A", "B", "A", "B", "A"],\n' +
              "})\n" +
              "\n" +
              "# 건수 30 이상만 남기고, 팀별 평균 건수\n" +
              "result = ...\n" +
              "\n" +
              "print(result)\n",
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
          { who: "Aistb", text: "조건으로 줄을 고르는 것과 묶어서 평균 내는 것, 방금 하신 두 가지를 이어 붙이면 됩니다." },
        ],
        menu: ["brief", "report"],
        nudge: "df[조건] 뒤에 .groupby(\"team\")[\"count\"].mean() 을 그대로 이어 붙이세요.",
        report: function () {
          return checkFile(
            "work/task_04/team.py",
            "import pandas as pd\n" +
              "assert not isinstance(result, type(Ellipsis)), 'result 가 아직 ... 그대로입니다.'\n" +
              "assert isinstance(result, pd.Series), '결과가 표 전체로 나왔습니다. groupby 뒤에 [\\\"count\\\"] 를 붙여 건수 열 하나만 골라 주세요.'\n" +
              "assert set(result.index) == {'A', 'B'}, f'팀 이름이 왼쪽에 와야 합니다. 지금 인덱스는 {list(result.index)} 입니다.'\n" +
              "assert abs(result['A'] - 38.0) < 0.01, f\"A팀 평균이 {result['A']:.2f} 입니다. 38이 나와야 합니다.\"\n" +
              "assert abs(result['B'] - 30.0) < 0.01, f\"B팀 평균이 {result['B']:.2f} 입니다. 30 미만인 사람이 걸러졌다면 30이 됩니다.\"\n"
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
          { who: "Aistb", text: "하나씩 세지 않는다. 필요한 부분만 꺼낸다. 이름으로 부른다. 오늘은 이 셋입니다." },
          { who: "Aistb", text: "참고 문서 두 개는 work/참고/ 에 그대로 남겨 두겠습니다. 내일도 쓰시게 됩니다." },
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
    "오늘은 도구 이름을 두 개 배웠다. NumPy, Pandas.",
    "이름은 어려운데 하는 일은 단순했다. 하나씩 세지 말고 한꺼번에 하라는 것.",
    "",
    "업무 보조 세 건. 배달료 계산, 점심 시간대 배달량, 팀별 평균.",
    "세 건 다 통과했다. 두 번째는 세 번 틀렸지만 그건 일기에 안 쓰기로 한다.",
    "",
    "참/거짓이 줄줄이 나오는 걸 처음 봤을 땐 뭐가 잘못된 줄 알았다.",
    "그걸 다시 대괄호에 넣는다는 건 아직도 좀 이상하다.",
    "",
    "Aistb는 오늘도 정정을 하지 않았다. 조금 아쉬웠다.",
  ],
};
