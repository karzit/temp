"""PostgreSQL에 쌓인 원본 크롤링 데이터를 읽어오는 부분입니다.

crawl-storage-example이 만들어둔 crawled_documents 테이블의 원본을
모두 꺼내오는 역할을 합니다 (처리 여부를 구분하는 별도 플래그는 없습니다).
"""
from contextlib import closing
from dataclasses import dataclass

import psycopg2  # 참고 https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/01_web_crawling/01_web_crawling.ipynb (sqlite3로 같은 패턴 실습, psycopg2 비교 포함)

from config import DATABASE_URL

SELECT_ALL_SQL = """
SELECT id, url, content_type, text_content, binary_content
FROM crawled_documents
ORDER BY id;
"""


@dataclass
class RawDocument:
    """PostgreSQL에서 읽어온 원본 문서 한 건을 담는 상자입니다.

    dataclass를 쓰면 매번 "이 값은 뭐고 저 값은 뭐고"를 딕셔너리 키로 찾지 않고
    raw_doc.url, raw_doc.text_content 처럼 이름으로 바로 꺼내 쓸 수 있어 편합니다.
    """

    id: int
    url: str
    content_type: str  # 'html' 또는 'pdf'
    text_content: str | None  # str | None 문법은 Python 3.10+ 필요
    binary_content: bytes | None


def fetch_raw_documents() -> list[RawDocument]:
    """crawled_documents 테이블의 모든 행을 RawDocument 목록으로 가져옵니다."""
    # closing으로 감싼 이유: psycopg2의 `with conn:`은 트랜잭션만 끝내고 커넥션은 닫지 않습니다.
    # (crawl-storage-example/src/db.py의 get_connection() 주석에 자세히 설명해뒀습니다.)
    with closing(psycopg2.connect(DATABASE_URL)) as conn:
        with conn.cursor() as cur:
            cur.execute(SELECT_ALL_SQL)
            rows = cur.fetchall()

    return [
        RawDocument(
            id=row[0],
            url=row[1],
            content_type=row[2],
            text_content=row[3],
            binary_content=bytes(row[4]) if row[4] is not None else None,
        )
        for row in rows
    ]
