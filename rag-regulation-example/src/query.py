"""JSON 형태의 사용자 데이터를 받아 유사 규정 문서를 검색하고, 최종 답변을 생성하는 스크립트.

사용법:
    python src/query.py "재택근무 시 초과근무 수당 기준이 뭐야?"
"""
import sys

from langchain_community.vectorstores import OpenSearchVectorSearch
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

from config import CHAT_MODEL, EMBEDDING_MODEL, OPENSEARCH_INDEX, OPENSEARCH_URL

TOP_K = 4

PROMPT_TEMPLATE = """당신은 사내 규정을 안내하는 어시스턴트입니다.
아래 [관련 규정]만 근거로 답변하고, 근거가 없으면 모른다고 답하세요.

[관련 규정]
{context}

[질문]
{question}

[답변]
"""


def search_similar_docs(question: str, k: int = TOP_K):
    embeddings = OpenAIEmbeddings(model=EMBEDDING_MODEL)
    vector_store = OpenSearchVectorSearch(
        opensearch_url=OPENSEARCH_URL,
        index_name=OPENSEARCH_INDEX,
        embedding_function=embeddings,
    )
    return vector_store.similarity_search(question, k=k)


def build_prompt(question: str, docs) -> str:
    context = "\n\n".join(
        f"[{doc.metadata.get('source', '?')} p.{doc.metadata.get('page', '?')}]\n{doc.page_content}"
        for doc in docs
    )
    return PROMPT_TEMPLATE.format(context=context, question=question)


def answer(question: str) -> str:
    docs = search_similar_docs(question)
    prompt = build_prompt(question, docs)

    llm = ChatOpenAI(model=CHAT_MODEL, temperature=0)
    response = llm.invoke(prompt)
    return response.content


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print('사용법: python src/query.py "질문"')
        sys.exit(1)

    question = sys.argv[1]
    print(answer(question))
