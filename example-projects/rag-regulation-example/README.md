# 사내 규정 [RAG](../../glossary.md#rag) 예시 프로젝트

LangChain + OpenSearch + gpt-4o-mini 기반 규정 문서 검색/응답 예시.
200페이지 PDF 2건 기준 최소 구성으로 설계됨.

용어가 낯설다면 **[../../glossary.md](../../glossary.md)**를 참고하세요.

> 📓 **이 프로젝트를 같이 읽어주는 노트북이 있습니다** —
> [`notebooks/project-walkthrough/04_rag_regulation`](../../notebooks/project-walkthrough/04_rag_regulation/04_rag_regulation.ipynb)
> 아래 코드를 한 줄씩 열어보며 "왜 이렇게 짰는지"를 따라갑니다.
> OpenSearch·API 키 없이 Colab에서 실행됩니다.

## 파이프라인

```
PDF (2건, 200p) -> 구조 파싱 (장>절>조>항 트리, parse.py)
                 -> [청킹](../../glossary.md#chunking) (조 단위, 긴 조는 항 단위)
                 -> [임베딩](../../glossary.md#embedding) (text-embedding-3-small)
                 -> [OpenSearch](../../glossary.md#opensearch) 인덱싱 (knn_vector)
사용자 질문 -> [벡터 검색](../../glossary.md#vector-search) + 키워드 검색 -> RRF 병합 (20개)
           -> 리랭킹 (bge-reranker, 4개) -> [프롬프트 조립](../../glossary.md#prompt-assembly) -> gpt-4o-mini 응답
검색 품질 채점 -> evaluate.py (hit@5 / MRR / recall@5)
```

## 1. 환경 준비

```bash
docker compose up -d
pip install -r requirements.txt
cp .env.example .env   # OPENAI_API_KEY 채워넣기
```

OpenSearch 정상 기동 확인:

```bash
curl http://localhost:9200
```

## 2. PDF 배치

`data/pdfs/` 폴더에 규정 PDF 2개를 넣는다. (예: `data/pdfs/취업규칙.pdf`, `data/pdfs/복무규정.pdf`)

PDF가 아직 없다면 연습용으로 넣어둔 [`data/sample_regulation.txt`](data/sample_regulation.txt)를 그대로 써도 된다.
가상의 취업규칙 18개 조로, 아래 모든 명령을 이 파일 하나로 끝까지 따라 해볼 수 있다.

## 3. 구조 파싱 확인 (색인 전에)

색인하기 전에, 파서가 문서 구조를 제대로 읽었는지 먼저 눈으로 확인한다.
OpenSearch도 API 키도 필요 없다.

```bash
python src/parse.py data/sample_regulation.txt
```

```
조 18개를 찾았습니다.

  제1장 총칙 > 제1조(목적)  (84자)
  ...
  제3장 근무 > 제11조의2(원격근무 보안)  (99자)
  ...

[무결성 검증]
  ⚠️  제16조가 없습니다 (제15조 다음이 제17조).
```

**이 경고가 이 단계의 핵심이다.** PDF 텍스트 추출은 2단 조판이나 표 안에 들어간 조문에서
조용히 실패한다. 조 번호는 원래 1, 2, 3...으로 이어지므로, 끊긴 지점을 찾으면 추출이
실패했을 만한 위치를 알 수 있다. 검증하지 않으면 "그 조항만 유독 못 찾는" 챗봇이 그대로 배포된다.

(위 예시의 제16조는 검증이 실제로 동작하는 걸 보여주려고 샘플 파일에서 일부러 뺀 것이다.)

## 4. 인덱싱

```bash
python src/ingest.py data/sample_regulation.txt
```

`.pdf`를 넣으면 페이지별로 읽고, `.txt`를 넣으면 통째로 읽는다. 어느 쪽이든 그다음은 같다 —
`parse.py`로 조 단위로 자르고, 각 조각 앞에 계층 경로(`제3장 근무 > 제11조(재택근무)`)를
프리픽스로 붙여 색인한다.

**왜 1000자 고정 청킹을 그만뒀나.** 규정 문서에는 사람이 이미 정해둔 경계(조항)가 있는데,
자로 재서 1000자씩 자르면 이런 일이 생긴다.

```
청크 A: ...제11조(재택근무) ① 사원은 부서장의 승인을 받아 재택근무를 할 수 있다. ② 재택근무일의 소정근로시
청크 B: 간은 제9조 제2항을 준용한다. ③ 재택근무 중 발생한 연장근로에 대하여는 제12조에 따른 수당을 지급한다.
```

"재택근무 중 야근수당"의 답은 청크 B에 있는데, 청크 B에는 **"재택근무"라는 단어도, 조항 번호도 없다.**
검색에 안 걸리고, 걸려도 AI가 출처를 말해줄 수 없다. 조 단위로 자르고 계층 경로를 붙이면 둘 다 해결된다.

조가 900자(`MAX_ARTICLE_CHARS`)를 넘으면 그때만 항(①②③) 단위로 한 번 더 쪼갠다.
조 표지가 아예 없는 문서(안내문, 회의록 등)는 자동으로 기존 고정 길이 방식으로 넘어간다.

## 5. 질의응답

```bash
python src/query.py "재택근무 중에 야근하면 수당 받을 수 있나요?"
```

검색은 세 단계를 거친다.

1. **하이브리드 검색** — 벡터 검색(`search_similar_docs`)과 키워드 검색(`search_keyword_docs`)을
   [RRF](../../glossary.md#rrf)로 합쳐 후보 20개를 만든다. 벡터 검색만으로는 놓치기 쉬운
   정확한 단어·조항 번호 매칭을 키워드 검색이 보완해준다. 개념과 numpy 기반 미니 구현은
   [`04_rag_pipeline.ipynb`](../../notebooks/rag-pipeline-practice/04_rag_pipeline/04_rag_pipeline.ipynb) 실습 4~5에 있다.
2. **리랭킹** (`rerank`) — 후보 20개를 cross-encoder 모델에 넣어 다시 줄 세우고 상위 4개만 남긴다.
   임베딩은 질문과 문서를 *따로* 벡터로 만들어 비교하지만(빠르지만 대략적), 리랭커는 둘을
   *붙여서* 모델에 통째로 넣어 관련도를 직접 점수화한다(정확하지만 느림). 그래서
   **빠른 검색으로 20개까지 좁히고, 정확한 리랭커로 4개를 고르는** 역할 분담을 한다.
3. **프롬프트 조립** — 남은 조각을 출처와 함께 이어붙인다. 출처는 이제 페이지가 아니라
   조항 기준이다: `취업규칙.txt 제11조 ③ (p.4)`. 규정을 다루는 사람은 "4페이지"가 아니라
   "제11조 ③항"으로 말하고, 개정판이 나오면 페이지는 밀려도 조항 번호는 남기 때문이다.

리랭커는 첫 실행 때 모델(약 2GB)을 내려받는다. 없이 돌려보려면 `.env`에 `USE_RERANKER=false`.

## 6. 검색 품질 채점하기

여기까지 오면 청킹도 바꿨고, 하이브리드도 붙였고, 리랭커도 달았다.
그런데 **정말 좋아진 걸까?** 질문 몇 개 던져보고 "잘 나오네" 하는 걸로는 알 수 없다.

```bash
python src/evaluate.py
```

[`data/golden_set.json`](data/golden_set.json)에 적어둔 "이 질문에는 이 조항이 나와야 한다"
12문항으로 검색 방식 4가지를 채점해 비교한다.

```
검색 방식                 hit@5       MRR   recall@5
------------------------------------------------
벡터만                    ...       ...        ...
키워드만                  ...       ...        ...
하이브리드                ...       ...        ...
하이브리드+리랭크          ...       ...        ...

[놓친 질문]
  ...
```

- **hit@5** — 상위 5개 안에 정답 조항이 들어 있던 질문의 비율. 이게 낮으면 프롬프트를
  아무리 다듬어도 소용없다. 애초에 근거가 AI에게 안 넘어간 것이기 때문이다.
- **MRR** — 정답이 1등이면 1점, 2등이면 1/2점... 으로 매긴 평균. hit@5가 같아도 MRR이 높으면
  정답을 더 위쪽에 올려놨다는 뜻이다.
- **recall@5** — 답이 여러 조항에 걸친 질문에서, 그중 몇 개나 찾아왔는지.

점수보다 **[놓친 질문]** 목록이 더 쓸모 있을 때가 많다. "왜 이 질문만 안 될까"를 파고들면
청킹이나 프롬프트에서 고칠 거리가 나온다.

`MAX_ARTICLE_CHARS`(ingest.py)나 `RERANK_CANDIDATES`(query.py)를 바꾸고 다시 색인한 뒤
이 스크립트를 돌리면, 그 변경이 점수를 올렸는지 내렸는지 알 수 있다. **이 루프가 있어야
검색 품질 개선이 감이 아니라 작업이 된다.**

## 7. 웹 챗봇으로 실행하기

```bash
uvicorn src.api:app --reload
```

브라우저에서 http://localhost:8000 을 열면 `static/index.html` 채팅 화면이 뜬다. 입력한 질문은
`POST /chat`으로 전달되어 `search_hybrid_docs()`로 찾은 근거 조각을 `answer_with_docs()`에 넘겨 답변을
생성하고(검색은 한 번만 실행), 답변과 함께 근거가 된 조항의 출처(`제11조 ③ (p.4)` 형태)가
같이 표시된다. FastAPI로 API를 감싸고 그 위에 HTML/JS 화면을 얇게 얹는 구조는
[`04_rag_pipeline.ipynb`](../../notebooks/rag-pipeline-practice/04_rag_pipeline/04_rag_pipeline.ipynb) 실습 9에서 다룬다.

## 파일 구성

| 파일 | 하는 일 | 단독 실행 |
|---|---|---|
| `src/parse.py` | 장>절>조>항 구조 파싱, 조 번호 무결성 검증 | ✅ (외부 의존 없음) |
| `src/ingest.py` | 파싱 -> 조항 단위 청킹 -> 임베딩 -> 색인 | OpenSearch + API 키 필요 |
| `src/query.py` | 하이브리드 검색 -> 리랭킹 -> 답변 생성 | OpenSearch + API 키 필요 |
| `src/evaluate.py` | 골든셋으로 검색 방식 4종 채점 비교 | OpenSearch + API 키 필요 |
| `src/api.py` | `/chat` 엔드포인트 + 정적 화면 | 위와 동일 |
| `data/sample_regulation.txt` | 연습용 가상 취업규칙 18개 조 | — |
| `data/golden_set.json` | 평가용 정답지 12문항 | — |

## 예상 리소스 (문서 2건, 400페이지 규모)

- OpenSearch 단일 노드, RAM 2GB 내외로 충분
- 인덱스 크기: 원문 대비 임베딩(1536차원 float) 포함 수십 MB 수준
- 임베딩/생성 비용은 OpenAI API 종량 과금
- 리랭커는 로컬에서 도는 모델이라 과금은 없지만, 디스크 약 2GB와 질문당 수백 ms가 든다
  (GPU가 있으면 훨씬 빠르지만 CPU로도 이 규모에서는 충분하다)

## 다음 단계 (필요 시)

- **골든셋 늘리기**: 지금 12문항은 예시 수준이다. 실제로 쓰려면 30~50문항은 필요하고,
  사용자가 실제로 던진 질문을 모아서 채우는 게 가장 좋다.
- 한국어 형태소 분석기(노리 Nori) 플러그인을 OpenSearch 인덱스에 적용해 키워드 검색 정확도 개선
  (현재는 기본 분석기라 조사가 다르면 놓칠 수 있음 — `query.py`의 `search_keyword_docs` 주석 참고).
  적용 전후로 `evaluate.py`의 "키워드만" 행이 얼마나 올라가는지 보면 효과가 바로 보인다.
- **상호참조(xref) 확장**: 규정 조문은 "제12조에 따른 수당"처럼 서로를 참조한다. 제11조 ③항을
  찾았을 때 거기 언급된 제12조를 자동으로 함께 가져오면 답변이 완성된다.
  `parse.py`에 "제N조" 패턴을 뽑는 함수를 더하고, 검색 결과를 1홉 확장하는 방식.
- **표·수식**: 급여 기준표처럼 표로 된 조문은 지금 텍스트로 뭉개진다. `pdfplumber`로 표 구조를
  유지해 추출하는 경로가 따로 필요하다 ([ALTERNATIVES.md](ALTERNATIVES.md) 참고).
- **답변 채점(faithfulness)**: `evaluate.py`는 "근거를 찾아왔는가"까지만 잰다. "찾아온 근거대로
  답했는가"는 별도 평가가 필요하다. 답변과 근거를 LLM에게 같이 주고 판정시키는 방식이 흔하다.
- **보안**: `query.py`처럼 검색된 문서를 프롬프트에 그대로 이어붙이는 구조는 [프롬프트 인젝션/탈옥](../../glossary.md#prompt-injection)에 취약할 수 있다. PDF 안에 숨겨진 지시문이 실제로 어떻게 시스템 프롬프트를 무력화시키는지, 그리고 데이터/지시 분리·입력 가드레일로 어떻게 방어하는지는 [`notebooks/rag-pipeline-practice/05_prompt_injection_defense/`](../../notebooks/rag-pipeline-practice/05_prompt_injection_defense/05_prompt_injection_defense.ipynb)에서 실습해볼 수 있다.

## 다른 선택지가 궁금하다면

`langchain`/`opensearch-py`/`pypdf`/`openai` 대신 쓸 수 있는 라이브러리(`LlamaIndex`, `pgvector`,
`Qdrant`, `anthropic`, [Hugging Face](../../glossary.md#huggingface) `sentence-transformers` 등)와
언제 그걸 고려하면 좋을지는 [`ALTERNATIVES.md`](ALTERNATIVES.md)에 정리해두었다.
