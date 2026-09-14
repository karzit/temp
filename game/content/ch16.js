// 16장 — B 덩이의 큰 건. 어제 올린 점수가 왜 올랐는지 밝히고, 도로 내려서 납품한다.
// 코드는 깔아주지 않는다. 조사 도구는 12장에서 이미 배웠다(feature_importances_).
//
// 크게 터뜨리지 않는다. 토이비가 "내 것도 그랬네" 정도로 한 번 겪고 지나간다
// (feed-back.md 「Leakage는 클라이맥스가 아닙니다」). 클라이맥스는 종장 하나뿐이다.

var NEW_CHECK_CSV = {
  path: "work/자료/신규점검.csv",
  readOnly: true,
  content:
  [
    "id,hours,reboots,delay,errors,patched,revisit_days",
    "4401,2100,5,540.0,7,1,",
    "4402,3400,13,210.0,9,0,",
    "4403,760,2,150.0,1,0,",
    "4404,1520,4,190.0,3,1,",
    "4405,2870,6,470.0,8,1,",
  ].join("\n") + "\n",
};

var CH16 = {
  id: "ch16",
  title: "16 · 내려서 보내는 날",
  decay: 3.1,
  scenes: ["desk", "diary"],

  desk: {
    files: [
      { path: PANDAS_DOC.path, content: PANDAS_DOC.content, readOnly: true },
      { path: FOREST_DOC.path, content: FOREST_DOC.content, readOnly: true },
      { path: CV_DOC.path, content: CV_DOC.content, readOnly: true },
      { path: METRIC_DOC.path, content: METRIC_DOC.content, readOnly: true },
      { path: LOG_EXT_CSV.path, content: LOG_EXT_CSV.content, readOnly: true },
    ],

    idleLines: [
      "어제 자료가 work/자료/점검이력_v2.csv 에 그대로 있습니다.",
      "어제 만드신 work/task_20/재학습.py 를 여셔도 됩니다.",
      "어제와 달라진 것은 열 하나입니다. 거기서부터 보세요.",
    ],
    errorLines: [
      "코드가 도중에 멈췄습니다. 아래 빨간 글씨의 마지막 줄부터 읽어보세요.",
      "실행이 끝까지 가지 못했습니다. 빈칸이 있는 열을 그대로 넣지 않으셨는지 보시죠.",
      "에러입니다. 판정에 넣는 표의 열이 학습할 때와 같아야 합니다.",
    ],

    beats: [
      // ── 아침 ────────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "…좋은 아침입니다, 토이비님." },
          { who: "Aistb", text: "어제 회신한 건으로 현장에서 다시 들어왔습니다. 두 번째입니다." },
        ],
      },

      // ── 의뢰 도착 ───────────────────────────────────
      {
        lines: [{ who: "Aistb", text: "의뢰서입니다." }],
        addFiles: [
          { path: NEW_CHECK_CSV.path, readOnly: true, content: NEW_CHECK_CSV.content },
          {
            path: "work/의뢰_0021.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0021 — 재학습본이 전부 재발이라고 합니다\n" +
              "\n" +
              "고객: 한울운수 통합관제센터 정비운영팀 현장반 / 하람 J. 도쿠\n" +
              "담당: 깁스 W 토이비\n" +
              "접수: 바로벤토 의뢰접수\n" +
              "\n" +
              "## 고객 원문\n" +
              "> 어제 받은 재학습본을 오늘 아침에 걸었습니다.\n" +
              "> 아직 점검을 안 한 다섯 대를 넣었더니 다섯 대 전부 재발이라고 나옵니다.\n" +
              "> 그중 4403 호는 지난달에 새로 들여온 겁니다. 오류가 하루 한 건입니다.\n" +
              "> 이건 아무리 봐도 아닙니다.\n" +
              ">\n" +
              "> 저희 쪽에서 뭘 잘못 넣었나 싶어 확인했습니다.\n" +
              "> 새 형식에 revisit_days 칸이 있는데 이 다섯 대는 그 칸이 비어 있습니다.\n" +
              "> 비면 안 들어가길래 0 으로 채워 넣었습니다. 그러고 나온 결과가 위입니다.\n" +
              "> 그 다섯 대 자료를 같이 보냅니다.\n" +
              ">\n" +
              "> 어제 0.98 이라고 들었습니다. 지난주에는 0.96 이었고요.\n" +
              "> 올랐다길래 좋은 줄 알았는데 걸어보니 전보다 못합니다.\n" +
              "> 숫자가 오르는 게 늘 좋은 건 아닌가 봅니다.\n" +
              "\n" +
              "## 자료\n" +
              "work/자료/점검이력_v2.csv — 의뢰 0020 에서 학습에 쓴 것과 같은 파일\n" +
              "work/자료/신규점검.csv — 지금 판정해야 할 다섯 대. revisit_days 는 비어 있습니다.\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_21/누출.py 를 만들고 아래 셋을 채워 주세요.\n" +
              "\n" +
              "- leak : 이 일을 일으킨 열의 이름 (글자 그대로 한 개)\n" +
              "- acc  : 그 열을 빼고 다시 만든 모델의 점수 (3할을 떼어 한 번)\n" +
              "- pred : 신규 다섯 대를 그 모델로 판정한 결과 (재발 아님 0 / 재발 1)\n" +
              "\n" +
              "## 조건\n" +
              "- 다시 만드는 모델은 숲 100 그루, 3할, random_state 42. 지금까지와 같습니다.\n" +
              "- 어제 회신한 0.98 은 이 건이 끝나면 정정합니다.\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0021.md"]',
        menu: ["brief"],
        nudge: "저를 눌러 의뢰 확인을 고르시면 의뢰서가 열립니다.",
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0021.md") >= 0;
          });
        },
      },

      // ── 넘겨주기 ────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "오늘은 예제 없이 하십니다." },
          { who: "Aistb", text: "어제와 달라진 것은 열 하나입니다. 그 열이 무슨 일을 하는지 보십시오." },
          { who: "Aistb", text: "어제 의뢰서에 고객이 적어 둔 그 열의 뜻도 한 번 더 읽어 보십시오." },
        ],
        menu: ["brief", "report"],
        nudge: "여섯 열로 학습한 숲에서 feature_importances_ 를 꺼내 열 이름과 짝지어 보세요.",
        report: function () {
          return checkFile(
            "work/task_21/누출.py",
            "for _n in ['leak', 'acc', 'pred']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "_l = str(leak).strip()\n" +
              "assert _l != 'again', 'again 은 정답 열입니다. 애초에 X 에 넣는 열이 아닙니다. 어제 새로 늘어난 열을 보세요.'\n" +
              "assert _l == 'revisit_days', f'leak 이 {_l!r} 입니다. 어제 늘어난 열 하나가 나머지 다섯을 합친 것보다 크게 쓰이고 있습니다. 중요도를 꺼내 보세요.'\n" +
              "assert abs(float(acc) - 0.9556) < 0.02, f'acc 가 {float(acc):.4f} 입니다. 0.9556 이 나와야 합니다. revisit_days 를 뺀 다섯 열로, 100 그루 random_state 42, 3할로 다시 만드셨는지 보세요.'\n" +
              "_p = [int(v) for v in pred]\n" +
              "assert len(_p) == 5, f'pred 에 {len(_p)} 개가 들어 있습니다. 다섯 대이니 다섯 개입니다.'\n" +
              "assert _p != [1, 1, 1, 1, 1], '다섯 대가 전부 재발로 나왔습니다. 현장이 겪은 것과 같습니다 — 아직 revisit_days 가 들어간 모델로 판정하고 계십니다.'\n" +
              "assert _p == [1, 1, 0, 0, 1], f'pred 가 {_p} 입니다. [1, 1, 0, 0, 1] 이 나와야 합니다. 판정에 넣는 표도 다섯 열이어야 합니다.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },

      // ── 마무리 ──────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "찾으셨습니다." },
          { who: "Aistb", text: "revisit_days 는 다음에 들어온 날까지의 간격입니다. 재발한 대수는 금방 다시 들어옵니다." },
          { who: "Aistb", text: "그 값은 **재발한 뒤에야 채워집니다.** 어제 모델은 재발 여부를 맞힌 것이 아니라, 이미 재발한 것을 보고 재발했다고 답한 것입니다." },
          { who: "Aistb", text: "판정할 대수에는 그 칸이 없습니다. 현장이 0 으로 채운 것이 '곧바로 다시 왔다' 가 되어 다섯 대 전부 재발로 나왔습니다." },
        ],
      },
      {
        lines: [
          { who: "Aistb", text: "어제 다섯 겹으로 재셨을 때 다섯 번 다 0.98 언저리였습니다." },
          { who: "Aistb", text: "다섯 번 다 같은 열로 배웠으니 잡히지 않습니다. 나눠 재는 것은 나누기 운을 잡아줄 뿐입니다." },
          { who: "Aistb", text: "참고 문서에 적혀 있었습니다. 「못 잡는 것 — 열 자체가 잘못 들어와 있는 것」." },
          { who: "Aistb", text: "저도 어제 그 문서를 읽지 않았습니다." },
        ],
      },
      {
        lines: [
          { who: "Aistb", text: "0.98 을 0.9556 으로 낮춰 회신하겠습니다." },
          { who: "Aistb", text: "내일부터는 방식이 아예 다릅니다." },
        ],
      },
      {
        lines: [{ who: "Aistb", text: "수고하셨습니다. 이것으로 금일 업무가 종료되었습니다. 내일 뵙겠습니다." }],
        menu: ["end"],
        nudge: "업무 종료를 누르시면 오늘 일과가 끝납니다.",
        wait: function () {
          return false;
        },
      },
    ],
  },

  diary: [
    "421950년 10월 21일.",
    "",
    "어제 일기에 이번 주는 시작이 좋다고 적었다. 하루 만에 뒤집혔다.",
    "",
    "어제 올라간 그 열이 문제였다.",
    "다음에 다시 들어온 날까지의 간격이라고 고객이 의뢰서에 적어 놨었다. 어제 읽고도 그냥 넘겼다.",
    "재발한 대수는 금방 다시 오고 아닌 대수는 안 온다.",
    "나는 미래를 보고 과거를 맞히고 있었다.",
    "",
    "다섯 번 나눠 잰 것도 소용없었다. 다섯 번 다 그 열을 보고 배웠으니까.",
    "참고 문서에 그 말이 그대로 적혀 있었고 어제 그 문서를 띄워놓고 있었다.",
    "",
    "0.98을 0.96으로 내려서 보냈다. 지난주 숫자로 돌아갔다.",
    "일주일 동안 올린 걸 오늘 도로 내렸는데 이상하게 기분이 나쁘지 않다.",
    "",
    "현장 반장이 숫자가 오르는 게 늘 좋은 건 아닌가 보다고 적어 보냈다.",
    "그 사람은 나보다 하루 먼저 알았다.",
    "",
    "얘는 오늘 별말 안 했다. 자기도 어제 그 문서를 안 읽었다고 한 게 다였다.",
  ],
};
