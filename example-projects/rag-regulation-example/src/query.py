"""사용자 질문을 받아서, 관련 있는 규정 내용을 찾아 보여주고, AI가 답변을 만들어주는 스크립트.

ingest.py가 "책을 도서관에 정리해두는 작업"이었다면,
이 파일은 "질문을 들고 도서관에 가서 관련된 페이지를 찾은 뒤, 그걸 읽고 답해주는 사서" 역할이야.

전체 흐름 (오픈북 시험을 본다고 상상해봐):
    1. 질문을 숫자 좌표(벡터)로 바꾼다
    2. OpenSearch(도서관)에서 그 좌표와 가까운, 즉 의미가 비슷한 규정 조각들을 찾는다 (top-k개)
    3. 찾은 조각들을 "여기 참고할 내용이야"라며 프롬프트에 끼워 넣는다
    4. AI(LLM)가 그 내용만 보고 답을 적는다

사용법:
    python src/query.py "재택근무 시 초과근무 수당 기준이 뭐야?"
"""
import sys

from langchain_community.vectorstores import OpenSearchVectorSearch
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

from config import CHAT_MODEL, EMBEDDING_MODEL, OPENSEARCH_INDEX, OPENSEARCH_URL

# 질문 하나당 몇 개의 규정 조각을 참고자료로 가져올지 정하는 값.
# 너무 적게 가져오면(예: 1개) 진짜 필요한 내용이 빠질 수 있고,
# 너무 많이 가져오면(예: 20개) AI에게 줄 글이 너무 길어져서 비용도 늘고
# 오히려 중요한 부분을 못 찾고 헤맬 수 있어. 그래서 적당히 4개로 정해둔 거야.
TOP_K = 4

# AI에게 "이렇게 답해줘"라고 미리 짜둔 질문지 양식(템플릿)이야.
# 여기서 제일 중요한 규칙 두 가지:
#   1) "아래 [관련 규정]만 근거로 답변하라" -> AI가 자기 마음대로 아무 말이나 지어내지 못하게 막는 거야.
#      (AI가 모르는 걸 아는 척 지어내서 답하는 걸 "환각(hallucination)"이라고 불러. 이걸 막는 게 목표!)
#   2) "근거가 없으면 모른다고 답하라" -> 확실하지 않은 걸 확신 있게 말하지 않도록 하는 안전장치야.
# 이렇게 "근거 자료를 주고 그 안에서만 답하게 하는 것"을 그라운딩(grounding)이라고 불러.
# 오픈북 시험에서 "교과서에 나온 내용만 쓰세요"라고 하는 것과 같은 느낌이야.
PROMPT_TEMPLATE = """당신은 사내 규정을 안내하는 어시스턴트입니다.
아래 [관련 규정]만 근거로 답변하고, 근거가 없으면 모른다고 답하세요.

[관련 규정]
{context}

[질문]
{question}

[답변]
"""


def search_similar_docs(question: str, k: int = TOP_K):
    """질문을 벡터로 바꾼 뒤, 도서관(OpenSearch)에서 의미가 가장 비슷한 규정 조각 k개를 찾아온다."""
    # 주의! 여기서 쓰는 임베딩 모델은 ingest.py에서 문서를 저장할 때 썼던 모델과 반드시 똑같아야 해.
    # 왜냐하면 서로 다른 모델이 만든 좌표는 "지도 자체"가 달라서, 같은 위치라도 의미가 다를 수 있거든.
    # (예를 들어 한국 지도의 좌표랑 미국 지도의 좌표를 비교하면 말이 안 되는 것과 비슷해)
    embeddings = OpenAIEmbeddings(model=EMBEDDING_MODEL)
    vector_store = OpenSearchVectorSearch(
        opensearch_url=OPENSEARCH_URL,
        index_name=OPENSEARCH_INDEX,
        embedding_function=embeddings,
    )
    # similarity_search: "질문 좌표랑 제일 가까운 문서 조각 k개를 찾아줘"라는 뜻.
    # 참고: https://python.langchain.com/docs/integrations/vectorstores/opensearch/
    return vector_store.similarity_search(question, k=k)


def build_prompt(question: str, docs) -> str:
    """찾아온 규정 조각들을 "[파일명 몇 페이지]" 표시와 함께 이어붙여 하나의 참고자료 텍스트로 만든다."""
    # 이렇게 출처를 남겨두면, 나중에 답변을 볼 때 "이 답은 취업규칙.pdf 3페이지 내용이구나"처럼
    # 어디서 나온 정보인지 확인할 수 있어서 신뢰도가 높아져.
    context = "\n\n".join(
        f"[{doc.metadata.get('source', '?')} p.{doc.metadata.get('page', '?')}]\n{doc.page_content}"
        for doc in docs
    )
    return PROMPT_TEMPLATE.format(context=context, question=question)


def answer(question: str) -> str:
    """질문 하나를 받아서 검색부터 답변 생성까지 전부 처리해주는 대표 함수."""
    docs = search_similar_docs(question)
    prompt = build_prompt(question, docs)

    # temperature는 AI 답변의 "즉흥성"을 조절하는 다이얼이라고 생각하면 돼.
    # 값이 높을수록(예: 1에 가까울수록) 매번 조금씩 다르고 창의적인 답을 하고,
    # 0에 가까울수록 같은 질문엔 거의 항상 같은, 딱딱하고 일관된 답을 해.
    # 회사 규정처럼 "정확함"이 제일 중요한 곳에서는 창의성이 필요 없으니까 0으로 딱 고정해둔 거야.
    llm = ChatOpenAI(model=CHAT_MODEL, temperature=0)
    response = llm.invoke(prompt)
    return response.content


if __name__ == "__main__":
    # 터미널에서 python src/query.py "질문 내용" 처럼 실행하면
    # sys.argv[1] 자리에 그 질문 문자열이 들어와.
    if len(sys.argv) < 2:
        print('사용법: python src/query.py "질문"')
        sys.exit(1)

    question = sys.argv[1]
    print(answer(question))
