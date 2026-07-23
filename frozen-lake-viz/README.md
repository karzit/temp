# Frozen Lake Q-Learning 시각화

Q-Learning이 게임판(Frozen Lake) 위에서 에이전트가 시행착오를 거치며 최적 경로를 학습해가는
과정을 브라우저에서 바로 볼 수 있는 순수 HTML/CSS/JS 데모입니다. 설치나 빌드 과정 없이
`index.html`을 브라우저로 열기만 하면 됩니다.

```bash
# 예: 파일 탐색기에서 더블클릭하거나
open frozen-lake-viz/index.html   # macOS
start frozen-lake-viz/index.html  # Windows
```

## 무엇을 보여주나요

- 8x8 격자(Ice/Hole/Start/Goal) 위에서 여러 에이전트(Units)가 동시에 Q-Learning으로 학습합니다.
- 셀의 밝기는 그 상태(state)의 최대 Q값(학습된 가중치)을 나타냅니다 — 학습이 진행될수록
  목표(Goal)로 가는 경로 주변이 점점 밝아지는 것을 관찰할 수 있습니다.
- Units(동시 에이전트 수)와 FPS를 슬라이더로 조절하며 학습 속도/안정성의 변화를 체감할 수 있습니다.

## 이 저장소와의 관계

이 프로젝트의 노트북 커리큘럼(`notebooks/ml-curriculum/`)은 강화학습(RL)을 다루지 않습니다
([CURRICULUM.md](../CURRICULUM.md)의 "범위에서 제외한 부분" 참고). 이 폴더는 그 자리를 메우는
정식 커리큘럼이 아니라, Q-Learning 개념을 눈으로 먼저 훑어보는 독립적인 보조 자료입니다.
