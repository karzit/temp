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
          { who: "???", text: "저는 바로벤토에서 직원 지원을 위해 개발된 AI, Aistb 입니다." },
          { who: "Aistb", text: "앞으로 토이비님이 바로벤토에 적응하실 수 있도록 도와드리겠습니다." },
          { who: "Aistb", text: "우선 업무 진행을 위한 인터페이스 사용법을 설명드리겠습니다." },
        ],
      },

      // ── 의뢰 확인 ──
      {
        lines: [
          { who: "Aistb", text: "먼저 금일 할당된 의뢰를 확인하시겠습니다." },
          { who: "Aistb", text: "저를 누르시면 업무 메뉴를 확인하실 수 있으며, 그 중 첫 번째 '의뢰 확인' 버튼을 통해 할당된 의뢰에 대한 개요를 확인하실 수 있습니다." },
          { who: "Aistb", text: "할당된 의뢰를 확인해봅시다." },
        ],
        menu: ["brief"],
        nudge: [
          "저를 눌러 업무 메뉴를 확인하실 수 있습니다.",
          "여기입니다!",
          "이쪽을 보세요",
          "바로벤토에서는 업무 능률 향상 및 직원 복지를 위해 휴식에 별도 제약을 두지는 않지만, 그것이 업무 태만을 용납한다는 것은 아닙니다.",
          "worklog_GipsWToyb_0000: 폐기 요망",
        ],
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0001.md") >= 0;
          });
        },
      },
      {
        lines: [
          { who: "Aistb", text: "금일은 바로벤토 교육팀에서 전달된 '신입 교육: 작업 단말 사용법'에 따라 작업 단말 사용법을 익히실 예정입니다." },
          { who: "Aistb", text: "의뢰에 대한 상세한 정보는" },
          { who: "Aistb", text: "의뢰서에서 확인하실 수 있습니다.", spot: '.tree-row[data-path="work/의뢰_0001.md"]' },
          { who: "Aistb", text: "다음으로 작업물을 생성하고 관리하는 방법에 대해 알아보겠습니다." },
        ],
      },

      // ── 파일과 폴더 ──
      {
        lines: [
          { who: "Aistb", text: "먼저 폴더와 파일의 생성 방법입니다." },
          { who: "Aistb", text: "폴더와 파일은 생성하고자 하는 폴더를 선택 후 ＋파일, ＋폴더 버튼을 통해 생성하실 수 있습니다." },
        ],
      },
      {
        lines: [{ who: "Aistb", text: "먼저 work 폴더를 선택해주세요.", spot: '.tree-row[data-path="work"]' }],
        nudge: [
          { text: "왼쪽 탐색기의 work 를 눌러 주세요.", spot: '.tree-row[data-path="work"]' },
          { text: "먼저 폴더를 생성할 상위 폴더를 선택해주세요.", spot: '.tree-row[data-path="work"]' },
          "바로벤토에서는 불어오는 바람, 그 너머로 함께 나아갈 인재를 찾고 있습니다.",
          "TMI: 업무 수준을 미달한 일부 직원의 프로필은 현재 '퇴사자 자료' 폴더로 이동되었습니다.",
          "worklog_GipsWToyb_0001: 폐기 요망",
        ],
        wait: function () {
          return IDE.selectedDir === "work";
        },
      },
      {
        lines: [{ who: "Aistb", text: "그 상태에서 '＋폴더' 버튼을 클릭하여 폴더를 생성하실 수 있습니다.", spot: "[data-new='dir']" }],
        nudge: [
          { text: "＋폴더 버튼을 눌러 폴더를 생성하실 수 있습니다.", spot: "[data-new='dir']" },
          { text: "'＋폴더' 버튼을 눌러 폴더를 생성하실 수 있습니다.", spot: "[data-new='dir']" },
          { text: "폴더를 생성하는 가장 쉬운 방법: ＋폴더", spot: "[data-new='dir']" },
          "지능 기대 수준을 13세에서 7세로 변경합니다.",
          { text: "여기 ＋폴더 버튼이 있지이~? 이걸 꾹~ 눌러주면요오~! 짜잔~! 새로운 폴더가 뿅~ 하고 만들어진답니다아~! ✨", spot: "[data-new='dir']" },
          "worklog_GipsWToyb_0002: 폐기 요망",
        ],
        wait: function () {
          return (IDE.newform && IDE.newform.kind === "dir") || FS.exists("work/first_task");
        },
      },
      {
        lines: [{ who: "Aistb", text: "여기에서 폴더와 파일의 이름을 지정하실 수 있습니다. 이번에는 '신입 교육: 작업 단말 사용법'에 따라 first_task 로 지정하겠습니다.", spot: ".newform input" }],
        nudge: [
          { text: "이름 칸에 first_task 를 적고 만들기를 누르세요.", spot: ".newform input" },
          { text: "폴더 이름을 first_task 로 지정하여 생성해주세요.", spot: ".newform input" },
          "폴더 이름을 first_task 로 생성하여주시옵서서.",
          "현재 하위 3%에 해당하는 재능을 가지고 있습니다.",
          "worklog_GipsWToyb_0003: 폐기 요망",
        ],
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
        lines: [{ who: "Aistb", text: "좋습니다. 이번에는 직접 first_task 폴더에 hello.py 파일을 생성해주세요.", spot: "[data-new='file']" }],
        nudge: [
          { text: "first_task 를 고른 뒤 ＋파일을 누르고, 이름을 hello.py 로 적으세요.", spot: "[data-new='file']" },
          { text: "first_task 폴더를 선택하고, ＋파일을 눌러 hello.py 를 생성해주세요.", spot: "[data-new='file']" },
          { text: "first_task: first_task를 선택, second_task: ＋파일 버튼을 클릭, third_task: hello.py 입력, fourth_task: 파일 생성", spot: "[data-new='file']" },
          "제가 말씀드리는 모든 이야기는 전력을 사용해 생성되었습니다. 즉, 산소뿐만 아니라 전기까지 낭비하고 계십니다.",
          "worklog_GipsWToyb_0004: 폐기 요망",
        ],
        wait: function () {
          return FS.isFile("work/first_task/hello.py");
        },
      },

      // ── 코드 실행 ──
      {
        lines: [
          { who: "Aistb", text: "마지막으로 코드를 실행하는 방법에 대해 알아보겠습니다." },
          { who: "Aistb", text: 'hello.py 에 print("안녕하세요") 를 입력한 후 \'▶ 실행\' 버튼을 눌러 실행할 수 있습니다. 처음에는 작업 구성을 위해 약간의 시간이 소요될 수 있습니다.', spot: ".run" },
        ],
        nudge: [
          { text: "왼쪽 편집창에서 hello.py를 선택 후 코드를 적고 아래의 ▶ 실행을 누르세요.", spot: "[data-path='work/first_task/hello.py']" },
          { text: "왼쪽 편집창에서 hello.py를 선택 후 코드를 적고 아래의 ▶ 실행을 누르세요.", spot: "[data-path='work/first_task/hello.py']" },
          { text: "왼쪽 편집창에서 hello.py를 선택 후 코드를 적고 아래의 ▶ 실행을 누르세요.", spot: "[data-path='work/first_task/hello.py']" },
          "일부 직원의 작업 능률 향상을 위해 Python 모듈을 Colt Python으로 교체 요망: 기각되었습니다.",
          "worklog_GipsWToyb_0005: 폐기 요망",
        ],
        wait: function () {
          var r = IDE.lastRun;
          return !!r && r.ok && r.path === "work/first_task/hello.py" && !!r.output;
        },
      },
      {
        lines: [
          { who: "Aistb", text: "완벽합니다. 해당 교육 수강자 중 상위 1%에 해당하는 성취도입니다." },
          { who: "Aistb", text: "**정정** 상위 98%입니다." },
        ],
      },

      // ── 완료 보고 ──
      {
        lines: [
          { who: "Aistb", text: "업무를 완료하신 후 업무 메뉴에서 완료 보고를 통해 업무를 종료하실 수 있습니다." },
        ],
        menu: ["report"],
        nudge: [
          "저를 누르시면 완료 보고가 있습니다.",
          "저를 클릭해 업무 메뉴를 확인하실 수 있습니다.",
          "여기에 퇴근이 있습니다.",
          "보고하지 않은 업무는 완료되지 않습니다.",
          "worklog_GipsWToyb_0006: 폐기 요망",
        ],
        wait: function (ctx) {
          return ctx.reported;
        },
      },
      { lines: [{ who: "Aistb", text: "접수했습니다." }] },
      {
        lines: [
          { who: "Aistb", text: "수고하셨습니다. 이것으로 금일 업무가 종료되었습니다. 내일 뵙겠습니다." },
          { who: "Aistb", text: "업무 메뉴에서 업무 종료를 선택해 PC를 종료하시고 퇴근하시면 됩니다." },
        ],
        menu: ["end"],
        nudge: [
          "업무 종료를 누르시면 오늘 일과가 끝납니다.",
          "출근 첫날의 조기 퇴근은 환경 변화에 대한 배려로, 바로벤토는 직원과 함께 불어오는 바람, 그 너머로 나아갑니다.",
          "회사를 위해 봉사하고자 하는 마음은 훌륭하지만, 더 이상 할당된 업무가 없습니다.",
          "분명 바로벤토에서는 초과 근무에 대한 추가 수당을 지급하지만, 전기를 낭비하는 것에 대한 수당은 지급하지 않습니다.",
          "worklog_GipsWToyb_0007: 실제 근무 내역 없음, 초과 근무수당을 지급하지 말것",
        ],
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
    "오늘은 입사 후 첫 출근 날이었다.",
    "출근해 보니 방에 모니터만 하나 켜져 있었다.",
    "모니터에 다가가 보니 사내 AI가 말을 걸었다. 캠이라도 있었나?",
    "Aistb라고 하는데 흔히 쓰는 AI와 다르게 농담을 안 받아준다. 그 정도는 직원의 정신 건강을 위해 받아 주라고, 잡담할 사람도 없잖아.",
    "",
    "뭐 첫날이라 OT 같은 걸 했는데 끝나고 상위 1%라더니 바로 98%로 정정했다.",
    "그럼 처음부터 98%라고 하라고. 정정 안 했으면 그냥 기분 좋았을 건데 말이지.",
    "",
    "뭐 AI와는 별개로 첫날 조기 퇴근 덕분에 이사한 동네를 조금 둘러볼 시간이 있었다.",
    "소시지 가게는 돈스랑 맠크도르, 밐모크, 포킈 뭐 선택지가 많은 건 좋은데 말이지, 왜 정작 모나크가 없는거냐.",
    "나는 모나크가 좋다고.",
  ],
};
