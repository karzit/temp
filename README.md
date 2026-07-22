# ML 튜토리얼 프로젝트

Google Colab에서 실습하는 머신러닝 입문 튜토리얼입니다. 첫 노트북은 scikit-learn으로 Iris 데이터셋을 분류하는 전체 파이프라인(로드 → EDA → 전처리 → 학습 → 평가 → 저장)을 다룹니다.

## 폴더 구조

```
notebooks/   실습 노트북 (.ipynb)
data/        직접 추가할 데이터셋 (git에는 커밋 안 됨)
models/      학습된 모델 저장 위치 (git에는 커밋 안 됨)
requirements.txt
```

## Colab에서 열기

**방법 A — 직접 업로드**
1. [colab.research.google.com](https://colab.research.google.com) 접속
2. 파일 → 노트북 업로드 → `notebooks/01_basic_classification.ipynb` 선택

**방법 B — GitHub 연동 (권장)**
1. 이 프로젝트를 GitHub 저장소로 push
2. Colab에서 파일 → GitHub 탭 → 저장소 URL 입력 → 노트북 선택
3. 이후 Colab에서 수정한 내용은 "GitHub에 사본 저장"으로 다시 push 가능

**방법 C — Google Drive**
1. 이 프로젝트 폴더를 Google Drive에 업로드
2. 노트북 첫 코드 셀에서 `drive.mount('/content/drive')` 주석 해제 후 실행

## 로컬에서 실행하려면

```bash
pip install -r requirements.txt
jupyter notebook notebooks/01_basic_classification.ipynb
```

## 다음 튜토리얼 아이디어
- PyTorch로 이미지 분류 (CNN, MNIST/CIFAR-10)
- Hugging Face Transformers로 텍스트 분류
- 자신의 CSV 데이터셋으로 파이프라인 재사용
