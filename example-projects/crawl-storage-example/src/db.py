"""PostgreSQL과 대화하는 부분을 모아둔 파일.

크롤러(crawl.py)는 "무엇을 저장할지"만 신경 쓰고,
"어떻게 저장할지(SQL 문법 등)"는 이 파일한테 맡긴다. 이렇게 역할을 나누면
나중에 DB를 바꾸더라도 이 파일만 고치면 되니까 유지보수가 편해진다.
"""
import psycopg2

from config import DATABASE_URL

# 크롤링 결과를 담을 테이블.
#   - url: 어디서 가져온 데이터인지 (같은 URL을 중복 저장하지 않도록 UNIQUE로 막아둔다)
#   - content_type: 'html'(텍스트) 인지 'pdf'(이진 파일)인지 구분하는 표시
#   - text_content: HTML에서 뽑아낸 본문 텍스트 (PDF라면 비워둠)
#   - binary_content: PDF 원본 파일 그대로 (HTML이라면 비워둠). BYTEA는 "이진 데이터"를 담는 컬럼 타입.
#   - crawled_at: 언제 수집했는지 (같은 페이지를 다시 크롤링했을 때 최신 여부 확인용)
CREATE_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS crawled_documents (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL UNIQUE,
    content_type TEXT NOT NULL,
    text_content TEXT,
    binary_content BYTEA,
    crawled_at TIMESTAMP NOT NULL DEFAULT NOW()
);
"""

# url이 이미 있으면 새로 넣지 않고 내용만 덮어쓴다 (같은 페이지를 다시 크롤링한 경우 최신화).
# ON CONFLICT는 "이 값이 이미 있으면 어떻게 할지"를 정하는 PostgreSQL 문법이야.
UPSERT_SQL = """
INSERT INTO crawled_documents (url, content_type, text_content, binary_content, crawled_at)
VALUES (%s, %s, %s, %s, NOW())
ON CONFLICT (url) DO UPDATE SET
    content_type = EXCLUDED.content_type,
    text_content = EXCLUDED.text_content,
    binary_content = EXCLUDED.binary_content,
    crawled_at = NOW();
"""


def get_connection():
    """DB에 접속하는 연결 통로(connection)를 하나 만들어서 돌려준다."""
    return psycopg2.connect(DATABASE_URL)


def init_db():
    """테이블이 아직 없으면 새로 만든다. (이미 있으면 아무 일도 안 함 - IF NOT EXISTS 덕분)"""
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(CREATE_TABLE_SQL)
        conn.commit()


def save_document(url: str, content_type: str, text_content: str | None, binary_content: bytes | None):
    """크롤링한 문서 하나를 DB에 저장(또는 갱신)한다."""
    with get_connection() as conn:
        with conn.cursor() as cur:
            # psycopg2.Binary로 감싸줘야 파이썬의 bytes를 PostgreSQL의 BYTEA 컬럼에 넣을 수 있어.
            binary_param = psycopg2.Binary(binary_content) if binary_content is not None else None
            cur.execute(UPSERT_SQL, (url, content_type, text_content, binary_param))
        conn.commit()
