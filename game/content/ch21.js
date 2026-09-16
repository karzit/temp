// 21장 — C 덩이의 큰 건. 코드는 한 줄도 깔아주지 않는다. 새로 배우는 것도 없다.
//
// 자료 하나에 규칙이 둘 들어 있고, 서로 다른 방법으로만 잡힌다.
//   재작업이 세 번 이상이면 불량   -> 개수. 13·19장의 가방
//   맨 처음 공정이 수동정렬이면 불량 -> 순서. 20장의 어텐션
// 어느 한쪽만으로는 못 풀고, 둘을 이어 붙여야 완성된다.
//
// 정렬 낱말이 어느 줄이든 수동 2 개 자동 2 개라, 가방이 두 번째 규칙을 훔쳐볼 수 없다.

var ASSY_CSV = {
  path: "work/자료/조립기록.csv",
  readOnly: true,
  src: "work/자료/조립기록.csv",
};

var ASSY_TODO_CSV = {
  path: "work/자료/조립대기.csv",
  readOnly: true,
  src: "work/자료/조립대기.csv",
};

var CH21 = {
  id: "ch21",
  title: "21 · 둘을 붙이는 날",
  decay: 3.5,
  scenes: ["desk", "diary"],

  desk: {
    files: [
      { path: PANDAS_DOC.path, content: PANDAS_DOC.content, readOnly: true },
      { path: TEXT_DOC.path, content: TEXT_DOC.content, readOnly: true },
      { path: SEQ_DOC.path, content: SEQ_DOC.content, readOnly: true },
      { path: ATTN_DOC.path, content: ATTN_DOC.content, readOnly: true },
      { path: METRIC_DOC.path, content: METRIC_DOC.content, readOnly: true },
    ],

    idleLines: [
      "참고 문서는 work/참고/ 안에 다섯 개 다 있습니다.",
      "어제 만드신 work/예제/21_한번에.py 를 여셔도 됩니다.",
      "한 방법으로 안 되면 그 방법이 못 보는 것이 무엇인지 보세요.",
    ],
    errorLines: [
      "코드가 도중에 멈췄습니다. 아래 빨간 글씨의 마지막 줄부터 읽어보세요.",
      "실행이 끝까지 가지 못했습니다. 두 표를 옆으로 붙이실 때 행 수가 같아야 합니다.",
      "에러입니다. 가방은 성긴 표로 나옵니다. 옆으로 붙이시려면 toarray() 로 펴 주세요.",
    ],

    beats: [
      // ── 아침 ────────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "좋은 아침입니다, 토이비님. 각인 건을 봐 드린 곳에서 정식 의뢰가 접수되었습니다." },
          { who: "Aistb", text: "금일은 예제 없이 진행하십니다." },
          { who: "Aistb", text: "나흘 동안 나온 것 중 어느 것을 쓸지 고르시는 것이 오늘 일입니다." },
        ],
      },

      // ── 의뢰 도착 ───────────────────────────────────
      {
        lines: [{ who: "Aistb", text: "의뢰서입니다." }],
        addFiles: [
          { path: ASSY_CSV.path, readOnly: true, src: ASSY_CSV.src },
          { path: ASSY_TODO_CSV.path, readOnly: true, src: ASSY_TODO_CSV.src },
          {
            path: "work/의뢰_0026.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0026 — 조립 라인 불량 예측\n" +
              "\n" +
              "고객: 한도정밀 검수라인 2012호 / 려 O. 하르츠\n" +
              "담당: 깁스 W 토이비\n" +
              "접수: 바로벤토 의뢰접수\n" +
              "\n" +
              "## 고객 원문\n" +
              "> 지난번 각인 건을 보고 이쪽도 부탁드리게 됐습니다.\n" +
              "> 조립대를 지나간 제품 500 개의 공정 기록입니다. 아직 검사 안 한 다섯 개도 같이 보냅니다.\n" +
              "> 저희 쪽에서 한 번 해봤는데 잘 안 됩니다. 어떤 공정이 몇 번 있었는지로 세어 보면\n" +
              "> 절반은 설명이 되는데 나머지 절반이 안 됩니다. 뭘 놓치고 있는 건지 모르겠습니다.\n" +
              ">\n" +
              "> 지난주에 판독기 만든 데는 결국 연락이 닿았습니다. 문을 닫았다고 합니다.\n" +
              "> 그쪽 AI 를 고치려던 사람들이 다 나갔다더군요.\n" +
              "\n" +
              "## 자료\n" +
              "work/자료/조립기록.csv — 조립대를 지나간 제품 500 개의 공정 기록\n" +
              "\n" +
              "  no    : 제품 번호\n" +
              "  steps : 그 제품이 거친 공정을 순서대로 적은 것. 빈칸으로 나뉩니다\n" +
              "  bad   : 최종 검사에서 불량이 났는지 (1 = 불량)\n" +
              "\n" +
              "공정은 열한 종류입니다.\n" +
              "수동정렬 · 자동정렬 · 재작업 · 압착 · 검사 · 도포 · 경화 · 이송 · 대기 · 세척 · 각인.\n" +
              "\n" +
              "work/자료/조립대기.csv — 아직 검사 안 한 다섯 개. bad 칸이 없습니다.\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_26/조립.py 를 만들고 아래 넷을 채워 주세요.\n" +
              "\n" +
              "- bag_acc  : 공정을 낱말처럼 세기만 해서 학습시켰을 때의 점수\n" +
              "- attn_acc : 앞쪽을 보라는 질문으로 꺼낸 것만으로 학습시켰을 때의 점수\n" +
              "- both_acc : 위 둘을 옆으로 붙여서 학습시켰을 때의 점수\n" +
              "- pred     : 조립대기 다섯 개의 판정 (양품 0 / 불량 1). both 쪽 모델로\n" +
              "\n" +
              "## 조건\n" +
              "- 앞쪽을 보는 질문은 의뢰 0025 에 쓴 것 그대로.\n" +
              "- 고객이 해 본 것이 bag 쪽입니다. 그 '절반' 이 무엇이었는지를 회신에 적습니다.\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0026.md"]',
        menu: ["brief"],
        nudge: [
          "저를 눌러 '의뢰 확인'을 고르시면 의뢰서가 열립니다.",
          "업무 메뉴 첫 번째 항목이 의뢰 확인입니다.",
          "나흘 동안 나온 것 중 어느 것을 쓸지 고르는 것이 오늘 일입니다. 하나만 골라야 하는 것은 아닙니다.",
          "판독기 만든 데는 결국 문을 닫았다고 합니다. 고치려던 사람들이 다 나갔다더군요.",
          "worklog_GipsWToyb_0120: 폐기 요망",
        ],
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0026.md") >= 0;
          });
        },
      },

      // ── 넘겨주기 ────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "고객이 절반은 설명이 된다고 적었습니다. 그대로 받아들이시면 됩니다." },
          { who: "Aistb", text: "세는 방식으로 잡히는 규칙 하나, 안 잡히는 규칙 하나라는 뜻입니다." },
          { who: "Aistb", text: "두 방법의 결과는 둘 다 표입니다. np.hstack 으로 옆으로 붙이면 하나가 됩니다." },
        ],
        menu: ["brief", "report"],
        nudge: [
          "가방은 성긴 표라 toarray() 로 펴야 붙습니다. 나누기 전에 붙이시면 행 순서가 어긋나지 않습니다.",
          "bag_acc, attn_acc, both_acc, pred — 네 이름을 의뢰서 그대로 써 주세요.",
          "두 표를 옆으로 붙이면 행 수는 그대로이고 열만 늘어납니다. 그것이 맞습니다.",
          "조립대기 다섯 개도 학습할 때와 같은 두 가지를 거쳐 같은 순서로 붙이십시오.",
          "worklog_GipsWToyb_0121: 폐기 요망",
        ],
        report: function () {
          return checkFile(
            "work/task_26/조립.py",
            "for _n in ['bag_acc', 'attn_acc', 'both_acc', 'pred']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "assert abs(float(bag_acc) - 0.6867) < 0.05, f'bag_acc 가 {float(bag_acc):.4f} 입니다. 0.69 근처가 나와야 합니다. 공정을 낱말로 세기만 하셨는지, 3할과 random_state 42 를 맞추셨는지 보세요.'\n" +
              "assert abs(float(attn_acc) - 0.82) < 0.05, f'attn_acc 가 {float(attn_acc):.4f} 입니다. 0.82 근처가 나와야 합니다. 어제처럼 자리 번호를 이름표로 삼고 번호가 작을수록 좋다는 질문을 던지셨는지 보세요.'\n" +
              "assert float(both_acc) > 0.94, f'both_acc 가 {float(both_acc):.4f} 입니다. 0.97 근처가 나와야 합니다. 두 표를 옆으로 붙이셨는지 보세요 — 행 수는 그대로이고 열만 늘어나야 합니다.'\n" +
              "assert float(both_acc) > float(bag_acc) and float(both_acc) > float(attn_acc), '붙인 쪽이 한쪽보다 낮습니다. 세 변수를 바꿔 담지 않으셨는지 보세요.'\n" +
              "_p = [int(v) for v in pred]\n" +
              "assert len(_p) == 5, f'pred 에 {len(_p)} 개가 들어 있습니다. 다섯 개입니다.'\n" +
              "assert _p == [0, 1, 1, 0, 1], f'pred 가 {_p} 입니다. [0, 1, 1, 0, 1] 이 나와야 합니다. 조립대기도 학습할 때와 같은 두 가지를 거쳐 같은 순서로 붙이셨는지 보세요.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },

      // ── 마무리 ──────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "통과했습니다." },
          { who: "Aistb", text: "0.69 와 0.82 를 붙여 0.97 입니다." },
          { who: "Aistb", text: "재작업 횟수는 순서로 안 나오고, 맨 처음은 세어서 안 나옵니다." },
          { who: "Aistb", text: "고객의 '절반' 이 정확했습니다. 자기 방법으로 볼 수 있는 절반이었습니다." },
        ],
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "다만 이 자료는 규칙이 둘뿐이라 둘로 다 덮였습니다. 0.97 은 자료가 작았던 덕입니다.",
          },
        ],
      },
      {
        lines: [
          { who: "Aistb", text: "다음 주부터는 만들지 않습니다." },
          { who: "Aistb", text: "남이 만들어 둔 것을 가져다 쓰는 일입니다." },
          {
            who: "Aistb",
            text: "안을 열어볼 수 없는 것을 도구로 부리는 일입니다.",
            tone: "bad",
          },
          { who: "Aistb", text: "수고하셨습니다. 이것으로 금일 업무가 종료되었습니다. 내일 뵙겠습니다." },
        ],
        menu: ["end"],
        nudge: [
          "업무 종료를 누르시면 오늘 일과가 끝납니다.",
          "저를 눌러 업무 메뉴에서 업무 종료를 선택하시면 됩니다.",
          "0.69 와 0.82 를 붙여 0.97 입니다. 다만 규칙이 둘뿐이라 덮인 것입니다. 자료가 작았던 덕입니다.",
          "다음 주부터는 만들지 않습니다. 남이 만들어 둔 것을, 안을 열어볼 수 없는 것을 부리는 일입니다.",
          "worklog_GipsWToyb_0122: 폐기 요망",
        ],
        wait: function () {
          return false;
        },
      },
    ],
  },

  diary: [
    "421950년 10월 28일.",
    "",
    "각인 봐줬던 데서 정식 의뢰가 왔다. 이번엔 조립 공정 기록 500개.",
    "고객이 자기들도 해봤는데 절반은 설명이 되고 절반이 안 된다고 적어놨다.",
    "",
    "세어보니까 0.69. 어제 방법으로만 하니까 0.82.",
    "둘 다 어중간해서 한참 들여다보다가 그냥 둘 다 붙여봤다.",
    "",
    "0.97.",
    "",
    "고객이 절반이라고 한 게 진짜 절반이었다.",
    "",
    "다음 주부터는 안 만든단다. 남이 만들어 둔 걸 가져다 쓴다고.",
    "안을 열어볼 수 없는 걸 도구로 부리는 일이라고. 한 달 동안 만드는 것만 배웠는데.",
  ],
};
