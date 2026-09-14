// 01_linear_regression 노트북에 대응하는 챕터.
// 자리는 잠정이다 — 1장(데이터 탐색)이 정해지면 그 뒤로 밀린다.
// 서사는 상황을 세우는 데까지만 쓰고, 설명은 위젯과 채점 피드백이 대신한다.
var CH02 = {
  id: "ch02",
  title: "첫 업무 — 고장난 예측기",
  notebook: "../notebooks/ml-curriculum/01_linear_regression/01_linear_regression.ipynb",
  beats: [
    {
      narration:
        "배정된 업무는 배달 시간 예측 AI 수리입니다. 거리만 보고 몇 분 걸릴지 답해야 하는 물건인데, 지금은 아무 숫자나 뱉고 있습니다. 남아 있는 자료는 지난 여섯 건의 기록이 전부입니다.",
    },
    {
      who: "Aistb",
      say: "안쪽 규칙은 아주 단순합니다. 시간 = W × 거리 + b. 토이비님이 W를 정하시면, 저는 그 규칙이 얼마나 틀렸는지 점수로 말씀드리겠습니다. 이 점수를 cost라고 부릅니다.",
    },
    {
      widget: "fitline",
      brief: "b는 12.4에 고정해 뒀습니다. W만 움직여서 cost를 1.5 아래로 낮추세요.",
      config: {
        xs: [1, 2, 3, 4, 5, 6],
        ys: [17, 23, 26, 33, 36, 42],
        wRange: [0, 10],
        lockB: 12.4,
        target: 1.5,
        xLabel: "거리(km)",
        yLabel: "시간(분)",
      },
    },
    {
      who: "Aistb",
      say: "빨간 세로선이 실제 기록과 규칙이 어긋난 정도입니다. 그걸 제곱해서 평균 낸 게 cost입니다. 아래 그림은 W를 바꾸면 cost가 어떻게 변하는지 미리 그려둔 것입니다.",
    },
    {
      choice: {
        question: "지금 서 있는 자리에서 cost 곡선이 오른쪽으로 내려가고 있습니다. 기울기가 마이너스라는 뜻입니다. W를 어떻게 해야 할까요?",
        options: [
          {
            text: "W를 키운다",
            ok: true,
            why: "기울기가 마이너스라는 건 오른쪽이 더 낮다는 뜻입니다. 기울기가 가리키는 쪽의 반대로 가면 cost가 줄어듭니다.",
          },
          {
            text: "W를 줄인다",
            ok: false,
            why: "그쪽은 곡선이 올라가는 방향이라 cost가 커집니다. 항상 기울기가 가리키는 쪽의 반대로 갑니다.",
          },
          {
            text: "기울기만으로는 정할 수 없다. 곡선 전체를 봐야 한다",
            ok: false,
            why: "전체를 볼 수 있으면 좋겠지만, 정할 값이 많아지면 이런 그림 자체를 그릴 수 없습니다. 그래서 발밑의 기울기 하나만 보고 다음 걸음을 정하는 방법을 씁니다.",
          },
        ],
      },
    },
    {
      who: "Aistb",
      say: "그게 전부입니다. 기울기를 재고, 반대쪽으로 조금 갑니다. 한 걸음을 얼마나 크게 뗄지는 lr이라는 값이 정합니다. 이제 직접 그 한 걸음을 써보시죠.",
    },
    {
      code: {
        brief: "dW와 db 두 줄을 채우세요. 식은 힌트에 있습니다. 나머지는 이미 짜여 있습니다.",
        packages: ["numpy"],
        hint: "dW = 2 × (error × x의 평균), db = 2 × (error의 평균). 파이썬으로는 2 * (error * x).mean() 과 2 * error.mean() 입니다.",
        starter: `import numpy as np

x = np.array([1., 2., 3., 4., 5., 6.])
y = np.array([17., 23., 26., 33., 36., 42.])

W, b, lr = 0.0, 0.0, 0.02

for i in range(2000):
    error = (W * x + b) - y
    dW = ...   # 여기를 채우세요
    db = ...   # 여기도
    W = W - lr * dW
    b = b - lr * db

print(f"W={W:.3f}  b={b:.3f}")
`,
        check: `import numpy as np
assert np.isfinite(W) and np.isfinite(b), "값이 발산했습니다. dW와 db가 서로 바뀌지 않았는지, x를 어느 쪽에 곱했는지 확인하세요."
W_star, b_star = np.polyfit(x, y, 1)
assert abs(W - W_star) < 0.05, f"W가 {W:.3f}인데 정답은 {W_star:.3f}입니다. dW의 방향이나 x를 곱하는 부분을 다시 보세요."
assert abs(b - b_star) < 0.15, f"W는 맞았는데 b가 {b:.3f}입니다(정답 {b_star:.3f}). db에는 x를 곱하지 않습니다."
`,
      },
    },
    {
      who: "Aistb",
      say: "두 줄 적으셨을 뿐인데 규칙이 알아서 제자리를 찾았습니다. 마지막으로 손으로 해보시죠. 이번엔 b도 풀어두겠습니다.",
    },
    {
      widget: "fitline",
      brief: "W와 b를 둘 다 움직여 cost를 1.0 아래로 낮추세요. 방금 코드가 찾아낸 값이 어디쯤이었는지 확인해 보세요.",
      config: {
        xs: [1, 2, 3, 4, 5, 6],
        ys: [17, 23, 26, 33, 36, 42],
        wRange: [0, 10],
        bRange: [0, 25],
        target: 1.0,
        xLabel: "거리(km)",
        yLabel: "시간(분)",
      },
    },
    {
      narration:
        "예측기가 제 숫자를 뱉기 시작합니다. 첫 업무는 여기까지입니다. (같은 내용을 코드로 끝까지 따라가려면 01_linear_regression 노트북으로 가세요. 여기서 손으로 만져본 W와 b가 거기서는 여러 개로 늘어납니다.)",
    },
  ],
};
