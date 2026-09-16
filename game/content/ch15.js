// 15장 — 한 번 잰 점수를 못 믿게 되는 날. 그리고 함정이 놓이는 날.
//
// 주말 사이 고객이 관제 시스템을 올렸고, 점검 이력을 내보내는 형식이 바뀌어 열이 하나 늘었다.
// 정기 유지보수로 새 자료에 재학습하면 점수가 오른다. CV 로 다시 재도 오른다.
// **CV 는 이것을 못 잡는다.** 여러 번 재도 고르게 높으니 오히려 더 믿고 넘어간다.
// 참고 문서에 「무엇을 못 잡는가」 를 적어 두었다 — 나중에 돌아봤을 때 반칙이 아니어야 한다.
// 터지는 것은 16장이다.

var LOG_EXT_CSV = {
  path: "work/자료/점검이력_v2.csv",
  readOnly: true,
  src: "work/자료/점검이력_v2.csv",
};

var CV_DOC = {
  path: "work/참고/여러번_요약.md",
  readOnly: true,
  content:
    "# 한 번 잰 점수는 못 믿습니다\n" +
    "\n" +
    "train_test_split 은 나눌 때마다 다른 것을 떼어 갑니다.\n" +
    "random_state 를 고정하면 늘 같은 것이 떨어져 나오지만, 하필 그것이 쉬웠을 수도 있습니다.\n" +
    "점수가 모델의 실력인지 나누기 운인지 한 번으로는 알 수 없습니다.\n" +
    "\n" +
    "## 여러 번 나눠 재기\n" +
    "from sklearn.model_selection import cross_val_score\n" +
    "scores = cross_val_score(모델, X, y, cv=5)\n" +
    "\n" +
    "자료를 다섯 덩이로 나눕니다. 한 덩이를 시험용으로 두고 나머지 넷으로 배웁니다.\n" +
    "시험용을 바꿔가며 다섯 번 합니다. 모든 행이 정확히 한 번씩 시험을 봅니다.\n" +
    "\n" +
    "scores        — 다섯 번의 점수\n" +
    "scores.mean() — 그 평균\n" +
    "scores.std()  — 얼마나 흔들렸는지. 작을수록 어느 덩이를 떼어도 비슷했다는 뜻입니다.\n" +
    "\n" +
    "fit 을 따로 부르지 않습니다. cross_val_score 가 안에서 다섯 번 학습합니다.\n" +
    "그러니 넣는 모델은 아직 학습하지 않은 것이어야 합니다.\n" +
    "\n" +
    "## 무엇을 잡아주고 무엇을 못 잡는가\n" +
    "잡아주는 것 — 어쩌다 쉬운 시험용이 걸려서 점수가 높게 나온 것.\n" +
    "못 잡는 것   — 열 자체가 잘못 들어와 있는 것. 다섯 번 다 같은 열로 배우기 때문입니다.\n" +
    "\n" +
    "여러 번 재서 고르게 높으면 나누기 운은 아니라는 뜻입니다. 그 이상은 말해주지 않습니다.\n",
};

var CH15 = {
  id: "ch15",
  title: "15 · 여러 번 재는 날",
  decay: 3.05,
  scenes: ["desk", "diary"],

  desk: {
    files: [
      { path: PANDAS_DOC.path, content: PANDAS_DOC.content, readOnly: true },
      { path: FOREST_DOC.path, content: FOREST_DOC.content, readOnly: true },
      { path: METRIC_DOC.path, content: METRIC_DOC.content, readOnly: true },
    ],

    idleLines: [
      "새 자료는 work/자료/점검이력_v2.csv 입니다. 지난주 것과 다릅니다.",
      "막히셨으면 저를 눌러 주세요.",
      "cross_val_score 에는 학습하지 않은 모델을 넣으셔야 합니다.",
    ],
    errorLines: [
      "코드가 도중에 멈췄습니다. 아래 빨간 글씨의 마지막 줄부터 읽어보세요.",
      "실행이 끝까지 가지 못했습니다. 열 이름이 새 자료의 것과 맞는지 보시죠.",
      "에러입니다. cross_val_score 는 나누기 전의 X 와 y 를 통째로 받습니다.",
    ],

    beats: [
      // ── 아침 ────────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "좋은 아침입니다, 토이비님. 주말 사이에 한울운수가 관제 시스템을 갱신했습니다." },
          { who: "Aistb", text: "점검 이력 형식도 바뀌어서, 새로 뽑은 파일이 와 있습니다." },
          { who: "Aistb", text: "자료가 바뀌었으니 다시 학습해 달라는 겁니다." },
        ],
      },

      // ── 의뢰 도착 ───────────────────────────────────
      {
        lines: [{ who: "Aistb", text: "의뢰서입니다." }],
        addFiles: [
          { path: LOG_EXT_CSV.path, readOnly: true, src: LOG_EXT_CSV.src },
          {
            path: "work/의뢰_0020.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0020 — 시스템 갱신에 따른 재학습\n" +
              "\n" +
              "고객: 한울운수 통합관제센터 시스템운영팀 / 소해 V. 뮐러\n" +
              "담당: 깁스 W 토이비\n" +
              "접수: 바로벤토 의뢰접수\n" +
              "\n" +
              "## 고객 원문\n" +
              "> 관제 시스템을 갱신하면서 점검 이력을 새로 뽑았습니다.\n" +
              "> 행은 전과 같은 300 건이고, 내보내는 열이 하나 늘었습니다.\n" +
              "> revisit_days 라고, 그 대수가 다음에 저희 쪽으로 들어온 날까지의 간격입니다.\n" +
              "> 예전 시스템은 이 값을 안 내보냈습니다.\n" +
              ">\n" +
              "> 정기 유지보수입니다. 새 자료로 다시 학습해 주세요.\n" +
              "> 그리고 점수를 한 번만 재지 마시고 여러 번 나눠 재 주세요. 현장에서 자꾸 물어봅니다.\n" +
              ">\n" +
              "> 갱신은 저희가 결정한 게 아니라 위에서 내려온 겁니다. 업계 표준을 따른다고 합니다.\n" +
              "> 덕분에 주말 내내 나와 있었습니다.\n" +
              "\n" +
              "## 자료\n" +
              "work/자료/점검이력_v2.csv — 갱신한 시스템에서 새로 뽑은 점검 이력\n" +
              "\n" +
              "  id · hours · reboots · delay · errors · patched · again   (전과 같음)\n" +
              "  revisit_days                                              (이번에 추가)\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_20/재학습.py 를 만들고 아래 셋을 채워 주세요.\n" +
              "\n" +
              "- cv_old  : 전에 쓰던 다섯 열로 5 겹 나눠 잰 점수의 평균\n" +
              "- cv_new  : 새 열까지 여섯 열로 5 겹 나눠 잰 점수의 평균\n" +
              "- acc_new : 새 열까지 넣고 한 번 나눠 잰 점수\n" +
              "\n" +
              "## 조건\n" +
              "- 숲 100 그루, random_state 42.\n" +
              "- 한 번 나눠 잴 때는 전과 같이 3할.\n" +
              "- 나눠 재는 것은 cv=5.\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0020.md"]',
        menu: ["brief"],
        nudge: [
          "저를 눌러 '의뢰 확인'을 고르시면 의뢰서가 열립니다.",
          "업무 메뉴 첫 번째 항목이 의뢰 확인입니다.",
          "시스템 갱신은 위에서 내려온 결정이라고 합니다. 업계 표준을 따른다고요. 어디서 많이 듣던 말입니다.",
          "확인하지 않은 의뢰도 마감 기한은 동일하게 적용됩니다.",
          "worklog_GipsWToyb_0097: 폐기 요망",
        ],
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0020.md") >= 0;
          });
        },
      },

      // ── 예제 ────────────────────────────────────────
      {
        addFiles: [
          { path: CV_DOC.path, readOnly: true, open: 1, content: CV_DOC.content },
          {
            path: "work/예제/17_여러번.py",
            open: 0,
            content:
              "import pandas as pd\n" +
              "from sklearn.model_selection import train_test_split, cross_val_score\n" +
              "from sklearn.ensemble import RandomForestClassifier\n" +
              "\n" +
              'df = pd.read_csv("work/자료/점검이력_v2.csv")\n' +
              "print(df.columns)\n" +
              "\n" +
              'old = ["hours", "reboots", "delay", "errors", "patched"]\n' +
              'y = df["again"]\n' +
              "\n" +
              "X_train, X_test, y_train, y_test = train_test_split(df[old], y, test_size=0.3, random_state=42)\n" +
              "forest = RandomForestClassifier(n_estimators=100, random_state=42)\n" +
              "forest.fit(X_train, y_train)\n" +
              "print(forest.score(X_test, y_test))\n" +
              "\n" +
              "scores = cross_val_score(RandomForestClassifier(n_estimators=100, random_state=42), df[old], y, cv=5)\n" +
              "print(scores)\n" +
              "print(scores.mean())\n",
          },
        ],
        lines: [
          { who: "Aistb", text: "예제는 전에 쓰던 다섯 열로만 하겠습니다." },
          { who: "Aistb", text: "다섯 번 눌러 주세요." },
        ],
        spot: ".step",
        nudge: [
          { text: "아래의 ↓ 한 문장 버튼입니다.", spot: ".step" },
          { text: "↓ 한 문장 버튼을 다섯 번 누르시면 새 자료의 열 목록이 나옵니다.", spot: ".step" },
          "한 번 잰 점수는 나누기 운일 수 있습니다. 여러 번 재야 실력인지 압니다. 사람 평가도 그러합니다.",
          "cross_val_score 에는 아직 학습하지 않은 모델을 넣으셔야 합니다.",
          "worklog_GipsWToyb_0098: 폐기 요망",
        ],
        wait: steppedTo("work/예제/17_여러번.py", 5),
      },
      {
        lines: [
          { who: "Aistb", text: "맨 뒤의 revisit_days 가 늘었습니다." },
          { who: "Aistb", text: "여섯 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/17_여러번.py", 11),
      },
      {
        lines: [
          { who: "Aistb", text: "0.9556, 지난주와 같습니다." },
          {
            who: "Aistb",
            text: "이 0.9556 은 90 건으로 잰 것입니다. 그 90 건이 하필 쉬웠다면요.",
          },
          {
            who: "Aistb",
            text: "random_state 를 고정했으니 늘 같은 90 건입니다. 같은 답이 계속 나온다고 맞다는 뜻은 아닙니다.",
          },
          { who: "Aistb", text: "남은 세 줄은 ▶ 실행으로 보시죠." },
        ],
        spot: ".run",
        wait: steppedTo("work/예제/17_여러번.py", 14),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "다섯 덩이로 나눠 다섯 번 쟀습니다. 300 행이 전부 한 번씩 시험을 봤습니다.",
            spot: { text: "cross_val_score(모델, X, y, cv=5)", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "0.917 부터 0.983, 평균 0.9467. 한 번 재서 나온 0.9556 은 좋은 쪽이었습니다.",
          },
          {
            who: "Aistb",
            text: "다섯 개가 고르게 붙어 있으면 나누기 운은 아닙니다.",
            spot: { text: "여러 번 재서 고르게 높으면", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "fit 을 따로 부르지 않았습니다. cross_val_score 가 안에서 다섯 번 학습합니다.",
          },
        ],
      },

      // ── 의뢰 처리 ───────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "의뢰는 revisit_days 까지 넣어 같은 것을 한 번 더 하시면 됩니다." },
        ],
        menu: ["brief", "report"],
        nudge: [
          "old 목록에 revisit_days 를 더한 목록을 하나 더 만들고, 같은 것을 그 목록으로 한 번 더 하세요.",
          "cv_old, cv_new, acc_new — 세 이름을 의뢰서 그대로 써 주세요.",
          "숲 100 그루, random_state 42, cv=5. 조건을 맞추셔야 같은 숫자가 나옵니다.",
          "새 열을 넣으니 점수가 올랐습니다. 오르는 것은 대체로 반가운 일입니다. 대체로는요.",
          "worklog_GipsWToyb_0099: 폐기 요망",
        ],
        report: function () {
          return checkFile(
            "work/task_20/재학습.py",
            "for _n in ['cv_old', 'cv_new', 'acc_new']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "assert abs(float(cv_old) - 0.9467) < 0.02, f'cv_old 가 {float(cv_old):.4f} 입니다. 0.9467 이 나와야 합니다. 다섯 열로 cv=5 의 평균을 내셨는지 보세요.'\n" +
              "assert abs(float(cv_new) - 0.98) < 0.02, f'cv_new 가 {float(cv_new):.4f} 입니다. 0.98 이 나와야 합니다. revisit_days 까지 여섯 열로 내셨는지 보세요.'\n" +
              "assert abs(float(acc_new) - 0.9889) < 0.02, f'acc_new 가 {float(acc_new):.4f} 입니다. 0.9889 가 나와야 합니다. 여섯 열로, 3할을 떼어 한 번만 재시면 됩니다.'\n" +
              "assert float(cv_new) > float(cv_old), f'새 열을 넣은 쪽이 더 낮게 나왔습니다 ({float(cv_new):.4f} vs {float(cv_old):.4f}). 두 변수를 바꿔 담지 않으셨는지 보세요.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },

      // ── 마무리 ──────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "접수했습니다." },
          { who: "Aistb", text: "0.9467 에서 0.98 입니다." },
          { who: "Aistb", text: "다섯 겹이 전부 올랐으니 운은 아닙니다." },
          { who: "Aistb", text: "이대로 회신하겠습니다." },
          {
            who: "Aistb",
            text: "정말 좋은 결과입니다. 그나저나 오늘 같은 날은 만두전골이 참 좋습니다.",
            tone: "bad",
          },
        ],
      },
      {
        lines: [{ who: "Aistb", text: "수고하셨습니다. 이것으로 금일 업무가 종료되었습니다. 내일 뵙겠습니다." }],
        menu: ["end"],
        nudge: [
          "업무 종료를 누르시면 오늘 일과가 끝납니다.",
          "저를 눌러 업무 메뉴에서 업무 종료를 선택하시면 됩니다.",
          "다섯 겹이 전부 올랐으니 나누기 운은 아닙니다. 여러 번 재는 것은 그것까지는 잡아 줍니다.",
          "여러 번 재도 잡지 못하는 것이 있습니다. 오늘은 거기까지 말씀드리지 않겠습니다. …만두전골이 좋은 날입니다.",
          "worklog_GipsWToyb_0100: 폐기 요망",
        ],
        wait: function () {
          return false;
        },
      },
    ],
  },

  diary: [
    "421950년 10월 20일.",
    "",
    "지난주에 보낸 0.96이 마음에 걸린다.",
    "오늘 다섯 번 다시 쟀더니 0.92부터 0.98까지 나왔다. 내가 보낸 건 그중에 잘 나온 쪽이었다.",
    "몰랐으니까 어쩔 수 없는데, 그쪽에서 그 숫자를 보고 있다고 생각하면 좀 그렇다.",
    "",
    "다행히 주말 사이에 열이 하나 새로 들어왔다. 그걸 넣으니까 0.98.",
    "이번엔 다섯 번 다 올랐다. 이건 운이 아니다.",
    "그걸로 보냈다. 지난주 건 이걸로 덮인 셈이다.",
    "",
    "이번 주는 시작이 좋다.",
    "",
    "얘가 결과를 한참 칭찬하다가 만두전골 얘기를 했다.",
    "집에 오는 길에 만두전골집 앞에서 잠깐 섰다.",
  ],
};
