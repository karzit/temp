# 대체 가능한 기술 (참고용)

이 프로젝트는 `requests` + `beautifulsoup4` + `psycopg2-binary` 조합으로 만들어졌다.
아래는 같은 역할을 대신할 수 있는 다른 선택지들을 간단히 소개하는 문서다.
실습 코드는 그대로 두고, "이럴 때는 이런 대안도 있다" 정도만 참고하면 된다.

## 크롤링 (requests + beautifulsoup4)

| 대안 | 언제 고려하나 |
|---|---|
| `httpx` | requests와 API가 거의 같지만 비동기(async)를 지원. 크롤링 대상이 많아 동시 요청이 필요할 때 |
| `Scrapy` | 대량의 페이지를 체계적으로 수집해야 할 때. 재시도, 속도 제한, 파이프라인 등이 프레임워크에 내장 |
| `playwright` / `selenium` | 대상 사이트가 JavaScript로 콘텐츠를 그리는 경우 (requests로는 빈 HTML만 받아짐) |
| `lxml` | BeautifulSoup보다 파싱 속도가 중요할 때 (BeautifulSoup 내부 파서로도 쓸 수 있음) |

## 저장 (psycopg2-binary / PostgreSQL)

| 대안 | 언제 고려하나 |
|---|---|
| `psycopg3` (psycopg) | psycopg2의 후속 버전. 비동기 지원, 최신 파이썬 타입 힌트 지원 |
| `asyncpg` | 크롤링을 비동기로 돌리면서 DB 저장도 비동기로 맞추고 싶을 때 |
| `SQLAlchemy` | 테이블/쿼리를 ORM으로 다루고 싶을 때. 스키마 변경이 잦은 프로젝트에 유리 |

## 참고

- 이 문서는 실습 편의를 위한 안내이며, 실제 코드 마이그레이션은 다루지 않는다.
