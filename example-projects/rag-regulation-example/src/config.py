"""프로젝트에서 공통으로 쓰는 설정값들을 모아둔 파일.

먼저 이 프로젝트가 뭘 하는 건지 쉽게 설명하면 —

우리가 만드는 건 "회사 규정을 대신 찾아서 알려주는 챗봇"이야.
근데 ChatGPT 같은 AI(LLM)는 "회사 내부 규정 PDF"를 학습한 적이 없어서 그 내용을 몰라.
그래서 우리가 직접 규정 PDF를 미리 읽기 좋게 잘라서 저장해두고(ingest.py가 하는 일),
질문이 들어오면 그중 관련 있는 부분만 찾아서 AI에게 "이거 보고 답해줘"라고 알려주는 방식(query.py가 하는 일)을 쓸 거야.
이런 방식을 RAG(검색 증강 생성)라고 불러. "검색해서(Retrieval) 찾은 걸 더해서(Augmented) 답을 생성한다(Generation)"는 뜻.
쉽게 말하면 "오픈북 시험"이랑 비슷해. AI가 모든 걸 외우고 있지 않아도, 책(문서)을 펼쳐서 보여주면 그걸 보고 답할 수 있는 것처럼!
참고 https://python.langchain.com/docs/concepts/rag/
"""
import os
from dotenv import load_dotenv

# .env 파일은 비밀번호(API 키)처럼 코드에 직접 적으면 안 되는 값들을 따로 보관하는 파일이야.
# (깃허브 같은 곳에 실수로 올리면 안 되니까 코드와 분리해두는 것!)
# load_dotenv()는 .env 파일 안의 값들을 읽어서 우리 프로그램이 쓸 수 있게 만들어줘.
# 참고: https://pypi.org/project/python-dotenv/
load_dotenv()

# OpenAI를 쓰려면 필요한 "출입증" 같은 열쇠(API 키).
# os.environ["OPENAI_API_KEY"]는 .env에 이 값이 없으면 바로 에러를 내면서 멈춰.
# (없으면 아예 실행이 안 되는 게 맞는 값이라서 일부러 이렇게 엄격하게 만든 거야)
# 키 발급은 여기서: https://platform.openai.com/api-keys
OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]

# OpenSearch가 뭐냐면, 우리가 잘라놓은 규정 문서 조각들을 저장해두고
# "이 질문이랑 비슷한 내용 찾아줘"라고 하면 척척 찾아주는 검색 전용 데이터베이스야.
# 도서관 사서 같은 역할이라고 생각하면 돼. (docker-compose.yml로 내 컴퓨터에 띄워놓은 걸 쓰는 거야)
# os.getenv(키, 기본값)은 .env에 값이 없으면 기본값을 대신 써주는 함수.
# OpenSearch 벡터 검색이 궁금하면: https://opensearch.org/docs/latest/search-plugins/knn/index/
OPENSEARCH_URL = os.getenv("OPENSEARCH_URL", "http://localhost:9200")

# OpenSearch 안에서 규정 문서 조각들을 모아두는 "서랍 이름" 같은 거야. (엑셀의 시트 이름이라고 생각해도 됨)
OPENSEARCH_INDEX = os.getenv("OPENSEARCH_INDEX", "regulation-docs")

# 임베딩(embedding)이 뭔지 예를 들어볼게.
# "연차휴가"랑 "휴가 일수"는 사람이 보면 비슷한 말이지? 근데 컴퓨터는 글자만 봐서는 그걸 몰라.
# 그래서 문장을 숫자로 이루어진 좌표(예: [0.12, -0.5, 0.88, ...])로 바꿔주는 게 임베딩이야.
# 의미가 비슷한 문장일수록 이 좌표들이 지도 위에서 가까운 위치에 찍히게 돼.
# 그래서 "질문의 좌표"랑 "가까운 좌표"를 가진 문서 조각을 찾으면, 그게 곧 "비슷한 의미의 문서"인 거지.
# 이 변환 작업을 해주는 AI 모델 이름이 EMBEDDING_MODEL이야.
# 참고: https://platform.openai.com/docs/guides/embeddings
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")

# 규정 조각들을 찾은 다음, 그걸 읽고 사람이 이해할 수 있는 문장으로 "답변"을 만들어주는 AI 모델이야.
# 검색은 OpenSearch가, 최종 글쓰기는 이 채팅 모델이 담당한다고 보면 돼.
# 참고: https://platform.openai.com/docs/models
CHAT_MODEL = os.getenv("CHAT_MODEL", "gpt-4o-mini")
