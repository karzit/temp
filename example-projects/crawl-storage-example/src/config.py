"""이 프로젝트에서 공통으로 쓰는 설정값 모음.

크롤러가 "어느 DB에 접속할지", "요청 사이에 얼마나 쉬어갈지"를 여기서 정해둔다.
"""
import os
from dotenv import load_dotenv

load_dotenv()

# PostgreSQL 접속 주소. "postgresql://아이디:비번@호스트:포트/DB이름" 형식이야.
# docker-compose.yml에 정의한 값과 짝이 맞아야 접속이 된다.
DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://rag_user:rag_pass@localhost:5432/rag_regulation"
)

# 왜 크롤링할 때 딜레이(대기 시간)를 둘까?
# 요청을 너무 빠르게 연속으로 보내면 상대 서버에 부담을 주고, 심하면 우리 IP가 차단될 수도 있어.
# 그래서 페이지 하나 요청하고 나면 잠깐 쉬었다가 다음 페이지를 요청하도록 예의를 지키는 거야.
CRAWL_DELAY_SECONDS = float(os.getenv("CRAWL_DELAY_SECONDS", "1.0"))
