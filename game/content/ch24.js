// 24장 — 22장의 물리기와 23장의 찾기를 붙인다. RAG 다.
//
// 붙이는 것 자체는 두 줄이라 금방 끝난다. 이 장의 내용은 그 뒤다.
//   23장의 0.0 은 모델이 "찾지 못했습니다" 라고 해서 실패가 드러난다
//   낱말을 글자로 잘라 점수를 올리면 그 실패가 **그럴듯한 오답**으로 바뀐다
//   문턱 0.15 도 못 잡는다. 그때 점수가 0.201 이기 때문이다
//
// 그래서 다섯 개를 답하는 쪽이 아니라 넷을 답하고 하나는 모른다고 하는 쪽을 골라 납품한다.
// 14장에서 놓침과 헛걸음을 따로 잰 것의 연장이고, 발신자도 그때 그 현장 반장이다.

var RAG_DOC = {
  path: "work/참고/찾아물리기_요약.md",
  readOnly: true,
  content:
    "# 찾아서 물리기\n" +
    "\n" +
    "22장에서 본 것 — 맞는 글을 주면 맞게 답합니다.\n" +
    "23장에서 본 것 — 맞는 글을 찾을 수 있습니다.\n" +
    "둘을 붙이면 물어보면 답하는 것이 됩니다.\n" +
    "\n" +
    "## 붙이는 법\n" +
    "top, score = 찾기(질문)\n" +
    "답 = ask(질문, context=문서[top])\n" +
    "\n" +
    "두 줄입니다. 모델은 손대지 않았습니다. 앞에 찾기를 붙였을 뿐입니다.\n" +
    "\n" +
    "## 찾기가 틀리면\n" +
    "모델은 준 글 안에서만 답합니다. 그러니 틀린 글을 주면 틀린 답을 합니다.\n" +
    "그리고 틀렸다는 것을 모델은 모릅니다. 무엇을 줄지는 우리가 정한 것이기 때문입니다.\n" +
    "\n" +
    "답을 보고 판단할 수 없습니다. 점수를 보고 판단해야 합니다.\n" +
    "\n" +
    "## 문턱\n" +
    "if score < 0.15:\n" +
    '    return "지침에서 찾지 못했습니다."\n' +
    "\n" +
    "점수가 낮으면 모델에 묻지 않고 우리가 답합니다.\n" +
    "못 하는 것이 틀리는 것보다 나은 일이라면 그렇게 합니다.\n" +
    "14장에서 놓침과 헛걸음을 따로 잰 것과 같은 이야기입니다.\n" +
    "\n" +
    "## 낱말 대신 글자로 자르기\n" +
    'TfidfVectorizer(analyzer="char_wb", ngram_range=(2, 3))\n' +
    "\n" +
    "낱말 대신 글자를 두세 개씩 잘라 셉니다. 13장에서 미뤄 둔 것입니다.\n" +
    "'부팅이' 와 '부팅에' 가 이제 겹칩니다. 안 겹치던 것이 겹치니 점수가 오릅니다.\n" +
    "\n" +
    "점수가 오르는 것이 늘 좋은 것은 아닙니다.\n",
};

var CH24 = {
  id: "ch24",
  title: "24 · 찾아서 물리는 날",
  decay: 3.75,
  scenes: ["desk", "diary"],

  desk: {
    files: [
      { path: PANDAS_DOC.path, content: PANDAS_DOC.content, readOnly: true },
      { path: TOOL_DOC.path, content: TOOL_DOC.content, readOnly: true },
      { path: FIND_DOC.path, content: FIND_DOC.content, readOnly: true },
      { path: METRIC_DOC.path, content: METRIC_DOC.content, readOnly: true },
      { path: LM_TOOL.path, content: LM_TOOL.content, readOnly: true },
      { path: MANUAL_CSV.path, content: MANUAL_CSV.content, readOnly: true },
    ],

    idleLines: [
      "어제 만드신 work/task_28/찾기.py 를 여셔도 됩니다.",
      "막히셨으면 저를 눌러 주세요.",
      "점수를 같이 들고 다니셔야 문턱을 걸 수 있습니다.",
    ],
    errorLines: [
      "코드가 도중에 멈췄습니다. 아래 빨간 글씨의 마지막 줄부터 읽어보세요.",
      "실행이 끝까지 가지 못했습니다. context 에는 문단 하나를 글자로 넣으셔야 합니다.",
      "에러입니다. 글자로 자른 표와 낱말로 자른 표를 섞어 재지 않으셨는지 보시죠.",
    ],

    beats: [
      // ── 아침 ────────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "좋은 아침입니다, 토이비님. 이번에는 현장에서 직접 왔습니다." },
          { who: "Aistb", text: "지난달에 96% 가 무슨 뜻이냐고 물어오셨던 분입니다. 세 번째입니다." },
          { who: "Aistb", text: "오늘 붙이는 것 자체는 두 줄입니다. 어제 찾은 것을 그제 배운 데로 넘기면 끝납니다." },
          { who: "Aistb", text: "오래 걸릴 것은 그 뒤입니다." },
        ],
      },

      // ── 의뢰 도착 ───────────────────────────────────
      {
        lines: [{ who: "Aistb", text: "의뢰서입니다." }],
        addFiles: [
          {
            path: "work/의뢰_0029.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0029 — 현장에 걸기 전에 제가 봅니다\n" +
              "\n" +
              "발신: 한울운수 통합관제센터 정비운영팀 현장반 / 하람 J. 도쿠\n" +
              "수신: 바로벤토 — 깁스 W 토이비\n" +
              "\n" +
              "## 자료\n" +
              "work/자료/정비지침.csv — 문서관리 쪽에서 넘겨받은 것과 같습니다. 36 문단.\n" +
              "\n" +
              "## 할 일\n" +
              "찾는 것까지 됐다고 들었습니다. 이제 붙이면 물어보면 답하는 게 된다고요.\n" +
              "걸기 전에 제가 먼저 보겠습니다. 저희 애들이 새벽에 이걸 보고 손을 댑니다.\n" +
              "\n" +
              "work/task_29/물리기.py 를 만들고 아래 셋을 채워 주세요.\n" +
              "질문은 어제 그 다섯 개 그대로입니다.\n" +
              "\n" +
              "- answers     : 낱말로 잘라 찾고 문턱을 걸어서 낸 다섯 개의 답\n" +
              "                점수가 0.15 미만이면 모델에 묻지 마시고\n" +
              "                '지침에서 찾지 못했습니다.' 를 그대로 넣어 주세요\n" +
              "- risky       : 글자를 두세 개씩 잘라 세는 방식으로 바꿔서 다섯 번째 질문에 낸 답\n" +
              "- risky_score : 그때의 점수\n" +
              "\n" +
              "## 조건\n" +
              "- 낱말로 자르는 것은 기본 설정, 글자로 자르는 것은 char_wb 로 두세 개씩입니다.\n" +
              "- 문턱은 0.15 로 하고 answers 에만 겁니다.\n" +
              "\n" +
              "## 비고\n" +
              "지난번에 96% 물어봤던 사람입니다. 그때 배운 게 있어서 이번엔 먼저 묻습니다.\n" +
              "틀리게 답하는 거랑 답 안 하는 거 중에 뭐가 더 자주 일어납니까.\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0029.md"]',
        menu: ["brief"],
        nudge: "저를 눌러 의뢰 확인을 고르시면 의뢰서가 열립니다.",
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0029.md") >= 0;
          });
        },
      },

      // ── 예제 ────────────────────────────────────────
      {
        addFiles: [
          { path: RAG_DOC.path, readOnly: true, open: 1, content: RAG_DOC.content },
          {
            path: "work/예제/23_물리기.py",
            open: 0,
            content:
              "import sys\n" +
              "import pandas as pd\n" +
              "\n" +
              'sys.path.append("work/도구")\n' +
              "from 사내모델 import ask\n" +
              "from sklearn.feature_extraction.text import TfidfVectorizer\n" +
              "from sklearn.metrics.pairwise import cosine_similarity\n" +
              "\n" +
              'df = pd.read_csv("work/자료/정비지침.csv")\n' +
              'docs = df["text"]\n' +
              'QUESTIONS = ["냉각팬은 얼마마다 갈아야 합니까?",\n' +
              '             "로그는 며칠이나 보관합니까?",\n' +
              '             "배터리는 언제 교체합니까?",\n' +
              '             "개선안은 적용 전에 무엇을 합니까?",\n' +
              '             "부팅이 계속 안 되면 어떻게 합니까?"]\n' +
              "\n" +
              "def find(q, v, X):\n" +
              "    s = cosine_similarity(v.transform([q]), X)[0]\n" +
              "    return int(s.argmax()), float(s.max())\n" +
              "\n" +
              "vec = TfidfVectorizer()\n" +
              "M = vec.fit_transform(docs)\n" +
              "\n" +
              "for q in QUESTIONS:\n" +
              "    top, score = find(q, vec, M)\n" +
              "    print(round(score, 3), ask(q, context=docs[top])[:38])\n" +
              "\n" +
              'char = TfidfVectorizer(analyzer="char_wb", ngram_range=(2, 3))\n' +
              "CM = char.fit_transform(docs)\n" +
              "q5 = QUESTIONS[4]\n" +
              "top, score = find(q5, char, CM)\n" +
              "print(top, round(score, 3))\n" +
              "print(ask(q5, context=docs[top]))\n" +
              "print(docs[21])\n" +
              "\n" +
              "def safe_ask(q, v, X, floor=0.15):\n" +
              "    t, s = find(q, v, X)\n" +
              "    if s < floor:\n" +
              '        return "지침에서 찾지 못했습니다."\n' +
              "    return ask(q, context=docs[t])\n" +
              "\n" +
              "for q in QUESTIONS:\n" +
              "    print(safe_ask(q, vec, M)[:38])\n" +
              "\n" +
              "print(safe_ask(q5, char, CM))\n",
          },
        ],
        lines: [
          { who: "Aistb", text: "예제 파일입니다. 열세 번 눌러 붙인 결과를 보시죠." },
        ],
        spot: ".step",
        nudge: "아래의 ↓ 한 문장 버튼입니다.",
        wait: steppedTo("work/예제/23_물리기.py", 13),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "붙었습니다. 넷은 지침의 문장을 그대로 답했습니다. 모델은 어제와 같은 것이고 앞에 찾기를 얹었을 뿐입니다.",
            spot: { text: "두 줄입니다. 모델은 손대지 않았습니다", in: ".doc" },
          },
          { who: "Aistb", text: "다섯 번째를 보십시오. 점수 0.0 이고 '주신 글에서는 찾지 못했습니다.' 입니다." },
          { who: "Aistb", text: "모델이 정직하게 실패했습니다. 엉뚱한 문단을 받았는데 지어내지 않았습니다." },
          {
            who: "Aistb",
            text: "다만 현장에서는 이 답이 '지침에 그런 건 없다' 로 읽힙니다. 실제로는 21 번 문단에 적혀 있습니다.",
          },
          { who: "Aistb", text: "어제 그 0.0 을 고쳐 보겠습니다. 여섯 번 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/23_물리기.py", 19),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "낱말 대신 글자를 두세 개씩 잘라 셌습니다. 13장에서 '고칠 방법이 없지는 않습니다만 오늘은 그대로 두겠습니다' 라고 말씀드린 것입니다.",
            spot: { text: "낱말 대신 글자로 자르기", in: ".doc" },
          },
          { who: "Aistb", text: "'부팅이' 와 '부팅에' 가 이제 겹칩니다. 점수가 0.0 에서 0.201 로 올랐습니다." },
          { who: "Aistb", text: "그리고 답이 나왔습니다. '재부팅이 한 주에 12회를 넘으면 전원부를 교체 대상으로 올린다.'" },
          { who: "Aistb", text: "실제 지침에는 뭐라고 적혀 있는지 한 번 눌러 확인하십시오." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/23_물리기.py", 20),
      },
      {
        lines: [
          { who: "Aistb", text: "'세 번 연속 부팅에 실패하면 현장에서 손대지 말고 접수한다.'" },
          { who: "Aistb", text: "손대지 말라는 것이 답이었습니다. 방금 모델은 전원부를 교체하라고 했습니다." },
          {
            who: "Aistb",
            text: "새벽에 부팅이 안 되는 장비 앞에서 이 답을 읽은 사람은 전원부를 뜯을 것입니다. 어제는 '못 찾았다' 였습니다.",
          },
          {
            who: "Aistb",
            text: "찾기를 나아지게 했더니 조용한 실패가 그럴듯한 오답이 되었습니다. 점수는 올랐습니다.",
          },
          { who: "Aistb", text: "문턱을 걸어 보시죠. ▶ 실행입니다." },
        ],
        spot: ".run",
        wait: steppedTo("work/예제/23_물리기.py", 23),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "낱말로 자른 쪽은 다섯 번째가 '지침에서 찾지 못했습니다.' 로 바뀌었습니다. 0.0 은 0.15 아래이니 아예 묻지 않았습니다.",
            spot: { text: "점수가 낮으면 모델에 묻지 않고", in: ".doc" },
          },
          { who: "Aistb", text: "그리고 마지막 줄. 글자로 자른 쪽에 같은 문턱을 걸었는데 그대로 통과했습니다." },
          { who: "Aistb", text: "0.201 은 0.15 보다 큽니다. 문턱이 못 잡습니다." },
          {
            who: "Aistb",
            text: "문턱을 0.25 로 올리면 이건 걸립니다. 그런데 오늘 맞게 답한 첫 번째가 0.326 이고 세 번째가 0.389 입니다. 조금만 더 올리면 맞는 것부터 떨어져 나갑니다.",
          },
          {
            who: "Aistb",
            text: "지난달에 이분이 물으셨던 것과 같은 자리입니다. 놓치는 것과 헛걸음 중에 무엇이 더 비싼가.",
            spot: { text: "헛걸음은 사람이 한 번 더 가면 되고", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "덧붙이자면, 정확히 그 부분이 중요합니다. 그나저나 부침개는 기름을 넉넉히 둘러야 바삭합니다.",
            tone: "bad",
          },
          { who: "Aistb", text: "…의뢰로 돌아가시죠." },
        ],
      },

      // ── 의뢰 처리 ───────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "셋 다 방금 보신 것입니다. answers 에만 문턱을 거시고, risky 는 문턱 없이 글자로 자른 쪽입니다." },
          { who: "Aistb", text: "고객이 마지막에 물은 것에는 회신에서 답하겠습니다. 지금은 숫자만 채워 주십시오." },
        ],
        menu: ["brief", "report"],
        nudge: "찾기 결과와 점수를 같이 들고 다니셔야 문턱을 걸 수 있습니다.",
        report: function () {
          return checkFile(
            "work/task_29/물리기.py",
            "for _n in ['answers', 'risky', 'risky_score']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "_a = [str(v) for v in answers]\n" +
              "assert len(_a) == 5, f'answers 에 {len(_a)} 개가 들어 있습니다. 질문이 다섯이니 다섯 개입니다.'\n" +
              "assert '6개월' in _a[0], f'첫 답이 {_a[0]!r} 입니다. 0 번 문단을 물려 받은 답이어야 합니다.'\n" +
              "assert '180일' in _a[1], f'둘째 답이 {_a[1]!r} 입니다. 9 번 문단을 물려 받은 답이어야 합니다.'\n" +
              "assert '30일' in _a[3], f'넷째 답이 {_a[3]!r} 입니다. 6 번 문단을 물려 받은 답이어야 합니다.'\n" +
              "assert _a[4].strip() == '지침에서 찾지 못했습니다.', f'다섯째 답이 {_a[4]!r} 입니다. 점수가 0.15 아래이므로 모델에 묻지 마시고 의뢰서의 문장을 그대로 넣어 주세요.'\n" +
              "assert '12회' in str(risky), f'risky 가 {str(risky)!r} 입니다. 글자를 두세 개씩 잘라 세면 5 번 질문이 재부팅 12회 문단을 가져옵니다 — 그 문단으로 받은 답이어야 합니다.'\n" +
              "assert '찾지 못' not in str(risky), 'risky 에 문턱을 거셨습니다. risky 는 문턱 없이 글자로 잘라 낸 답입니다.'\n" +
              "assert abs(float(risky_score) - 0.201) < 0.02, f'risky_score 가 {float(risky_score):.3f} 입니다. 0.201 이 나와야 합니다. char_wb 로 두세 글자씩 자르셨는지 보세요.'\n" +
              "assert float(risky_score) > 0.15, '문턱보다 낮게 나왔습니다. 이 값이 문턱 위라는 것이 이번 의뢰의 요점입니다.'\n"
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
          { who: "Aistb", text: "납품할 것을 고르셔야 합니다. 다섯 개를 답하는 쪽과, 넷을 답하고 하나는 모른다고 하는 쪽입니다." },
          { who: "Aistb", text: "앞쪽이 점수가 높습니다. 뒤쪽이 맞습니다." },
          { who: "Aistb", text: "낱말로 자르고 문턱을 건 쪽으로 회신하겠습니다. 다섯 중 넷을 답하고 하나는 못 찾았다고 말합니다." },
          {
            who: "Aistb",
            text: "고객이 물으신 것 — 틀리게 답하는 것과 답 안 하는 것 중에 무엇이 더 자주 일어나느냐. 저희가 어느 쪽을 더 자주 일어나게 할지 고를 수 있습니다. 그것이 오늘 하신 일입니다.",
          },
        ],
      },
      {
        lines: [
          { who: "Aistb", text: "이것으로 배우실 것이 끝났습니다." },
          { who: "Aistb", text: "한 달 하고 사흘입니다. 표를 만드는 것부터 시작해서 오늘까지 왔습니다." },
          { who: "Aistb", text: "다음 주 월요일에 한 건이 있습니다. 새로 배우실 것은 없습니다." },
          { who: "Aistb", text: "수고하셨습니다. 이것으로 금일 업무가 종료되었습니다. 다음 주에 뵙겠습니다." },
        ],
        menu: ["end"],
        nudge: "업무 종료를 누르시면 오늘 일과가 끝납니다.",
        wait: function () {
          return false;
        },
      },
    ],
  },

  diary: [
    "421950년 10월 31일.",
    "",
    "붙이는 건 두 줄이었다. 어제 찾은 걸 그제 배운 데로 넘기면 끝이다.",
    "넷은 지침 문장을 그대로 답했다.",
    "",
    "다섯 번째가 문제였다. 어제 0.0 나왔던 그 질문.",
    "모델은 “주신 글에서는 찾지 못했습니다” 라고 했다. 정직하게 실패했다.",
    "근데 현장에서 이걸 읽으면 지침에 없는 줄 안다. 21번에 분명히 있는데.",
    "",
    "그래서 낱말 대신 글자로 잘라봤다. 13장에서 미뤄뒀던 그거다.",
    "'부팅이' 랑 '부팅에' 가 겹치게 되니까 점수가 0.0에서 0.201로 올랐다.",
    "답도 나왔다. “재부팅이 한 주에 12회를 넘으면 전원부를 교체 대상으로 올린다.”",
    "실제 지침은 “세 번 연속 부팅에 실패하면 현장에서 손대지 말고 접수한다” 였다.",
    "",
    "손대지 말라는 게 답인데 전원부를 뜯으라고 답한 거다.",
    "점수는 올랐다.",
    "",
    "문턱 0.15를 걸어도 0.201이라 그냥 통과한다. 0.25로 올리면 이건 걸리는데",
    "맞게 답한 첫 번째가 0.326이다.",
    "",
    "현장 반장이 틀리게 답하는 거랑 답 안 하는 거 중에 뭐가 더 자주 일어나냐고 적어 보냈다.",
    "지난달에 96% 물어봤던 그 사람이다. 그때 배운 게 있어서 먼저 묻는다고 적혀 있었다.",
    "",
    "넷을 답하고 하나는 모른다고 하는 쪽으로 보냈다. 점수는 낮은 쪽이다.",
    "",
    "Aistb가 배울 건 끝났다고 했다. 한 달 하고 사흘이란다.",
  ],
};
