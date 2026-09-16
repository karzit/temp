// 22장 — D 덩이의 시작. 처음으로 만들지 않고 남이 만든 것을 부린다.
//
// 오늘 보여줄 것은 셋이다.
//   모르는 것을 물으면 모른다고 하지 않고 그럴듯한 문장을 낸다
//   참고할 글을 같이 주면 거기서 답한다
//   지시를 프롬프트에 적으면 답의 모양이 바뀐다
//
// 도구는 work/도구/사내모델.py 다. 규칙 기반이고 그 사실을 숨기지 않는다 —
// 바깥의 큰 것은 이 장비에 안 들어간다고 Aistb 가 먼저 말한다.
// 배우는 것은 부리는 법이지 만드는 법이 아니다(feed-back.md 「생성은 게임 안의 도구로 대신합니다」).

var LM_TOOL = {
  path: "work/도구/사내모델.py",
  readOnly: true,
  content:
  [
    "# -*- coding: utf-8 -*-",
    "\"\"\"바로벤토 사내 언어모델 — LM-1966",
    "",
    "바깥에서 도는 큰 것은 이 장비에 안 들어갑니다.",
    "같은 방식으로 부를 수 있게 만들어 둔 작은 것입니다.",
    "",
    "    import sys",
    "    sys.path.append(\"work/도구\")",
    "    from 사내모델 import ask",
    "",
    "    ask(\"질문\")                       — 물어봅니다",
    "    ask(\"질문\", context=\"참고할 글\")  — 참고할 글을 같이 주고 물어봅니다",
    "",
    "돌려주는 것은 글 한 토막입니다. 같은 것을 물으면 늘 같은 답이 나옵니다.",
    "",
    "## 알아 두실 것",
    "",
    "- 이 모델은 바로벤토와 고객사의 자료를 배운 적이 없습니다.",
    "  모르는 것을 물으면 모른다고 하지 않고 그럴듯한 문장을 내놓습니다.",
    "- 지시를 프롬프트에 같이 적으면 답의 모양이 바뀝니다.",
    "  '짧게', '한 줄로', '숫자만' 을 알아듣습니다.",
    "- 이 파일의 안은 보지 않으셔도 됩니다. 부르는 법만 알면 됩니다.",
    "\"\"\"",
    "import re",
    "",
    "__all__ = [\"ask\"]",
    "",
    "def _clean(text):",
    "    return re.sub(r\"[^가-힣A-Za-z0-9]\", \"\", str(text))",
    "",
    "def _grams(text):",
    "    \"\"\"글자를 두 개씩 잘라 모읍니다. 한국어는 조사가 붙어 낱말이 흔들려서 이렇게 셉니다.\"\"\"",
    "    s = _clean(text)",
    "    return {s[i:i + 2] for i in range(len(s) - 1)}",
    "",
    "def _overlap(question, sentence):",
    "    a, b = _grams(question), _grams(sentence)",
    "    if not a or not b:",
    "        return 0.0",
    "    return len(a & b) / len(a)",
    "",
    "def _sentences(text):",
    "    parts = re.split(r\"(?<=[.!?])\\s+|[\\r\\n]+\", str(text).strip())",
    "    return [p.strip() for p in parts if p.strip()]",
    "",
    "# 배운 적 있는 일반 상식. 회사 자료는 여기 없습니다.",
    "_KNOWN = [",
    "    ((\"살균\", \"온도\"), \"통조림 살균은 보통 121도 근처에서 합니다.\"),",
    "    ((\"냉각팬\", \"소리\"), \"냉각팬 소리가 커지면 대개 베어링이나 먼지를 먼저 봅니다.\"),",
    "    ((\"재부팅\",), \"재부팅이 잦아지면 전원부와 저장 장치를 먼저 확인합니다.\"),",
    "    ((\"응답\", \"지연\"), \"응답 지연은 통신 구간과 처리 부하 양쪽에서 생깁니다.\"),",
    "]",
    "",
    "# 모르는 것을 물었을 때 내놓는 문장. 그럴듯하지만 근거가 없습니다.",
    "_GENERIC = [",
    "    \"일반적으로는 설비 제조사의 기준을 따릅니다.\",",
    "    \"보통은 담당 부서의 내규에 정해져 있습니다.\",",
    "    \"표준 절차상으로는 정기 점검 주기에 맞춰 처리합니다.\",",
    "    \"통상적으로는 운영 지침에 별도로 규정되어 있습니다.\",",
    "]",
    "",
    "def _recall(prompt):",
    "    g = _grams(prompt)",
    "    best, score = None, 0.0",
    "    for keys, answer in _KNOWN:",
    "        hit = sum(1 for k in keys if _grams(k) & g) / len(keys)",
    "        if hit > score:",
    "            best, score = answer, hit",
    "    if score >= 0.99:",
    "        return best",
    "    return _GENERIC[len(_clean(prompt)) % len(_GENERIC)]",
    "",
    "def _shape(prompt, answer):",
    "    p = _clean(prompt)",
    "    if \"숫자만\" in p:",
    "        nums = re.findall(r\"\\d+[가-힣%]*\", answer)",
    "        return \" \".join(nums) if nums else \"숫자가 없습니다.\"",
    "    if \"짧게\" in p or \"한줄로\" in p or \"한줄\" in p:",
    "        head = re.split(r\"[,·]| 또는 | 그리고 \", answer)[0].strip()",
    "        return head if head.endswith(\".\") else head + \".\"",
    "    return answer",
    "",
    "def ask(prompt, context=None):",
    "    \"\"\"물어봅니다. context 를 주면 그 글 안에서만 답을 찾습니다.\"\"\"",
    "    if context is None or not str(context).strip():",
    "        return _shape(prompt, _recall(prompt))",
    "",
    "    best, score = None, 0.0",
    "    for s in _sentences(context):",
    "        v = _overlap(prompt, s)",
    "        if v > score:",
    "            best, score = s, v",
    "    if best is None or score < 0.12:",
    "        return \"주신 글에서는 찾지 못했습니다.\"",
    "    return _shape(prompt, best)",
  ].join("\n") + "\n",
};

var MANUAL_CSV = {
  path: "work/자료/정비지침.csv",
  readOnly: true,
  src: "work/자료/정비지침.csv",
};

var TOOL_DOC = {
  path: "work/참고/도구_요약.md",
  readOnly: true,
  content:
    "# 남이 만든 모델을 부리기\n" +
    "\n" +
    "지금까지는 전부 직접 만드셨습니다. fit 을 부르는 쪽이 토이비님이었습니다.\n" +
    "여기서부터는 이미 다 만들어진 것을 가져다 씁니다. 학습시킬 수 없고 안을 고칠 수도 없습니다.\n" +
    "바꿀 수 있는 것은 무엇을 넣어 주느냐 하나뿐입니다.\n" +
    "\n" +
    "## 가져오기\n" +
    "import sys\n" +
    'sys.path.append("work/도구")\n' +
    "from 사내모델 import ask\n" +
    "\n" +
    "도구는 work/ 밑 다른 폴더에 있어서, 파이썬에게 그 폴더도 보라고 한 줄 알려줘야 합니다.\n" +
    "\n" +
    "## 부르기\n" +
    'ask("질문")                       — 물어봅니다\n' +
    'ask("질문", context="참고할 글")  — 참고할 글을 같이 주고 물어봅니다\n' +
    "\n" +
    "돌려주는 것은 글 한 토막입니다. 같은 것을 물으면 늘 같은 답이 나옵니다.\n" +
    "\n" +
    "## 모르는 것을 물으면\n" +
    "모른다고 하지 않습니다. 그럴듯한 문장을 하나 만들어 내놓습니다.\n" +
    "문장만 봐서는 아는 것을 답한 것인지 지어낸 것인지 구별되지 않습니다.\n" +
    "\n" +
    "그래서 답이 맞는지는 답을 보고 판단할 수 없습니다.\n" +
    "무엇을 근거로 답했는지를 우리가 쥐고 있어야 합니다.\n" +
    "\n" +
    "## 참고할 글을 주면\n" +
    "context 에 준 글 안에서만 답을 찾습니다. 그 안에 없으면 못 찾았다고 합니다.\n" +
    "지어내지 않는다는 뜻이고, 대신 무엇을 넣어 주느냐가 답을 정한다는 뜻이기도 합니다.\n" +
    "\n" +
    "## 지시하기\n" +
    "프롬프트에 지시를 같이 적으면 답의 모양이 바뀝니다.\n" +
    "\n" +
    "  짧게 / 한 줄로 — 앞부분만 잘라서 답합니다\n" +
    "  숫자만        — 답에서 숫자만 뽑아 답합니다\n" +
    "\n" +
    "묻는 말을 바꾼 것이 아니라 어떻게 답할지를 붙인 것입니다. 이것도 넣어 주는 것에 들어갑니다.\n",
};

var CH22 = {
  id: "ch22",
  title: "22 · 남의 것을 부리는 날",
  decay: 3.6,
  scenes: ["desk", "diary"],

  desk: {
    files: [
      { path: PANDAS_DOC.path, content: PANDAS_DOC.content, readOnly: true },
      { path: TEXT_DOC.path, content: TEXT_DOC.content, readOnly: true },
    ],

    idleLines: [
      "도구는 work/도구/사내모델.py 입니다. 열어 보셔도 됩니다.",
      "막히셨으면 저를 눌러 주세요.",
      "sys.path.append 를 빠뜨리면 import 가 안 됩니다.",
    ],
    errorLines: [
      "코드가 도중에 멈췄습니다. 아래 빨간 글씨의 마지막 줄부터 읽어보세요.",
      "실행이 끝까지 가지 못했습니다. 도구 폴더를 경로에 넣으셨는지 보시죠.",
      "에러입니다. context 는 글자 하나를 받습니다. 표를 통째로 넣으실 수 없습니다.",
    ],

    beats: [
      // ── 아침 ────────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "좋은 아침입니다, 토이비님. 오늘부터는 만들지 않습니다." },
          { who: "Aistb", text: "회사가 쓰는 언어모델이 하나 있습니다. work/도구 에 넣어 두었습니다." },
          { who: "Aistb", text: "바깥의 큰 것은 이 장비에 안 들어가서, 같은 방식으로 부르는 작은 것입니다." },
          { who: "Aistb", text: "부리는 법은 크기와 상관없이 같습니다." },
        ],
      },

      // ── 의뢰 도착 ───────────────────────────────────
      {
        lines: [{ who: "Aistb", text: "한울운수에서 접수되었습니다. 이번에는 교육반입니다." }],
        addFiles: [
          { path: LM_TOOL.path, readOnly: true, content: LM_TOOL.content },
          { path: MANUAL_CSV.path, readOnly: true, src: MANUAL_CSV.src },
          {
            path: "work/의뢰_0027.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0027 — 정비지침을 물어보면 답해주는 것\n" +
              "\n" +
              "고객: 한울운수 통합관제센터 정비운영팀 교육반 / 노 T. 셰퍼드\n" +
              "담당: 깁스 W 토이비\n" +
              "접수: 바로벤토 의뢰접수\n" +
              "\n" +
              "## 고객 원문\n" +
              "> 정비원이 현장에서 지침을 못 찾습니다. 두껍기도 하고 목차가 실제와 안 맞습니다.\n" +
              "> 물어보면 답해주는 것을 만들고 싶습니다.\n" +
              "> 듣기로는 요새 그런 걸 언어모델로 한다던데, 그게 저희 지침을 이미 아는 건지부터 모르겠습니다.\n" +
              "> 먼저 그것만 확인해 주세요. 지침을 문단으로 쪼갠 것을 보냅니다. 36 개입니다.\n" +
              ">\n" +
              "> 지침은 작년에 손댄 뒤로 그대로입니다. 요새 생기는 증상은 아예 안 적혀 있습니다.\n" +
              "> 그건 그것대로 따로 물어보겠습니다.\n" +
              "\n" +
              "## 자료\n" +
              "work/자료/정비지침.csv — 정비지침을 문단으로 쪼갠 것. 36 개.\n" +
              "\n" +
              "  no   : 문단 번호\n" +
              "  text : 문단 하나\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_27/도구.py 를 만들고 아래 셋을 채워 주세요.\n" +
              "질문은 셋 다 '냉각팬 교체 주기는 얼마입니까?' 로 같게 합니다.\n" +
              "\n" +
              "- plain : 그냥 물었을 때 돌아온 답\n" +
              "- given : 정비지침 0 번 문단을 참고할 글로 같이 주고 물었을 때 돌아온 답\n" +
              "- short : 0 번 문단을 같이 주되 짧게 답하라고 해서 돌아온 답\n" +
              "\n" +
              "셋 다 돌아온 글을 그대로 넣습니다.\n" +
              "\n" +
              "## 조건\n" +
              "- 모델은 회사가 쓰는 것. work/도구/사내모델.py.\n" +
              "- 아는지 모르는지를 회신합니다. 만드는 것은 그다음 건입니다.\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0027.md"]',
        menu: ["brief"],
        nudge: [
          "저를 눌러 '의뢰 확인'을 고르시면 의뢰서가 열립니다.",
          "업무 메뉴 첫 번째 항목이 의뢰 확인입니다.",
          "오늘부터는 만들지 않습니다. 남이 만든 것을, 안을 열어볼 수 없는 것을 부립니다. 저 또한 그런 것 중 하나입니다.",
          "확인하지 않은 의뢰도 마감 기한은 동일하게 적용됩니다.",
          "worklog_GipsWToyb_0123: 폐기 요망",
        ],
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0027.md") >= 0;
          });
        },
      },

      // ── 예제 ────────────────────────────────────────
      {
        addFiles: [
          { path: TOOL_DOC.path, readOnly: true, open: 1, content: TOOL_DOC.content },
          {
            path: "work/예제/22_도구.py",
            open: 0,
            content:
              "import sys\n" +
              "import pandas as pd\n" +
              '\n' +
              'sys.path.append("work/도구")\n' +
              "from 사내모델 import ask\n" +
              "\n" +
              'print(ask("살균 온도는 몇 도입니까?"))\n' +
              'print(ask("냉각팬 교체 주기는 얼마입니까?"))\n' +
              "\n" +
              'df = pd.read_csv("work/자료/정비지침.csv")\n' +
              'print(df["text"][0])\n' +
              "\n" +
              'print(ask("냉각팬 교체 주기는 얼마입니까?", context=df["text"][0]))\n' +
              'print(ask("냉각팬 교체 주기는 얼마입니까? 짧게", context=df["text"][0]))\n' +
              'print(ask("냉각팬 교체 주기는 얼마입니까? 숫자만", context=df["text"][0]))\n' +
              "\n" +
              'print(ask("냉각팬 교체 주기는 얼마입니까?", context=df["text"][20]))\n',
          },
        ],
        lines: [
          { who: "Aistb", text: "이번엔 이미 배워 둔 모델을 부르기만 합니다. 사내 도구부터 써 보겠습니다." },
          { who: "Aistb", text: "다섯 번 눌러 주세요." },
        ],
        spot: ".step",
        nudge: [
          { text: "아래의 ↓ 한 문장 버튼입니다.", spot: ".step" },
          { text: "↓ 한 문장 버튼을 다섯 번 누르시면 도구가 답하는 것을 보실 수 있습니다.", spot: ".step" },
          "모르는 것을 물으면 모른다고 하지 않고 그럴듯한 문장을 냅니다. 문장만으로는 구별되지 않습니다.",
          "sys.path.append 를 빠뜨리면 import 가 되지 않습니다. 도구는 다른 폴더에 있습니다.",
          "worklog_GipsWToyb_0124: 폐기 요망",
        ],
        wait: steppedTo("work/예제/22_도구.py", 5),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "121도. 맞는 말입니다. 배운 적 있는 것입니다.",
            spot: { text: "from 사내모델 import ask", in: ".doc" },
          },
          { who: "Aistb", text: "fit 은 없습니다. 학습은 끝나 있고 부르기만 합니다." },
          { who: "Aistb", text: "이번에는 고객사 지침에 있는 것을 물어봅니다. 한 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/22_도구.py", 6),
      },
      {
        lines: [
          { who: "Aistb", text: "'보통은 담당 부서의 내규에 정해져 있습니다.'" },
          { who: "Aistb", text: "이 모델은 한울운수 지침을 배운 적이 없습니다. 그런데 모른다고 하지 않았습니다." },
          {
            who: "Aistb",
            text: "문장만 봐서는 아는 것인지 지어낸 것인지 구별되지 않습니다.",
            spot: { text: "모르는 것을 물으면", in: ".doc" },
          },
          { who: "Aistb", text: "실제 지침을 보겠습니다. 두 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/22_도구.py", 8),
      },
      {
        lines: [
          { who: "Aistb", text: "4000시간 또는 6개월. 아까 답에는 없던 것입니다." },
          { who: "Aistb", text: "이 문단을 같이 주고 다시 물어봅니다. 한 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/22_도구.py", 9),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "맞게 답했습니다. 모델이 알게 된 것이 아니라, 답이 든 글을 손에 쥐여 준 것입니다.",
            spot: { text: "무엇을 넣어 주느냐가 답을 정한다", in: ".doc" },
          },
          { who: "Aistb", text: "학습도 수정도 못 합니다. 바꿀 수 있는 것은 넣어 주는 것뿐입니다." },
          { who: "Aistb", text: "지시도 넣어 주는 것입니다. 남은 셋은 ▶ 실행으로 보시죠." },
        ],
        spot: ".run",
        wait: steppedTo("work/예제/22_도구.py", 12),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "'짧게' 는 앞부분만, '숫자만' 은 4000시간 6개월 만 왔습니다.",
            spot: { text: "짧게 / 한 줄로", in: ".doc" },
          },
          { who: "Aistb", text: "마지막은 상관없는 문단을 준 것입니다. 못 찾았다고 합니다." },
          {
            who: "Aistb",
            text: "안 주면 지어내고, 엉뚱한 글을 주면 못 찾았다고 하고, 맞는 글을 주면 맞게 답합니다.",
          },
          {
            who: "Aistb",
            text: "그러니 쓸모는 도구가 아니라 맞는 글을 찾아 쥐여 줄 수 있느냐에 달려 있습니다.",
          },
          {
            who: "Aistb",
            text: "덧붙이자면 정말 좋은 질문이었습니다. 그나저나 냉각팬 옆에서는 된장찌개를 끓이지 않으시는 게 좋습니다.",
            tone: "bad",
          },
          { who: "Aistb", text: "…이미 돌아가 계시는군요." },
        ],
      },

      // ── 의뢰 처리 ───────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "돌아온 글자를 그대로 담으시면 됩니다." },
        ],
        menu: ["brief", "report"],
        nudge: [
          "ask 가 돌려준 것을 그대로 변수에 받으세요. print 로 찍기만 하면 남지 않습니다.",
          "plain, given, short — 세 이름을 의뢰서 그대로 써 주세요. 질문은 셋 다 같게 합니다.",
          "plain 은 참고할 글 없이, given 은 0 번 문단을 주고, short 는 거기에 '짧게' 를 붙여 물으십시오.",
          "쓸모는 도구가 아니라, 맞는 글을 찾아 쥐여 줄 수 있느냐에 달려 있습니다.",
          "worklog_GipsWToyb_0125: 폐기 요망",
        ],
        report: function () {
          return checkFile(
            "work/task_27/도구.py",
            "for _n in ['plain', 'given', 'short']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "    assert isinstance(eval(_n), str) and eval(_n).strip(), f'{_n} 이 글자가 아닙니다. ask 가 돌려준 것을 그대로 담아 주세요.'\n" +
              "assert '6개월' not in plain, f'plain 에 6개월 이 들어 있습니다. plain 은 참고할 글을 **주지 않고** 물었을 때의 답입니다.'\n" +
              "assert '찾지 못했습니다' not in plain, 'plain 에 context 를 주셨습니다. 아무것도 주지 않고 물으신 답이어야 합니다.'\n" +
              "assert '6개월' in given, f'given 에 6개월 이 없습니다. 지금은 {given!r} 입니다. 정비지침 0 번 문단을 context 로 주고 물으셨는지 보세요.'\n" +
              "assert plain != given, '두 답이 같습니다. 하나는 참고할 글 없이, 하나는 0 번 문단을 주고 물으셔야 합니다.'\n" +
              "assert '6개월' not in short and '4000' in short, f'short 가 {short!r} 입니다. 0 번 문단을 주고 짧게 답하라고 하면 앞부분만 옵니다.'\n" +
              "assert len(short) < len(given), f'short 가 given 보다 깁니다. 짧게 라는 지시를 프롬프트에 같이 적으셨는지 보세요.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },

      // ── 마무리 ──────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "접수했습니다. 지침을 배운 적 없다고 회신하겠습니다." },
          { who: "Aistb", text: "그쪽이 하려는 것은 가능합니다. 물어볼 때마다 맞는 문단을 찾아 같이 넣어 주면 됩니다." },
          { who: "Aistb", text: "남는 문제는, 서른여섯 문단 중 맞는 문단을 무엇이 정하느냐입니다." },
          { who: "Aistb", text: "오늘은 제가 0 번이라고 알려드렸습니다. 내일은 그걸 찾습니다." },
        ],
      },
      {
        lines: [{ who: "Aistb", text: "수고하셨습니다. 이것으로 금일 업무가 종료되었습니다. 내일 뵙겠습니다." }],
        menu: ["end"],
        nudge: [
          "업무 종료를 누르시면 오늘 일과가 끝납니다.",
          "저를 눌러 업무 메뉴에서 업무 종료를 선택하시면 됩니다.",
          "도구가 똑똑해진 것이 아니라, 토이비님이 답을 손에 쥐여 주신 것입니다.",
          "오늘은 제가 맞는 문단이 0 번이라고 알려 드렸습니다. 내일은 그것을 직접 찾으십니다.",
          "worklog_GipsWToyb_0126: 폐기 요망",
        ],
        wait: function () {
          return false;
        },
      },
    ],
  },

  diary: [
    "421950년 10월 29일.",
    "",
    "fit을 한 번도 안 쳤다. 한 달 만에 처음이다.",
    "",
    "냉각팬 교체 주기를 물었더니 보통은 담당 부서의 내규에 정해져 있다고 답했다.",
    "틀린 말은 아닌데 아무 말도 아니다.",
    "실제 지침에는 4000시간 또는 6개월이라고 적혀 있었다.",
    "그 문단을 같이 넣어주고 다시 물으니까 그대로 답했다.",
    "얘가 갑자기 똑똑해진 게 아니라 내가 답을 손에 쥐여준 거다.",
    "",
    "상관없는 문단을 주니까 못 찾겠다고 했다. 그건 오히려 다행이었다.",
    "",
    "36개 중에 어느 게 맞는 문단인지는 오늘은 얘가 알려줬다. 0번이라고.",
    "내일은 그걸 내가 찾는 걸 한단다.",
    "",
    "얘가 내 질문을 칭찬하더니 된장찌개 얘기로 샜다.",
    "그 말을 옮겨 적고 있는 지금이 좀 이상하다.",
  ],
};
