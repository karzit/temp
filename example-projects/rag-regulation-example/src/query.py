"""사용자 질문을 받아서, 관련 있는 규정 내용을 찾아 보여주고, AI가 답변을 만들어주는 스크립트.

ingest.py가 "책을 도서관에 정리해두는 작업"이었다면,
이 파일은 "질문을 들고 도서관에 가서 관련된 페이지를 찾은 뒤, 그걸 읽고 답해주는 사서" 역할이야.

전체 흐름 (오픈북 시험을 본다고 상상해봐):
    1. 질문을 숫자 좌표(벡터)로 바꾼다
    2. OpenSearch(도서관)에서 그 좌표와 가까운, 즉 의미가 비슷한 규정 조각들을 찾는다
       + 동시에 질문 속 단어가 정확히 등장하는 조각도 키워드 검색으로 찾는다 (하이브리드 검색)
    3. 넉넉히 가져온 후보(20개)를 리랭커로 다시 줄 세워서 진짜 상위 4개만 남긴다
    4. 남은 조각들을 "여기 참고할 내용이야"라며 프롬프트에 끼워 넣는다
    5. AI(LLM)가 그 내용만 보고 답을 적는다

사용법:
    python src/query.py "재택근무 시 초과근무 수당 기준이 뭐야?"
"""
import sys

from langchain_community.vectorstores import OpenSearchVectorSearch
from langchain_core.documents import Document
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from opensearchpy import OpenSearch

from config import (
    CHAT_MODEL,
    EMBEDDING_MODEL,
    OPENSEARCH_INDEX,
    OPENSEARCH_URL,
    RERANKER_MODEL,
    USE_RERANKER,
)

# 질문 하나당 몇 개의 규정 조각을 참고자료로 가져올지 정하는 값.
# 너무 적게 가져오면(예: 1개) 진짜 필요한 내용이 빠질 수 있고,
# 너무 많이 가져오면(예: 20개) AI에게 줄 글이 너무 길어져서 비용도 늘고
# 오히려 중요한 부분을 못 찾고 헤맬 수 있어. 그래서 적당히 4개로 정해둔 거야.
TOP_K = 4

# 리랭커에게 넘길 후보 개수. 검색은 20개까지 넉넉히 뽑아놓고, 리랭커가 그중 TOP_K개를 고른다.
# 이 값을 키우면 정답을 후보에 포함시킬 확률(recall)은 올라가지만 리랭킹이 느려진다.
RERANK_CANDIDATES = 20

# AI에게 "이렇게 답해줘"라고 미리 짜둔 질문지 양식(템플릿)이야.
# 여기서 제일 중요한 규칙 두 가지:
#   1) "아래 [관련 규정]만 근거로 답변하라" -> AI가 자기 마음대로 아무 말이나 지어내지 못하게 막는 거야.
#      (AI가 모르는 걸 아는 척 지어내서 답하는 걸 "환각(hallucination)"이라고 불러. 이걸 막는 게 목표!)
#   2) "근거가 없으면 모른다고 답하라" -> 확실하지 않은 걸 확신 있게 말하지 않도록 하는 안전장치야.
# 이렇게 "근거 자료를 주고 그 안에서만 답하게 하는 것"을 그라운딩(grounding)이라고 불러.
# 오픈북 시험에서 "교과서에 나온 내용만 쓰세요"라고 하는 것과 같은 느낌이야.
PROMPT_TEMPLATE = """당신은 사내 규정을 안내하는 어시스턴트입니다.
아래 [관련 규정]만 근거로 답변하고, 근거가 없으면 모른다고 답하세요.
답변에는 근거가 된 조항 번호를 반드시 함께 적으세요. (예: "제11조 ③에 따르면 ...")

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


def search_keyword_docs(question: str, k: int = TOP_K) -> list[Document]:
    """OpenSearch의 match 쿼리로, 질문에 쓰인 단어가 그대로 등장하는 조각을 찾아온다 (BM25 스코어링).

    벡터 검색은 "의미가 비슷한 문장"을 잘 찾지만, 조항 번호나 특정 단어를 정확히 맞혀야 하는
    질문에는 오히려 약할 수 있다. 반대로 이 함수처럼 역색인 기반 키워드 검색은 정확한 단어
    매칭에 강하다. 개념과 numpy 기반 미니 구현은
    https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/04_rag_pipeline/04_rag_pipeline.ipynb
    실습 4를 참고.

    주의: 이 인덱스는 ingest.py가 만드는 기본 매핑을 그대로 쓰기 때문에, "text" 필드는
    OpenSearch의 기본(standard) 분석기로 색인된다. 한국어는 조사가 붙기 때문에 기본 분석기로는
    "제2조"는 잘 맞아도 "휴가를"/"휴가가"처럼 조사가 다르면 놓칠 수 있다. 실제 서비스에서는
    인덱스 매핑에 노리(Nori) 형태소 분석 플러그인을 적용하는 것이 정확도에 유리하다.
    """
    client = OpenSearch(OPENSEARCH_URL)
    body = {"size": k, "query": {"match": {"text": question}}}
    response = client.search(index=OPENSEARCH_INDEX, body=body)
    return [
        Document(page_content=hit["_source"]["text"], metadata=hit["_source"].get("metadata", {}))
        for hit in response["hits"]["hits"]
    ]


def reciprocal_rank_fusion(*ranked_lists: list[Document], k: int = 60) -> list[Document]:
    """벡터 검색 결과와 키워드 검색 결과를, 각각 몇 등이었는지(rank)만 보고 하나로 합친다 (RRF).

    두 검색은 점수의 스케일이 다르기 때문에(코사인 유사도 vs BM25) 점수를 직접 더하면 안 된다.
    `1 / (k + rank)`를 검색별로 더해서, 두 검색 모두에서 상위에 있던 문서일수록 높은 점수를 받게 만든다.
    """
    scores: dict[tuple, float] = {}
    doc_lookup: dict[tuple, Document] = {}
    for ranked in ranked_lists:
        for rank, doc in enumerate(ranked, start=1):
            # page_content만 키로 쓰면, 우연히 본문이 같은 서로 다른 문서(다른 source/page)가
            # 하나로 합쳐지면서 점수가 더 낮은 쪽 출처가 결과에서 통째로 사라질 수 있다.
            # source/page까지 함께 넣어야 "정말 같은 조각"만 병합된다.
            key = (doc.metadata.get("source"), doc.metadata.get("page"), doc.page_content)
            scores[key] = scores.get(key, 0.0) + 1.0 / (k + rank)
            doc_lookup[key] = doc
    fused = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    return [doc_lookup[key] for key, _score in fused]


_reranker = None  # 모델을 매번 새로 읽으면 느려서, 한 번 읽은 걸 여기에 담아둔다.


def _get_reranker():
    """리랭커 모델을 (처음 한 번만) 메모리에 올린다. 준비가 안 되면 None을 돌려준다.

    처음 실행할 때 모델 파일을 인터넷에서 내려받으므로 몇 분 걸릴 수 있고, 그 뒤로는 캐시를 쓴다.
    설치가 안 돼 있거나 다운로드에 실패해도 챗봇 자체는 돌아가야 하므로, 실패하면 None을 주고
    호출한 쪽이 리랭킹 없이 넘어가게 한다.
    """
    global _reranker
    if _reranker is None:
        # import를 함수 안에 둔 이유: sentence-transformers는 PyTorch를 함께 끌고 오는
        # 무거운 패키지라서, 리랭커를 안 쓰는 사람까지 실행 시작이 느려지면 안 되기 때문이다.
        from sentence_transformers import CrossEncoder

        _reranker = CrossEncoder(RERANKER_MODEL)
    return _reranker


def rerank(question: str, docs: list[Document], k: int = TOP_K) -> list[Document]:
    """검색으로 추린 후보들을 리랭커(cross-encoder)로 다시 줄 세워 상위 k개만 남긴다.

    왜 한 번 더 줄을 세울까? 검색에 쓴 임베딩과 리랭커는 계산 방식이 다르다.

      - 임베딩(bi-encoder): 질문과 문서를 **따로따로** 벡터로 바꿔서 거리를 잰다.
        문서 벡터는 미리 만들어둘 수 있어서 100만 건도 순식간에 훑는다. 대신 질문을
        보지 않은 채 만든 벡터라 "대충 이 근처" 수준의 정확도다.
      - 리랭커(cross-encoder): 질문과 문서를 **한 문장으로 붙여서** 모델에 통째로 넣고
        "이 둘이 얼마나 관련 있나"를 직접 점수로 뽑는다. 훨씬 정확하지만, 후보 하나하나
        모델을 돌려야 해서 느리다. 100만 건에는 못 쓴다.

    그래서 둘을 역할 분담시킨다. **빠른 검색으로 20개까지 좁히고, 정확한 리랭커로 4개를 고른다.**
    도서관에서 사서가 서가에서 관련 있어 보이는 책 20권을 뽑아온 뒤,
    실제로 목차를 펼쳐보고 진짜 필요한 4권을 고르는 것과 같다.

    실무에서 검색 품질을 끌어올릴 때 비용 대비 효과가 가장 큰 단계가 보통 여기다.
    바꾸기 전후로 evaluate.py를 돌려서 hit@5/MRR이 실제로 올라갔는지 확인해보면 좋다.
    """
    if not USE_RERANKER or not docs:
        return docs[:k]

    try:
        model = _get_reranker()
    except Exception as error:  # 미설치, 다운로드 실패 등
        print(f"[리랭커 건너뜀] {error}", file=sys.stderr)
        return docs[:k]

    # predict에 (질문, 문서) 쌍의 목록을 넘기면 쌍마다 관련도 점수가 나온다.
    pairs = [(question, doc.page_content) for doc in docs]
    scores = model.predict(pairs)

    ranked = sorted(zip(docs, scores), key=lambda pair: pair[1], reverse=True)
    return [doc for doc, _score in ranked[:k]]


def search_hybrid_docs(question: str, k: int = TOP_K) -> list[Document]:
    """벡터 검색 + 키워드 검색을 RRF로 합친 뒤 리랭킹까지 마친다. answer()가 쓰는 검색 방식.

    단계별로 개수가 이렇게 줄어든다:
        벡터 20 + 키워드 20  ->  RRF 병합 20  ->  리랭킹 후 4
    """
    vector_docs = search_similar_docs(question, k=RERANK_CANDIDATES)
    keyword_docs = search_keyword_docs(question, k=RERANK_CANDIDATES)
    fused = reciprocal_rank_fusion(vector_docs, keyword_docs)[:RERANK_CANDIDATES]
    return rerank(question, fused, k=k)


def format_citation(doc: Document) -> str:
    """조각 하나의 출처를 "취업규칙.txt 제11조 ③ (p.4)" 형태의 한 줄로 만든다.

    페이지 번호만 있던 예전 방식보다 조항 번호가 훨씬 쓸모 있다. 규정 문서를 다루는
    사람은 "4페이지"가 아니라 "제11조 ③항"으로 말하고, 개정판이 나오면 페이지는
    밀리지만 조항 번호는 그대로 남기 때문이다.

    ingest.py의 파서를 타지 않은 문서(조 표지가 없어 fallback으로 들어간 것)는
    article 메타데이터가 없으므로, 그때는 예전처럼 페이지만 보여준다.
    """
    source = doc.metadata.get("source", "?")
    page = doc.metadata.get("page", "?")
    article = doc.metadata.get("article")
    if not article:
        return f"{source} p.{page}"

    paragraph = doc.metadata.get("paragraph") or ""
    label = f"{article} {paragraph}".strip()
    return f"{source} {label} (p.{page})"


def build_prompt(question: str, docs) -> str:
    """찾아온 규정 조각들을 출처 표시와 함께 이어붙여 하나의 참고자료 텍스트로 만든다."""
    # 이렇게 출처를 남겨두면, 나중에 답변을 볼 때 "이 답은 취업규칙 제11조 내용이구나"처럼
    # 어디서 나온 정보인지 확인할 수 있어서 신뢰도가 높아져.
    context = "\n\n".join(f"[{format_citation(doc)}]\n{doc.page_content}" for doc in docs)
    return PROMPT_TEMPLATE.format(context=context, question=question)


def answer_with_docs(question: str, docs: list[Document]) -> str:
    """이미 찾아온 규정 조각(docs)을 근거로 답변만 생성한다.

    api.py처럼 출처 목록도 화면에 보여줘야 해서 검색 결과(docs)를 먼저 가지고 있는 경우,
    answer()를 그대로 쓰면 search_hybrid_docs()가 중복으로 한 번 더 실행된다.
    이 함수를 쓰면 검색은 한 번만 하고, 그 결과를 답변 생성에도 재사용할 수 있다.
    """
    prompt = build_prompt(question, docs)

    # temperature는 AI 답변의 "즉흥성"을 조절하는 다이얼이라고 생각하면 돼.
    # 값이 높을수록(예: 1에 가까울수록) 매번 조금씩 다르고 창의적인 답을 하고,
    # 0에 가까울수록 같은 질문엔 거의 항상 같은, 딱딱하고 일관된 답을 해.
    # 회사 규정처럼 "정확함"이 제일 중요한 곳에서는 창의성이 필요 없으니까 0으로 딱 고정해둔 거야.
    llm = ChatOpenAI(model=CHAT_MODEL, temperature=0)
    response = llm.invoke(prompt)
    return response.content


def answer(question: str) -> str:
    """질문 하나를 받아서 검색부터 답변 생성까지 전부 처리해주는 대표 함수."""
    docs = search_hybrid_docs(question)
    return answer_with_docs(question, docs)


if __name__ == "__main__":
    # 터미널에서 python src/query.py "질문 내용" 처럼 실행하면
    # sys.argv[1] 자리에 그 질문 문자열이 들어와.
    if len(sys.argv) < 2:
        print('사용법: python src/query.py "질문"')
        sys.exit(1)

    question = sys.argv[1]
    print(answer(question))
