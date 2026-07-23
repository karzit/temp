# B파트 사용자 입력 처리 예시 (서류 사진 -> 정형 JSON)

서류 이미지를 업로드하면 OCR로 글자를 읽고, 그 지저분한 원문을 AI가 정리해서
정형화된 JSON으로 바꿔주는 예시. C파트(RAG)가 검색 질의를 만들 때 이 JSON을 사용한다.

## 왜 이 단계가 필요한가?

사용자가 타이핑한 깔끔한 질문이 아니라 "서류를 촬영한 사진"이 입력이기 때문이다.
OCR로 뽑은 텍스트는 오타, 줄바꿈 깨짐, 표 구조 붕괴가 섞여 있어서
이걸 그대로 검색(임베딩)에 사용하면 정확도가 크게 떨어진다.
그래서 한 번 더 AI를 거쳐 "문서 종류, 핵심 사유, 날짜" 같은 필요한 정보만 깔끔하게 뽑아낸다.

## 파이프라인

```
사용자가 Streamlit 화면에 서류 사진 업로드
    -> Google Vision OCR: 이미지 -> 오타 섞인 날것의 줄글 텍스트
    -> gpt-4o-mini + Pydantic: 날것의 텍스트 -> 정형화된 JSON (문서 종류/사유/날짜 등)
    -> (다음 단계) 이 JSON을 C파트(RAG)로 넘겨서 관련 규정 검색
```

## 1. 환경 준비

```bash
pip install -r requirements.txt
cp .env.example .env
```

`.env`에 다음 두 가지를 채워야 한다.
- `OPENAI_API_KEY`: gpt-4o-mini 호출용
- `GOOGLE_APPLICATION_CREDENTIALS`: Google Cloud Vision API 서비스 계정 키 파일(json) 경로
  발급 방법: https://cloud.google.com/vision/docs/setup

## 2. 실행

```bash
streamlit run src/app.py
```

브라우저가 열리면 서류 이미지를 업로드해서 OCR 결과와 정형 JSON을 확인할 수 있다.

## 다음 단계

여기서 만들어진 JSON은 [`../rag-regulation-example`](../rag-regulation-example)의
`query.py`처럼 관련 규정을 검색하는 C파트 RAG 단계로 전달된다.
