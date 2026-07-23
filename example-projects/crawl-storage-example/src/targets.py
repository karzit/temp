"""크롤링할 URL 목록.

실제 프로젝트에서는 사내 인트라넷 규정 게시판, 법령 정보 사이트 등의 주소를 여기에 채워 넣으면 된다.
지금은 예시로 몇 개만 넣어뒀다.
"""

CRAWL_TARGETS = [
    "https://example.com/regulations/attendance",
    "https://example.com/regulations/leave-policy",
    # "https://example.com/files/취업규칙.pdf",  # 이렇게 .pdf로 끝나는 링크는 PDF로 자동 판별된다.
]
