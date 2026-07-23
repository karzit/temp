"""이 프로젝트에서 공통으로 쓰는 설정값 모음.

crawl-storage-example의 config.py와 비슷하지만, 여기는 "원본을 어디서 읽어서(PostgreSQL)
어디에 검색용으로 저장할지(OpenSearch)"를 함께 다루기 때문에 두 시스템 주소가 모두 필요하다.
"""
import os
from dotenv import load_dotenv  # 참고 https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/01_web_crawling/01_web_crawling.ipynb

load_dotenv()

# 원본 데이터가 들어있는 PostgreSQL 주소. crawl-storage-example과 같은 DB를 가리켜야 한다.
DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://rag_user:rag_pass@localhost:5432/rag_regulation"
)

OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]

OPENSEARCH_URL = os.getenv("OPENSEARCH_URL", "http://localhost:9200")
OPENSEARCH_INDEX = os.getenv("OPENSEARCH_INDEX", "regulation-docs")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")
