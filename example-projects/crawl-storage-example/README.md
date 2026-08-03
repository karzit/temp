# A파트-1 수집/저장 예시 ([크롤링](../../glossary.md#crawling) -> [PostgreSQL](../../glossary.md#postgresql))

Web URL -> PostgreSQL 테이블에 텍스트/이진(PDF) 데이터를 저장하는 예시입니다.
전체 파이프라인 중 "재료를 모아서 창고에 쌓아두는" 첫 단계에 해당합니다.

이 프로젝트만 따로 보면 "웹사이트 몇 개를 긁어서 DB에 저장하는 작업"이 전부입니다.
[청킹](../../glossary.md#chunking)이나 [임베딩](../../glossary.md#embedding), 검색은 다음 단계인 `preprocess-example`이 담당합니다.

용어가 낯설다면 **[../../glossary.md](../../glossary.md)**를 참고하세요.

> 📓 **이 프로젝트를 같이 읽어주는 노트북이 있습니다** —
> [`notebooks/project-walkthrough/01_crawl_storage`](../../notebooks/project-walkthrough/01_crawl_storage/01_crawl_storage.ipynb)
> 아래 코드를 한 줄씩 열어보며 "왜 이렇게 짰는지"를 따라갑니다.
> PostgreSQL 없이 Colab에서 실행됩니다.

## 왜 크롤링한 걸 바로 OpenSearch에 넣지 않고 PostgreSQL을 거칠까?

- 크롤링은 네트워크 요청이 많고 느리고, 사이트가 막히거나 실패할 수도 있습니다.
  한 번 받아온 원본을 그대로 보관해두면, 청킹 방식을 나중에 바꾸더라도 크롤링을 다시 할 필요가 없습니다.
- [원본/가공본 분리](../../glossary.md#raw-vs-processed)해두면 문제가 생겼을 때 원인 추적이 쉽습니다.
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
cp .env.example .env   # DATABASE_URL, CRAWL_DELAY_SECONDS 등 확인/수정
```

## 2. 크롤링 대상 등록

`src/targets.py`에 크롤링할 URL 목록을 정의합니다.

기본값은 크롤링 연습용으로 공개된 사이트(`quotes.toscrape.com`)로 채워져 있어서, 그대로 두고
바로 실행해볼 수 있습니다. [01 크롤링 실습 노트북](../../notebooks/rag-pipeline-practice/01_web_crawling/01_web_crawling.ipynb)에서
쓰는 사이트와 같은 곳입니다. 실제 사내 규정 주소로 바꾸는 건 그다음입니다.

> 긁어오는 내용이 규정이 아니라 명언 모음이라는 점은 감안하세요. 여기서 확인하려는 건
> "파이프라인이 실제로 도는가"입니다. 규정 질의응답까지 보고 싶다면
> [`../rag-regulation-example`](../rag-regulation-example)이 자체 샘플 규정을 가지고 있습니다.

## 3. 실행

```bash
python src/crawl.py
```

성공하면 이렇게 나옵니다.

```
크롤링 중: https://quotes.toscrape.com/
크롤링 중: https://quotes.toscrape.com/page/2/
크롤링 중: https://quotes.toscrape.com/tag/inspirational/
크롤링 완료
```

URL 하나가 **네트워크 문제로** 실패해도 전체가 멈추지 않고 `실패: <url> (<사유>)`만 찍고 다음으로
넘어갑니다 ([crawl.py](src/crawl.py)의 `main()` 참고). 한 사이트가 막혔다고 나머지 수집까지
날아가면 곤란하기 때문입니다.

반대로 DB 접속 실패처럼 "계속 돌려봐야 소용없는" 오류는 잡지 않고 그대로 멈춥니다. 어차피
모든 URL이 똑같이 실패할 텐데 수십 번 더 시도해봐야 얻는 게 없으니까요. 그래서 `main()`이
크롤링을 시작하기 전에 `init_db()`를 먼저 호출합니다 — DB가 안 떠 있으면 남의 서버에 요청을
보내기도 전에 바로 알려주려는 것입니다.

## 4. DB에 실제로 들어갔는지 확인

화면에 "완료"가 떴다고 저장까지 됐다는 보장은 없으니, 창고를 직접 열어봅니다.

```bash
docker exec -it postgres-rag psql -U rag_user -d rag_regulation -c "SELECT id, content_type, length(text_content) AS chars, url FROM crawled_documents ORDER BY id;"
```

```
 id | content_type | chars |                      url
----+--------------+-------+------------------------------------------------
  1 | html         |  1700 | https://quotes.toscrape.com/
  2 | html         |  3500 | https://quotes.toscrape.com/page/2/
  3 | html         |  2900 | https://quotes.toscrape.com/tag/inspirational/
(3 rows)
```

`chars`(본문 글자수)는 사이트가 바뀌면 달라지니 정확한 숫자보다 **세 가지**만 보면 됩니다.

- 행이 URL 개수만큼 있는가 (빠진 게 있으면 그 URL이 실패한 것)
- `content_type`이 맞는가 (`.pdf` 링크를 넣었다면 그 행은 `pdf`여야 하고, `text_content`는 비어 있고 `binary_content`가 차 있어야 정상)
- 글자수가 0이 아닌가 (0이면 요청은 성공했지만 본문 추출이 실패한 것 — 자바스크립트로 본문을 그리는 사이트에서 흔합니다)

같은 URL로 `crawl.py`를 다시 돌려도 행이 늘지 않고 내용만 갱신됩니다
([db.py](src/db.py)의 `UPSERT_SQL`, `ON CONFLICT (url) DO UPDATE`).

## 다음 단계

여기서 저장한 원본 데이터는 [`../preprocess-example`](../preprocess-example)에서
꺼내어 청킹 -> 임베딩 -> OpenSearch 인덱싱까지 처리합니다.

## 다른 선택지가 궁금하다면

`requests`/`beautifulsoup4`/`psycopg2` 대신 쓸 수 있는 라이브러리(`httpx`, `Scrapy`, `SQLAlchemy` 등)와
언제 그걸 고려하면 좋을지는 [`ALTERNATIVES.md`](ALTERNATIVES.md)에 정리해두었습니다.
