"""이 프로젝트에서 공통으로 쓰는 설정값 모음."""
import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
CHAT_MODEL = os.getenv("CHAT_MODEL", "gpt-4o-mini")

# 이 환경변수는 우리가 직접 읽지는 않지만, google-cloud-vision 라이브러리가
# 내부적으로 이 이름의 환경변수를 자동으로 찾아서 인증에 사용한다.
# load_dotenv()가 .env 파일 값을 환경변수로 등록해주기 때문에, import만 해도 인증 준비가 끝난다.
# GOOGLE_APPLICATION_CREDENTIALS=./google-vision-key.json
