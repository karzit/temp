"""OCR 원문에서 뽑아내고 싶은 정보의 "양식"(데이터 모델)을 정의하는 파일입니다.

structurer.py(어떻게 채울지)와 schema.py(무엇을 채울지)를 분리해두면,
"이 앱이 다루는 데이터의 계약(contract)"이 코드베이스 어디에 있는지 한눈에 알 수 있습니다.
나중에 필드를 추가/변경할 때도 이 파일 하나만 보면 되고, LLM 호출 로직(structurer.py)과
데이터 형태(schema.py)가 서로 다른 이유로 바뀌는 걸 깔끔하게 나눌 수 있습니다.
"""
from pydantic import BaseModel, Field  # 참고 https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/03_document_structuring/03_document_structuring.ipynb


class RegulationInquiry(BaseModel):
    """서류에서 뽑아내고 싶은 정보의 "양식"을 정의한 것입니다.

    Pydantic의 BaseModel을 상속하면, 각 필드에 어떤 타입의 값이 들어가야 하는지 미리 정해둘 수 있습니다.
    이렇게 양식을 정해두면 AI가 "이 틀에 맞춰서만 답해라"라고 강제할 수 있어서,
    매번 다른 형식으로 삐뚤빼뚤 답하는 걸 막아줍니다. (엑셀 양식의 빈칸을 채우게 하는 것과 비슷!)
    """

    document_type: str = Field(description="서류의 종류 (예: 휴가신청서, 재직증명서, 초과근무신청서 등)")
    applicant_request: str = Field(description="신청자가 요청하는 핵심 내용을 한두 문장으로 요약")
    related_dates: list[str] = Field(
        default_factory=list, description="서류에 등장하는 날짜들 (YYYY-MM-DD 형식으로, 없으면 빈 목록)"
    )
    keywords: list[str] = Field(
        default_factory=list, description="규정 검색에 도움이 될 핵심 키워드 목록 (예: ['육아휴직', '재택근무'])"
    )

    def to_search_query(self) -> str:
        """이 정형 데이터를 C파트(RAG)에 던질 **검색 질의 한 줄**로 조립합니다.

        B파트의 결과물이 여기서 C파트의 입력으로 바뀝니다. 두 파트를 잇는 지점이라
        이 메서드가 곧 "B -> C 화살표"의 실체입니다.

        왜 이렇게 섞어서 붙일까요? C파트가 하이브리드 검색(벡터 + 키워드)을 쓰기 때문입니다.
        두 검색이 좋아하는 입력의 모양이 서로 다릅니다.
            - 키워드 검색: 단어가 그대로 있어야 걸립니다 -> document_type, keywords가 유리
            - 벡터 검색  : 문장이어야 의미가 제대로 잡힙니다 -> applicant_request가 유리
        그래서 둘 다 넣습니다. 명사만 넣으면 벡터 검색이 헤매고, 문장만 넣으면
        "초과근무신청서" 같은 정확한 단어 매칭을 놓칩니다.

        네 필드 중 related_dates만 빠진 이유: 규정 본문에는 "2026-03-15" 같은 구체적인 날짜가
        나오지 않습니다("연장근로수당은 ... 지급한다"처럼 쓰여 있죠). 검색어에 넣어봐야 걸릴
        문서가 없고, 오히려 질의를 길게 만들어 다른 단어의 비중만 떨어뜨립니다. 날짜는 검색이
        아니라 "언제 신청한 건인지" 사람이 확인하는 용도라 JSON에는 남기고 질의에서만 뺐습니다.

        예: RegulationInquiry(document_type="초과근무신청서",
                              applicant_request="재택근무일에 3시간 초과근무한 수당을 신청합니다",
                              keywords=["재택근무", "초과근무", "수당"])
            -> "초과근무신청서 재택근무 초과근무 수당 재택근무일에 3시간 초과근무한 수당을 신청합니다"
        """
        parts = [self.document_type, *self.keywords, self.applicant_request]
        return " ".join(part.strip() for part in parts if part and part.strip())
