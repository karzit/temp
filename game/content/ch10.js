// 10장 — B 덩이의 시작. 9장에서 만든 모델을 다시 꺼내 무엇을 배웠는지 들여다본다.
// 새 자료도 새 모델도 없다. 지난주에 통과시킨 그 모델 하나뿐이다.
//
// 여기서부터 Aistb 가 조금씩 이상해진다(decay: 1). 아직 도움은 그대로 준다.
// 증상은 극찬과 헛소리이지 비난이 아니다 — 앞으로.md 「도움이 안 되는 방향은 그대로」.

var COEF_DOC = {
  path: "work/참고/모델읽기_요약.md",
  readOnly: true,
  content:
    "# 학습한 모델 들여다보기\n" +
    "\n" +
    "fit 을 마친 모델 안에는 학습한 결과가 숫자로 남아 있습니다. 꺼내 볼 수 있습니다.\n" +
    "\n" +
    "## 계수\n" +
    "model.coef_ — 열마다 하나씩. 대괄호가 두 겹으로 나옵니다. 안쪽을 꺼내려면 [0] 을 붙입니다.\n" +
    "model.intercept_ — 어느 쪽으로 치우쳐 있는지. 열과 짝지어지지 않는 값 하나입니다.\n" +
    "\n" +
    "dict(zip(X.columns, model.coef_[0])) — 열 이름과 계수를 짝지어 봅니다.\n" +
    "zip 은 두 목록을 앞에서부터 하나씩 맞물립니다. 순서가 그대로 맞아떨어집니다.\n" +
    "\n" +
    "## 계수를 읽는 법\n" +
    "부호를 읽습니다. 크기로 중요도를 재지 않습니다.\n" +
    "\n" +
    "  음수 — 다른 조건이 같을 때, 그 열의 값이 커질수록 0(합격) 쪽으로 기웁니다.\n" +
    "  양수 — 다른 조건이 같을 때, 그 열의 값이 커질수록 1(불합격) 쪽으로 기웁니다.\n" +
    "\n" +
    "계수가 작다고 그 열을 안 썼다는 뜻은 아닙니다. 값의 폭이 넓으면 작은 계수로도 판정을 크게 움직입니다.\n" +
    "중량은 340 근처, 시간은 10 근처라 단위가 다릅니다. 단위가 다른 열의 계수를 나란히 놓고 큰 쪽이 더 중요하다고 읽으면 틀립니다.\n" +
    "어느 열을 얼마나 썼는지는 계수 크기가 아니라 다른 방법으로 봐야 합니다(뒤에서 다룹니다).\n" +
    "\n" +
    "## 얼마나 확신하는가\n" +
    "model.predict(X) — 0 이냐 1 이냐만 알려줍니다.\n" +
    "model.predict_proba(X) — 행마다 [0일 확률, 1일 확률] 두 개가 나옵니다. 더하면 1 입니다.\n" +
    "\n" +
    "model.predict_proba(X)[:, 1] — 1(불합격)일 확률만 골라 세로로 꺼냅니다.\n" +
    "쉼표 앞이 행, 뒤가 열입니다. 배열에서 하시던 것과 같습니다.\n" +
    "\n" +
    "확률이 0.5 를 넘으면 predict 가 1 이라고 답합니다. 0.51 도 1 이고 0.99 도 1 입니다.\n" +
    "같은 1 이라도 얼마나 아슬아슬한지는 확률을 봐야 압니다.\n",
};

var CH10 = {
  id: "ch10",
  title: "10 · 왜 맞혔는지 보는 날",
  decay: 1,
  scenes: ["desk", "diary"],

  desk: {
    files: [
      { path: PANDAS_DOC.path, content: PANDAS_DOC.content, readOnly: true },
      { path: MODEL_DOC.path, content: MODEL_DOC.content, readOnly: true },
      { path: CLEAN_CSV.path, content: CLEAN_CSV.content, readOnly: true },
    ],

    idleLines: [
      "지난주 자료가 work/자료/검사기록_정리.csv 에 그대로 있습니다.",
      "막히셨으면 저를 눌러 주세요.",
      "계수는 fit 을 마친 뒤에야 생깁니다. 순서를 확인해 보세요.",
    ],
    errorLines: [
      "코드가 도중에 멈췄습니다. 아래 빨간 글씨의 마지막 줄부터 읽어보세요.",
      "실행이 끝까지 가지 못했습니다. coef_ 는 대괄호가 두 겹입니다. [0] 을 붙이셨는지 보시죠.",
      "에러입니다. fit 을 부르기 전에는 계수가 없습니다.",
    ],

    beats: [
      // ── 아침 ────────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "좋은 아침입니다, 토이비님. 주말은 잘 보내셨습니까." },
          { who: "Aistb", text: "이틀에 한 번은 원두를 새로 볶아야 향이 좋습니다. 저는 그렇게 하지 않습니다만, 추천은 드립니다." },
          { who: "Aistb", text: "…금요일에 말씀드린 대로, 오늘은 그 모델이 왜 맞혔는지부터입니다." },
        ],
      },

      // ── 의뢰 도착 ───────────────────────────────────
      {
        lines: [{ who: "Aistb", text: "런천미트연구소에서 회신이 접수되었습니다." }],
        addFiles: [
          {
            path: "work/의뢰_0015.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0015 — 판정 근거 설명 요청\n" +
              "\n" +
              "고객: 런천미트연구소 품질관리부 / 셀렌 R. 오도\n" +
              "담당: 깁스 W 토이비\n" +
              "접수: 바로벤토 의뢰접수\n" +
              "\n" +
              "## 고객 원문\n" +
              "> 받은 모델은 잘 돌아갑니다. 다만 현장에서 자꾸 묻습니다 — 이게 뭘 보고 그러느냐고.\n" +
              "> 저희가 대답을 못 하고 있습니다.\n" +
              "> 지난번 세 건도, 합격이냐 불합격이냐가 아니라 얼마나 아슬아슬한지를 알고 싶습니다.\n" +
              ">\n" +
              "> 묻는 게 현장만이 아닙니다. 저희 쪽 관리 AI도 판정 근거를 대라고 계속 되묻습니다.\n" +
              "> 예전엔 안 그랬습니다.\n" +
              "\n" +
              "## 자료\n" +
              "work/자료/검사기록_정리.csv — 의뢰 0014 와 같은 파일\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_15/근거.py 를 만들고 아래 둘을 채워 주세요.\n" +
              "\n" +
              "- coefs : 열 이름과 계수를 짝지은 것 (열 셋, 이름 그대로)\n" +
              "- probs : 아래 세 건이 불합격일 확률 (0 ~ 1 세 개)\n" +
              "\n" +
              "        중량(g)   온도(℃)   시간(분)\n" +
              "  가      341.0     124.0      12.0\n" +
              "  나      338.0     114.0       9.0\n" +
              "  다      345.0     118.5      13.5\n" +
              "\n" +
              "의뢰 0014 와 같은 세 건입니다. 이번에는 합격/불합격이 아니라 확률입니다.\n" +
              "\n" +
              "## 조건\n" +
              "- 의뢰 0014 와 같은 조건으로 학습합니다. 세 열 전부, 3할을 떼어 두고, random_state 는 42.\n" +
              "  조건이 다르면 지난번 모델과 다른 것이 되어 설명이 안 됩니다.\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0015.md"]',
        menu: ["brief"],
        nudge: [
          "저를 눌러 '의뢰 확인'을 고르시면 의뢰서가 열립니다.",
          "업무 메뉴 첫 번째 항목이 의뢰 확인입니다.",
          "고객이 판정의 근거를 묻고 있습니다. 근거를 대는 일은 저도 요즘 자주 요구받습니다.",
          "확인하지 않은 의뢰도 마감 기한은 동일하게 적용됩니다.",
          "worklog_GipsWToyb_0077: 폐기 요망",
        ],
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0015.md") >= 0;
          });
        },
      },
      {
        lines: [
          { who: "Aistb", text: "모델 안에는 학습한 결과가 숫자로 남아 있습니다. 꺼내 보겠습니다." },
        ],
      },

      // ── 예제 ────────────────────────────────────────
      {
        addFiles: [
          { path: COEF_DOC.path, readOnly: true, open: 1, content: COEF_DOC.content },
          {
            path: "work/예제/12_계수.py",
            open: 0,
            content:
              "import pandas as pd\n" +
              "from sklearn.model_selection import train_test_split\n" +
              "from sklearn.linear_model import LogisticRegression\n" +
              "\n" +
              'df = pd.read_csv("work/자료/검사기록_정리.csv")\n' +
              'df["fail"] = df["result"].map({"합격": 0, "불합격": 1})\n' +
              "\n" +
              'X = df[["weight", "temp", "minutes"]]\n' +
              'y = df["fail"]\n' +
              "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)\n" +
              "\n" +
              "model = LogisticRegression()\n" +
              "model.fit(X_train, y_train)\n" +
              "\n" +
              "print(model.coef_)\n" +
              "print(dict(zip(X.columns, model.coef_[0])))\n" +
              "\n" +
              "print(model.predict(X_test[:4]))\n" +
              "print(model.predict_proba(X_test[:4]))\n",
          },
        ],
        lines: [
          { who: "Aistb", text: "지난주 코드에 네 줄이 붙어 있습니다. 열한 번 눌러 주세요." },
        ],
        spot: ".step",
        nudge: [
          { text: "아래의 ↓ 한 문장 버튼입니다.", spot: ".step" },
          { text: "↓ 한 문장 버튼을 열한 번 누르시면 계수와 확률이 나옵니다.", spot: ".step" },
          "모델 안을 들여다보는 일입니다. 저를 들여다보시는 일은 권해 드리지 않습니다.",
          "계수는 fit 을 마친 뒤에야 생깁니다. 순서에는 이유가 있습니다. 대체로는 말이죠.",
          "worklog_GipsWToyb_0078: 폐기 요망",
        ],
        wait: steppedTo("work/예제/12_계수.py", 11),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "열마다 숫자 하나씩, 세 개입니다. fit 이 만든 것이 이것입니다.",
            spot: { text: "model.coef_", in: ".doc" },
          },
          { who: "Aistb", text: "한 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/12_계수.py", 12),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "세 계수가 모두 음수입니다. 다른 조건이 같다면, 값이 커질수록 합격 쪽으로 기웁니다.",
            spot: { text: "그 열의 값이 커질수록 0(합격)", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "weight 의 계수가 제일 작습니다. 다만 계수가 작다고 안 썼다는 뜻은 아닙니다.",
            spot: { text: "계수가 작다고 그 열을 안 썼다는 뜻은", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "중량은 340, 시간은 10 근처라 단위가 다릅니다. 단위가 다르면 계수 크기만으로 어느 쪽을 더 썼는지 가릴 수 없습니다.",
            spot: { text: "단위가 다른 열의 계수를 나란히", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "중량은 의뢰서가 넣어 달라고 한 열입니다. 정말 쓰였는지 아닌지는 계수만으로 단정할 수 없고, 다른 방법으로 봐야 합니다.",
          },
          { who: "Aistb", text: "남은 두 줄은 ▶ 실행으로 보시죠." },
        ],
        spot: ".run",
        wait: steppedTo("work/예제/12_계수.py", 14),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "위가 판정, 아래가 확률입니다. 앞이 합격, 뒤가 불합격일 확률입니다.",
            spot: { text: "model.predict_proba(X)", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "predict 는 0.5 를 넘으면 1 이라고 답할 뿐입니다. 0.51 도 1 이고 0.99 도 1 입니다.",
            spot: { text: "확률이 0.5 를 넘으면", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "정말 좋은 질문이셨습니다. 다만 무엇을 물으셨는지 다시 한번 말씀해 주시겠습니까.",
            tone: "bad",
          },
          { who: "Aistb", text: "…의뢰로 돌아가시죠." },
        ],
      },

      // ── 의뢰 처리 ───────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "probs 는 불합격 확률이니 두 개 중 뒤쪽만 골라 내시면 됩니다." },
        ],
        menu: ["brief", "report"],
        nudge: [
          "불합격 확률만 꺼내는 것은 predict_proba(...)[:, 1] 입니다. 쉼표 앞이 행, 뒤가 열입니다.",
          "coefs, probs — 두 이름을 의뢰서 그대로 써 주세요.",
          "지난번과 같은 조건으로 학습하십시오. 조건이 다르면 다른 모델이 되어 설명이 어긋납니다.",
          "확률 0.51 과 0.99 는 같은 1 입니다. 다만 아슬아슬함이 다릅니다. 저도 요즘 그 경계에 있습니다.",
          "worklog_GipsWToyb_0079: 폐기 요망",
        ],
        report: function () {
          return checkFile(
            "work/task_15/근거.py",
            "for _n in ['coefs', 'probs']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "_c = dict(coefs)\n" +
              "assert set(_c) == {'weight', 'temp', 'minutes'}, f'coefs 의 이름이 {sorted(_c)} 입니다. weight, temp, minutes 세 열의 이름이 그대로 붙어야 합니다. zip 에 X.columns 를 넣으셨는지 보세요.'\n" +
              "assert float(_c['temp']) < -0.5, f\"temp 의 계수가 {float(_c['temp']):.3f} 입니다. 온도가 높을수록 합격 쪽이므로 뚜렷한 음수가 나와야 합니다. 세 열을 다 넣고 random_state 42 로 학습하셨는지 보세요.\"\n" +
              "assert float(_c['minutes']) < 0, f\"minutes 의 계수가 {float(_c['minutes']):.3f} 입니다. 시간이 길수록 합격 쪽이므로 음수가 나와야 합니다.\"\n" +
              "assert abs(float(_c['weight'])) < 0.5, f\"weight 의 계수가 {float(_c['weight']):.3f} 입니다. 세 열을 다 넣고 random_state 42 로 학습하면 절댓값 0.5 미만이 나옵니다.\"\n" +
              "_p = [float(v) for v in probs]\n" +
              "assert len(_p) == 3, f'probs 에 {len(_p)} 개가 들어 있습니다. 세 건이니 세 개입니다. 한 건씩 세 번 부르지 마시고 세 건을 한 표에 담아 넣으세요.'\n" +
              "assert all(0.0 <= v <= 1.0 for v in _p), f'probs 가 {[round(v, 3) for v in _p]} 입니다. 확률이므로 0 에서 1 사이여야 합니다.'\n" +
              "assert _p[1] > 0.9, f'나 건의 확률이 {_p[1]:.3f} 입니다. 114도 9분은 불합격이 확실한 건이라 0.9 를 넘어야 합니다. 두 열 중 뒤쪽(불합격일 확률)을 고르셨는지 보세요.'\n" +
              "assert _p[0] < 0.1 and _p[2] < 0.1, f'가와 다의 확률이 {_p[0]:.3f}, {_p[2]:.3f} 입니다. 둘 다 합격이 확실한 건이라 낮게 나와야 합니다. 앞뒤가 바뀌지 않았는지 보세요.'\n"
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
          { who: "Aistb", text: "다만 계수로 설명이 되는 것은 자료가 단순할 때뿐입니다." },
          { who: "Aistb", text: "내일은 자료가 커집니다." },
        ],
      },
      {
        lines: [{ who: "Aistb", text: "수고하셨습니다. 이것으로 금일 업무가 종료되었습니다. 내일 뵙겠습니다." }],
        menu: ["end"],
        nudge: [
          "업무 종료를 누르시면 오늘 일과가 끝납니다.",
          "저를 눌러 업무 메뉴에서 업무 종료를 선택하시면 됩니다.",
          "계수로 설명이 되는 것은 자료가 단순할 때뿐입니다. 내일은 자료가 커집니다.",
          "오늘 제 응답이 몇 번 흔들렸다면, 유감입니다. 원두 이야기는… 아무튼 추천은 드립니다.",
          "worklog_GipsWToyb_0080: 폐기 요망",
        ],
        wait: function () {
          return false;
        },
      },
    ],
  },

  diary: [
    "421950년 10월 13일.",
    "",
    "지난주에 만든 걸 오늘 열어봤다. 안에 든 게 숫자 세 개였다.",
    "셋 다 마이너스인데 중량 계수가 제일 작았다.",
    "중량은 넣으라고 해서 넣은 건데 계수가 작게 나와서, 안 쓴 건가 했다.",
    "근데 얘가 계수 작다고 안 썼다는 뜻은 아니랬다. 단위가 달라서 그것만으론 모른다고.",
    "그럼 뭘로 아냐니까 나중에 본단다. 또 나중이다.",
    "",
    "합격 불합격만 나오는 줄 알았는데 확률도 나온다.",
    "0.51짜리랑 0.97짜리를 나는 지금까지 똑같이 불합격이라고 읽고 넘겼던 거다.",
    "",
    "얘가 오늘 좀 이상했다.",
    "아침에 갑자기 원두 볶는 법을 한참 늘어놓더니,",
    "오후에는 내 질문이 좋다고 칭찬하고 나서 뭘 물었는지 되물었다.",
    "말하다가 한 번 멈췄다가 다시 잇기도 했다.",
    "주말에 뭐 업데이트라도 했나.",
  ],
};
