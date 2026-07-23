"""targets.py에 적힌 URL들을 하나씩 방문해서 PostgreSQL에 저장하는 메인 스크립트.

동작 방식을 요약하면:
    1. URL이 .pdf로 끝나면 -> 파일을 통째로 다운로드해서 "이진 데이터"로 저장
    2. 그 외(보통 HTML 페이지)라면 -> BeautifulSoup으로 본문 텍스트만 뽑아내서 "텍스트"로 저장

비유하자면, 인터넷이라는 넓은 도서관을 돌아다니며 필요한 책(페이지)을 찾아서
사진을 찍거나(PDF는 그대로 복사) 내용을 옮겨 적어(HTML은 텍스트만 추출) 우리 창고(PostgreSQL)에 쌓는 일이다.

사용법:
    python src/crawl.py
"""
import time

import requests  # 참고 https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/01_web_crawling/01_web_crawling.ipynb
from bs4 import BeautifulSoup  # 참고 https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/01_web_crawling/01_web_crawling.ipynb

from config import CRAWL_DELAY_SECONDS
from db import init_db, save_document
from targets import CRAWL_TARGETS

# 일부 사이트는 "브라우저가 아닌 요청"을 차단하기도 해서, 브라우저인 척하는 헤더를 붙여준다.
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; regulation-crawler/1.0)"}


def fetch(url: str) -> requests.Response:
    """URL 하나에 접속해서 응답을 받아온다. 실패하면 예외를 던진다 (raise_for_status)."""
    response = requests.get(url, headers=HEADERS, timeout=10)
    response.raise_for_status()  # 200(성공)이 아니면 여기서 에러를 발생시켜 실패를 바로 알아챌 수 있게 한다.
    return response


def extract_text_from_html(html: str) -> str:
    """HTML 문서에서 사람이 읽는 "본문 글자"만 뽑아낸다.

    HTML에는 <script>(자바스크립트 코드)나 <style>(디자인 코드)처럼
    우리가 읽을 필요 없는 내용도 섞여 있어서, 이런 건 미리 제거하고 순수 텍스트만 남긴다.
    """
    soup = BeautifulSoup(html, "html.parser")

    for tag in soup(["script", "style"]):
        tag.decompose()  # decompose(): 태그와 그 안의 내용을 통째로 삭제

    # get_text()는 태그를 다 떼어내고 글자만 이어붙여준다.
    # separator="\n"으로 태그 경계마다 줄바꿈을 넣어서 문단 구분이 아예 사라지지 않게 한다.
    text = soup.get_text(separator="\n")

    # 빈 줄이 여러 개 겹치는 걸 정리 (각 줄의 앞뒤 공백 제거 + 빈 줄 제거)
    lines = [line.strip() for line in text.splitlines()]
    return "\n".join(line for line in lines if line)


def crawl_one(url: str) -> None:
    """URL 하나를 크롤링해서 DB에 저장하는 한 사이클."""
    print(f"크롤링 중: {url}")
    response = fetch(url)

    if url.lower().endswith(".pdf"):
        # PDF는 텍스트로 바꾸지 않고 원본 바이너리 그대로 저장한다.
        # (PDF 안의 글자를 뽑아내는 작업은 다음 단계인 preprocess-example의 몫이다)
        save_document(url=url, content_type="pdf", text_content=None, binary_content=response.content)
    else:
        text = extract_text_from_html(response.text)
        save_document(url=url, content_type="html", text_content=text, binary_content=None)


def main():
    init_db()  # 테이블이 없으면 먼저 만들어둔다.

    for url in CRAWL_TARGETS:
        try:
            crawl_one(url)
        except requests.RequestException as e:
            # 사이트 하나가 실패해도 전체 크롤링이 멈추지 않도록, 에러만 출력하고 다음 URL로 넘어간다.
            print(f"실패: {url} ({e})")

        # 다음 요청 전에 잠깐 쉬어서 상대 서버에 부담을 주지 않는다.
        time.sleep(CRAWL_DELAY_SECONDS)

    print("크롤링 완료")


if __name__ == "__main__":
    main()
