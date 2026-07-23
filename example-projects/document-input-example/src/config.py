"""이 프로젝트에서 공통으로 쓰는 설정값 모음."""
import os
from dotenv import load_dotenv  # 참고 https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/01_web_crawling/01_web_crawling.ipynb

load_dotenv()

OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
CHAT_MODEL = os.getenv("CHAT_MODEL", "gpt-4o-mini")

# 이 환경변수는 우리가 직접 읽지는 않지만, google-cloud-vision 라이브러리가
# 내부적으로 이 이름의 환경변수를 자동으로 찾아서 인증에 사용한다.
# load_dotenv()가 .env 파일 값을 환경변수로 등록해주기 때문에, import만 해도 인증 준비가 끝난다.
# GOOGLE_APPLICATION_CREDENTIALS=./google-vision-key.json
#
# 아래 검증이 없으면 이 값이 빠졌을 때 앱 실행 시점엔 아무 에러도 없다가, 사용자가 이미지를
# 업로드하고 "분석 시작"을 눌러야 ocr.py 안에서야 (그것도 알아보기 힘든 구글 SDK 에러 메시지로)
# 실패한다. OPENAI_API_KEY처럼 시작하자마자 바로 알아챌 수 있도록 여기서 미리 확인해둔다.
_GOOGLE_CREDENTIALS_PATH = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if not _GOOGLE_CREDENTIALS_PATH:
    raise RuntimeError(
        "GOOGLE_APPLICATION_CREDENTIALS 환경변수가 없습니다. .env에 Google Cloud Vision 서비스 계정 "
        "키 파일(json) 경로를 'GOOGLE_APPLICATION_CREDENTIALS=./google-vision-key.json' 형식으로 "
        "추가하세요. 발급 방법: https://cloud.google.com/vision/docs/setup"
    )
if not os.path.isfile(_GOOGLE_CREDENTIALS_PATH):
    raise RuntimeError(
        f"GOOGLE_APPLICATION_CREDENTIALS가 가리키는 파일을 찾을 수 없습니다: {_GOOGLE_CREDENTIALS_PATH}"
    )
