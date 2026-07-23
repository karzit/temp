"""OCR 원문에서 뽑아내고 싶은 정보의 "양식"(데이터 모델)을 정의하는 파일.

structurer.py(어떻게 채울지)와 schema.py(무엇을 채울지)를 분리해두면,
"이 앱이 다루는 데이터의 계약(contract)"이 코드베이스 어디에 있는지 한눈에 알 수 있다.
나중에 필드를 추가/변경할 때도 이 파일 하나만 보면 되고, LLM 호출 로직(structurer.py)과
데이터 형태(schema.py)가 서로 다른 이유로 바뀌는 걸 깔끔하게 나눌 수 있다.
"""
from pydantic import BaseModel, Field  # 참고 https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/03_document_structuring/03_document_structuring.ipynb


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
