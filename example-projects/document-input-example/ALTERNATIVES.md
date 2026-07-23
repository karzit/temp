# 대체 가능한 기술 (참고용)

이 프로젝트는 `streamlit` + `google-cloud-vision` + `openai` + `pydantic` 조합으로 만들어졌다.
아래는 같은 역할을 대신할 수 있는 다른 선택지들을 간단히 소개하는 문서다.
실습 코드는 그대로 두고, "이럴 때는 이런 대안도 있다" 정도만 참고하면 된다.

## 화면/입력 (streamlit)

| 대안 | 언제 고려하나 |
|---|---|
| `Gradio` | 데모 화면을 빠르게 만들고 싶을 때. streamlit과 비슷한 포지션 |
| `FastAPI` + React/Next.js | 사용자에게 정식 서비스로 제공해야 할 때 (streamlit은 프로토타입에 적합) |
| `Flask` | 가볍게 직접 화면을 구성하고 싶을 때 |

## OCR (google-cloud-vision)

| 대안 | 언제 고려하나 |
|---|---|
| `AWS Textract` | 표/양식이 많은 문서에서 레이아웃까지 구조화해서 뽑고 싶을 때 |
| `Azure Document Intelligence` | 이미 Azure 인프라를 쓰고 있거나, 문서 템플릿 학습이 필요할 때 |
| `Upstage Document AI` | 국내 서비스, 한글 문서 인식 품질이 중요할 때 |
| `Tesseract` (오픈소스) | 비용 없이 로컬에서 처리하고 싶을 때 (품질은 상대적으로 낮음) |

## 텍스트 정형화에 쓰는 LLM (openai)

| 대안 | 언제 고려하나 |
|---|---|
| `anthropic` (Claude) | 이미 Claude를 쓰는 조직이거나 긴 문맥 처리가 필요할 때 |
| `google-generativeai` (Gemini) | Google 생태계(Vision 등)와 통합해서 쓰고 싶을 때 |
| `ollama` | 외부로 데이터를 보내지 않고 로컬 LLM으로 처리하고 싶을 때 (민감 서류) |

LLM은 위처럼 바뀔 수 있지만, "정형화 스키마를 어떻게 정의할지"는 `pydantic`이 사실상 표준이라
어떤 LLM을 쓰든 그대로 유지하는 걸 추천한다 (대부분의 LLM SDK가 Pydantic 모델을 구조화 출력
스키마로 직접 지원한다).

## 참고

- 이 문서는 실습 편의를 위한 안내이며, 실제 코드 마이그레이션은 다루지 않는다.
