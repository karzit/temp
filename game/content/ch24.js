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
    "그저께 본 것 — 맞는 글을 주면 맞게 답합니다.\n" +
    "어제 본 것 — 맞는 글을 찾을 수 있습니다.\n" +
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
    "96% 가 무슨 뜻이냐던 날 놓침과 헛걸음을 따로 잰 것과 같은 이야기입니다.\n" +
    "\n" +
    "## 낱말 대신 글자로 자르기\n" +
    'TfidfVectorizer(analyzer="char_wb", ngram_range=(2, 3))\n' +
    "\n" +
    "낱말 대신 글자를 두세 개씩 잘라 셉니다. 접수 메모 때 미뤄 둔 것입니다.\n" +
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
          { who: "Aistb", text: "좋은 아침입니다, 토이비님. 이번에는 현장에서 직접 접수되었습니다." },
          { who: "Aistb", text: "96% 가 무슨 뜻이냐고 물어오셨던 그분입니다." },
          { who: "Aistb", text: "붙이는 것 자체는 두 줄입니다." },
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
              "고객: 한울운수 통합관제센터 정비운영팀 현장반 / 하람 J. 도쿠\n" +
              "담당: 깁스 W 토이비\n" +
              "접수: 바로벤토 의뢰접수\n" +
              "\n" +
              "## 고객 원문\n" +
              "> 찾는 것까지 됐다고 들었습니다. 이제 붙이면 물어보면 답하는 게 된다고요.\n" +
              "> 걸기 전에 제가 먼저 보겠습니다. 저희 애들이 새벽에 이걸 보고 손을 댑니다.\n" +
              "> 질문은 문서관리에서 뽑은 그 다섯 개 그대로면 됩니다.\n" +
              ">\n" +
              "> 지난번에 96% 물어봤던 사람입니다. 그때 배운 게 있어서 이번엔 먼저 묻습니다.\n" +
              "> 틀리게 답하는 거랑 답 안 하는 거 중에 뭐가 더 자주 일어납니까.\n" +
              "\n" +
              "## 자료\n" +
              "work/자료/정비지침.csv — 의뢰 0028 과 같은 파일. 36 문단.\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_29/물리기.py 를 만들고 아래 셋을 채워 주세요.\n" +
              "질문은 의뢰 0028 의 다섯 개 그대로입니다.\n" +
              "\n" +
              "- answers     : 낱말로 잘라 찾고 문턱을 걸어서 낸 다섯 개의 답\n" +
              "                점수가 0.15 미만이면 모델에 묻지 말고\n" +
              "                '지침에서 찾지 못했습니다.' 를 그대로 넣습니다\n" +
              "- risky       : 글자를 두세 개씩 잘라 세는 방식으로 바꿔서 다섯 번째 질문에 낸 답\n" +
              "- risky_score : 그때의 점수\n" +
              "\n" +
              "## 조건\n" +
              "- 낱말로 자르는 것은 기본 설정, 글자로 자르는 것은 char_wb 로 두세 개씩.\n" +
              "- 문턱은 0.15 로 하고 answers 에만 겁니다.\n" +
              "- 고객의 마지막 질문에는 회신에서 답합니다.\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0029.md"]',
        menu: ["brief"],
        nudge: [
          "저를 눌러 '의뢰 확인'을 고르시면 의뢰서가 열립니다.",
          "업무 메뉴 첫 번째 항목이 의뢰 확인입니다.",
          "96%가 무슨 뜻이냐 물으셨던 그분입니다. 그때 배운 게 있어 이번엔 먼저 묻는다고 하십니다.",
          "확인하지 않은 의뢰도 마감 기한은 동일하게 적용됩니다.",
          "worklog_GipsWToyb_0131: 폐기 요망",
        ],
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
            path: "work/예제/24_물리기.py",
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
          { who: "Aistb", text: "지난 이틀을 잇습니다. 찾은 지침을 모델에 물려 답하게 하겠습니다." },
          { who: "Aistb", text: "열세 번 눌러 주세요." },
        ],
        spot: ".step",
        nudge: [
          { text: "아래의 ↓ 한 문장 버튼입니다.", spot: ".step" },
          { text: "↓ 한 문장 버튼을 열세 번 누르시면 찾기를 얹은 답까지 나옵니다.", spot: ".step" },
          "찾기를 손보면 못 찾겠다던 것이 그럴듯한 오답이 됩니다. 없는 답보다 틀린 답이 더 위험할 때가 있습니다.",
          "새벽에 이 답을 읽은 사람은 그대로 손을 댑니다. 답 하나가 전원부를 뜯게 만듭니다.",
          "worklog_GipsWToyb_0132: 폐기 요망",
        ],
        wait: steppedTo("work/예제/24_물리기.py", 13),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "넷은 지침의 문장을 그대로 답했습니다. 모델 앞에 찾기를 얹었을 뿐입니다.",
            spot: { text: "두 줄입니다. 모델은 손대지 않았습니다", in: ".doc" },
          },
          { who: "Aistb", text: "다섯 번째는 점수 0.0, '주신 글에서는 찾지 못했습니다.' 입니다." },
          { who: "Aistb", text: "엉뚱한 문단을 받고 지어내지 않았습니다. 그건 다행입니다." },
          {
            who: "Aistb",
            text: "다만 현장에서는 '지침에 없다' 로 읽힙니다. 실제로는 21 번에 적혀 있습니다.",
          },
          { who: "Aistb", text: "그 0.0 을 고쳐 봅니다. 여섯 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/24_물리기.py", 19),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "낱말 대신 글자를 두세 개씩 잘라 셌습니다. 접수 메모 때 미뤄 둔 그것입니다.",
            spot: { text: "낱말 대신 글자로 자르기", in: ".doc" },
          },
          { who: "Aistb", text: "'부팅이' 와 '부팅에' 가 겹칩니다. 0.0 이 0.201 이 되었습니다. 다만 '재부팅이' 와는 더 많이 겹쳐서, 그쪽이 이겼습니다." },
          { who: "Aistb", text: "답도 나왔습니다. '재부팅이 한 주에 12회를 넘으면 전원부를 교체 대상으로 올린다.'" },
          { who: "Aistb", text: "실제 지침은 한 번 더 눌러 확인하십시오." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/24_물리기.py", 20),
      },
      {
        lines: [
          { who: "Aistb", text: "'세 번 연속 부팅에 실패하면 현장에서 손대지 말고 접수한다.'" },
          { who: "Aistb", text: "손대지 말라는 게 답인데 모델은 전원부를 교체하라고 했습니다." },
          {
            who: "Aistb",
            text: "새벽에 이 답을 읽은 사람은 전원부를 뜯을 것입니다.",
          },
          {
            who: "Aistb",
            text: "찾기를 손봤더니 못 찾겠다던 것이 그럴듯한 오답이 되었습니다.",
          },
          { who: "Aistb", text: "문턱을 걸어 보시죠. ▶ 실행입니다." },
        ],
        spot: ".run",
        wait: steppedTo("work/예제/24_물리기.py", 23),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "낱말로 자른 쪽은 0.0 이 0.15 아래라 아예 묻지 않았습니다.",
            spot: { text: "점수가 낮으면 모델에 묻지 않고", in: ".doc" },
          },
          { who: "Aistb", text: "글자로 자른 쪽은 같은 문턱을 그대로 통과했습니다." },
          { who: "Aistb", text: "0.201 은 0.15 보다 크니까요." },
          {
            who: "Aistb",
            text: "0.25 로 올리면 걸립니다. 그런데 맞게 답한 첫 번째가 0.326 입니다. 조금만 더 올리면 맞는 것부터 떨어집니다.",
          },
          {
            who: "Aistb",
            text: "지난달 그 자리입니다. 놓치는 것과 헛걸음 중 무엇이 더 비싼가.",
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
          { who: "Aistb", text: "answers 에만 문턱을 거시고, risky 는 문턱 없이 글자로 자른 쪽입니다." },
          { who: "Aistb", text: "고객의 마지막 질문에는 회신에서 답하겠습니다." },
        ],
        menu: ["brief", "report"],
        nudge: [
          "찾기 결과와 점수를 같이 들고 다니셔야 문턱을 걸 수 있습니다.",
          "answers, risky, risky_score — 세 이름을 의뢰서 그대로 써 주세요.",
          "answers 에만 문턱 0.15 를 거십시오. 점수가 낮으면 모델에 묻지 말고 의뢰서의 문장을 그대로 넣습니다.",
          "risky 는 문턱 없이 글자로 자른 쪽입니다. 그럴듯한 오답이 문턱을 통과하는 것이 요점입니다.",
          "worklog_GipsWToyb_0133: 폐기 요망",
        ],
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
          { who: "Aistb", text: "다섯 개를 답하는 쪽과, 넷을 답하고 하나는 모른다고 하는 쪽입니다." },
          { who: "Aistb", text: "앞쪽이 점수가 높습니다. 뒤쪽이 맞습니다." },
          { who: "Aistb", text: "뒤쪽으로 회신하겠습니다." },
          {
            who: "Aistb",
            text: "틀리게 답하는 것과 답하지 않는 것 중 무엇이 더 자주 일어나느냐 — 그건 저희가 고를 수 있습니다. 오늘 하신 일입니다.",
          },
        ],
      },
      {
        lines: [
          { who: "Aistb", text: "이것으로 배우실 것이 끝났습니다." },
          { who: "Aistb", text: "오늘로 꼭 한 달입니다." },
          { who: "Aistb", text: "다음 주 월요일에 한 건이 있습니다." },
          { who: "Aistb", text: "수고하셨습니다. 이것으로 금일 업무가 종료되었습니다. 다음 주에 뵙겠습니다." },
        ],
        menu: ["end"],
        nudge: [
          "업무 종료를 누르시면 오늘 일과가 끝납니다.",
          "저를 눌러 업무 메뉴에서 업무 종료를 선택하시면 됩니다.",
          "다섯을 답하는 쪽과, 넷을 답하고 하나는 모른다고 하는 쪽. 앞쪽이 점수가 높고, 뒤쪽이 맞습니다.",
          "틀리게 답하는 것과 답하지 않는 것 중 무엇이 더 자주 일어나느냐 — 그건 고를 수 있습니다. 오늘 하신 일입니다.",
          "worklog_GipsWToyb_0134: 폐기 요망",
        ],
        wait: function () {
          return false;
        },
      },
    ],
  },

  diary: [
    "421950년 10월 31일.",
    "",
    "다섯 번째가 역시 문제였다. 어제 0.0 나왔던 그 질문.",
    "모델은 주신 글에서는 찾지 못했다고 답했다. 지어내진 않았다.",
    "",
    "그래서 낱말 대신 글자로 잘라봤다. 접수 메모 때 미뤄뒀던 그거다.",
    "그랬더니 답이 나왔다. 재부팅이 한 주에 12회를 넘으면 전원부를 교체 대상으로 올린다고.",
    "",
    "실제 지침은 손대지 말라는 거다. 전원부를 뜯으라고 답한 거고. 점수는 올랐다.",
    "",
    "현장 반장이 물어왔다. 틀리게 답하는 거랑 아예 답 안 하는 거, 뭐가 더 자주 일어나냐고.",
    "넷을 답하고 하나는 모른다고 하는 쪽으로 보냈다. 점수는 낮은 쪽이다.",
    "",
    "얘가 배울 건 끝났다고 했다. 오늘로 꼭 한 달이란다.",
    "그런 것 같기도 하고 아닌 것 같기도 하다.",
  ],
};
