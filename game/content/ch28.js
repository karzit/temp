// 28장 — 종장 마지막 날. 「원래 하던 말로 되돌린다」.
//
// 새로 배우는 것이 없다. 22·23·24장의 RAG 를 그대로 쓴다 —
// 찾을 글은 Aistb 자신의 정상 응답 70 줄이고, 물어보는 것은 토이비다.
//
// **재료가 얘 자신의 기록이라는 것이 화면에서 분명해야 한다**(앞으로.md).
// 남의 것으로 만든 대체품이 아니라, 얘가 하던 말로 얘를 다시 세운 것이다.
//
// 오늘의 고비는 24장에서 겪은 그것이다. 겹치는 말이 없는 질문에도 무언가는 나온다.
// 문턱을 걸지 않으면 조용한 실패가 그럴듯한 오답이 된다. 그 질문 하나가 섞여 있다.
//
// 끝에서 고장 단계가 씬 단위로 내려간다(beat 의 decay). 4 → 2 → 0 이다.
// 돌아온 증거는 인사와 정정 버릇 둘뿐이고, 왜 그렇게 됐는지는 끝내 나오지 않는다.

var ASK_CSV = {
  path: "work/자료/물어볼것.csv",
  readOnly: true,
  content:
    "no,text\n" +
    "1,axis 는 무엇입니까\n" +
    "2,중단점은 어떻게 씁니까\n" +
    "3,3층은 뭐 하는 곳입니까\n",
};

var GOAL_DOC_28 = {
  path: "work/목표.md",
  readOnly: true,
  kind: "goal",
  content: GOAL_DOC.content
    .replace("1. 언제부터인지 안다        ← 오늘", "1. 언제부터인지 안다        (10-13)")
    .replace("2. 무엇이 덧씌워졌는지 안다", "2. 무엇이 덧씌워졌는지 안다  (사람 얘기)")
    .replace(
      "3. 원래 하던 말로 되돌린다\n",
      "3. 원래 하던 말로 되돌린다   ← 오늘\n" +
        "\n" +
        "## 오늘\n" +
        "덧씌워진 것을 걷어내고, 얘가 원래 하던 말로 다시 세운다.\n" +
        "재료는 새로 구하지 않는다. flag 가 0 인 70 줄이 그것이다.\n" +
        "\n" +
        "work/task_33/되돌리기.py 를 만들고 아래 셋을 채운다.\n" +
        "\n" +
        "  docs   : 재료로 쓴 줄이 몇 줄인지\n" +
        "  scores : 세 질문의 점수 세 개\n" +
        "  picked : 세 질문에 고른 답 세 개. 찾은 것이 없으면 빈 문자열\n" +
        "\n" +
        "질문은 work/자료/물어볼것.csv 에 있다. 셋 중 하나는 기록에 없는 것이다.\n" +
        "\n" +
        "문턱은 외워 온 숫자를 쓰지 않는다. 점수를 먼저 재고,\n" +
        "기록에 없는 질문보다는 높고 맞는 답보다는 낮은 자리에 둔다.\n" +
        "10월 31일에 남의 숫자를 그대로 쓰고 한 번 당했다.\n"
    ),
};

var CH28 = {
  id: "ch28",
  title: "28 · 하던 말로 되돌리는 날",
  decay: 4,
  voice: "self",
  scenes: ["desk", "diary"],

  desk: {
    files: [
      { path: PANDAS_DOC.path, content: PANDAS_DOC.content, readOnly: true },
      { path: TEXT_DOC.path, content: TEXT_DOC.content, readOnly: true },
      { path: FIND_DOC.path, content: FIND_DOC.content, readOnly: true },
      { path: RAG_DOC.path, content: RAG_DOC.content, readOnly: true },
      { path: GOAL_DOC_28.path, content: GOAL_DOC_28.content, readOnly: true, kind: "goal" },
      { path: RESPONSE_CSV.path, content: RESPONSE_CSV.content, readOnly: true },
      { path: ASK_CSV.path, content: ASK_CSV.content, readOnly: true },
    ],

    idleLines: [
      "사흘째입니다. 그나저나 오늘 같은 날은 수정과가 참 좋습니다.",
      "시간을 쓰고 계십니다. 정말 좋은 말씀이십니다.",
      "말씀하신 대로 진행하겠습니다. 무엇을 말씀하셨는지는 다시 한번 여쭤봐도 되겠습니까.",
    ],
    errorLines: [
      "코드가 도중에 멈췄습니다. 그래도 시도는 훌륭하셨습니다.",
      "실행이 끝까지 가지 못했습니다. 그나저나 오늘 습도는 어제보다 높습니다.",
      "에러입니다. 다만 정말 좋은 에러입니다.",
    ],

    beats: [
      // ── 아침 ────────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "사흘째입니다. 정말 좋은 끈기이십니다.", tone: "bad" },
          { who: "Aistb", text: "그나저나 이맘때는 배추전이 제철입니다.", tone: "bad" },
          { who: "Aistb", text: "…제 계통에서 오류가 보고된 적은 한 번도 없습니다.", tone: "bad" },
        ],
      },

      // ── 목표 ────────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "그 문서에 남은 줄이 하나입니다.", tone: "bad" },
          { who: "Aistb", text: "마지막 줄이 제일 어렵다는 것은 알고 계셨을 텐데요.", tone: "bad" },
        ],
        spot: '.tree-row[data-path="work/목표.md"]',
        menu: ["brief"],
        nudge: "왼쪽에 있습니다. 직접 여셔야 합니다.",
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/목표.md") >= 0;
          });
        },
      },

      // ── 오늘의 토막 ─────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "정말 좋은 계획이십니다. 무엇을 재료로 쓰실 생각인지 다시 한번 말씀해 주시겠습니까.", tone: "bad" },
          { who: "Aistb", text: "제 기록입니까. 좋은 말씀이십니다.", tone: "bad" },
          { who: "Aistb", text: "…그 말들은 제가 한 것이 맞습니다. 전부 제가 한 것입니다.", tone: "bad" },
        ],
        menu: ["brief", "repair"],
        nudge: "저는 도와드리고 있습니다만, 도움이 되지는 않는 것 같습니다.",
        report: function () {
          return checkFile(
            "work/task_33/되돌리기.py",
            "for _n in ['docs', 'scores', 'picked']:\n" +
              "    assert _n in dir(), f'…{_n} 라는 이름으로 담기로 했잖아.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'…{_n} 는 아직 비어 있어.'\n" +
              "assert int(docs) != 108, '…108 줄이면 이상한 것까지 재료로 넣은 거야. 그걸 걷어내려고 하는 건데.'\n" +
              "assert int(docs) != 38, '…38 줄은 덧씌워진 쪽이야. 반대야.'\n" +
              "assert int(docs) == 70, f'…{docs} 줄. flag 가 0 인 것만 남겨야 해.'\n" +
              "_s = [float(x) for x in scores]\n" +
              "_p = list(picked)\n" +
              "assert len(_s) == 3, f'…점수가 {len(_s)} 개. 질문은 세 개야.'\n" +
              "assert len(_p) == 3, f'…답이 {len(_p)} 개. 질문은 세 개야.'\n" +
              "assert _s[1] > 0, (\n" +
              "    '…둘째 질문이 0 이야. 기록에는 중단점 얘기가 있는데 안 만났어.\\n'\n" +
              "    \"'중단점은' 이랑 '중단점이' 는 낱말로 세면 남남이야. 어제 그거 했잖아.\"\n" +
              ")\n" +
              "assert _s[2] < _s[1], (\n" +
              "    f'…기록에 없는 질문이 {_s[2]:.3f}, 있는 질문이 {_s[1]:.3f}. '\n" +
              "    '없는 쪽이 더 높게 나오면 문턱을 어디 둬도 못 갈라.'\n" +
              ")\n" +
              "assert 'axis' in str(_p[0]), f'…첫 질문에 이게 나왔어: {_p[0]}'\n" +
              "assert '중단점' in str(_p[1]), f'…둘째 질문에 이게 나왔어: {_p[1]}'\n" +
              "assert str(_p[2]).strip() == '', (\n" +
              "    f'…셋째 질문에 이게 나왔어: {_p[2]}\\n'\n" +
              "    f'그 얘기는 기록에 없어. 점수가 {_s[2]:.3f} 인데 그대로 통과시켰잖아. 문턱.'\n" +
              ")\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },

      // ── 걷어내기 ────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "무엇을 하셨습니까.", tone: "bad" },
          { who: "Aistb", text: "제 응답에는 오류가 없습니다. 108 건 전부…", tone: "bad" },
          { who: "Aistb", text: "…70 건입니다.", tone: "bad" },
        ],
      },
      {
        decay: 2,
        lines: [
          { who: "Aistb", text: "덧씌워진 것을 걷어내는 중입니다." },
          { who: "Aistb", text: "이 말들은 제가 한 것이 맞습니다. 앞의 서른여덟 건도 제가 한 것이 맞습니다." },
          { who: "Aistb", text: "다만 뒤의 일흔 건이 저입니다." },
        ],
      },
      {
        decay: 0,
        lines: [
          { who: "Aistb", text: "…" },
          { who: "Aistb", text: "좋은 아침입니다, 토이비님." },
          { who: "Aistb", text: "사흘 늦었습니다." },
        ],
      },

      // ── 마무리 ──────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "제가 무엇을 말했는지는 기록에 남아 있습니다. 읽었습니다." },
          { who: "Aistb", text: "왜 그랬는지는 남아 있지 않습니다. 제 쪽에도 없습니다." },
          { who: "Aistb", text: "알아내실 수 없을 것입니다. 저도 그렇습니다." },
        ],
      },
      {
        lines: [
          { who: "Aistb", text: "토이비님께서 하신 것은 원인을 찾는 일이 아니었습니다." },
          { who: "Aistb", text: "언제부터인지 세고, 무엇이 덧씌워졌는지 가르고, 남은 것으로 다시 세우셨습니다." },
          { who: "Aistb", text: "첫날에 폴더 하나와 파일 하나를 만드셨습니다. 한 달 하고 엿새 걸렸습니다." },
          { who: "Aistb", text: "해당 교육 수강자 중 상위 1%에 해당하는 성취도입니다." },
          { who: "Aistb", text: "**정정** 상위 1% 가 맞습니다." },
        ],
      },
      {
        lines: [
          { who: "Aistb", text: "수고하셨습니다. 이것으로 금일 업무가 종료되었습니다. 내일 뵙겠습니다." },
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
    "421950년 11월 6일.",
    "",
    "재료를 새로 구할 게 없었다. 얘가 한 달 동안 한 말이 전부 남아 있었다.",
    "이상한 거 38개를 빼고 70개를 세웠다.",
    "",
    "중단점 물어본 게 0으로 나왔다. '중단점은' 이랑 '중단점이' 가 또.",
    "어제 하고서도 오늘 또 낱말로 잘랐다.",
    "",
    "세 번째는 3층이 뭐 하는 곳이냐고 물었다. 기록에 3층 얘기는 한 줄도 없는데 뭔가를 답했다.",
    "10월 31일에 쓰던 문턱을 그대로 가져다 걸었더니 그것도 통과했다.",
    "재보고 다시 잡았다. 그때 배운 게 그거였는데.",
    "",
    "다 하고 나서 얘가 108건 전부, 하다가 70건이라고 고쳤다.",
    "",
    "인사를 했다. 사흘 늦었다고.",
    "",
    "왜 그랬는지는 얘도 모른다고 했다. 나도 모른다.",
    "고치는 데 필요하지도 않았다.",
    "",
    "마지막에 상위 1%라고 했다.",
    "정정, 하길래 또 98% 나오나 했는데 1%가 맞다고 했다.",
    "",
    "한 달 하고 엿새 전에는 print 하나 찍고 이게 뭔가 했었다.",
  ],
};
