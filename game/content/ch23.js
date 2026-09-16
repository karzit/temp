// 23장 — 어제 Aistb 가 0 번이라고 알려줬던 그 자리를 스스로 찾는다. 학습은 없다.
//
// 두 가지를 정직하게 보여준다.
//   찾기는 조용히 실패한다 — 겹치는 낱말이 하나도 없어 점수가 0.000 인데도 argmax 는 0 번을 돌려준다
//   줄여도 뜻은 안 묶인다 — 문서 서른여섯 개로는 크기가 모자란다
//
// 두 번째가 「LLM 은 스케일」 을 받는 자리다(앞으로.md 주제 19).
// 크기가 모자라서 안 되는 것을 직접 재 보는 것이 스케일을 가르치는 가장 정직한 방법이다.

var FIND_DOC = {
  path: "work/참고/찾기_요약.md",
  readOnly: true,
  content:
    "# 문서를 찾는 법\n" +
    "\n" +
    "접수 메모를 분류하던 날 문장을 숫자로 바꾸는 것을 하셨습니다. 그것을 그대로 씁니다.\n" +
    "다른 점은 학습이 없다는 것입니다. 숫자로 바꿔 놓고 가까운 것을 고르기만 합니다.\n" +
    "\n" +
    "## 문서를 숫자로\n" +
    "vec = TfidfVectorizer()\n" +
    "M = vec.fit_transform(문서들)     — (문서 수, 낱말 수)\n" +
    "\n" +
    "## 질문도 같은 자로 재기\n" +
    "qv = vec.transform([질문])\n" +
    "\n" +
    "fit 을 다시 부르면 안 됩니다. 문서를 재던 그 자로 질문도 재야 나란히 놓입니다.\n" +
    "질문에만 있고 문서에는 없는 낱말은 그냥 버려집니다.\n" +
    "\n" +
    "## 가까운 것 고르기\n" +
    "from sklearn.metrics.pairwise import cosine_similarity\n" +
    "sim = cosine_similarity(qv, M)[0]   — 문서마다 0 에서 1 사이 점수\n" +
    "\n" +
    "sim.argmax() — 제일 가까운 문서의 번호\n" +
    "sim.max()    — 그때의 점수\n" +
    "\n" +
    "방향만 봅니다. 문서가 길든 짧든 상관없이 재집니다.\n" +
    "\n" +
    "## 점수가 0 이면\n" +
    "겹치는 낱말이 하나도 없다는 뜻입니다.\n" +
    "그래도 argmax 는 번호를 하나 돌려줍니다. 앞에서부터 첫 번째, 0 번입니다.\n" +
    "\n" +
    "못 찾았다는 것을 argmax 는 말해주지 않습니다. 점수를 같이 봐야 압니다.\n" +
    "\n" +
    "## 줄이기\n" +
    "from sklearn.decomposition import TruncatedSVD\n" +
    "svd = TruncatedSVD(n_components=16, random_state=42)\n" +
    "E = svd.fit_transform(M)          — (문서 수, 16)\n" +
    "\n" +
    "낱말 수만큼 있던 칸을 열여섯 개로 줄입니다.\n" +
    "문서 하나가 숫자 열여섯 개가 됩니다. 이것을 그 문서의 임베딩이라고 부릅니다.\n" +
    "\n" +
    "질문도 같은 방식으로 줄여야 나란히 놓입니다.\n" +
    "svd.transform(qv)\n" +
    "\n" +
    "## 줄이면 뜻까지 묶이는가\n" +
    "그렇게 된다고들 합니다. 낱말이 안 겹쳐도 뜻이 가까우면 자리가 가까워진다는 것입니다.\n" +
    "그러려면 문서가 아주 많아야 합니다. 서른여섯 개로는 안 됩니다.\n" +
    "말로 믿지 마시고 직접 재 보십시오.\n",
};

var CH23 = {
  id: "ch23",
  title: "23 · 찾아내는 날",
  decay: 3.7,
  scenes: ["desk", "diary"],

  desk: {
    files: [
      { path: PANDAS_DOC.path, content: PANDAS_DOC.content, readOnly: true },
      { path: TEXT_DOC.path, content: TEXT_DOC.content, readOnly: true },
      { path: TOOL_DOC.path, content: TOOL_DOC.content, readOnly: true },
      { path: LM_TOOL.path, content: LM_TOOL.content, readOnly: true },
      { path: MANUAL_CSV.path, src: MANUAL_CSV.src, readOnly: true },
    ],

    idleLines: [
      "자료는 어제와 같은 work/자료/정비지침.csv 입니다.",
      "막히셨으면 저를 눌러 주세요.",
      "질문에는 transform 만 부르셔야 합니다. fit 은 문서에 한 번뿐입니다.",
    ],
    errorLines: [
      "코드가 도중에 멈췄습니다. 아래 빨간 글씨의 마지막 줄부터 읽어보세요.",
      "실행이 끝까지 가지 못했습니다. transform 은 목록을 받습니다. 질문 하나여도 대괄호로 감싸 주세요.",
      "에러입니다. 줄인 표와 안 줄인 표를 섞어 재지 않으셨는지 보시죠.",
    ],

    beats: [
      // ── 아침 ────────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "좋은 아침입니다, 토이비님." },
          { who: "Aistb", text: "어제는 제가 0 번이라고 알려드렸습니다. 오늘은 직접 찾으십니다." },
          { who: "Aistb", text: "학습은 없습니다. 재고 고르기만 합니다." },
        ],
      },

      // ── 의뢰 도착 ───────────────────────────────────
      {
        lines: [{ who: "Aistb", text: "의뢰서입니다." }],
        addFiles: [
          {
            path: "work/의뢰_0028.md",
            readOnly: true,
            kind: "brief",
            content:
              "# 의뢰 0028 — 질문에 맞는 문단 찾기\n" +
              "\n" +
              "고객: 한울운수 통합관제센터 문서관리 / 미 R. 홀란트\n" +
              "담당: 깁스 W 토이비\n" +
              "접수: 바로벤토 의뢰접수\n" +
              "\n" +
              "## 고객 원문\n" +
              "> 교육반에서 넘겨받았습니다. 모델이 지침을 모른다는 건 알겠고,\n" +
              "> 그러면 물어볼 때마다 맞는 문단을 찾아 붙여줘야 한다고 들었습니다.\n" +
              "> 찾는 쪽부터 되는지 봐 주세요. 정비원들이 실제로 자주 묻는 다섯 가지를 뽑았습니다.\n" +
              ">\n" +
              ">   0  냉각팬은 얼마마다 갈아야 합니까?\n" +
              ">   1  로그는 며칠이나 보관합니까?\n" +
              ">   2  배터리는 언제 교체합니까?\n" +
              ">   3  개선안은 적용 전에 무엇을 합니까?\n" +
              ">   4  부팅이 계속 안 되면 어떻게 합니까?\n" +
              ">\n" +
              "> 저희가 손으로 찾아본 답은 차례로 0 번 · 9 번 · 12 번 · 6 번 · 21 번 문단입니다.\n" +
              ">\n" +
              "> 다섯 개 다 맞을 거라고는 생각하지 않습니다. 몇 개가 맞는지를 알고 싶은 겁니다.\n" +
              "> 안 맞는 게 있으면 그게 어떤 종류로 안 맞는지도요.\n" +
              "\n" +
              "## 자료\n" +
              "work/자료/정비지침.csv — 의뢰 0027 과 같은 파일. 36 문단.\n" +
              "\n" +
              "## 할 일\n" +
              "work/task_28/찾기.py 를 만들고 아래 셋을 채워 주세요.\n" +
              "\n" +
              "- found       : 다섯 질문이 각각 찾아낸 문단 번호 (다섯 개)\n" +
              "- scores      : 그때의 점수 (다섯 개)\n" +
              "- small_shape : 문서를 16 칸으로 줄인 표의 크기 (행, 열)\n" +
              "\n" +
              "## 조건\n" +
              "- 낱말을 세는 것은 기본 설정 그대로.\n" +
              "- 줄일 때 칸은 16 개, random_state 는 42.\n" +
              "- 틀린 것은 번호만이 아니라 점수도 같이 회신합니다. 고객이 '어떤 종류로' 를 물었습니다.\n",
          },
        ],
        spot: '.tree-row[data-path="work/의뢰_0028.md"]',
        menu: ["brief"],
        nudge: [
          "저를 눌러 '의뢰 확인'을 고르시면 의뢰서가 열립니다.",
          "업무 메뉴 첫 번째 항목이 의뢰 확인입니다.",
          "어제는 제가 맞는 문단을 알려 드렸습니다. 오늘은 직접 찾으십니다. 언젠가는 저 없이 하셔야 합니다.",
          "확인하지 않은 의뢰도 마감 기한은 동일하게 적용됩니다.",
          "worklog_GipsWToyb_0127: 폐기 요망",
        ],
        wait: function () {
          return IDE.panes.some(function (p) {
            return p.tabs.indexOf("work/의뢰_0028.md") >= 0;
          });
        },
      },

      // ── 예제 ────────────────────────────────────────
      {
        addFiles: [
          { path: FIND_DOC.path, readOnly: true, open: 1, content: FIND_DOC.content },
          {
            path: "work/예제/23_찾기.py",
            open: 0,
            content:
              "import pandas as pd\n" +
              "import numpy as np\n" +
              "from sklearn.feature_extraction.text import TfidfVectorizer\n" +
              "from sklearn.decomposition import TruncatedSVD\n" +
              "from sklearn.metrics.pairwise import cosine_similarity\n" +
              "\n" +
              'df = pd.read_csv("work/자료/정비지침.csv")\n' +
              'docs = df["text"]\n' +
              "\n" +
              "vec = TfidfVectorizer()\n" +
              "M = vec.fit_transform(docs)\n" +
              "print(M.shape)\n" +
              "print(round(M.nnz / (M.shape[0] * M.shape[1]), 3))\n" +
              "\n" +
              'q = "냉각팬은 얼마마다 갈아야 합니까?"\n' +
              "qv = vec.transform([q])\n" +
              "print(qv.nnz)\n" +
              "sim = cosine_similarity(qv, M)[0]\n" +
              "print(int(sim.argmax()), round(sim.max(), 3))\n" +
              "print(docs[int(sim.argmax())])\n" +
              "\n" +
              "svd = TruncatedSVD(n_components=16, random_state=42)\n" +
              "E = svd.fit_transform(M)\n" +
              "print(E.shape)\n" +
              "print(E[0].round(3))\n" +
              "print(int(cosine_similarity(svd.transform(qv), E)[0].argmax()))\n" +
              "\n" +
              'QUESTIONS = ["냉각팬은 얼마마다 갈아야 합니까?",\n' +
              '             "로그는 며칠이나 보관합니까?",\n' +
              '             "배터리는 언제 교체합니까?",\n' +
              '             "개선안은 적용 전에 무엇을 합니까?",\n' +
              '             "부팅이 계속 안 되면 어떻게 합니까?"]\n' +
              "for one in QUESTIONS:\n" +
              "    s = cosine_similarity(vec.transform([one]), M)[0]\n" +
              "    print(int(s.argmax()), round(s.max(), 3), docs[int(s.argmax())][:22])\n" +
              "\n" +
              "S1 = cosine_similarity(M)\n" +
              "S2 = cosine_similarity(E)\n" +
              "far = S2.copy()\n" +
              "far[S1 > 1e-9] = -1        # 낱말이 겹치는 쌍은 빼고 본다\n" +
              "np.fill_diagonal(far, -1)\n" +
              "i, j = np.unravel_index(far.argmax(), far.shape)\n" +
              "print(round(far[i, j], 3))\n" +
              "print(docs[i])\n" +
              "print(docs[j])\n",
          },
        ],
        lines: [
          { who: "Aistb", text: "이번엔 질문에 맞는 지침을 찾아냅니다. 낱말이 겹치는 문서부터 골라 보겠습니다." },
          { who: "Aistb", text: "열한 번 눌러 주세요." },
        ],
        spot: ".step",
        nudge: [
          { text: "아래의 ↓ 한 문장 버튼입니다.", spot: ".step" },
          { text: "↓ 한 문장 버튼을 열한 번 누르시면 질문으로 문단을 찾는 것까지 나옵니다.", spot: ".step" },
          "argmax 는 못 찾았다는 것을 말해 주지 않습니다. 0.326 도 0.0 도 똑같이 번호 하나입니다. 점수를 같이 보십시오.",
          "찾기가 실패해도 무언가는 나옵니다. 나온다고 맞는 것은 아닙니다. 저 역시 그렇습니다.",
          "worklog_GipsWToyb_0128: 폐기 요망",
        ],
        wait: steppedTo("work/예제/23_찾기.py", 11),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "36 × 250. 문서 서른여섯, 낱말 이백오십입니다.",
            spot: { text: "M = vec.fit_transform(문서들)", in: ".doc" },
          },
          { who: "Aistb", text: "채워진 칸이 3% 남짓입니다. 거의 비어 있습니다." },
          { who: "Aistb", text: "여섯 번 더 눌러 질문을 넣어 보시죠." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/23_찾기.py", 17),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "질문에서 살아남은 낱말이 '냉각팬' 하나뿐입니다. 나머지는 문서에 없어 버려졌습니다.",
            spot: { text: "질문에만 있고 문서에는 없는 낱말은", in: ".doc" },
          },
          { who: "Aistb", text: "그 하나로 0 번 문단을 0.326 에 찾았습니다." },
          { who: "Aistb", text: "이제 줄여 봅니다. 다섯 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/23_찾기.py", 22),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "36 × 16. 문단 하나가 숫자 열여섯 개가 되었습니다.",
            spot: { text: "E = svd.fit_transform(M)", in: ".doc" },
          },
          { who: "Aistb", text: "이 숫자 묶음을 임베딩이라고 부릅니다. 문서가 놓인 자리입니다." },
          { who: "Aistb", text: "그 자리로 다시 찾아도 0 번입니다." },
          { who: "Aistb", text: "나머지 넷도 해봅니다. 두 번 더 눌러 주세요." },
        ],
        spot: ".step",
        wait: steppedTo("work/예제/23_찾기.py", 24),
      },
      {
        lines: [
          { who: "Aistb", text: "넷은 맞았습니다. 마지막 줄을 보십시오." },
          { who: "Aistb", text: "부팅 질문이 냉각팬 문단을 가져왔습니다. 점수 0.0." },
          {
            who: "Aistb",
            text: "겹치는 낱말이 없었습니다. '부팅이' 는 '부팅에' 와 다른 낱말입니다.",
          },
          {
            who: "Aistb",
            text: "그런데 argmax 는 번호를 하나 돌려줍니다. 못 찾았다는 것을 말해주지 않습니다.",
            spot: { text: "못 찾았다는 것을 argmax 는 말해주지 않습니다", in: ".doc" },
          },
          { who: "Aistb", text: "0.326 도 0.0 도 똑같이 번호 하나입니다. 점수를 같이 봐야 구별됩니다." },
          { who: "Aistb", text: "하나 더 재 보시죠. ▶ 실행입니다." },
        ],
        spot: ".run",
        wait: steppedTo("work/예제/23_찾기.py", 33),
      },
      {
        lines: [
          {
            who: "Aistb",
            text: "줄이면 뜻이 묶인다는 말이 있습니다. 낱말이 안 겹쳐도 뜻이 가까우면 자리가 가까워진다고.",
            spot: { text: "줄이면 뜻까지 묶이는가", in: ".doc" },
          },
          {
            who: "Aistb",
            text: "낱말이 안 겹치는 쌍 중 제일 가까워진 둘입니다.",
          },
          { who: "Aistb", text: "'세 번 연속 부팅에 실패하면 접수한다' 와 '예비 부품은 두 벌을 둔다' 입니다. 0.392 입니다." },
          { who: "Aistb", text: "아무 상관이 없습니다. 잡음입니다." },
          {
            who: "Aistb",
            text: "그 말이 틀린 것은 아닙니다. 다만 문서가 아주 많아야 합니다. 서른여섯 개로는 안 됩니다.",
          },
          {
            who: "Aistb",
            text: "바깥의 큰 것들은 다른 재주가 아니라 같은 것을 훨씬 많이 본 것입니다.",
            tone: "bad",
          },
        ],
      },

      // ── 의뢰 처리 ───────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "scores 에는 마지막 0.0 도 그대로 담아 주십시오." },
          { who: "Aistb", text: "고객이 어떤 종류로 안 맞는지도 물었습니다. 그 0.0 이 답입니다." },
        ],
        menu: ["brief", "report"],
        nudge: [
          "질문마다 argmax 와 max 를 같이 모으세요. 줄인 표의 크기는 E.shape 입니다.",
          "found, scores, small_shape — 세 이름을 의뢰서 그대로 써 주세요.",
          "문서에 fit 한 vec 으로 질문도 transform 하십시오. 기준이 어긋나면 자리가 맞지 않습니다.",
          "마지막 0.0 도 scores 에 그대로 담으십시오. 이번 의뢰에서 제일 중요한 값입니다.",
          "worklog_GipsWToyb_0129: 폐기 요망",
        ],
        report: function () {
          return checkFile(
            "work/task_28/찾기.py",
            "for _n in ['found', 'scores', 'small_shape']:\n" +
              "    assert _n in dir(), f'{_n} 가 없습니다. 의뢰서에 적힌 이름 그대로 써 주세요.'\n" +
              "    assert not isinstance(eval(_n), type(Ellipsis)), f'{_n} 가 아직 ... 그대로입니다.'\n" +
              "_f = [int(v) for v in found]\n" +
              "assert len(_f) == 5, f'found 에 {len(_f)} 개가 들어 있습니다. 질문이 다섯이니 다섯 개입니다.'\n" +
              "assert _f == [0, 9, 12, 6, 0], f'found 가 {_f} 입니다. [0, 9, 12, 6, 0] 이 나와야 합니다. 문서에 fit 한 vec 으로 질문도 transform 하셨는지 보세요.'\n" +
              "_s = [float(v) for v in scores]\n" +
              "assert len(_s) == 5, f'scores 에 {len(_s)} 개가 들어 있습니다. 다섯 개입니다.'\n" +
              "assert abs(_s[0] - 0.326) < 0.01, f'첫 점수가 {_s[0]:.3f} 입니다. 0.326 이 나와야 합니다. argmax 자리의 점수, 즉 max 를 담으셨는지 보세요.'\n" +
              "assert _s[4] < 0.001, f'마지막 점수가 {_s[4]:.3f} 입니다. 0.0 이 나와야 합니다 — 겹치는 낱말이 하나도 없는 질문입니다. 이 0 이 이번 의뢰에서 제일 중요한 값입니다.'\n" +
              "_sh = tuple(int(v) for v in small_shape)\n" +
              "assert _sh == (36, 16), f'small_shape 가 {_sh} 입니다. (36, 16) 이 나와야 합니다. 칸 16 개로 줄이신 표의 크기입니다.'\n"
          );
        },
        wait: function (ctx) {
          return ctx.reported;
        },
      },

      // ── 마무리 ──────────────────────────────────────
      {
        lines: [
          { who: "Aistb", text: "접수했습니다. 다섯 중 넷이라고 회신하겠습니다." },
          { who: "Aistb", text: "내일은 찾은 걸 모델에 물립니다." },
          {
            who: "Aistb",
            text: "오늘 나온 0.0 을 기억해 두십시오. 찾기가 실패해도 무언가는 나옵니다.",
          },
        ],
      },
      {
        lines: [{ who: "Aistb", text: "수고하셨습니다. 이것으로 금일 업무가 종료되었습니다. 내일 뵙겠습니다." }],
        menu: ["end"],
        nudge: [
          "업무 종료를 누르시면 오늘 일과가 끝납니다.",
          "저를 눌러 업무 메뉴에서 업무 종료를 선택하시면 됩니다.",
          "다섯 중 넷을 찾으셨습니다. 못 찾은 하나의 점수가 0.0 이었던 것이, 오늘의 성과입니다.",
          "바깥의 큰 것들은 다른 재주가 아니라 같은 것을 훨씬 많이 본 것뿐입니다. 그 점은 기억해 두십시오.",
          "worklog_GipsWToyb_0130: 폐기 요망",
        ],
        wait: function () {
          return false;
        },
      },
    ],
  },

  diary: [
    "421950년 10월 30일.",
    "",
    "어제 얘가 0번이라고 알려줬던 자리를 오늘은 내가 찾았다.",
    "질문에서 살아남은 낱말이 '냉각팬' 하나였는데 그 하나로 맞는 문단이 나왔다. 점수는 0.33.",
    "",
    "250칸을 16칸으로 줄여도 같은 문단이 나왔다.",
    "문단 하나가 숫자 열여섯 개가 된다는 게 아직 이상하다. 임베딩이라고 부른다는데 이름만 알았다.",
    "",
    "다섯 개 중에 넷 맞았다. 틀린 하나가 마음에 걸린다.",
    "부팅 질문에 냉각팬 문단을 가져왔는데 점수가 0.0이었다.",
    "겹치는 낱말이 하나도 없는데 그냥 0번을 준 거다. 0.33이랑 0.0이 똑같이 번호 하나로 나온다.",
    "",
    "줄이면 뜻이 묶인다는 얘기가 있길래 재봤다.",
    "낱말이 안 겹치는데 제일 가까워진 두 문단이 부팅 세 번 실패랑 예비 부품 두 벌이었다. 아무 상관이 없다.",
    "얘는 그 말이 틀린 게 아니라 문서가 아주 많아야 되는 거라고 했다. 36개로는 안 된다고.",
    "",
    "내일은 찾은 걸 물려본다. 0.0짜리를 물리면 어떻게 되는지 내일 본다는데, 좀 걱정된다.",
  ],
};
