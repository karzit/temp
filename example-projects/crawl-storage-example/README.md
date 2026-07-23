# A파트-1 수집/저장 예시 ([크롤링](../../glossary.md#crawling) -> [PostgreSQL](../../glossary.md#postgresql))

Web URL -> PostgreSQL 테이블에 텍스트/이진(PDF) 데이터를 저장하는 예시.
전체 파이프라인 중 "재료를 모아서 창고에 쌓아두는" 첫 단계에 해당한다.

이 프로젝트만 따로 보면 "웹사이트 몇 개를 긁어서 DB에 저장하는 작업"이 전부다.
[청킹](../../glossary.md#chunking)이나 [임베딩](../../glossary.md#embedding), 검색은 다음 단계인 `preprocess-example`이 담당한다.

용어가 낯설다면 **[../../glossary.md](../../glossary.md)**를 참고하세요.

## 왜 크롤링한 걸 바로 OpenSearch에 넣지 않고 PostgreSQL을 거칠까?

- 크롤링은 네트워크 요청이 많고 느리고, 사이트가 막히거나 실패할 수도 있다.
  한 번 받아온 원본은 그대로 보관해두면, 청킹 방식을 나중에 바꾸더라도 크롤링을 다시 할 필요가 없다.
- [원본/가공본 분리](../../glossary.md#raw-vs-processed)해두면 문제가 생겼을 때 원인 추적이 쉽다.
  (예: "검색이 이상해" -> 원본 자체가 깨졌는지, 청킹/임베딩 과정이 잘못됐는지 구분 가능)

## 파이프라인

```
크롤링 대상 URL 목록 -> requests로 페이지/파일 요청
                     -> BeautifulSoup으로 HTML 파싱 (본문 텍스트 추출)
                     -> (PDF 링크면) 바이너리 그대로 다운로드
                     -> PostgreSQL에 원본 저장 (crawled_documents 테이블)
```

## 1. 환경 준비

```bash
docker compose up -d
pip install -r requirements.txt
cp .env.example .env   # DATABASE_URL 등 확인/수정
```

## 2. 크롤링 대상 등록

`src/targets.py`에 크롤링할 URL 목록을 정의한다.

## 3. 실행

```bash
python src/crawl.py
```

## 다음 단계

여기서 저장한 원본 데이터는 [`../preprocess-example`](../preprocess-example)에서
꺼내어 청킹 -> 임베딩 -> OpenSearch 인덱싱까지 처리한다.

## 다른 선택지가 궁금하다면

`requests`/`beautifulsoup4`/`psycopg2` 대신 쓸 수 있는 라이브러리(`httpx`, `Scrapy`, `SQLAlchemy` 등)와
언제 그걸 고려하면 좋을지는 [`ALTERNATIVES.md`](ALTERNATIVES.md)에 정리해두었다.
