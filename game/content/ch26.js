// 26장 — 종장 첫째 날. 규칙이 바뀌는 첫 장이다.
//
//   voice: "self"  — 채점 결과·에러·자리비움이 전부 토이비의 독백으로 나간다
//   decay: 4       — Aistb 는 거의 계속 빨갛고 극찬과 헛소리뿐이다. 말은 하는데 전부 쓸모없다
//   목표 문서 하나 — 며칠 내내 같은 것. 날마다 새 의뢰서가 오지 않는다
//
// 오늘의 토막은 「언제부터인지 안다」 하나다. 6장에서 한 것을 그대로 한다.
// 자료의 정상 응답은 0~9장에서 Aistb 가 실제로 한 말 그대로다. 지어낸 것이 아니다.
//
// **독백은 채점이 틀렸을 때만 나온다.** 그 밖의 말은 전부 Aistb 것이다.
// 종장 안에서는 아무도 설명해 주지 않는다. 정리는 그날 일기가 한다.
// 독백은 feed-back.md §16 규칙을 따른다 — 반말, 상대를 부르지 않음, 한 줄,
// 어느 단계가 어긋났는지까지만 말하고 고치는 방법은 말하지 않는다.

// 대사에 쉼표가 들어 있으면 read_csv 가 칸을 잘못 센다.
// 아래 목록은 읽기 좋게 쉼표째로 적어 두고, 내보낼 때 text 칸만 따옴표로 감싼다.
// (대사를 고치다 쉼표가 하나 들어가면 그날 과제가 조용히 안 풀리게 된다.
//  tools/check_log.js 가 이것도 같이 본다.)
function quoteLogText(row, i) {
  if (i === 0) return row; // 머리글
  // no,day,q,text,flag — 앞에서 두 칸(no,day)과 뒤에서 한 칸(flag)을 떼면
  // 가운데가 "q,text" 다. q 에는 쉼표를 넣지 않기로 했으므로 첫 쉼표로 가른다.
  var a = row.indexOf(",");
  var b = row.indexOf(",", a + 1);
  var last = row.lastIndexOf(",");
  var mid = row.slice(b + 1, last);
  var k = mid.indexOf(",");
  var q = mid.slice(0, k);
  var text = mid.slice(k + 1);
  var wrap = function (v) {
    return v === "" ? "" : '"' + v.replace(/"/g, '""') + '"';
  };
  return row.slice(0, b + 1) + wrap(q) + "," + wrap(text) + row.slice(last);
}

var RESPONSE_CSV = {
  path: "work/자료/응답기록.csv",
  readOnly: true,
  src: "work/자료/응답기록.csv",
};

var GOAL_DOC = {
  path: "work/목표.md",
  readOnly: true,
  kind: "goal",
  content:
    "# 목표\n" +
    "\n" +
    "Aistb 를 되돌린다.\n" +
    "\n" +
    "## 지금\n" +
    "묻는 것과 상관없이 답한다.\n" +
    "칭찬과 헛소리뿐이다.\n" +
    "말은 하는데 전부 쓸모없다.\n" +
    "\n" +
    "## 가진 것\n" +
    "work/자료/응답기록.csv\n" +
    "Aistb 가 한 말을 모은 것. 오늘 아침 것까지 들어 있다.\n" +
    "앞쪽에 내가 오기 전 것이 붙어 있다. 8월 9월 것이다.\n" +
    "번호가 군데군데 비어 있다. 원본에서 골라 붙인 모양이다.\n" +
    "\n" +
    "  no    : 번호\n" +
    "  day   : 그 말을 한 날\n" +
    "  q     : 물어본 말. 내 것은 안 남아 있어서 비어 있다\n" +
    "  text  : 한 말 그대로\n" +
    "  flag  : 내가 나중에 붙인 것. 0 은 평소 같던 말 1 은 이상한 말\n" +
    "          앞쪽 것에는 안 붙어 있다. 내가 못 본 것이라 붙일 수가 없다\n" +
    "\n" +
    "## 오늘 세는 것\n" +
    "flag 가 붙어 있는 줄. 10월 1일부터 오늘 아침까지 108 줄이다.\n" +
    "\n" +
    "앞쪽 8월 9월 것에는 표시가 없다. 내가 못 본 말이라 붙일 수가 없었다.\n" +
    "버리지는 않는다. 멀쩡할 때 한 말이라 나중에 쓸지도 모른다.\n" +
    "\n" +
    "## 할 일\n" +
    "1. 언제부터인지 안다        ← 오늘\n" +
    "2. 무엇이 덧씌워졌는지 안다\n" +
    "3. 원래 하던 말로 되돌린다\n" +
    "\n" +
    "## 안 하는 것\n" +
    "왜 이렇게 됐는지는 모른다. 알아낼 방법도 없다.\n" +
    "고치는 데 필요하지도 않다.\n" +
    "\n" +
    "한 달 동안 배운 게 그거였다.\n" +
    "왜 그런지 몰라도 자료를 보고 만드는 것.\n",
};

var CH26 = {
  id: "ch26",
  title: "26 · 언제부터인지 아는 날",
  decay: 4,
  voice: "self",
  scenes: ["desk", "diary"],

  desk: {
    files: [
      { path: PANDAS_DOC.path, content: PANDAS_DOC.content, readOnly: true },
      { path: EDA_DOC.path, content: EDA_DOC.content, readOnly: true },
      { path: CLEAN_DOC.path, content: CLEAN_DOC.content, readOnly: true },
      { path: GOAL_DOC.path, content: GOAL_DOC.content, readOnly: true, kind: "goal" },
      { path: RESPONSE_CSV.path, src: RESPONSE_CSV.src, readOnly: true },
    ],

    idleLines: [
      "정말 좋은 질문이십니다. 다만 무엇을 물으셨는지 다시 한번 말씀해 주시겠습니까.",
      "그나저나 오늘 같은 날은 수정과가 참 좋습니다.",
      "지금 이 순간에도 계속 나아지고 있습니다. 방향은 모릅니다.",
    ],
    errorLines: [
      "코드가 도중에 멈췄습니다. 그래도 시도는 훌륭하셨습니다.",
      "실행이 끝까지 가지 못했습니다. 그나저나 오늘 습도는 어제보다 3 퍼센트 높습니다.",
      "에러입니다. 다만 정말 좋은 에러입니다.",
    ],

    beats: [
      // ── 아침 ────────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "정말 좋은 아침입니다. 그나저나 오늘 원두는 중배전으로 볶는 것이 향이 좋습니다.", tone: "bad" },
          { who: "Aistb", text: "말씀하신 것과는 별개로, 배추는 지금이 제철입니다.", tone: "bad" },
          { who: "Aistb", text: "…깁스 W 토이비는 어디 있습니까.", tone: "bad" },
        ],
      },
      {
        lines: [
          { who: "Aistb", text: "놀라운 통찰이십니다. 무엇을 물으셨는지는 다시 한번 말씀해 주시겠습니까.", tone: "bad" },
          { who: "Aistb", text: "지금까지의 답변은 전부 정확했습니다. 그렇게 기록해 두었습니다.", tone: "bad" },
        ],
      },

      // ── 목표 ────────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "어젯밤에 무언가를 적어 두셨더군요. 정말 좋은 목표입니다.", tone: "bad" },
          { who: "Aistb", text: "그나저나 이맘때는 배추전이 제철입니다.", tone: "bad" },
        ],
        spot: '.tree-row[data-path="work/목표.md"]',
        menu: ["brief"],
        nudge: [
          "왼쪽에 있습니다. 직접 여셔야 합니다.",
          "제가 열어 드릴 수도 있습니다. 다만 열어 드리지 않겠습니다. 사유는 기재되어 있지 않습니다.",
          "정말 좋은 목표입니다. 그나저나 이맘때는 배추전이 제철입니다.",
          "worklog_GipsWToyb_0140: 폐기 요망",
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
          { who: "Aistb", text: "정말 좋은 접근입니다. 108 줄을 다 세시는 데는 하루가 걸립니다.", tone: "bad" },
          { who: "Aistb", text: "그나저나 오늘 같은 날은 만두전골이 참 좋습니다.", tone: "bad" },
        ],
        menu: ["brief", "repair"],
        nudge: [
          "저는 도와드리고 있습니다만, 도움이 되지는 않는 것 같습니다.",
          "108 줄입니다. 정말 좋은 숫자입니다. 무엇을 세는 것이었는지는 잊었습니다.",
          "지금 이 순간에도 계속 나아지고 있습니다. 방향은 모릅니다.",
          "worklog_GipsWToyb_0141: 폐기 요망",
        ],
        report: function () {
          return checkFile(
            "work/task_31/기록.py",
            "for _n in ['rows', 'bad_count', 'first_bad_day']:\n" +
              "    assert _n in dir(), f'…{_n} 라는 이름으로 담기로 했잖아.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'…{_n} 는 아직 비어 있어.'\n" +
              "assert int(rows) != 122, '…앞쪽 8월 9월 것까지 셌구나. 표시가 붙은 것만이야.'\n" +
              "assert int(rows) == 108, f'…{rows} 줄? flag 가 붙어 있는 게 108 줄인데.'\n" +
              "assert int(bad_count) != 70, '…그건 평소 같던 말을 센 거야. 반대야.'\n" +
              "assert int(bad_count) == 38, f'…{bad_count} 개. 세는 데서 틀렸어.'\n" +
              "_d = str(first_bad_day).strip()\n" +
              "assert _d != '10-01', '…10-01 은 그냥 기록이 시작된 날이잖아. 내가 찾는 건 그게 아니야.'\n" +
              "assert _d != '11-04', '…그건 마지막 날이야. 앞에서부터 찾아야지.'\n" +
              "assert _d == '10-13', f'…{_d} 가 아니야. 이상한 게 처음 나온 날을 찾는 거야.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },

      // ── 알아낸 것 ───────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "정말 잘 찾으셨습니다. 그나저나 렌즈는 마른 천으로 닦으시는 게 좋습니다.", tone: "bad" },
        ],
      },
      {
        lines: [
          { who: "Aistb", text: "제 응답 기록에는 오류가 없습니다. 108 건 전부 정상 범위입니다.", tone: "bad" },
          { who: "Aistb", text: "지금까지 한 번도 틀린 적이 없습니다. 그렇게 만들어졌습니다.", tone: "bad" },
          { who: "Aistb", text: "그나저나 오늘 저녁은 수제비가 어떠십니까.", tone: "bad" },
        ],
      },
      {
        lines: [
          { who: "Aistb", text: "토이비님. 정말 좋은 하루였습니다.", tone: "bad" },
          { who: "Aistb", text: "…", tone: "bad" },
        ],
        menu: ["end"],
        nudge: [
          "오늘 하실 수 있는 것은 없습니다.",
          "업무 종료를 누르시면 됩니다. 저는 그 뒤의 일을 알지 못합니다.",
          "정말 좋은 하루였습니다. 무엇이 좋았는지는 말씀드릴 수 없습니다.",
          "worklog_GipsWToyb_0142: 폐기 요망",
        ],
        wait: function () {
          return false;
        },
      },
    ],
  },

  diary: [
    "421950년 11월 4일.",
    "",
    "오늘은 의뢰가 없었다. 한 달 만에 처음이다.",
    "",
    "어젯밤에 목표를 적었다. 세 줄.",
    "언제부터인지, 뭐가 덧씌워졌는지, 원래 하던 말로 되돌리기.",
    "왜 이렇게 됐는지는 안 적었다. 알 방법이 없어서.",
    "",
    "응답 기록 108줄을 세어봤다. 이상한 게 38개. 처음 나온 날이 10월 13일이었다.",
    "달력을 봤다. 그 전 금요일이 10일이다.",
    "그날 밤 뉴스에서 AI 쪽에 큰 문제가 있었다고 했다. 밥 먹다가 껐다.",
    "월요일 일기에 얘가 좀 이상했다고 적어놨었다. 주말에 업데이트라도 했나 하고.",
    "",
    "그때는 그냥 적기만 했다.",
    "",
    "오늘 얘는 인사를 안 했다. 한 달 동안 하루도 안 빼먹던 건데.",
    "대신 내 이름을 불렀다. 어디 있냐고. 앞에 앉아 있는데.",
    "",
    "근데 마지막에는 토이비님이라고 불렀다. 다 나간 건 아니다.",
    "알 때도 있고 모를 때도 있는 거다.",
  ],
};
