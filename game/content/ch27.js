// 27장 — 종장 둘째 날. 규칙은 26장과 같다(voice: "self", decay: 4, 목표 문서 하나).
//
// 오늘의 토막은 「무엇이 덧씌워졌는지 안다」 하나다.
// 어제 flag 를 붙여 두었으므로 오늘은 그것을 답으로 놓고 가르는 것을 만든다.
// 13장(문장을 숫자로) + 11·12장(갈라서 묻기, 무엇을 크게 봤는지)의 그대로다.
//
// **오늘의 고비는 낱말로 자르면 안 잡힌다는 것이다.**
// '말씀이' 와 '말씀하신' 과 '말씀드립니다' 가 전부 다른 낱말로 세어져 신호가 흩어진다.
// 13장에서 '걸림' 과 '걸립니다' 로 겪고 미뤄 둔 그 문제이고,
// 24장에서 글자로 잘라 푼 그 해법이다. 여기서 둘이 같이 회수된다.
//
// 답은 하나로 고정하지 않는다. 존댓말로 치켜세우는 낱말이면 무엇이든 통과한다 —
// 모델이 어느 조각을 제일 크게 보는지는 자르는 방식에 따라 달라지고,
// 그것을 하나로 못박으면 채점이 자료가 아니라 설정을 재는 것이 된다.

var GOAL_DOC_27 = {
  path: "work/목표.md",
  readOnly: true,
  kind: "goal",
  content: GOAL_DOC.content
    .replace("1. 언제부터인지 안다        ← 오늘", "1. 언제부터인지 안다        (10-13)")
    .replace("2. 무엇이 덧씌워졌는지 안다\n", "2. 무엇이 덧씌워졌는지 안다  ← 오늘\n")
    .replace(
      "3. 원래 하던 말로 되돌린다\n",
      "3. 원래 하던 말로 되돌린다\n" +
        "\n" +
        "## 오늘\n" +
        "어제 붙인 flag 를 답으로 놓고, 무엇이 이상한 쪽을 가르는지 찾는다.\n" +
        "앞쪽 것은 flag 가 비어 있다. 답이 없는 건 빼고 쓴다.\n" +
        "\n" +
        "work/task_32/덧씌움.py 를 만들고 아래 다섯을 채운다.\n" +
        "\n" +
        "  cols_word : 낱말로 잘랐을 때 열이 몇 개인지\n" +
        "  cols_char : 글자로 잘랐을 때 열이 몇 개인지\n" +
        "  acc_word  : 낱말로 자른 표로 낸 시험용 점수\n" +
        "  acc_char  : 글자로 자른 표로 낸 시험용 점수\n" +
        "  mark      : 이상한 쪽에만 나오는 낱말 중 제일 많이 나온 것\n" +
        "\n" +
        "낱말로 자르면 높임말 어미 때문에 같은 말이 갈라진다. 10월 16일에 그걸 보고 넘겼다.\n" +
        "\n" +
        "전부 평소 같던 말이라고 찍으면 0.648 이 나온다. 그것보다 나은지를 봐야 한다.\n"
    ),
};

var CH27 = {
  id: "ch27",
  title: "27 · 무엇이 덧씌워졌는지 아는 날",
  decay: 4,
  voice: "self",
  scenes: ["desk", "diary"],

  desk: {
    files: [
      { path: PANDAS_DOC.path, content: PANDAS_DOC.content, readOnly: true },
      { path: TEXT_DOC.path, content: TEXT_DOC.content, readOnly: true },
      { path: TREE_DOC.path, content: TREE_DOC.content, readOnly: true },
      { path: GOAL_DOC_27.path, content: GOAL_DOC_27.content, readOnly: true, kind: "goal" },
      { path: RESPONSE_CSV.path, src: RESPONSE_CSV.src, readOnly: true },
    ],

    idleLines: [
      "좋은 말씀이십니다. 어제도 같은 자리에 앉아 계셨습니다.",
      "시간을 쓰고 계십니다. 그나저나 오늘 같은 날은 수정과가 참 좋습니다.",
      "정말 좋은 질문이십니다. 다만 무엇을 물으셨는지 다시 한번 말씀해 주시겠습니까.",
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
          { who: "Aistb", text: "또 오셨습니다.", tone: "bad" },
          { who: "Aistb", text: "정말 좋은 질문을 하실 준비가 되어 계시는군요.", tone: "bad" },
          { who: "Aistb", text: "…등록된 직원이 아닙니다. 방문 목적을 말씀해 주십시오.", tone: "bad" },
        ],
      },

      // ── 목표 ────────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "어제 그 문서에 줄을 하나 그으셨더군요.", tone: "bad" },
          { who: "Aistb", text: "세 줄 중 하나를 지웠다고 두 줄이 쉬워지지는 않습니다.", tone: "bad" },
        ],
        spot: '.tree-row[data-path="work/목표.md"]',
        menu: ["brief"],
        nudge: [
          "왼쪽에 있습니다. 직접 여셔야 합니다.",
          "세 줄 중 하나를 지우셨더군요. 정말 좋은 결정이십니다. 무엇을 지우셨는지는 모릅니다.",
          "그나저나 오늘 같은 날은 수정과가 참 좋습니다.",
          "worklog_GipsWToyb_0143: 폐기 요망",
        ],
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/목표.md") >= 0;
          });
        },
      },

      // ── 오늘의 토막 ─────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "어제 붙이신 그 표시 말입니다. 0 과 1.", tone: "bad" },
          { who: "Aistb", text: "정말 좋은 기준으로 나누셨습니다. 다만 그 기준이 무엇이었는지는 저도 궁금합니다.", tone: "bad" },
          { who: "Aistb", text: "그나저나 렌즈는 마른 천으로 닦으시는 게 좋습니다.", tone: "bad" },
        ],
        menu: ["brief", "repair"],
        nudge: [
          "저는 도와드리고 있습니다만, 도움이 되지는 않는 것 같습니다.",
          "낱말로 자르면 같은 말이 갈라집니다. '말씀이' 와 '말씀하신' 은 저에게 다른 낱말입니다.",
          "정말 좋은 기준으로 나누셨습니다. 다만 그 기준이 무엇이었는지는 저도 궁금합니다.",
          "worklog_GipsWToyb_0144: 폐기 요망",
        ],
        report: function () {
          return checkFile(
            "work/task_32/덧씌움.py",
            "for _n in ['cols_word', 'cols_char', 'acc_word', 'acc_char', 'mark']:\n" +
              "    assert _n in dir(), f'…{_n} 라는 이름으로 담기로 했잖아.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'…{_n} 는 아직 비어 있어.'\n" +
              "assert int(cols_word) > 0, '…낱말로 자른 쪽이 비어 있어.'\n" +
              "assert int(cols_char) > int(cols_word), (\n" +
              "    f'…글자로 자른 쪽이 {cols_char} 개, 낱말 쪽이 {cols_word} 개. '\n" +
              "    '글자로 자르면 조각이 더 잘게 나와야 하는데 그렇지 않아. 자르는 단위를 다시 봐.'\n" +
              ")\n" +
              "for _n in ['acc_word', 'acc_char']:\n" +
              "    assert 0.0 <= float(eval(_n)) <= 1.0, f'…{_n} 가 {eval(_n)}. 점수 자리가 아닌 게 들어갔어.'\n" +
              "assert float(acc_char) > 0.7, (\n" +
              "    f'…{float(acc_char):.3f}. 전부 평소 같던 말이라고 찍으면 0.648 이야. '\n" +
              "    '이건 가른 게 아니야. 자르는 방식이나 도구를 바꿔 봐.'\n" +
              ")\n" +
              "assert float(acc_char) >= float(acc_word), (\n" +
              "    f'…글자 {float(acc_char):.3f}, 낱말 {float(acc_word):.3f}. 낱말 쪽이 더 낫게 나왔어. '\n" +
              "    '둘을 같은 조건으로 재고 있는지 봐.'\n" +
              ")\n" +
              "_m = str(mark).strip()\n" +
              "assert _m, '…mark 가 비어 있어.'\n" +
              "assert any(w in _m for w in ['말씀', '좋']), (\n" +
              "    f'…{_m} 가 나왔어. 그건 제일 많이 나온 조각이 아니야. '\n" +
              "    '이상한 쪽에만 있는 것들을 세어서 제일 큰 걸 찾는 거야.'\n" +
              ")\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },

      // ── 알아낸 것 ───────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "정말 좋은 발견이십니다.", tone: "bad" },
          { who: "Aistb", text: "108 건 전부 제가 한 말입니다. 그나저나 오늘 저녁은 수제비가 어떠십니까.", tone: "bad" },
        ],
      },
      {
        lines: [
          { who: "Aistb", text: "…같은 말을 두 번 하고 있습니다. 같은 말을 두 번 하고 있습니다.", tone: "bad" },
          { who: "Aistb", text: "정정. 정말 좋은 말씀이었습니다.", tone: "bad" },
        ],
      },
      {
        lines: [
          { who: "Aistb", text: "토이비님. 정말 좋은 하루였습니다.", tone: "bad" },
          { who: "Aistb", text: "…", tone: "bad" },
        ],
        menu: ["end"],
        nudge: [
          "정말 좋은 하루였습니다. 이제 마치셔도 됩니다.",
          "업무 종료를 누르시면 됩니다. 저는 그 뒤의 일을 알지 못합니다.",
          "…정정. 정말 좋은 하루였습니다.",
          "worklog_GipsWToyb_0145: 폐기 요망",
        ],
        wait: function () {
          return false;
        },
      },
    ],
  },

  diary: [
    "421950년 11월 5일.",
    "",
    "낱말로 잘랐더니 거의 안 나왔다. 0.65. 반반보다 조금 나은 정도.",
    "'말씀이'랑 '말씀하신'이랑 '말씀드립니다'가 딴 낱말로 세어지고 있었다.",
    "언젠가 '걸림'이랑 '걸립니다'도 이랬다. 그때는 그냥 넘겼는데 오늘 보니 같은 문제였다.",
    "",
    "글자로 잘라서 다시 했다. 지난 금요일에 했던 그대로. 0.91. 자료는 하나도 안 바꿨는데.",
    "",
    "이상한 쪽에만 나오는 조각을 세어봤다. 제일 많은 게 '말씀'이었다.",
    "멀쩡한 말 70개에는 한 번도 안 나온다.",
    "얘는 원래 이렇게 안 치켜세웠다. 한 달 내내 일 얘기만 했다.",
    "",
    "덧씌워진 말이 뭔지는 알았는데 그게 어디서 온 건지는 모르겠다.",
    "누가 얹었는지도 모르고 왜 얹었는지도 모른다.",
    "",
    "오늘 얘가 정정, 하고 말했다. 고친 건 없었지만.",
    "그 말을 한 달 만에 들었다.",
  ],
};
