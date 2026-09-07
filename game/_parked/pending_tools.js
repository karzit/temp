// 보류 중인 실습 묶음 — 어느 챕터에 들어갈지 정해지지 않았다.
//
// 원래 0장에 있었지만, 0장이 게임 조작 튜토리얼로 바뀌면서 갈 곳을 잃었다.
// 1장(데이터 탐색)이 확정되면 필요한 비트만 그 챕터로 옮기면 된다.
// index.html에서 읽지 않으므로 지금은 게임에 나오지 않는다.
//
// 내용: 리스트 vs 배열 → 브로드캐스팅 → 슬라이싱 → shape → 행렬곱 → Pandas → 기울기 손계산
var PENDING_TOOL_BEATS = [
    // ── 도구 1. 배열 ─────────────────────────────────────
    {
      who: "Aistb",
      say: "파이썬에서 숫자 여러 개를 담을 때 리스트를 쓰시죠. [1, 2, 3] 같은 것 말입니다. 여기에 2를 곱하면 무엇이 나올까요?",
    },
    {
      choice: {
        question: "[1, 2, 3] * 2 를 실행하면 무엇이 나올까요?",
        options: [
          {
            text: "[1, 2, 3, 1, 2, 3]",
            ok: true,
            why: "맞습니다. 리스트에 곱하기는 \"두 번 이어 붙이기\"라는 뜻입니다. 안에 든 숫자를 계산한 게 아닙니다.",
          },
          {
            text: "[2, 4, 6]",
            ok: false,
            why: "그러면 편하겠지만 아닙니다. 리스트에 곱하기는 \"두 번 이어 붙이기\"라서 [1, 2, 3, 1, 2, 3]이 됩니다.",
          },
          {
            text: "에러가 난다",
            ok: false,
            why: "에러는 안 납니다. 다만 우리가 기대한 계산이 아니라 길이만 두 배가 된 [1, 2, 3, 1, 2, 3]이 나옵니다.",
          },
        ],
      },
    },
    {
      who: "Aistb",
      say: "우리에게 필요한 건 [2, 4, 6] 쪽입니다. 숫자를 숫자로 다뤄주는 물건이 따로 있어야 합니다. 그게 첫 번째 도구, NumPy입니다.",
    },
    {
      code: {
        brief: "리스트를 NumPy 배열로 바꾸면 곱하기가 진짜 곱하기가 됩니다. np.array( ) 안에 리스트를 넣어보세요.",
        packages: ["numpy"],
        hint: "arr = np.array(nums) 라고 쓰면 됩니다. 리스트를 괄호 안에 그대로 넣는 것뿐입니다.",
        starter: `import numpy as np

nums = [1, 2, 3]

arr = ...   # nums를 NumPy 배열로 바꾸세요

print(arr * 2)
`,
        check: `import numpy as np
assert isinstance(arr, np.ndarray), "arr이 아직 리스트입니다. np.array(nums) 처럼 감싸주세요."
assert np.allclose(arr * 2, [2, 4, 6]), f"arr * 2 가 {arr * 2}입니다. [2 4 6]이 나와야 합니다."
`,
      },
    },
    {
      who: "Aistb",
      say: "보셨죠. 배열에 곱하기는 \"안에 든 값 전부에 곱하기\"입니다. 값이 세 개든 백만 개든 식은 한 줄입니다.",
    },
    {
      code: {
        brief: "x에 든 값 하나하나에 W를 곱하고 b를 더하세요. for문은 쓰지 말고 한 줄로.",
        packages: ["numpy"],
        hint: "방금 arr * 2 를 쓴 것과 똑같습니다. W * x + b 라고 그대로 쓰면 됩니다.",
        starter: `import numpy as np

x = np.array([1.0, 2.0, 3.0, 4.0])
W, b = 2.0, 3.0

y_pred = ...   # 여기를 채우세요

print(y_pred)
`,
        check: `import numpy as np
assert "for" not in __source__, "for문 없이 풀어보세요. 배열 전체를 한 번에 계산하는 것이 이 문제의 요점입니다."
assert isinstance(y_pred, np.ndarray), "y_pred가 배열이 아닙니다. x를 그대로 계산에 쓰면 배열이 나옵니다."
want = np.array([5.0, 7.0, 9.0, 11.0])
assert np.allclose(y_pred, want), f"y_pred가 {y_pred}입니다. 정답은 {want}입니다."
`,
      },
    },
    {
      who: "Aistb",
      say: "숫자 하나가 배열 전체로 퍼져서 계산됐습니다. 이걸 브로드캐스팅이라고 부릅니다. 이름은 그런가 보다 하고 넘기셔도 됩니다.",
    },
    {
      who: "Aistb",
      say: "배열은 한 줄로만 있는 게 아닙니다. 공책처럼 여러 줄을 쌓아 표로 만들 수도 있습니다. 그럼 표에서 원하는 칸만 꺼내는 법을 아셔야겠죠.",
    },
    {
      widget: "gridindex",
      brief:
        "0부터 11까지 열두 개 숫자를 3줄 4칸짜리 표로 늘어놓았습니다. 이 표의 이름은 m입니다. 아래 표기가 표에서 어디를 꺼내는지 눌러서 표시하세요. 네 문제 연속입니다.",
      config: {
        rows: 3,
        cols: 4,
        questions: [
          { expr: "m[0]", cells: [0, 1, 2, 3], why: "m[0]은 0번째 줄 전체입니다. 칸 하나가 아닙니다." },
          {
            expr: "m[:, 0]",
            cells: [0, 4, 8],
            why: "쉼표 앞은 줄, 뒤는 칸입니다. 앞의 : 는 \"모든 줄\", 뒤의 0은 \"0번째 칸\". 그래서 첫 칸이 세로로 전부 골라집니다.",
          },
          { expr: "m[1, 2]", cells: [6], why: "1번째 줄의 2번째 칸, 하나뿐입니다. 줄 번호를 먼저 씁니다." },
          {
            expr: "m[:2, 1:3]",
            cells: [1, 2, 5, 6],
            why: "0~1번째 줄과 1~2번째 칸이 겹치는 네모입니다. 1:3 은 1과 2까지이고 3은 포함하지 않습니다.",
          },
        ],
      },
    },
    { who: "Aistb", say: "쉼표 앞이 줄, 뒤가 칸. 이것 하나만 붙잡고 계시면 됩니다." },
    {
      who: "Aistb",
      say: "그런데 표를 받으면 제일 먼저 물어봐야 하는 게 따로 있습니다. 몇 줄 몇 칸이냐는 것입니다. 파이썬은 그걸 shape라는 이름으로 알려줍니다.",
    },
    {
      choice: {
        question: "np.array([[1, 2, 3], [4, 5, 6]]) 의 shape는 무엇일까요?",
        options: [
          { text: "(2, 3)", ok: true, why: "줄이 2개, 한 줄에 칸이 3개. 줄 수가 먼저 옵니다." },
          {
            text: "(3, 2)",
            ok: false,
            why: "순서가 뒤집혔습니다. 바깥부터 셉니다 — 먼저 줄이 몇 개인지(2), 그 다음 한 줄에 몇 칸인지(3).",
          },
          {
            text: "(6,)",
            ok: false,
            why: "숫자가 6개인 건 맞지만 shape는 개수가 아니라 생김새입니다. 줄과 칸을 따로 알려줍니다.",
          },
        ],
      },
    },
    {
      who: "Aistb",
      say: "앞으로 보실 에러의 절반은 여기서 납니다. 표끼리 계산할 때 줄과 칸 수가 안 맞으면 시작도 못 하거든요.",
    },
    {
      who: "Aistb",
      say: "표 두 개를 곱하는 규칙을 하나만 알려드리겠습니다. 앞 표의 칸 수와 뒤 표의 줄 수가 같아야 곱할 수 있습니다. 그리고 결과는 앞 표의 줄 수, 뒤 표의 칸 수가 됩니다.",
    },
    {
      choice: {
        question: "shape가 (3, 2)인 X와 (2, 1)인 W를 곱하면 결과의 shape는 무엇일까요?",
        options: [
          { text: "(3, 1)", ok: true, why: "가운데 2와 2가 맞아떨어져 사라지고, 바깥의 3과 1만 남습니다." },
          {
            text: "(2, 2)",
            ok: false,
            why: "남는 건 가운데 숫자가 아니라 바깥 숫자입니다. (3, 2)와 (2, 1)에서 바깥은 3과 1입니다.",
          },
          {
            text: "곱할 수 없다",
            ok: false,
            why: "곱할 수 있습니다. 앞 표의 칸 수(2)와 뒤 표의 줄 수(2)가 같으니까요. 이게 안 맞을 때 나는 에러를 앞으로 자주 보게 됩니다.",
          },
        ],
      },
    },
    {
      code: {
        brief:
          "배달 세 건이 있고, 건마다 숫자가 두 개씩 적혀 있습니다(X). 그 두 숫자에 각각 곱할 값이 W에 들어 있습니다. 세 건을 한꺼번에 계산해서 H를 만드세요.",
        packages: ["numpy"],
        hint: "표끼리 곱할 때는 * 가 아니라 @ 를 씁니다. X @ W + b 라고 쓰세요. 순서를 바꾸면 줄과 칸이 안 맞아 에러가 납니다.",
        starter: `import numpy as np

X = np.array([[1., 2.], [3., 4.], [5., 6.]])   # 3줄 2칸
W = np.array([[0.5], [1.5]])                   # 2줄 1칸
b = 1.0

H = ...   # X와 W를 곱하고 b를 더하세요

print(H)
print("shape:", H.shape)
`,
        check: `import numpy as np
assert isinstance(H, np.ndarray), "H가 배열이 아닙니다."
assert H.shape == (3, 1), f"H의 shape가 {H.shape}입니다. (3, 1)이 나와야 합니다. 곱하는 순서를 확인하세요."
want = np.array([[4.5], [8.5], [12.5]])
assert np.allclose(H, want), "shape는 맞지만 값이 다릅니다. b를 더했는지 확인하세요."
`,
      },
    },
    {
      who: "Aistb",
      say: "이 한 줄이 앞으로 계속 나옵니다. 뒤에서 무엇을 배우시든 속을 열어보면 결국 이 모양입니다.",
    },

    // ── 도구 2. 표 ───────────────────────────────────────
    { narration: "Aistb가 화면에 표를 하나 띄웁니다 — 이름, 점수, 팀." },
    {
      who: "Aistb",
      say: "방금 그 배열은 숫자만 담습니다. 두 번째 도구인 Pandas는 이름 같은 글자도 같이 담고, 칸마다 이름을 붙여 부를 수 있습니다.",
    },
    {
      who: "Aistb",
      say: "이런 표에서 가장 많이 하는 일은 둘입니다. 조건에 맞는 줄만 골라내기, 그리고 무리별로 묶어서 평균 내기.",
    },
    {
      code: {
        brief: "70점 이상인 사람만 남긴 다음, 팀별로 평균 점수를 구하세요.",
        packages: ["pandas"],
        hint:
          "조건으로 고르는 건 df[df[\"score\"] >= 70] 입니다. 팀별로 묶어 평균을 내는 건 .groupby(\"team\")[\"score\"].mean() 입니다. 앞의 것 뒤에 뒤의 것을 그대로 이어 붙이세요.",
        starter: `import pandas as pd

df = pd.DataFrame({
    "name": ["Alice", "Bob", "Carol", "Dave", "Eve"],
    "score": [88, 92, 79, 65, 95],
    "team":  ["A", "B", "A", "B", "A"],
})

result = ...   # 여기를 채우세요

print(result)
`,
        check: `import pandas as pd
assert isinstance(result, pd.Series), "결과가 표 전체로 나왔습니다. groupby 뒤에 [\\"score\\"] 를 붙여 점수 칸 하나만 골라주세요."
assert set(result.index) == {"A", "B"}, f"팀 이름이 왼쪽에 와야 합니다. 지금은 {list(result.index)}입니다."
assert abs(result["A"] - 87.3333) < 0.01, f"A팀 평균이 {result['A']:.2f}입니다. 87.33이 나와야 합니다."
assert abs(result["B"] - 92.0) < 0.01, f"B팀 평균이 {result['B']:.2f}입니다. 65점인 Dave가 걸러졌다면 92가 됩니다."
`,
      },
    },

    // ── 도구 3. 미분 ─────────────────────────────────────
    { narration: "세 번째 항목에는 자물쇠 표시가 붙어 있습니다 — PyTorch." },
    {
      who: "Aistb",
      say: "이건 이 자리 컴퓨터로는 못 돌립니다. 너무 무겁습니다. 대신 이 도구가 무엇을 대신 해주는지는 지금 아셔야 합니다.",
    },
    {
      who: "Aistb",
      say: "예측이 얼마나 틀렸는지를 점수로 매길 수 있습니다. 많이 틀릴수록 큰 점수. 이걸 cost라고 부릅니다. 우리 일은 이 점수를 낮추는 것입니다.",
    },
    {
      who: "Aistb",
      say: "그러려면 알아야 할 게 있습니다. 지금 자리에서 W를 아주 조금 키우면 cost가 늘어날까요, 줄어들까요? 그걸 숫자 하나로 알려주는 게 기울기입니다. 식은 제가 드릴 테니 옮겨 적어보세요.",
    },
    {
      code: {
        brief: "W와 b가 둘 다 0인 상태입니다. 이때의 기울기를 구하세요. 식은 힌트에 있습니다 — 지금은 뜻보다 계산이 먼저입니다.",
        packages: ["numpy"],
        hint: "dW = 2 × (error × x의 평균), db = 2 × (error의 평균). 파이썬으로는 2 * (error * x).mean() 과 2 * error.mean() 입니다.",
        starter: `import numpy as np

x = np.array([1., 2., 3., 4.])
y = np.array([5., 7., 9., 11.])   # 사실은 y = 2x + 3
W, b = 0.0, 0.0

error = (W * x + b) - y   # 예측에서 정답을 뺀 값 = 얼마나 빗나갔는지

dW = ...   # 여기를 채우세요
db = ...

print(f"dW={dW}  db={db}")
`,
        check: `assert abs(dW - (-45.0)) < 1e-6, f"dW가 {dW}입니다. -45가 나와야 합니다. error에 x를 곱했는지, 앞의 2를 빠뜨리지 않았는지 확인하세요."
assert abs(db - (-16.0)) < 1e-6, f"db가 {db}입니다. -16이 나와야 합니다. db 쪽에는 x를 곱하지 않습니다."
`,
      },
    },
    {
      who: "Aistb",
      say: "PyTorch에서는 방금 그 두 줄을 backward() 한 번으로 끝냅니다. 식은 한 글자도 쓰지 않습니다. 계산이 백 배 복잡해져도 마찬가지입니다.",
    },
    {
      who: "Aistb",
      say: "도구는 다 보셨습니다. 그런데 방금 나온 -45, 이 숫자를 가지고 무엇을 하라는 건지는 아직 안 배우셨죠.",
    },
];
