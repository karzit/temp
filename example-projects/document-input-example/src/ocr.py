"""서류 사진(이미지)에서 글자를 읽어내는 OCR(광학 문자 인식) 부분.

OCR이 뭐냐면, 사진 속에 있는 "그림처럼 생긴 글자"를 컴퓨터가 실제로 읽고 쓸 수 있는
"텍스트 데이터"로 바꿔주는 기술이야. 우리 눈으로 사진을 보고 글자를 읽는 것처럼,
Google Vision이라는 AI가 사진을 보고 대신 글자를 읽어주는 것.

주의: OCR 결과는 완벽하지 않다. 사진이 흐릿하거나 손글씨가 섞여있으면
오타나 이상한 기호가 섞여 나올 수 있다. 그래서 다음 단계(structurer.py)에서
AI가 한 번 더 "이 오타 섞인 글을 정리해줘"라는 작업을 거치게 된다.
"""
from google.cloud import vision  # 참고 https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/03_document_structuring/03_document_structuring.ipynb (Vision API 호출은 다루지 않지만 OCR 개념과 다음 단계인 구조화를 실습)

# config를 import하기만 해도 .env의 GOOGLE_APPLICATION_CREDENTIALS 값이 로드된다.
import config  # noqa: F401  (환경변수 로딩을 위해 import만 하고 직접 쓰지는 않음)


def extract_text_from_image(image_bytes: bytes) -> str:
    """이미지 파일의 바이트 데이터를 받아서, 그 안에 있는 글자를 텍스트로 뽑아낸다."""
    # ImageAnnotatorClient: Google Vision API에 "이 사진 좀 분석해줘"라고 요청을 보내는 창구.
    client = vision.ImageAnnotatorClient()
    image = vision.Image(content=image_bytes)

    # document_text_detection: 사진, 스캔본처럼 문서 형태의 이미지에서 글자를 읽을 때 쓰는 기능.
    # (사진 속 간판 글씨 하나 인식하는 것과, 문서 전체의 문단을 읽는 것은 다른 기능이라 이 쪽을 사용)
    response = client.document_text_detection(image=image)

    if response.error.message:
        # API가 에러를 알려주면 그대로 파이썬 예외로 바꿔서 우리 코드에서 처리할 수 있게 한다.
        raise RuntimeError(f"Google Vision OCR 오류: {response.error.message}")

    # full_text_annotation.text 안에 사진 전체에서 읽어낸 글자가 하나의 문자열로 들어있다.
    return response.full_text_annotation.text
