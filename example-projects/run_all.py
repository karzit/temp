"""네 프로젝트를 순서대로 이어서 돌려보고, 막히면 어디서 막혔는지 알려준다.

README의 "전체를 이어서 한 번 실행해보기"를 그대로 실행하는 스크립트입니다.
순서를 외우기 위한 것이 아니라, **어느 단계에서 막혔는지 알려주기 위한 것**입니다.
프로젝트가 넷이라 "안 되는데요"의 원인이 크롤링인지, DB인지, 인덱싱인지,
API 키인지 구분하기 어렵습니다. 각 단계 뒤에서 실제로 데이터가 들어갔는지 확인합니다.

    python example-projects/run_all.py --check    # 지금 무엇이 준비됐는지만 진단
    python example-projects/run_all.py            # 진단 + 1 → 2 → 3 순서대로 실행

먼저 각 프로젝트의 `docker compose up -d`와 `cp .env.example .env`는 끝내둬야 합니다.
자세한 순서와 이유는 README.md의 "전체를 이어서 한 번 실행해보기"를 보세요.

B파트(`document-input-example`)는 Streamlit 화면에서 파일을 올리는 대화형이라
이 스크립트에서 실행하지 않습니다. 마지막에 실행 방법만 안내합니다.
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
A1, A2, C = "crawl-storage-example", "preprocess-example", "rag-regulation-example"
B = "document-input-example"

# Windows 기본 콘솔은 cp949라서 한글 외의 기호(—, ✗)에서 그대로 죽습니다.
# 출력만 UTF-8로 고정합니다.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def env_of(project: str) -> dict[str, str]:
    """프로젝트 폴더의 .env를 읽는다 (python-dotenv 없이 최소한만 파싱)."""
    values: dict[str, str] = {}
    path = HERE / project / ".env"
    if not path.exists():
        return values
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        values[k.strip()] = v.strip().strip('"').strip("'")
    return values


def opensearch(url: str, path: str) -> dict | None:
    try:
        with urllib.request.urlopen(f"{url.rstrip('/')}{path}", timeout=10) as r:
            return json.loads(r.read())
    except Exception:
        return None


def postgres_rows(database_url: str) -> int | None:
    """psycopg2가 있으면 원본 테이블의 행 수를 센다. 없으면 None."""
    try:
        import psycopg2
    except ImportError:
        return None
    try:
        with psycopg2.connect(database_url) as conn, conn.cursor() as cur:
            cur.execute("SELECT count(*) FROM documents")
            return cur.fetchone()[0]
    except Exception:
        return None


# ---------------------------------------------------------------- 진단
def diagnose() -> dict:
    """지금 무엇이 준비됐는지 확인하고 상태를 돌려준다."""
    print("=" * 62)
    print(" 준비 상태")
    print("=" * 62)

    state: dict = {}

    for project in (A1, A2, C, B):
        has_env = (HERE / project / ".env").exists()
        print(f"  .env  {project:<26} {'있음' if has_env else '없음 — cp .env.example .env'}")
        state[f"env:{project}"] = has_env

    db_url = env_of(A1).get("DATABASE_URL") or \
        "postgresql://rag_user:rag_pass@localhost:5432/rag_regulation"
    rows = postgres_rows(db_url)
    state["pg_rows"] = rows
    if rows is None:
        print(f"  DB    PostgreSQL                 확인 못 함 "
              f"(psycopg2 미설치이거나 접속 실패 — {db_url.split('@')[-1]})")
    else:
        print(f"  DB    PostgreSQL                 문서 {rows}건")

    os_url = env_of(A2).get("OPENSEARCH_URL") or env_of(C).get("OPENSEARCH_URL") \
        or "http://localhost:9200"
    index = env_of(A2).get("OPENSEARCH_INDEX") or env_of(C).get("OPENSEARCH_INDEX") \
        or "regulation-docs"
    state["os_url"], state["index"] = os_url, index

    if opensearch(os_url, "/") is None:
        print(f"  검색  OpenSearch                  응답 없음 ({os_url})"
              f" — preprocess-example에서 docker compose up -d")
        state["os_docs"] = None
    else:
        count = opensearch(os_url, f"/{index}/_count")
        n = count.get("count") if count else None
        state["os_docs"] = n
        print(f"  검색  OpenSearch                  "
              f"{'인덱스 ' + index + ' 없음 (아직 인덱싱 전)' if n is None else f'조각 {n}건 · 인덱스 {index}'}")

    # 두 프로젝트가 같은 인덱스를 가리켜야 A경로와 C경로가 합류한다.
    i2, i3 = env_of(A2).get("OPENSEARCH_INDEX"), env_of(C).get("OPENSEARCH_INDEX")
    if i2 and i3 and i2 != i3:
        print(f"\n  ! OPENSEARCH_INDEX가 서로 다릅니다 ({A2}={i2}, {C}={i3}).")
        print("    같은 인덱스를 가리켜야 A경로와 C경로가 한 곳으로 합류합니다.")

    key = env_of(C).get("OPENAI_API_KEY") or os.getenv("OPENAI_API_KEY", "")
    state["has_key"] = bool(key)
    print(f"  키    OPENAI_API_KEY             {'있음' if key else '없음 — 2·3단계는 실행되지 않습니다'}")
    print()
    return state


# ---------------------------------------------------------------- 실행
def run(project: str, args: list[str], title: str) -> bool:
    print("-" * 62)
    print(f" {title}")
    print(f" $ cd {project} && python {' '.join(args)}")
    print("-" * 62)
    result = subprocess.run([sys.executable, *args], cwd=HERE / project)
    if result.returncode != 0:
        print(f"\n  ✗ {title} 실패 (종료 코드 {result.returncode})")
        print(f"    자세한 원인은 {project}/README.md를 보세요.")
        return False
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="진단만 하고 끝낸다")
    opts = parser.parse_args()

    state = diagnose()
    if opts.check:
        return 0

    if not state["has_key"]:
        print("OPENAI_API_KEY가 없어 임베딩과 답변 생성을 할 수 없습니다.")
        print(f"{A2}/.env 와 {C}/.env 에 키를 넣고 다시 실행하세요.")
        print("키 없이 구조만 보고 싶다면 notebooks/project-walkthrough/ 쪽이 맞습니다.")
        return 1

    # 1) A-1 크롤링 → PostgreSQL
    if not run(A1, ["src/crawl.py"], "1) A-1  웹 크롤링 → PostgreSQL"):
        return 1
    rows = postgres_rows(env_of(A1).get("DATABASE_URL", ""))
    print(f"\n  → PostgreSQL 문서 {rows}건" if rows is not None
          else "\n  → 저장 결과는 psycopg2가 없어 확인하지 못했습니다 (크롤링 자체는 성공)")

    # 2) A-2 청킹 → OpenSearch
    if not run(A2, ["src/preprocess.py"], "2) A-2  청킹(500자) → OpenSearch 인덱싱"):
        return 1
    after_a = opensearch(state["os_url"], f"/{state['index']}/_count")
    n_a = after_a.get("count") if after_a else 0
    print(f"\n  → 인덱스 {state['index']}에 조각 {n_a}건")
    if not n_a:
        print("  ✗ 인덱싱은 끝났는데 조각이 0건입니다. 1단계에서 저장된 원본이 있는지 확인하세요.")
        return 1

    # 3) C 같은 인덱스에 규정 문서를 더 넣고 질문
    if not run(C, ["src/ingest.py", "data/sample_regulation.txt"],
               "3) C  같은 인덱스에 규정 문서 추가 (C경로)"):
        return 1
    after_c = opensearch(state["os_url"], f"/{state['index']}/_count")
    n_c = after_c.get("count") if after_c else 0
    print(f"\n  → 조각 {n_a}건 → {n_c}건 (C경로로 {n_c - n_a}건 추가)")

    for question in [
        "세상을 바꾸는 것에 대해 아인슈타인이 한 말이 있나요?",   # A경로 데이터가 답해야 한다
        "재택근무 중에 야근하면 수당 받을 수 있나요?",            # C경로 데이터가 답해야 한다
    ]:
        if not run(C, ["src/query.py", question], f"질문: {question}"):
            return 1

    print("=" * 62)
    print(" 끝났습니다. 방금 확인한 것")
    print("=" * 62)
    print(f"  출처가 다른 두 데이터(웹 명언 {n_a}건 + 규정 파일 {n_c - n_a}건)가")
    print(f"  같은 인덱스 '{state['index']}'에 들어가 있고,")
    print("  query.py는 어느 쪽에서 왔는지 신경 쓰지 않고 질문에 맞는 쪽을 찾아왔습니다.")
    print()
    print("  답변이 어느 쪽 데이터에서 나왔는지 출처까지 보려면:")
    print(f"    cd {C} && uvicorn api:app --reload --app-dir src   # http://localhost:8000")
    print()
    print(f"  B파트는 화면에서 파일을 올리는 대화형이라 여기서 실행하지 않았습니다:")
    print(f"    cd {B} && streamlit run src/app.py")
    print("    거기서 나온 JSON의 keywords를 위 질문 자리에 넣으면 B → C 흐름이 됩니다.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
