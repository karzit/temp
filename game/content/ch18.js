// 18장 — 표가 아닌 자료. 무늬가 판 위를 돌아다니면 픽셀을 한 줄로 펴는 순간 못 맞힌다.
//
// 프레임워크가 없으므로 필터를 손으로 정해 준다. 학습하는 것은 뒤의 MLP 뿐이다.
// 그래도 요점은 그대로 산다 — 판을 훑는 것과 한 줄로 펴는 것의 차이가 0.59 대 0.98 이다.
// 필터도 학습으로 찾는 것이 진짜 CNN 이라는 것은 마지막에 한 줄로 짚고 넘어간다.

var MARK_CSV = {
  path: "work/자료/판독표본.csv",
  readOnly: true,
  src: "work/자료/판독표본.csv",
};

var MARK_TODO_CSV = {
  path: "work/자료/판독대기.csv",
  readOnly: true,
  src: "work/자료/판독대기.csv",
};

var CONV_DOC = {
  path: "work/참고/판_요약.md",
  readOnly: true,
  content:
    "# 판으로 된 자료\n" +
    "\n" +
    "표는 열마다 뜻이 다릅니다. 3번 열은 늘 3번 열입니다.\n" +
    "판은 다릅니다. 같은 무늬가 왼쪽 위에 있든 오른쪽 아래에 있든 같은 무늬입니다.\n" +
    "판을 한 줄로 펴 버리면 그 사실이 사라집니다. 자리마다 다른 열이 되어 버립니다.\n" +
    "\n" +
    "## 글자를 판으로 되돌리기\n" +
    'imgs = np.array([[int(c) for c in s] for s in df["pixels"]]).reshape(-1, 12, 12)\n' +
    "\n" +
    "144 글자를 숫자 144 개로 바꾸고, 12 × 12 로 접습니다.\n" +
    "reshape 의 -1 은 '나머지는 알아서' 라는 뜻입니다.\n" +
    "\n" +
    "## 그림으로 보기\n" +
    "import matplotlib.pyplot as plt\n" +
    'plt.imshow(imgs[0], cmap="gray")\n' +
    "plt.show()\n" +
    "\n" +
    "숫자만 보고 판단하지 마십시오. 판은 눈으로 한 번 보는 것이 빠릅니다.\n" +
    "\n" +
    "## 훑기 (합성곱)\n" +
    "from scipy.signal import correlate2d\n" +
    'scan = correlate2d(판, 필터, mode="valid")\n' +
    "\n" +
    "작은 필터를 판 위 모든 자리에 대 보고, 자리마다 얼마나 맞아떨어지는지를 적습니다.\n" +
    "12 × 12 판을 3 × 3 필터로 훑으면 10 × 10 이 나옵니다. 가장자리는 필터가 안 들어갑니다.\n" +
    "\n" +
    "같은 필터를 모든 자리에 씁니다. 그래서 무늬가 어디 있든 걸립니다.\n" +
    "한 줄로 펴서 넣는 것과 다른 점이 여기입니다.\n" +
    "\n" +
    "## 묶기 (최대묶기)\n" +
    "conv.reshape(장수, 5, 2, 5, 2).max(axis=(2, 4))\n" +
    "\n" +
    "10 × 10 을 2 × 2 씩 묶어 5 × 5 로 줄입니다. 묶음 안에서 제일 큰 값만 남깁니다.\n" +
    "'이 근처에 있었다' 만 남기고 '정확히 어디였다' 는 버립니다. 자리가 조금 달라도 같은 값이 됩니다.\n" +
    "\n" +
    "## 필터는 어디서 오는가\n" +
    "여기서는 손으로 정해 줍니다. 찾을 무늬를 이미 알고 있기 때문입니다.\n" +
    "실제 CNN 은 이 필터까지 학습으로 찾아냅니다. 무엇을 훑을지를 자료가 정하는 것입니다.\n",
};

var CH18 = {
  id: "ch18",
  title: "18 · 판을 훑는 날",
  decay: 3.3,
  scenes: ["desk", "diary"],

  desk: {
    files: [
      { path: PANDAS_DOC.path, content: PANDAS_DOC.content, readOnly: true },
      { path: NN_DOC.path, content: NN_DOC.content, readOnly: true },
    ],

    idleLines: [
      "자료는 work/자료/판독표본.csv 입니다. 한 줄이 한 장입니다.",
      "막히셨으면 저를 눌러 주세요.",
      "훑을 때와 판정할 때 같은 필터를 쓰셔야 합니다.",
    ],
    errorLines: [
      "코드가 도중에 멈췄습니다. 아래 빨간 글씨의 마지막 줄부터 읽어보세요.",
      "실행이 끝까지 가지 못했습니다. reshape 의 숫자가 맞는지 보시죠. 144 는 12 × 12 입니다.",
      "에러입니다. correlate2d 는 판 하나씩 받습니다. 480 장을 통째로 넣을 수 없습니다.",
    ],

    beats: [
      // ── 아침 ────────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "좋은 아침입니다, 토이비님. 표가 아닌 것이 왔습니다." },
          { who: "Aistb", text: "신규 고객사입니다. 부품에 찍힌 각인을 읽는 검수 AI 를 굴리는 곳입니다." },
        ],
      },

      // ── 의뢰 도착 ───────────────────────────────────
      {
        lines: [{ who: "Aistb", text: "의뢰서입니다." }],
        addFiles: [
          { path: MARK_CSV.path, readOnly: true, src: MARK_CSV.src },
          { path: MARK_TODO_CSV.path, readOnly: true, src: MARK_TODO_CSV.src },
          {
            path: "work/의뢰_0023.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0023 — 각인 판독이 자꾸 틀립니다\n" +
              "\n" +
              "고객: 한도정밀 검수라인 2012호 / 려 O. 하르츠\n" +
              "담당: 깁스 W 토이비\n" +
              "접수: 바로벤토 의뢰접수\n" +
              "\n" +
              "## 고객 원문\n" +
              "> 쓰던 판독기가 열에 넷은 틀립니다. 각인은 세 종류뿐인데도요.\n" +
              "> 각인이 부품 어디에 찍히는지는 정해져 있지 않습니다. 그때그때 다릅니다.\n" +
              "> 검수대를 지나간 부품 480 개의 각인 사진과, 아직 판독 안 한 세 개를 보냅니다.\n" +
              "> 사진은 12 × 12 로 찍어서 한 자리 숫자 144 개를 한 줄로 이어 붙인 것입니다.\n" +
              ">\n" +
              "> 판독기 만든 데는 연락이 안 됩니다. 그쪽도 요새 정신이 없다고만 합니다.\n" +
              "> 저희 라인만 이런 게 아니라고 하더군요.\n" +
              "\n" +
              "## 자료\n" +
              "work/자료/판독표본.csv — 검수대를 지나간 부품 480 개의 각인 사진\n" +
              "\n" +
              "  no     : 부품 번호\n" +
              "  pixels : 12 × 12 로 찍은 사진. 한 자리 숫자 144 개를 한 줄로 이어 붙인 것\n" +
              "  mark   : 사람이 확인한 각인 (가로 / 세로 / 엑스)\n" +
              "\n" +
              "work/자료/판독대기.csv — 아직 판독 안 한 세 개. mark 칸이 없습니다.\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_23/판독.py 를 만들고 아래 셋을 채워 주세요.\n" +
              "\n" +
              "- raw_acc  : 사진을 한 줄로 편 그대로 학습시켰을 때의 점수\n" +
              "- conv_acc : 각인 무늬로 판을 훑어 만든 자료로 학습시켰을 때의 점수\n" +
              "- pred     : 판독대기 세 개의 각인 (이름 그대로 세 개)\n" +
              "\n" +
              "## 조건\n" +
              "- 3할을 떼어 두고 random_state 는 42.\n" +
              "- 고객이 쓰던 판독기의 점수는 raw_acc 언저리일 것입니다. 둘을 나란히 회신합니다.\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0023.md"]',
        menu: ["brief"],
        nudge: [
          "저를 눌러 '의뢰 확인'을 고르시면 의뢰서가 열립니다.",
          "업무 메뉴 첫 번째 항목이 의뢰 확인입니다.",
          "쓰던 판독기가 열에 넷을 틀린다고 합니다. 판독기 만든 데는 연락이 안 되고요. 저희 라인만 이런 게 아니라더군요.",
          "확인하지 않은 의뢰도 마감 기한은 동일하게 적용됩니다.",
          "worklog_GipsWToyb_0108: 폐기 요망",
        ],
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0023.md") >= 0;
          });
        },
      },

      // ── 예제 ────────────────────────────────────────
      {
        addFiles: [
          { path: CONV_DOC.path, readOnly: true, open: 1, content: CONV_DOC.content },
          {
            path: "work/예제/19_판.py",
            open: 0,
            content:
              "import pandas as pd\n" +
              "import numpy as np\n" +
              "import matplotlib.pyplot as plt\n" +
              "from scipy.signal import correlate2d\n" +
              "from sklearn.model_selection import train_test_split\n" +
              "from sklearn.neural_network import MLPClassifier\n" +
              "\n" +
              'df = pd.read_csv("work/자료/판독표본.csv")\n' +
              'y = df["mark"]\n' +
              'imgs = np.array([[int(c) for c in s] for s in df["pixels"]]).reshape(-1, 12, 12)\n' +
              "print(imgs.shape)\n" +
              "\n" +
              "fig, ax = plt.subplots(1, 4, figsize=(6, 2))\n" +
              "for i in range(4):\n" +
              "    ax[i].imshow(imgs[i], cmap=\"gray\")\n" +
              "    ax[i].set_title(y[i])\n" +
              '    ax[i].axis("off")\n' +
              "plt.show()\n" +
              "\n" +
              "X_train, X_test, y_train, y_test = train_test_split(imgs.reshape(len(imgs), -1), y, test_size=0.3, random_state=42)\n" +
              "flat_model = MLPClassifier(hidden_layer_sizes=(32,), max_iter=1500, random_state=42).fit(X_train, y_train)\n" +
              "print(flat_model.score(X_test, y_test))\n" +
              "\n" +
              "edge = np.array([[1, 0, -1], [1, 0, -1], [1, 0, -1]])\n" +
              'scan = correlate2d(imgs[0], edge, mode="valid")\n' +
              "print(scan.shape)\n" +
              "plt.figure(figsize=(3, 3))\n" +
              'plt.imshow(np.abs(scan), cmap="gray")\n' +
              "plt.show()\n" +
              "\n" +
              "def pool(conv):\n" +
              "    # 10 x 10 을 2 x 2 씩 묶어 5 x 5 로 줄인다. 묶음 안에서 제일 큰 값만 남는다.\n" +
              "    return conv.reshape(len(conv), 5, 2, 5, 2).max(axis=(2, 4))\n" +
              "\n" +
              "def features(images, filters):\n" +
              "    parts = []\n" +
              "    for f in filters:\n" +
              '        conv = np.stack([correlate2d(im, f, mode="valid") for im in images])\n' +
              "        parts.append(pool(conv).reshape(len(images), -1))\n" +
              "    return np.concatenate(parts, axis=1)\n" +
              "\n" +
              "EDGES = [np.array([[1, 1, 1], [0, 0, 0], [-1, -1, -1]]),\n" +
              "         np.array([[1, 0, -1], [1, 0, -1], [1, 0, -1]]),\n" +
              "         np.array([[0, -1, 0], [-1, 4, -1], [0, -1, 0]])]\n" +
              "MARKS = [np.array([[1, 1, 1], [0, 0, 0], [0, 0, 0]]),\n" +
              "         np.array([[1, 0, 0], [1, 0, 0], [1, 0, 0]]),\n" +
              "         np.array([[1, 0, 1], [0, 1, 0], [1, 0, 1]])]\n" +
              "\n" +
              'for name, filters in [("일반 모서리", EDGES), ("각인 그대로", MARKS)]:\n' +
              "    F = features(imgs, filters)\n" +
              "    a, b, c, d = train_test_split(F, y, test_size=0.3, random_state=42)\n" +
              "    m = MLPClassifier(hidden_layer_sizes=(32,), max_iter=1500, random_state=42).fit(a, c)\n" +
              "    print(name, F.shape[1], m.score(b, d))\n",
          },
        ],
        lines: [
          { who: "Aistb", text: "이번 자료는 그림입니다. 각인을 픽셀로 읽는 것부터 살펴보겠습니다." },
          { who: "Aistb", text: "열 번 눌러 주세요." },
        ],
        spot: ".step",
        nudge: [
          { text: "아래의 ↓ 한 문장 버튼입니다.", spot: ".step" },
          { text: "↓ 한 문장 버튼을 열 번 누르시면 각인이 그림으로 뜹니다.", spot: ".step" },
          "각인의 자리가 매번 다릅니다. 한 줄로 펴는 순간 다른 자료가 됩니다. 판은 판으로 다뤄야 합니다.",
          "144 글자를 12 × 12 로 접습니다. 사람의 눈에는 당연한 일이, 기계에는 한 단계입니다.",
          "worklog_GipsWToyb_0109: 폐기 요망",
        ],
        wait: steppedTo("work/예제/19_판.py", 10),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "144 글자짜리 한 줄을 12 × 12 로 접었습니다. 480 장입니다.",
            spot: { text: "reshape(-1, 12, 12)", in: ".doc" },
          },
          { who: "Aistb", text: "세 번 더 눌러 눈으로 보시죠." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/19_판.py", 13),
      },
      {
        lines: [
          { who: "Aistb", text: "각인의 자리가 매번 다릅니다." },
          { who: "Aistb", text: "같은 각인이라도 자리가 다르면, 한 줄로 펴는 순간 다른 자료가 됩니다." },
          { who: "Aistb", text: "일단 그대로 넣어 봅니다. 세 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/19_판.py", 16),
      },
      {
        lines: [
          { who: "Aistb", text: "0.59 입니다. 아무렇게나 찍어도 0.33 입니다." },
          { who: "Aistb", text: "열에 넷을 틀린다는 그 판독기가 이 숫자일 것입니다." },
          { who: "Aistb", text: "판을 판으로 다루겠습니다. 여섯 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/19_판.py", 22),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "작은 필터를 판의 모든 자리에 대 보고, 자리마다 얼마나 맞는지 적었습니다.",
            spot: { text: "correlate2d(판, 필터", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "세로로 선 자리만 밝습니다. 세로 모서리를 찾는 필터입니다.",
          },
          {
            who: "Aistb",
            text: "**같은 필터를 모든 자리에 썼으니** 무늬가 어디 있든 걸립니다.",
            spot: { text: "같은 필터를 모든 자리에 씁니다", in: ".doc" },
          },
          { who: "Aistb", text: "2 × 2 로 묶어 줄이면 자리가 조금 달라도 같은 값이 됩니다. 남은 것은 ▶ 실행으로 보시죠." },
        ],
        spot: ".run",
        wait: steppedTo("work/예제/19_판.py", 27),
      },
      {
        lines: [
          { who: "Aistb", text: "0.86 과 0.98 입니다. 한 줄로 폈을 때가 0.59." },
          {
            who: "Aistb",
            text: "위쪽은 아무 모서리 필터나 댄 것입니다. 훑기만 해도 0.86 입니다.",
          },
          {
            who: "Aistb",
            text: "아래쪽은 각인 자체를 필터로 쓴 것입니다. 0.98.",
          },
          {
            who: "Aistb",
            text: "저희는 답을 알아서 필터를 손으로 정했습니다. 실제 CNN 은 이 필터까지 학습으로 찾아냅니다.",
            spot: { text: "필터는 어디서 오는가", in: ".doc" },
          },
        ],
      },

      // ── 의뢰 처리 ───────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "conv_acc 는 각인을 필터로 쓴 쪽입니다." },
          { who: "Aistb", text: "판독대기 세 개도 판으로 되돌려 같은 필터로 훑어 넣으셔야 합니다." },
        ],
        menu: ["brief", "report"],
        nudge: [
          "판독대기도 features 로 같은 필터를 통과시켜야 학습할 때와 열이 맞습니다.",
          "raw_acc, conv_acc, pred — 세 이름을 의뢰서 그대로 써 주세요.",
          "raw_acc 는 사진을 한 줄로 편 그대로, conv_acc 는 각인을 필터로 훑은 자료입니다.",
          "판독대기 세 개는 그림으로 그려 눈으로 먼저 확인하시는 편이 빠릅니다.",
          "worklog_GipsWToyb_0110: 폐기 요망",
        ],
        report: function () {
          return checkFile(
            "work/task_23/판독.py",
            "for _n in ['raw_acc', 'conv_acc', 'pred']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "assert abs(float(raw_acc) - 0.5903) < 0.05, f'raw_acc 가 {float(raw_acc):.4f} 입니다. 0.59 근처가 나와야 합니다. 사진을 한 줄로 편 그대로 넣으셔야 하고, 층 (32,) max_iter 1500 random_state 42 를 맞추셨는지 보세요.'\n" +
              "assert abs(float(conv_acc) - 0.9792) < 0.04, f'conv_acc 가 {float(conv_acc):.4f} 입니다. 0.98 근처가 나와야 합니다. 각인 세 개를 필터로 쓰고 2 × 2 로 묶으셨는지 보세요.'\n" +
              "assert float(conv_acc) > float(raw_acc), f'훑은 쪽이 더 낮게 나왔습니다 ({float(conv_acc):.4f} vs {float(raw_acc):.4f}). 두 변수를 바꿔 담지 않으셨는지 보세요.'\n" +
              "_p = [str(v) for v in pred]\n" +
              "assert len(_p) == 3, f'pred 에 {len(_p)} 개가 들어 있습니다. 세 개입니다.'\n" +
              "assert set(_p) <= {'가로', '세로', '엑스'}, f'pred 에 {_p} 가 들어 있습니다. 각인 이름 그대로 나와야 합니다.'\n" +
              "assert _p == ['엑스', '가로', '세로'], f'pred 가 {_p} 입니다. 판독대기를 그림으로 그려 눈으로 확인해 보십시오. 판으로 되돌린 뒤 학습할 때와 같은 필터로 훑으셨는지도 보세요.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },

      // ── 마무리 ──────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "접수했습니다. 세 개 다 맞았습니다." },
          { who: "Aistb", text: "오늘 이긴 것은 층이 아니라 **판을 판으로 다룬 것**입니다. 층은 어제와 같습니다." },
          { who: "Aistb", text: "내일은 판도 표도 아닌 것이 옵니다." },
        ],
      },
      {
        lines: [{ who: "Aistb", text: "수고하셨습니다. 이것으로 금일 업무가 종료되었습니다. 내일 뵙겠습니다." }],
        menu: ["end"],
        nudge: [
          "업무 종료를 누르시면 오늘 일과가 끝납니다.",
          "저를 눌러 업무 메뉴에서 업무 종료를 선택하시면 됩니다.",
          "오늘 이긴 것은 층이 아니라 판을 판으로 다룬 것입니다. 넣어 주는 모양만 바꾸셨습니다.",
          "내일은 판도 표도 아닌 것이 옵니다. 내일이면 금요일입니다.",
          "worklog_GipsWToyb_0111: 폐기 요망",
        ],
        wait: function () {
          return false;
        },
      },
    ],
  },

  diary: [
    "421950년 10월 23일.",
    "",
    "사진이 왔다. 사진이라는데 열어보니 144글자짜리 문자열이 480줄이다.",
    "숫자만 한참 보다가 그림으로 띄워보고서야 알았다.",
    "각인이 판 위 아무 데나 찍혀 있었다. 매번 자리가 달랐다.",
    "",
    "그대로 한 줄로 펴서 넣으니까 0.59. 판 전체를 훑게 하니까 0.86, 각인 모양 그대로 대니까 0.98.",
    "층은 어제랑 똑같은 걸 썼다. 넣어주는 모양만 바꿨는데.",
    "",
    "진짜는 훑는 모양도 학습으로 찾는단다. 우리는 답을 아니까 손으로 정한 거고.",
    "",
    "그 회사 판독기 만든 데는 연락이 안 된단다. 그쪽도 정신이 없다고.",
    "",
    "집에 오는 길에 로봇이 대교 난간에서 \"아틀란티스가 다시 일어설 거다!!!!!\"라고 외치더니 강으로 뛰어내렸다.",
    "뭐야 저거.",
    "",
    "내일이면 금요일이다.",
  ],
};
