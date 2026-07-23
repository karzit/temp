# 대체 가능한 기술 (참고용)

이 프로젝트는 `langchain` + `opensearch-py` + `pypdf` + `gpt-4o-mini`(openai) 조합으로 만들어졌다.
아래는 같은 역할을 대신할 수 있는 다른 선택지들을 간단히 소개하는 문서다.
실습 코드는 그대로 두고, "이럴 때는 이런 대안도 있다" 정도만 참고하면 된다.

## 오케스트레이션 (langchain)

| 대안 | 언제 고려하나 |
|---|---|
| `LlamaIndex` | 청킹/검색/응답으로 이어지는 RAG 흐름 자체가 목적이라면 더 단순하게 짤 수 있음 |
| 직접 구현 (라이브러리 없이) | 이 예시처럼 파이프라인이 단순할 때는 프레임워크 없이도 충분 |

## PDF 텍스트 추출 (pypdf)

| 대안 | 언제 고려하나 |
|---|---|
| `PyMuPDF` | 추출 속도/정확도가 더 중요할 때 (`preprocess-example`에서 이미 사용 중) |
| `pdfplumber` | 규정 문서에 표(급여 기준표 등)가 많아 구조를 유지해야 할 때 |
| `unstructured` / `Docling` | 레이아웃이 복잡한 문서를 자동으로 구조화해서 뽑고 싶을 때 |

## 임베딩 (text-embedding-3-small / openai)

| 대안 | 언제 고려하나 |
|---|---|
| [Hugging Face](../../glossary.md#huggingface) `sentence-transformers` | 임베딩 API 비용 없이 로컬에서 처리하고 싶을 때, 규정 문서처럼 민감한 내용을 외부로 보내지 않아야 할 때 |
| Cohere Embed | 다국어 검색 품질이 중요할 때 |

## 벡터 저장/검색 (opensearch-py)

| 대안 | 언제 고려하나 |
|---|---|
| `pgvector` | 문서량이 적은 이 규모(2건, 400p)에서는 별도 OpenSearch 없이 Postgres 하나로도 충분 |
| `Qdrant` / `Weaviate` | 하이브리드 검색, 메타데이터 필터링 등 검색 기능이 더 필요할 때 |
| `Chroma` | 로컬 실습/데모 용도로 가장 가볍게 띄우고 싶을 때 |

## LLM (gpt-4o-mini / openai)

| 대안 | 언제 고려하나 |
|---|---|
| `anthropic` (Claude) | 긴 문서(200p PDF 등) 컨텍스트를 통째로 넣고 싶을 때, 답변 근거 인용 품질이 중요할 때 |
| `google-generativeai` (Gemini) | Google 인프라(Vision OCR 등)와 이미 통합돼 있을 때 |
| `ollama` (로컬 LLM) | 사내 규정처럼 민감한 문서를 외부로 보내지 않고 처리하고 싶을 때 |

## 참고

- 이 문서는 실습 편의를 위한 안내이며, 실제 코드 마이그레이션은 다루지 않는다.
