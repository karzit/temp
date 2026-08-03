"""크롤링할 URL 목록입니다.

실제 프로젝트에서는 사내 인트라넷 규정 게시판, 법령 정보 사이트 등의 주소를 여기에 채워 넣으면 됩니다.
지금 기본값으로 넣어둔 곳은 `quotes.toscrape.com` — **크롤링 연습용으로 공개된 사이트**입니다.
01 크롤링 실습 노트북에서 쓰는 사이트와 같은 곳이라, 실습에서 손으로 해본 걸
그대로 이 예제로 이어서 돌려볼 수 있습니다.

왜 아무 사이트나 넣으면 안 되는가:
    남의 서버에 요청을 보내는 일이라 예의와 규칙이 있습니다. robots.txt로 수집을 막아둔
    곳이 있고, 이용약관에서 자동 수집을 금지하는 곳도 있습니다. 요청 간격 없이 퍼부으면
    상대 서버에 부담을 주고 차단당하기도 합니다. (그래서 crawl.py가 CRAWL_DELAY_SECONDS만큼
    쉬어갑니다.) toscrape.com은 애초에 "연습해도 되는 사이트"로 만들어져 공개된 곳이라
    마음 놓고 써도 됩니다.

주의: 여기서 긁어오는 건 규정 문서가 아니라 명언 모음입니다. 파이프라인이 실제로
도는지 확인하는 용도이고, 규정 질의응답을 보고 싶다면 rag-regulation-example의
`data/sample_regulation.txt`를 쓰면 됩니다 (최상위 README의 통합 실행 순서 참고).
"""

CRAWL_TARGETS = [
    "https://quotes.toscrape.com/",
    "https://quotes.toscrape.com/page/2/",
    "https://quotes.toscrape.com/tag/inspirational/",
    # "https://example.com/files/취업규칙.pdf",  # 이렇게 .pdf로 끝나는 링크는 PDF로 자동 판별됩니다.
]
