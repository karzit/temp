# B파트 사용자 입력 처리 예시 (서류 사진 -> [정형 출력](../../glossary.md#structured-output) JSON)

서류 이미지를 업로드하면 [OCR](../../glossary.md#ocr)로 글자를 읽고, 그 지저분한 원문을 AI가 정리해서
정형화된 JSON으로 바꿔주는 예시입니다. C파트([RAG](../../glossary.md#rag))가 검색 질의를 만들 때 이 JSON을 사용합니다.

용어가 낯설다면 **[../../glossary.md](../../glossary.md)**를 참고하세요.

> 📓 **이 프로젝트를 같이 읽어주는 노트북이 있습니다** —
> [`notebooks/project-walkthrough/03_document_input`](../../notebooks/project-walkthrough/03_document_input/03_document_input.ipynb)
> 아래 코드를 한 줄씩 열어보며 "왜 이렇게 짰는지"를 따라갑니다.
> Google Vision·API 키 없이 Colab에서 실행됩니다.

## 왜 이 단계가 필요한가?

사용자가 타이핑한 깔끔한 질문이 아니라 "서류를 촬영한 사진"이 입력이기 때문입니다.
OCR로 뽑은 텍스트는 오타, 줄바꿈 깨짐, 표 구조 붕괴가 섞여 있어서
이걸 그대로 검색(임베딩)에 사용하면 정확도가 크게 떨어집니다.
그래서 한 번 더 AI를 거쳐 "문서 종류, 핵심 사유, 날짜" 같은 필요한 정보만 깔끔하게 뽑아냅니다.

## 파이프라인

```
사용자가 Streamlit 화면에 서류 사진 업로드
    -> Google Vision OCR: 이미지 -> 오타 섞인 날것의 줄글 텍스트
    -> gpt-4o-mini + [Pydantic](../../glossary.md#pydantic): 날것의 텍스트 -> 정형화된 JSON (문서 종류/사유/날짜 등)
    -> (다음 단계) 이 JSON을 C파트(RAG)로 넘겨서 관련 규정 검색
```

## 1. 환경 준비

```bash
pip install -r requirements.txt
cp .env.example .env
```

`.env`에 다음 두 가지를 채워야 합니다.
- `OPENAI_API_KEY`: gpt-4o-mini 호출용
- `GOOGLE_APPLICATION_CREDENTIALS`: Google Cloud Vision API 서비스 계정 키 파일(json) 경로
  발급 방법: https://cloud.google.com/vision/docs/setup

## 2. 실행

```bash
streamlit run src/app.py
```

브라우저가 열리면 서류 이미지를 업로드해서 OCR 결과와 정형 JSON을 확인할 수 있습니다.
화면은 세 부분으로 나옵니다.

```
1. OCR 원문        오타가 섞인 날것의 줄글
2. 정형화된 JSON   document_type / applicant_request / related_dates / keywords
3. 검색 질의       위 JSON을 한 줄로 조립한 것 (C파트에 그대로 넣는 입력)
```

## 다음 단계: C파트로 넘기기

3번에 나온 문자열이 곧 C파트의 질문입니다. [`../rag-regulation-example`](../rag-regulation-example)이
떠 있다면 그대로 붙여넣어 이어서 실행할 수 있습니다.

```bash
python src/query.py "초과근무신청서 재택근무 초과근무 수당 재택근무일에 3시간 초과근무한 수당을 신청합니다"
```

조립 규칙은 [`schema.py`](src/schema.py)의 `to_search_query()`에 있고, 요지는 **명사와 문장을
같이 넣는 것**입니다. C파트가 하이브리드 검색(벡터 + 키워드)을 쓰는데 두 검색이 좋아하는 입력이
서로 다르기 때문입니다 — 키워드 검색은 `document_type`/`keywords` 같은 단어가 그대로 있어야
걸리고, 벡터 검색은 `applicant_request` 같은 문장이어야 의미가 제대로 잡힙니다.

JSON의 네 필드 중 `related_dates`만 질의에서 빠진 것도 눈여겨볼 만합니다. 규정 본문에는
"2026-03-15" 같은 구체적인 날짜가 나오지 않기 때문에("연장근로수당은 ... 지급한다"처럼 쓰여
있죠) 검색어에 넣어봐야 걸릴 문서가 없고, 질의만 길어져서 다른 단어의 비중을 떨어뜨립니다.
날짜는 "언제 신청한 건인지" 사람이 확인하는 값이라 JSON에는 남기고 질의에서만 뺐습니다.

이게 B파트가 존재하는 이유이기도 합니다. 서류 사진에서 나온 OCR 원문을 그대로 검색에 던지면
서식 문구·표 깨짐·오타까지 전부 질의에 섞여 들어갑니다. 한 번 정형화를 거쳐야 **검색에 쓸 값만**
남습니다.

## 다른 선택지가 궁금하다면

`streamlit`/`google-cloud-vision`/`openai` 대신 쓸 수 있는 라이브러리(`Gradio`, `Tesseract`,
`anthropic` 등)와 언제 그걸 고려하면 좋을지는 [`ALTERNATIVES.md`](ALTERNATIVES.md)에 정리해두었습니다.
