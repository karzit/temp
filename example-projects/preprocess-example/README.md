# A파트-2 데이터 전처리 예시 (PostgreSQL Raw -> [청킹](../../glossary.md#chunking) -> [OpenSearch](../../glossary.md#opensearch))

[`../crawl-storage-example`](../crawl-storage-example)가 PostgreSQL에 쌓아둔 원본 데이터를 꺼내서,
500자 단위로 청킹하고 [임베딩](../../glossary.md#embedding)한 뒤 OpenSearch에 인덱싱하는 예시입니다.

용어가 낯설다면 **[../../glossary.md](../../glossary.md)**를 참고하세요.

> 📓 **이 프로젝트를 같이 읽어주는 노트북이 있습니다** —
> [`notebooks/project-walkthrough/02_preprocess`](../../notebooks/project-walkthrough/02_preprocess/02_preprocess.ipynb)
> 아래 코드를 한 줄씩 열어보며 "왜 이렇게 짰는지"를 따라갑니다.
> PostgreSQL·OpenSearch·API 키 없이 Colab에서 실행됩니다.

## 왜 필요한가?

PostgreSQL에 있는 원본은 "사람이 읽는 형태"일 뿐, AI 검색에 바로 쓸 수 있는 형태가 아닙니다.
- PDF는 아직 이진 파일 그대로라 글자를 꺼내야 합니다 (PyMuPDF 사용).
- HTML에서 뽑은 텍스트/PDF에서 뽑은 텍스트 모두, 문서 전체를 통째로 검색하기엔 너무 깁니다.
  그래서 작은 조각(청크)으로 잘라 임베딩해야 "질문과 관련된 부분만" 정확히 찾을 수 있습니다.

## 파이프라인

```
PostgreSQL (crawled_documents 테이블)
    -> content_type이 'pdf'면 PyMuPDF로 텍스트 추출, 'html'이면 저장된 text_content 그대로 사용
    -> 정규식으로 잡음(중복 공백, 과도한 줄바꿈, 반복 특수문자) 정리 (clean_text)
    -> LangChain [RecursiveCharacterTextSplitter](../../glossary.md#recursive-splitter)로 500자 청크 생성
    -> [형태소 분석](../../glossary.md#morphological-analysis)으로 청크별 대표 명사 추출해 metadata.keywords에 저장 (extract_keywords)
    -> OpenAIEmbeddings로 벡터 변환
    -> OpenSearch에 인덱싱 (rag-regulation-example의 ingest.py와 같은 인덱스로 합류)
```

`ingest.py`와 인덱스는 같지만 메타데이터는 다릅니다. `ingest.py`는 조 표지를 파싱하므로
`article`/`paragraph`/`page`를 남겨 출처를 "제11조 ③ (p.4)"로 찍을 수 있고, 이쪽은 조 구조가 없는
크롤링 문서라 `source`(URL)와 `keywords`만 남깁니다. 그래서 `query.py`가 이쪽 청크를 찾아오면
출처는 URL만 표시됩니다 (`format_citation`이 없는 항목은 빼고 찍습니다).

`metadata.keywords`는 저장만 하고 마는 값이 아닙니다. `rag-regulation-example`의
`search_keyword_docs()`가 본문(`text`)과 이 필드를 함께 검색합니다. 한국어 검색에서 이게 왜
도움이 되는지는 그 함수의 주석에 정리해뒀습니다.

> **단, 기본 크롤링 대상으로 돌리면 이 필드는 비어 있습니다(`[]`).** `crawl-storage-example`의
> 기본 타깃이 영어 사이트(quotes.toscrape.com)인데, `extract_keywords()`가 쓰는 Kiwi는 한국어
> 형태소 분석기라 영어 단어를 명사(NNG/NNP)로 잡지 않기 때문입니다. 오류가 아니라 "한국어
> 문서에만 듣는 장치"라는 뜻입니다. 값이 채워지는 걸 보고 싶다면 `targets.py`에 한국어 페이지를
> 하나 넣고 다시 돌려보세요.
>
> C경로(`ingest.py`)로 들어간 조항 청크에도 이 필드는 없습니다. 그래도 검색은 정상입니다 —
> `multi_match`는 없는 필드를 그냥 건너뛰므로, 그 문서들은 `text`로만 채점됩니다.

`clean_text()`와 `extract_keywords()`는 각각
[`02_text_chunking.ipynb`](../../notebooks/rag-pipeline-practice/02_text_chunking/02_text_chunking.ipynb)의
실습 8(정규식 정제), 실습 9(한국어 형태소 분석)와 같은 코드입니다.

## 1. 환경 준비

```bash
docker compose up -d   # OpenSearch 실행 (PostgreSQL은 crawl-storage-example 쪽에서 이미 떠 있어야 함)
pip install -r requirements.txt
cp .env.example .env   # DATABASE_URL, OPENAI_API_KEY 등 채워넣기
```

## 2. 실행

```bash
python src/preprocess.py
```

PostgreSQL의 `crawled_documents` 테이블에 있는 모든 문서를 순회하며 처리합니다.
문서 하나를 끝낼 때마다 몇 조각으로 잘렸는지 찍고, 마지막에 색인 결과를 알려줍니다.

```
https://quotes.toscrape.com/: 4 chunks
https://quotes.toscrape.com/page/2/: 8 chunks
https://quotes.toscrape.com/tag/inspirational/: 7 chunks
Indexed 19 chunks into 'regulation-docs'
```

조각 개수는 원문 길이에 따라 달라지니 숫자 자체보다 **대략 `(길이 - 75) ÷ 425`쯤 나오는지**를
보면 됩니다. 500이 아니라 425로 나누는 이유는 `CHUNK_OVERLAP`(75자) 때문입니다 — 조각 하나는
500자지만 다음 조각이 75자를 겹쳐서 시작하므로, 실제로는 425자씩 전진하며 잘립니다. 그래서
3400자쯤 되는 페이지가 7조각이 아니라 8조각이 됩니다.

여기서 말하는 "길이"는 [앞 단계에서 확인한](../crawl-storage-example/README.md) `chars`와 정확히
같지는 않습니다. `clean_text()`가 공백과 군더더기를 걷어내면서 글자가 줄고, 반대로 문단
경계(`\n\n`, `\n`)에서 잘린 조각은 500자를 다 못 채우기 때문에 개수가 조금 더 늘어납니다.
그러니 딱 맞아떨어지길 기대하지 말고 자릿수만 보세요 — 두 배 가까이 벌어진다면 그때가
청킹 설정이나 본문 추출을 의심할 지점입니다.

`건너뜀 (텍스트 없음): <url>`이 찍히는 문서도 있을 수 있습니다. 크롤링은 됐지만 본문이
비어 있는 경우(자바스크립트로 그리는 페이지, 글자가 없는 스캔 PDF 등)라, 오류가 아니라
정상적인 건너뛰기입니다.

## 3. OpenSearch에 들어갔는지 확인

```bash
curl "http://localhost:9200/regulation-docs/_count"
```

```json
{"count":19,"_shards":{"total":1,"successful":1,"skipped":0,"failed":0}}
```

`count`가 방금 찍힌 청크 수와 같으면 색인까지 끝난 것입니다. 조각이 실제로 어떻게 잘렸는지
눈으로 보고 싶다면 한 건만 꺼내봅니다 (출력이 길어서 `text`와 `metadata`만 골랐습니다).

```bash
curl "http://localhost:9200/regulation-docs/_search?size=1&_source=text,metadata"
```

`text`에 잘린 본문이, `metadata`에 출처 URL(`source`)이 들어 있으면 정상입니다.
`keywords`는 위에서 말했듯 기본 타깃(영어 사이트)에서는 `[]`로 비어 있는 게 정상입니다.

## 다음 단계

여기서 만들어진 OpenSearch 인덱스는 [`../rag-regulation-example`](../rag-regulation-example)의
`query.py`가 그대로 검색해서 쓸 수 있습니다 (같은 `OPENSEARCH_INDEX` 이름을 쓰면 됩니다).

## 다른 선택지가 궁금하다면

`langchain`/`PyMuPDF`/`opensearch-py` 대신 쓸 수 있는 라이브러리(`LlamaIndex`, `pdfplumber`,
`pgvector`, `Qdrant`, [Hugging Face](../../glossary.md#huggingface) `sentence-transformers` 등)와
언제 그걸 고려하면 좋을지는 [`ALTERNATIVES.md`](ALTERNATIVES.md)에 정리해두었습니다.
