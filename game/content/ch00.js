// 0장 — 튜토리얼.
// ML은 하나도 가르치지 않는다. 이 게임을 어떻게 조작하는지만 가르친다.
var CH00 = {
  id: "ch00",
  title: "0 · 튜토리얼",
  scenes: ["intro", "phone", "room", "desk", "diary"],

  intro: [
    "대충 먼 미래. 아마도 42의 의미를 인류가 이해했을 정도의 아득한 미래…",
    "AI는 고객센터에서 사람들을 화나게 만드는 일 외에도 많은 곳에서 쓰이고 있습니다.",
    "딸기잼을 바른 하와이안 초코퐁듀 피자를 화학식으로 분해해 어떤 맛이 날지 알려주고, 이상한 쓰레기 게임을 먼저 해보면서 우리의 돈을 아껴주고, 인터넷 커뮤니티에 모두가 본인만 볼 수 없는 명작들을 적어주고… 여튼 상당히 여러 방면으로 쓰이고 있습니다.",
    "",
    "하지만 이런 다재다능한 인공지능도 결국 인류의 발명품…",
    "어쩌다 진상 고객과의 진솔한 대화(물리)로 인해 망가지거나, 어른들의 사정으로 인해 용도가 변경되거나… 이런 일들로 인해 인공지능을 만들고 고쳐주는 사람이 필요합니다.",
    "",
    "그리고 바로 지금! 바로 당신이! 바로 인공지능을 고쳐주는 바로벤토의 새로운 직원으로 입사하였습니다.",
    "인공지능을 다루는 법을 배우고, 고치고, 만들어 바로벤토에서 ~~폐기당하지 않도록~~ 최고의 엔지니어로 성장해봅시다!",
  ],

  phone: {
    apps: [
      { icon: "✉", name: "메일", badge: "1", shake: true, opens: "mail" },
      { icon: "💬", name: "메신저", quip: "읽지 않은 단체방이 217개 있다. 열지 않는 편이 낫겠다." },
      { icon: "🎮", name: "게임", quip: "출근 첫날부터 이건 좀 아닌 것 같다." },
      { icon: "🗺", name: "지도", quip: "Dartconarin거리 1956-0718번지. 이미 외웠다." },
      { icon: "☀", name: "날씨", quip: "바람이 분다. 그 너머까지는 아직 모르겠다." },
      { icon: "🧮", name: "계산기", quip: "곧 아주 많이 쓰게 될 것 같은 예감이 든다." },
      { icon: "🎵", name: "음악", quip: "출근길에 듣던 노래가 아직 걸려 있다." },
      { icon: "📷", name: "사진", quip: "볼 만한 게 없다." },
      { icon: "⚙", name: "설정", quip: "건드릴 게 없다." },
    ],
    mails: [
      {
        from: "바로벤토 인사팀",
        subject: "바로벤토 AI엔지니어링 신입 채용 최종 합격 안내 — 깁스 W 토이비님",
        unread: true,
        body:
          "안녕하세요! 깁스 W 토이비님. 이번 바로벤토의 공개 채용에 관심을 갖고 지원해 주셔서 진심으로 감사드립니다.\n" +
          "이번 공개 채용에서 토이비님께서 보여주신 역량과 열정은 매우 인상 깊었습니다.\n" +
          "이에 바로벤토의 최종 합격자로 선정되었음을 기쁜 마음으로 알려 드립니다.\n" +
          "바로벤토의 새로운 구성원이 되신 것을 진심으로 환영하며, 앞으로 당사와 함께 불어오는 바람 그 너머로 나아갈 수 있기를 기대합니다.\n" +
          "421950년 10월 01일부터 Dartconarin거리 1956-0718번지로 출근해주시면 됩니다.\n" +
          "감사합니다.",
      },
      {
        from: "스팸클래식",
        subject: "[광고] 오늘만 이 가격! 스팸클래식 12호 선물세트",
        body: "명절이 아니어도 괜찮습니다. 햄은 늘 옳습니다.\n수신 거부는 아래 링크를 눌러도 되지 않습니다.",
        quip: "이런 걸 왜 스팸이라고 부르는지 알 것 같기도 하다.",
      },
      {
        from: "런천미트연구소",
        subject: "[광고] 신제품 출시 — 이번엔 진짜 다릅니다",
        body: "지난번에도 진짜 달랐습니다.\n이번엔 더 진짜 다릅니다.",
        quip: "다르긴 뭐가 다른가.",
      },
      {
        from: "매달햄",
        subject: "[광고] 구독하고 매달 받아보세요",
        body: "매달 햄이 도착합니다.\n해지는 매달 1일 오전 3시에서 3시 5분 사이에만 가능합니다.",
        quip: "저 시간에 깨어 있을 자신이 없다.",
      },
    ],
  },

  desk: {
    files: [
      {
        path: "work/의뢰_0001.md",
        readOnly: true,
        kind: "brief",
        content:
          "# 의뢰 0001 — 신입 교육: 작업 단말 사용법\n" +
          "\n" +
          "발신: 바로벤토 교육팀\n" +
          "수신: 깁스 W 토이비\n" +
          "\n" +
          "## 할 일\n" +
          "1. 이 문서를 끝까지 읽는다.\n" +
          "2. work 폴더 안에 first_task 폴더를 만들고, 그 안에 hello.py 파일을 만든다.\n" +
          '3. hello.py 에 print("안녕하세요") 를 적고 실행한다.\n' +
          "4. Aistb에게 완료 보고를 한다.\n" +
          "\n" +
          "## 참고\n" +
          "- 파일은 왼쪽 탐색기에서 만듭니다. 만들 위치가 될 폴더를 먼저 한 번 누르세요.\n" +
          "- 탭 오른쪽의 ◫ 를 누르면 화면이 둘로 나뉩니다. 이 문서를 띄워두고 코드를 짤 수 있습니다.\n" +
          "- 막히면 오른쪽 아래의 Aistb를 누르세요.\n",
      },
    ],

    idleLines: [
      "천천히 하셔도 됩니다. 첫날에 잘리는 사람은 거의 없습니다.",
      "막히셨으면 저를 눌러 주세요. 그러라고 있는 겁니다.",
      "의뢰서는 work 폴더에 그대로 있습니다.",
    ],
    errorLines: [
      "코드가 도중에 멈췄습니다. 아래 빨간 글씨의 마지막 줄부터 읽어보세요.",
      "실행이 끝까지 가지 못했습니다. 따옴표나 괄호가 짝이 맞는지 보시죠.",
      "에러입니다. 당황하실 것 없습니다. 저도 하루에 백 번쯤 봅니다.",
    ],

    // 완료 보고를 눌렀을 때. 문제가 있으면 그 이유를, 없으면 null.
    report: function () {
      if (!FS.isFile("work/first_task/hello.py")) {
        return "work/first_task/hello.py 가 보이지 않습니다. 파일부터 만들어 주세요.";
      }
      var r = IDE.lastRun;
      if (!r || !r.ok || r.path !== "work/first_task/hello.py" || !r.output) {
        return "hello.py 가 아직 제대로 실행되지 않았습니다. 실행 결과를 확인하고 다시 보고해 주세요.";
      }
      return null;
    },

    beats: [
      {
        lines: [
          { who: "???", text: "반갑습니다, 깁스 W 토이비님." },
          { who: "???", text: "바로벤토에서 직원 지원 업무를 맡고 있는 Aistb 입니다." },
          { who: "Aistb", text: "오늘은 이 단말을 다루는 법만 익힙니다." },
        ],
      },

      // ── 의뢰 확인 ──
      {
        lines: [
          { who: "Aistb", text: "저를 누르시면 업무 메뉴가 열립니다. 첫 항목이 의뢰 확인입니다." },
        ],
        nudge: "오른쪽 아래의 저를 눌러 주세요. 첫 항목이 의뢰 확인입니다.",
        menu: ["brief"],
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0001.md") >= 0;
          });
        },
      },
      {
        lines: [{ who: "Aistb", text: "의뢰서입니다." }],
        spot: '.tree-row[data-path="work/의뢰_0001.md"]',
      },

      // ── 파일과 폴더 ──
      {
        lines: [{ who: "Aistb", text: "다음은 폴더입니다. work 를 눌러 주세요." }],
        spot: '.tree-row[data-path="work"]',
        nudge: "왼쪽 탐색기의 work 를 눌러 주세요.",
        wait: function () {
          return IDE.selectedDir === "work";
        },
      },
      {
        lines: [{ who: "Aistb", text: "그 상태에서 ＋폴더입니다." }],
        spot: "[data-new='dir']",
        nudge: "＋폴더 버튼을 눌러 주세요.",
        wait: function () {
          return (IDE.newform && IDE.newform.kind === "dir") || FS.exists("work/first_task");
        },
      },
      {
        lines: [{ who: "Aistb", text: "이름은 first_task 입니다." }],
        spot: ".newform input",
        nudge: "이름 칸에 first_task 를 적고 만들기를 누르세요.",
        wait: function () {
          return FS.exists("work/first_task");
        },
        reject: function () {
          var made = FS.list("work").filter(function (n) {
            return n !== "first_task" && FS.node("work/" + n).type === "dir";
          });
          if (made.length) {
            return "폴더 이름이 " + made[0] + " 로 되어 있습니다. 의뢰서에는 first_task 로 적혀 있습니다.";
          }
          return null;
        },
      },
      {
        lines: [{ who: "Aistb", text: "이번에는 그 폴더 안에 hello.py 입니다." }],
        spot: "[data-new='file']",
        nudge: "first_task 를 고른 뒤 ＋파일을 누르고, 이름을 hello.py 로 적으세요.",
        wait: function () {
          return FS.isFile("work/first_task/hello.py");
        },
      },

      // ── 코드 실행 ──
      {
        lines: [
          { who: "Aistb", text: "완벽합니다. 해당 교육 수강자 중 상위 1%에 해당하는 성취도입니다." },
          { who: "Aistb", text: "**정정** 상위 98%입니다." },
        ],
      },
      {
        lines: [
          { who: "Aistb", text: 'print("안녕하세요") 를 적고 ▶ 실행입니다. 처음은 몇 초 걸립니다.' },
        ],
        spot: ".run",
        nudge: "왼쪽 편집창에 코드를 적고 아래의 ▶ 실행을 누르세요.",
        wait: function () {
          var r = IDE.lastRun;
          return !!r && r.ok && r.path === "work/first_task/hello.py" && !!r.output;
        },
      },

      // ── 완료 보고 ──
      {
        lines: [
          { who: "Aistb", text: "끝나면 완료 보고입니다." },
        ],
        menu: ["report"],
        nudge: "저를 누르시면 완료 보고가 있습니다.",
        wait: function (ctx) {
          return ctx.reported;
        },
      },
      { lines: [{ who: "Aistb", text: "접수했습니다." }] },
      {
        lines: [
          { who: "Aistb", text: "수고하셨습니다. 이것으로 금일 업무가 종료되었습니다. 내일 뵙겠습니다." },
        ],
        menu: ["end"],
        nudge: "업무 종료를 누르시면 오늘 일과가 끝납니다.",
        wait: function () {
          return false; // 업무 종료를 눌러야 하루가 끝난다
        },
      },
    ],
  },

  // 하루가 끝나면 소개와 같은 형태로 일기가 나온다. (초안에 없어 새로 쓴 부분)
  diary: [
    "421950년 10월 1일.",
    "",
    "첫 출근.",
    "문 열었더니 불이 꺼져 있고 켜진 건 모니터 하나였다.",
    "자리 찾는 데 좀 걸렸다.",
    "",
    "Aistb라는 사내 AI가 말을 걸었다. 오늘 할 일까지 다 짜여 있었다.",
    "생각보다 친절했다.",
    "",
    "오는 길에 햄 광고판을 실컷 봤다. 돈스햄이 제일 컸는데",
    "맞은편 가게가 더 싸 보였다. 내일은 그쪽으로.",
    "",
    "한 거라곤 폴더 하나 파일 하나에 \"안녕하세요\" 한 줄.",
    "상위 1%라더니 바로 98%로 정정했다. 정정 안 했으면 몰랐잖아.",
    "아니 그럼 처음부터 98%라고 하든가.",
  ],
};
