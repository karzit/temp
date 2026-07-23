"""OCR로 뽑아낸 지저분한 텍스트를, AI를 시켜서 깔끔한 JSON 형태로 정리하는 부분.

비유하자면 이런 느낌이야:
    OCR 결과 = 손글씨로 급하게 휘갈겨 쓴 메모 (오타, 줄바꿈이 뒤죽박죽)
    이 파일이 하는 일 = 그 메모를 읽고 "신청서 양식"에 맞춰 정자로 다시 옮겨 적어주는 것

왜 그냥 텍스트로 안 두고 굳이 JSON(정형 데이터)으로 바꿀까?
    - 텍스트는 "대충 이런 내용이 있다" 정도만 알 수 있지만,
      JSON은 "document_type은 무엇, reason은 무엇"처럼 항목별로 값이 딱 정해져 있어서
      다음 단계(RAG 검색)에서 컴퓨터가 정확하게 활용하기 훨씬 쉬워진다.
"""
from openai import OpenAI  # 참고 https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/03_document_structuring/03_document_structuring.ipynb
from pydantic import BaseModel, Field  # 참고 https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/03_document_structuring/03_document_structuring.ipynb

from config import CHAT_MODEL, OPENAI_API_KEY


class RegulationInquiry(BaseModel):
    """서류에서 뽑아내고 싶은 정보의 "양식"을 정의한 것.

    Pydantic의 BaseModel을 상속하면, 각 필드에 어떤 타입의 값이 들어가야 하는지 미리 정해둘 수 있다.
    이렇게 양식을 정해두면 AI가 "이 틀에 맞춰서만 답해라"라고 강제할 수 있어서,
    매번 다른 형식으로 삐뚤빼뚤 답하는 걸 막아준다. (엑셀 양식의 빈칸을 채우게 하는 것과 비슷!)
    """

    document_type: str = Field(description="서류의 종류 (예: 휴가신청서, 재직증명서, 초과근무신청서 등)")
    applicant_request: str = Field(description="신청자가 요청하는 핵심 내용을 한두 문장으로 요약")
    related_dates: list[str] = Field(
        default_factory=list, description="서류에 등장하는 날짜들 (YYYY-MM-DD 형식으로, 없으면 빈 목록)"
    )
    keywords: list[str] = Field(
        default_factory=list, description="규정 검색에 도움이 될 핵심 키워드 목록 (예: ['육아휴직', '재택근무'])"
    )


SYSTEM_PROMPT = """당신은 사내 서류 텍스트를 분석해 정해진 형식의 데이터로 정리하는 도우미입니다.
OCR로 인식된 텍스트라 오타나 줄바꿈 오류가 있을 수 있으니, 문맥을 보고 자연스럽게 해석해 채우세요.
텍스트에 없는 내용은 추측해서 지어내지 말고, 알 수 없으면 빈 값으로 두세요."""


def structure_text(raw_text: str) -> RegulationInquiry:
    """OCR 원문 텍스트를 받아서 RegulationInquiry 형태의 정형 데이터로 바꿔준다."""
    client = OpenAI(api_key=OPENAI_API_KEY)

    # beta.chat.completions.parse: "이 Pydantic 모델(RegulationInquiry) 형식에 딱 맞춰서 답해줘"라고
    # OpenAI에게 요청하는 기능. 응답이 자동으로 RegulationInquiry 객체로 변환되어 돌아온다.
    # (사람이 직접 "response.choices[0]...에서 JSON 파싱해서..." 하는 번거로운 과정을 대신 해준다)
    completion = client.beta.chat.completions.parse(
        model=CHAT_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": raw_text},
        ],
        response_format=RegulationInquiry,
    )

    return completion.choices[0].message.parsed
