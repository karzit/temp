"""검색이 실제로 잘 되고 있는지 점수로 재는 스크립트입니다 (평가 하네스).

여기까지 오면 이런 상태입니다. 청킹 방식도 바꿔봤고, 하이브리드 검색도 붙였고, 리랭커도 달았습니다.
그런데 **정말 좋아진 걸까요?** 질문 몇 개 던져보고 "오, 잘 나오네" 하는 걸로는 알 수 없습니다.
어제 잘 되던 질문이 오늘 안 되는 것도 눈치채지 못합니다.

그래서 필요한 것이 이것입니다. 정답지(골든셋)를 미리 만들어두고, 설정을 바꿀 때마다
**같은 질문 세트로 채점해서 숫자를 비교**하는 것입니다. 학습할 때 문제집을 풀고 채점하는 것과 같습니다.

이 스크립트가 재는 지표 두 개:

    hit@k   상위 k개 안에 정답 조항이 하나라도 들어 있던 질문의 비율입니다.
            "AI에게 넘길 4개 안에 근거가 들어는 갔나?"를 봅니다. 이게 낮으면
            프롬프트를 아무리 다듬어도 소용없습니다. 애초에 자료가 안 들어간 것이니까요.

    MRR     정답이 몇 등으로 나왔는지를 점수로 바꾼 것입니다. 1등이면 1점, 2등이면 1/2점,
            3등이면 1/3점... 이렇게 매기고 전체 질문에 대해 평균 냅니다.
            hit@5가 같아도 MRR이 높으면 "정답을 더 위쪽에 올려놨다"는 뜻입니다.
            (Mean Reciprocal Rank, 평균 역순위)

실행하면 검색 방식 4가지를 같은 질문으로 돌려서 표로 비교해줍니다:

    python src/evaluate.py

주의: 리랭커 열은 모델을 내려받아야 해서 처음엔 오래 걸립니다.
      빼고 돌리려면 .env에 USE_RERANKER=false를 적으면 됩니다.
"""
import json
import sys
from pathlib import Path

from langchain_core.documents import Document

from query import (
    RERANK_CANDIDATES,
    reciprocal_rank_fusion,
    rerank,
    search_keyword_docs,
    search_similar_docs,
)

GOLDEN_SET_PATH = Path(__file__).resolve().parent.parent / "data" / "golden_set.json"

# 몇 등까지를 "찾았다"고 볼 것인지 정하는 값입니다. 5로 두는 게 관행인데, 이유는 실용적입니다.
# 보통 AI에게 4~5개 조각을 넘기니까, 상위 5개 안에 정답이 있으면 답변이 가능하다는 뜻이 됩니다.
K = 5


def load_golden_set() -> list[dict]:
    """정답지 파일을 읽어옵니다."""
    data = json.loads(GOLDEN_SET_PATH.read_text(encoding="utf-8"))
    return data["questions"]


def hit_and_rank(docs: list[Document], gold_articles: list[str]) -> tuple[bool, int]:
    """검색 결과에서 정답 조항이 몇 등에 처음 나왔는지 찾습니다.

    반환값은 (맞췄는지, 몇 등인지)입니다. 못 찾았으면 (False, 0)입니다.

    같은 조가 여러 조각으로 나뉘어 있어도(①②③) 조 번호가 같으면 같은 정답으로 칩니다.
    사람이 "제12조를 찾아왔네"라고 판단하는 기준과 맞추기 위해서입니다.
    """
    for rank, doc in enumerate(docs, start=1):
        if doc.metadata.get("article") in gold_articles:
            return True, rank
    return False, 0


def recall_at_k(docs: list[Document], gold_articles: list[str]) -> float:
    """정답 조항이 여러 개일 때, 그중 몇 퍼센트를 찾아왔는지 재는 지표입니다.

    "집에서 일하는 날 몇 시간 일하나요?"처럼 제11조와 제9조를 둘 다 봐야 답이 되는
    질문에서, 하나만 찾아온 것과 둘 다 찾아온 것을 구분하기 위해 필요합니다.
    """
    found = {doc.metadata.get("article") for doc in docs} & set(gold_articles)
    return len(found) / len(gold_articles)


# ---------------------------------------------------------------------------
# 비교할 검색 방식 4가지
# ---------------------------------------------------------------------------
# 각 함수는 "질문을 받아서 문서 목록을 돌려준다"는 같은 모양이라, 아래 run_evaluation이
# 똑같은 방식으로 채점할 수 있습니다. 새 검색 방식을 시험해보고 싶으면 이 모양에 맞춰
# 함수를 하나 더 만들고 STRATEGIES에 추가하면 됩니다.


def strategy_vector(question: str) -> list[Document]:
    """벡터 검색만 씁니다 (의미가 비슷한 것)."""
    return search_similar_docs(question, k=K)


def strategy_keyword(question: str) -> list[Document]:
    """키워드 검색만 씁니다 (단어가 그대로 나오는 것)."""
    return search_keyword_docs(question, k=K)


def strategy_hybrid(question: str) -> list[Document]:
    """벡터 + 키워드를 RRF로 합칩니다 (리랭킹 없음)."""
    vector_docs = search_similar_docs(question, k=RERANK_CANDIDATES)
    keyword_docs = search_keyword_docs(question, k=RERANK_CANDIDATES)
    return reciprocal_rank_fusion(vector_docs, keyword_docs)[:K]


def strategy_hybrid_rerank(question: str) -> list[Document]:
    """하이브리드 + 리랭커입니다 (query.py가 실제로 쓰는 방식)."""
    vector_docs = search_similar_docs(question, k=RERANK_CANDIDATES)
    keyword_docs = search_keyword_docs(question, k=RERANK_CANDIDATES)
    fused = reciprocal_rank_fusion(vector_docs, keyword_docs)[:RERANK_CANDIDATES]
    return rerank(question, fused, k=K)


STRATEGIES = {
    "벡터만": strategy_vector,
    "키워드만": strategy_keyword,
    "하이브리드": strategy_hybrid,
    "하이브리드+리랭크": strategy_hybrid_rerank,
}


def run_evaluation(questions: list[dict], search_fn) -> dict:
    """질문 목록을 하나씩 검색해보고 지표를 계산합니다."""
    hits = 0
    reciprocal_ranks = 0.0
    recalls = 0.0
    misses: list[str] = []

    for item in questions:
        docs = search_fn(item["question"])
        found, rank = hit_and_rank(docs, item["articles"])

        if found:
            hits += 1
            reciprocal_ranks += 1 / rank
        else:
            misses.append(item["question"])
        recalls += recall_at_k(docs, item["articles"])

    total = len(questions)
    return {
        f"hit@{K}": hits / total,
        "MRR": reciprocal_ranks / total,
        f"recall@{K}": recalls / total,
        "misses": misses,
    }


def main() -> None:
    questions = load_golden_set()
    print(f"골든셋 {len(questions)}문항으로 검색 방식 {len(STRATEGIES)}가지를 비교합니다.\n")

    results: dict[str, dict] = {}
    for name, search_fn in STRATEGIES.items():
        print(f"  {name} 실행 중...", file=sys.stderr)
        results[name] = run_evaluation(questions, search_fn)

    # 표로 출력
    header = f"{'검색 방식':<20}{f'hit@{K}':>10}{'MRR':>10}{f'recall@{K}':>12}"
    print(header)
    print("-" * len(header))
    for name, scores in results.items():
        print(
            f"{name:<20}{scores[f'hit@{K}']:>10.3f}{scores['MRR']:>10.3f}"
            f"{scores[f'recall@{K}']:>12.3f}"
        )

    # 못 찾은 질문은 따로 보여줍니다. 점수보다 이게 더 쓸모 있을 때가 많습니다.
    # "왜 이 질문만 안 될까"를 파고들면 청킹이나 프롬프트에서 고칠 거리가 나옵니다.
    print("\n[놓친 질문]")
    for name, scores in results.items():
        if scores["misses"]:
            print(f"  {name}:")
            for question in scores["misses"]:
                print(f"    - {question}")
        else:
            print(f"  {name}: 없음")

    print(
        "\n힌트: ingest.py의 MAX_ARTICLE_CHARS나 query.py의 RERANK_CANDIDATES를 바꾸고"
        "\n      다시 색인한 뒤 이 스크립트를 돌리면, 그 변경이 점수를 올렸는지 내렸는지 알 수 있습니다."
    )


if __name__ == "__main__":
    main()
