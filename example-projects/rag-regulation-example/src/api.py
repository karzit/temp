"""query.py의 answer()를 브라우저에서 호출할 수 있는 HTTP API로 감싸는 부분입니다.

query.py가 "터미널에서 질문 하나 던지고 답 받기"였다면,
이 파일은 그 기능을 웹 챗봇 화면(static/index.html)이 호출할 수 있는 API로 열어주는 역할입니다.

실행 (프로젝트 루트에서):
    uvicorn api:app --reload --app-dir src

    --app-dir이 필요한 이유: 이 파일은 `from query import ...`처럼 같은 폴더의 모듈을
    최상위 이름으로 불러옵니다. `python src/query.py`처럼 스크립트로 실행할 때는 파이썬이
    그 파일이 있는 src/를 자동으로 검색 경로에 넣어주지만, uvicorn으로 띄울 때는 그렇지 않아서
    `uvicorn src.api:app`이라고 하면 query를 못 찾고 ModuleNotFoundError가 납니다.
    --app-dir src가 그 검색 경로를 대신 넣어주는 옵션입니다.
    (src/ 안으로 이동해서 `uvicorn api:app --reload`로 띄워도 똑같이 동작합니다.)

브라우저에서 http://localhost:8000 접속하면 static/index.html이 뜨고,
거기서 입력한 질문이 POST /chat으로 전달되어 answer()가 처리합니다.
"""
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from query import answer_with_docs, format_citation, search_hybrid_docs

app = FastAPI(title="사내 규정 챗봇 API")

STATIC_DIR = Path(__file__).resolve().parent.parent / "static"
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    answer: str
    sources: list[str]


@app.get("/")
def index() -> FileResponse:
    return FileResponse(STATIC_DIR / "index.html")


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    # 화면에 출처도 같이 보여줘야 해서, 검색 결과(docs)를 먼저 받아온 뒤
    # 같은 docs를 answer_with_docs()에 넘겨 답변을 생성합니다 (검색은 한 번만 실행).
    docs = search_hybrid_docs(request.question)
    sources = [format_citation(doc) for doc in docs]
    reply = answer_with_docs(request.question, docs)
    return ChatResponse(answer=reply, sources=sources)
