"""PostgreSQL과 대화하는 부분을 모아둔 파일입니다.

크롤러(crawl.py)는 "무엇을 저장할지"만 신경 쓰고,
"어떻게 저장할지(SQL 문법 등)"는 이 파일한테 맡깁니다. 이렇게 역할을 나누면
나중에 DB를 바꾸더라도 이 파일만 고치면 되니까 유지보수가 편해집니다.
"""
from contextlib import closing

import psycopg2  # 참고 https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/01_web_crawling/01_web_crawling.ipynb (sqlite3로 같은 패턴 실습, psycopg2 비교 포함)

from config import DATABASE_URL

# 크롤링 결과를 담을 테이블입니다.
#   - url: 어디서 가져온 데이터인지 (같은 URL을 중복 저장하지 않도록 UNIQUE로 막아둡니다)
#   - content_type: 'html'(텍스트) 인지 'pdf'(이진 파일)인지 구분하는 표시
#   - text_content: HTML에서 뽑아낸 본문 텍스트 (PDF라면 비워둠)
#   - binary_content: PDF 원본 파일 그대로 (HTML이라면 비워둠). BYTEA는 "이진 데이터"를 담는 컬럼 타입입니다.
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

# url이 이미 있으면 새로 넣지 않고 내용만 덮어씁니다 (같은 페이지를 다시 크롤링한 경우 최신화).
# ON CONFLICT는 "이 값이 이미 있으면 어떻게 할지"를 정하는 PostgreSQL 문법입니다.
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
    """DB에 접속하는 연결 통로(connection)를 하나 만들어서 돌려줍니다.

    주의: psycopg2에서 `with conn:` 블록은 **트랜잭션만** 끝내지 커넥션을 닫아주지 않습니다.
    (같은 커넥션으로 with 블록을 여러 번 쓸 수 있게 하려고 일부러 그렇게 설계된 동작입니다.)
    그래서 문서마다 커넥션을 새로 여는 이 코드에서 `with get_connection()`만 쓰면
    다 쓴 커넥션이 계속 열린 채 쌓여서, URL을 수십 개 돌리면 DB 접속 한도에 걸립니다.
    아래 함수들이 contextlib.closing으로 한 번 더 감싼 이유가 이것입니다
    (closing은 블록을 벗어날 때 close()를 확실히 호출해줍니다).
    """
    return psycopg2.connect(DATABASE_URL)


def init_db():
    """테이블이 아직 없으면 새로 만듭니다. (이미 있으면 아무 일도 안 함 - IF NOT EXISTS 덕분)"""
    # closing = 커넥션 닫기 담당, with conn = 커밋/롤백 담당. 역할이 서로 다르니 둘 다 필요합니다.
    with closing(get_connection()) as conn:
        with conn:
            with conn.cursor() as cur:
                cur.execute(CREATE_TABLE_SQL)


def save_document(url: str, content_type: str, text_content: str | None, binary_content: bytes | None):
    """크롤링한 문서 하나를 DB에 저장(또는 갱신)합니다."""
    with closing(get_connection()) as conn:
        with conn:  # 블록을 정상적으로 빠져나가면 자동 commit, 예외가 나면 자동 rollback
            with conn.cursor() as cur:
                # psycopg2.Binary로 감싸줘야 파이썬의 bytes를 PostgreSQL의 BYTEA 컬럼에 넣을 수 있습니다.
                binary_param = psycopg2.Binary(binary_content) if binary_content is not None else None
                cur.execute(UPSERT_SQL, (url, content_type, text_content, binary_param))
