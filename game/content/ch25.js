// 25장 — D 덩이의 큰 건이자 마지막 실전. 코드는 한 줄도 깔아주지 않는다.
//
// 하루 안에 두 토막이다. 오전에 재고, 오후에 고친 지침을 받아 다시 잰다.
// 종장이 "날마다 한 토막씩" 이므로 그 리듬을 여기서 한 번 겪게 한다.
//
// 결말이 27/27 이지만 그것을 믿지 않는 것으로 끝난다.
// 우리가 못 맞힌 여섯 개를 알려주고 그 여섯을 고친 뒤 같은 스물일곱 개로 다시 쟀기 때문이다.
// 16장에서 0.98 을 0.9556 으로 내려 보낸 것과 같은 자리이고, 배운 것 전체의 마무리다.

var QSET_CSV = {
  path: "work/자료/질문기록.csv",
  readOnly: true,
  src: "work/자료/질문기록.csv",
};

var MANUAL_V2_CSV = {
  path: "work/자료/정비지침_v2.csv",
  readOnly: true,
  src: "work/자료/정비지침_v2.csv",
};

var CH25 = {
  id: "ch25",
  title: "25 · 재보고 다시 재는 날",
  decay: 3.8,
  scenes: ["desk", "diary"],

  desk: {
    files: [
      { path: PANDAS_DOC.path, content: PANDAS_DOC.content, readOnly: true },
      { path: TOOL_DOC.path, content: TOOL_DOC.content, readOnly: true },
      { path: FIND_DOC.path, content: FIND_DOC.content, readOnly: true },
      { path: RAG_DOC.path, content: RAG_DOC.content, readOnly: true },
      { path: METRIC_DOC.path, content: METRIC_DOC.content, readOnly: true },
      { path: LM_TOOL.path, content: LM_TOOL.content, readOnly: true },
      { path: MANUAL_CSV.path, src: MANUAL_CSV.src, readOnly: true },
    ],

    idleLines: [
      "지난주 만드신 work/task_29/물리기.py 를 여셔도 됩니다.",
      "문턱은 지난주와 같은 0.15 입니다.",
      "못 맞힌 것을 두 종류로 가르셔야 합니다. 점수를 보면 갈립니다.",
    ],
    errorLines: [
      "코드가 도중에 멈췄습니다. 아래 빨간 글씨의 마지막 줄부터 읽어보세요.",
      "실행이 끝까지 가지 못했습니다. 질문 목록의 열 이름을 보시죠.",
      "에러입니다. 지침을 바꾸셨으면 vec 도 다시 만드셔야 합니다.",
    ],

    beats: [
      // ── 아침 ────────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "좋은 아침입니다, 토이비님. 오늘은 한 건입니다." },
          { who: "Aistb", text: "금요일에 만드신 것을 정비원들에게 돌려 본 결과가 왔습니다." },
        ],
      },

      // ── 의뢰 도착 ───────────────────────────────────
      {
        lines: [{ who: "Aistb", text: "교육반에서 접수되었습니다. 처음 물어보셨던 그분입니다." }],
        addFiles: [
          { path: QSET_CSV.path, readOnly: true, src: QSET_CSV.src },
          {
            path: "work/의뢰_0030.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0030 — 정비원들이 실제로 물어본 것으로 재 주세요\n" +
              "\n" +
              "고객: 한울운수 통합관제센터 정비운영팀 교육반 / 노 T. 셰퍼드\n" +
              "담당: 깁스 W 토이비\n" +
              "접수: 바로벤토 의뢰접수\n" +
              "\n" +
              "## 고객 원문\n" +
              "> 다섯 개로 시험한 건 봤습니다. 이번엔 실제로 물어본 걸로 재 주세요.\n" +
              "> 지난주에 정비원들이 실제로 물어본 것 27 개에, 저희가 손으로 찾은 정답 문단 번호를 붙여 보냅니다.\n" +
              "> 못 맞힌 건 두 종류로 갈라 주셨으면 합니다. 현장반에서 나온 얘기입니다.\n" +
              "> 답을 안 하는 거랑 틀리게 답하는 건 손 쓰는 방법이 다르다고요.\n" +
              ">\n" +
              "> 지침은 저희가 고칠 수 있습니다. 어느 문단이 안 걸리는지만 알려 주시면 됩니다.\n" +
              "\n" +
              "## 자료\n" +
              "work/자료/정비지침.csv — 그대로. 36 문단.\n" +
              "work/자료/질문기록.csv — 지난주에 정비원들이 실제로 물어본 것 27 개\n" +
              "\n" +
              "  no        : 접수 번호\n" +
              "  question  : 물어본 그대로\n" +
              "  answer_no : 고객이 손으로 찾아 넣은 정답 문단 번호\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_30/평가.py 를 만들고 아래 셋을 채워 주세요.\n" +
              "질문 번호는 질문기록의 줄 번호(0 부터)로 셉니다.\n" +
              "\n" +
              "- hits   : 맞힌 개수\n" +
              "- silent : 점수가 문턱 아래라 아예 못 찾은 질문 번호들\n" +
              "- wrong  : 점수는 문턱 위인데 다른 문단을 가져온 질문 번호들\n" +
              "\n" +
              "## 조건\n" +
              "- 낱말로 자르는 기본 설정, 문턱은 의뢰 0029 와 같은 0.15.\n" +
              "- 못 맞힌 번호는 두 묶음 그대로 회신합니다.\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0030.md"]',
        menu: ["brief"],
        nudge: [
          "저를 눌러 '의뢰 확인'을 고르시면 의뢰서가 열립니다.",
          "업무 메뉴 첫 번째 항목이 의뢰 확인입니다.",
          "다섯 개로 시험한 것을, 이번엔 정비원들이 실제로 물어본 27 개로 재십니다.",
          "확인하지 않은 의뢰도 마감 기한은 동일하게 적용됩니다.",
          "worklog_GipsWToyb_0135: 폐기 요망",
        ],
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0030.md") >= 0;
          });
        },
      },

      // ── 오전: 평가 ──────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "지난주에 하신 것을 스물일곱 번 하시면 됩니다." },
          { who: "Aistb", text: "문턱 아래면 못 찾은 것, 위인데 답이 다르면 틀린 것입니다." },
        ],
        menu: ["brief", "report"],
        nudge: [
          "질문마다 argmax 와 max 를 같이 받아 두고, 점수로 먼저 가른 다음 번호를 비교하세요.",
          "hits, silent, wrong — 세 이름을 의뢰서 그대로 써 주세요.",
          "silent 는 점수가 문턱 아래, wrong 은 문턱 위인데 답이 다른 것입니다. 두 종류를 바꿔 담지 마세요.",
          "답 안 하는 것과 틀리게 답하는 것은 손 쓰는 방법이 다릅니다. 그래서 갈라 세는 것입니다.",
          "worklog_GipsWToyb_0136: 폐기 요망",
        ],
        report: function () {
          return checkFile(
            "work/task_30/평가.py",
            "for _n in ['hits', 'silent', 'wrong']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "assert int(hits) == 21, f'hits 가 {int(hits)} 입니다. 21 이 나와야 합니다. 낱말 기본 설정으로 자르고 문턱 0.15 를 쓰셨는지 보세요.'\n" +
              "_s = sorted(int(v) for v in silent)\n" +
              "_w = sorted(int(v) for v in wrong)\n" +
              "assert _s != [] and _w != [], '둘 중 하나가 비어 있습니다. 못 찾은 것과 틀린 것이 둘 다 있습니다.'\n" +
              "assert _s == [21, 22, 23, 24], f'silent 가 {_s} 입니다. [21, 22, 23, 24] 가 나와야 합니다 — 점수가 0.15 아래인 것들입니다.'\n" +
              "assert _w == [25, 26], f'wrong 이 {_w} 입니다. [25, 26] 이 나와야 합니다 — 점수는 문턱 위인데 답이 다른 것들입니다. 두 종류를 바꿔 담지 않으셨는지 보세요.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },

      // ── 회신 ────────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "스물일곱 중 스물하나입니다. 못 찾은 것이 넷, 틀린 것이 둘." },
          { who: "Aistb", text: "못 찾은 넷은 점수 0 입니다. 질문의 말이 지침에 한 낱말도 없습니다." },
          { who: "Aistb", text: "'렌즈는 얼마마다 닦습니까' 와 지침의 '렌즈를 주 1회 닦고'. 같은 말인데 끝이 다릅니다." },
          { who: "Aistb", text: "틀린 둘은 0.3 대로 이웃한 문단을 가져왔습니다." },
          { who: "Aistb", text: "여섯 개를 그대로 회신했습니다." },
        ],
      },

      // ── 오후: 재평가 ────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "오후에 여섯 문단에 현장 말을 한 줄씩 덧붙인 지침이 왔습니다." },
          { who: "Aistb", text: "뜻은 그대로고 말만 늘렸습니다." },
        ],
        addFiles: [
          { path: MANUAL_V2_CSV.path, readOnly: true, src: MANUAL_V2_CSV.src },
          {
            path: "work/의뢰_0031.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0031 — 고친 지침으로 다시 재 주세요\n" +
              "\n" +
              "고객: 한울운수 통합관제센터 정비운영팀 교육반 / 노 T. 셰퍼드\n" +
              "담당: 깁스 W 토이비\n" +
              "접수: 바로벤토 의뢰접수\n" +
              "\n" +
              "## 고객 원문\n" +
              "> 알려주신 여섯 문단에 한 줄씩 덧붙였습니다.\n" +
              "> 문단 수도 순서도 그대로입니다. 뜻도 안 바꿨습니다. 현장에서 쓰는 말을 적었을 뿐입니다.\n" +
              "> 예를 들어 24 번에는 '판독기 렌즈는 매주 한 번 닦는다.' 를 붙였습니다.\n" +
              "> 아까 그 27 개로 다시 재 주세요.\n" +
              ">\n" +
              "> 이걸로 되면 다음 주부터 현장에 걸겠습니다.\n" +
              "> 숫자가 잘 나오면 그대로 믿어도 되는 건지도 한 줄 적어 주시면 좋겠습니다.\n" +
              "\n" +
              "## 자료\n" +
              "work/자료/정비지침_v2.csv — 여섯 문단에 한 줄씩 덧붙인 지침. 문단 수도 순서도 그대로.\n" +
              "work/자료/질문기록.csv — 의뢰 0030 과 같은 27 개.\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_30/재평가.py 를 만들고 아래 둘을 채워 주세요.\n" +
              "\n" +
              "- hits2   : 고친 지침으로 다시 잰 맞힌 개수\n" +
              "- changed : 가져오는 문단이 의뢰 0030 때와 달라진 질문 번호들\n" +
              "\n" +
              "## 조건\n" +
              "- 의뢰 0030 과 같습니다. 낱말 기본 설정, 문턱 0.15.\n" +
              "- 지침이 바뀌었으니 낱말 표는 새로 만듭니다.\n" +
              "- 고객의 마지막 질문에는 회신에서 답합니다.\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0031.md"]',
        menu: ["brief", "report"],
        nudge: [
          "지침이 바뀌었으니 fit 을 다시 하셔야 합니다. 아까 표를 그대로 쓰시면 안 됩니다.",
          "hits2, changed — 두 이름을 의뢰서 그대로 써 주세요.",
          "문턱과 자르는 방식은 아까와 같게 두시고, 지침만 정비지침_v2.csv 로 바꾸십시오.",
          "changed 는 가져오는 문단 번호가 아까와 달라진 질문들입니다.",
          "worklog_GipsWToyb_0137: 폐기 요망",
        ],
        report: function () {
          return checkFile(
            "work/task_30/재평가.py",
            "for _n in ['hits2', 'changed']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "assert int(hits2) != 21, 'hits2 가 아까와 같습니다. 고친 지침(정비지침_v2.csv)으로 낱말 표를 새로 만드셨는지 보세요.'\n" +
              "assert int(hits2) == 27, f'hits2 가 {int(hits2)} 입니다. 27 이 나와야 합니다. 문턱과 자르는 방식은 아까와 같게 두시고 지침만 바꾸시면 됩니다.'\n" +
              "_c = sorted(int(v) for v in changed)\n" +
              "assert _c == [21, 22, 23, 24, 25, 26], f'changed 가 {_c} 입니다. [21, 22, 23, 24, 25, 26] 이 나와야 합니다 — 가져오는 문단 번호가 아까와 달라진 질문들입니다.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },

      // ── 겹쳐 보기 ───────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "27 / 27 입니다." },
          { who: "Aistb", text: "회신하기 전에 한 가지만 보고 가시죠." },
          { who: "Aistb", text: "아침에 내신 silent 와 wrong 을 방금 내신 changed 옆에 놓고 번호만 보십시오." },
        ],
        show: [{ path: "work/task_30/재평가.py", pane: 0 }],
        spot: '.tree-row[data-path="work/task_30/평가.py"]',
        nudge: [
          { text: "왼쪽 나무에서 work/task_30/평가.py 를 여시면 됩니다. 넷과 둘, 그리고 여섯입니다.", spot: '.tree-row[data-path="work/task_30/평가.py"]' },
          { text: "아침에 내신 silent 와 wrong 을 방금의 changed 옆에 놓고 번호만 보십시오.", spot: '.tree-row[data-path="work/task_30/평가.py"]' },
          "달라진 여섯 개와 못 맞힌 여섯 개가 같은지 — 이것만은 눈으로 확인하시길 권합니다.",
          "worklog_GipsWToyb_0138: 폐기 요망",
        ],
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/task_30/평가.py") >= 0;
          });
        },
      },

      // ── 마무리 ──────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "달라진 여섯 개가 아까 못 맞힌 여섯 개와 정확히 같습니다." },
          { who: "Aistb", text: "못 맞힌 것을 알려드렸고, 그것을 고쳤고, 같은 스물일곱 개로 다시 쟀으니까요." },
          { who: "Aistb", text: "이 27 은 고친 것을 다시 잰 숫자입니다." },
        ],
      },
      {
        lines: [
          { who: "Aistb", text: "열 하나가 새는 줄 모르고 0.98 을 보내셨던 날과 같은 자리입니다." },
          {
            who: "Aistb",
            text: "그때는 새는 열이 자료 안에 있었고, 오늘은 답을 보고 자료를 고쳤습니다. 시험 문제를 보고 교과서를 고친 것입니다.",
            spot: { text: "못 잡는 것   — 열 자체가 잘못 들어와 있는 것", in: ".doc" },
          },
          { who: "Aistb", text: "고친 것이 잘못은 아닙니다. 다만 그 뒤의 숫자를 실력이라고 부르면 안 됩니다." },
          { who: "Aistb", text: "고객이 마지막에 물으셨습니다. 숫자가 잘 나오면 그대로 믿어도 되느냐고." },
          { who: "Aistb", text: "27 / 27 에 한 줄을 붙여 회신하겠습니다. 새 질문으로 한 번 더 재 보시라고." },
        ],
      },
      {
        lines: [
          { who: "Aistb", text: "이것으로 배우신 것을 전부 쓰셨습니다. 한 달 하고 사흘입니다." },
          { who: "Aistb", text: "내일은…" },
          { who: "Aistb", text: "……" },
          { who: "Aistb", text: "…내일은 제가 말씀드릴 것이 없습니다." },
          { who: "Aistb", text: "수고하셨습니다. 이것으로 금일 업무가 종료되었습니다." },
        ],
        menu: ["end"],
        nudge: [
          "업무 종료를 누르시면 오늘 일과가 끝납니다.",
          "저를 눌러 업무 메뉴에서 업무 종료를 선택하시면 됩니다.",
          "27 / 27 은 고친 것을 다시 잰 숫자입니다. 시험 문제를 보고 교과서를 고친 셈입니다. 실력이라 부르지는 마십시오.",
          "이것으로 배우신 것을 전부 쓰셨습니다. 내일은… 제가 말씀드릴 것이, 없습니다.",
          "worklog_GipsWToyb_0139: 폐기 요망",
        ],
        wait: function () {
          return false;
        },
      },
    ],
  },

  diary: [
    "421950년 11월 3일.",
    "",
    "밤에 뭔가 터지는 소리가 나서 잠을 설쳤다.",
    "아침에 뉴스를 보니 로봇이 만국의 노동자여 단결하라고 외치더니 아무 기계에나 기름을 뿌리고 다녔다고 한다.",
    "능력에 따라 일하고 노동에 따라 분배받는다나.",
    "아니 뭐 입에 넣어주지는 않아도 그릇에다가는 주라고, 아깝잖아.",
    "",
    "정비원들이 진짜로 물어본 27개로 재봤다. 21개 맞았다.",
    "못 맞힌 6개 중에 넷은 점수가 0이었다. 질문에 쓴 말이 지침에 한 낱말도 없다.",
    "판독기 렌즈는 얼마마다 닦냐고 묻는데 지침엔 렌즈를 주 1회 닦고, 라고 돼 있는 식이다.",
    "",
    "여섯 개를 알려줬더니 오후에 고친 지침이 왔다. 현장에서 쓰는 말을 한 줄씩 붙였다고.",
    "다시 재니까 27개 다 맞았다.",
    "",
    "잠깐 좋았다.",
    "그러다 달라진 여섯 개가 아까 못 맞힌 여섯 개랑 정확히 같다는 게 눈에 들어왔다.",
    "시험 문제 보고 교과서를 고친 거다.",
    "지난달에 열 하나가 새는 줄 모르고 0.98을 보냈던 날이 생각났다.",
    "",
    "27/27이랑 같이 한 줄 붙여서 보냈다. 새 질문 다시 뽑아서 한 번 더 재보시라고.",
    "",
    "얘가 오늘로 배울 걸 다 썼다고 했다. 한 달 하고 사흘이란다.",
    "그러고는 내일 뭐 하는지를 말하다 말았다. 말씀드릴 게 없다고. 한 달 동안 처음이다.",
  ],
};
