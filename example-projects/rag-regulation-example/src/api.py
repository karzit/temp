"""query.py의 answer()를 브라우저에서 호출할 수 있는 HTTP API로 감싸는 부분.

query.py가 "터미널에서 질문 하나 던지고 답 받기"였다면,
이 파일은 그 기능을 웹 챗봇 화면(static/index.html)이 호출할 수 있는 API로 열어주는 역할이야.

실행:
    uvicorn src.api:app --reload
    (프로젝트 루트에서 실행. src/ 안에서 실행하려면 `uvicorn api:app --reload`)

브라우저에서 http://localhost:8000 접속하면 static/index.html이 뜨고,
거기서 입력한 질문이 POST /chat으로 전달돼서 answer()가 처리해.
"""
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from query import answer_with_docs, search_hybrid_docs

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
    # 같은 docs를 answer_with_docs()에 넘겨 답변을 생성한다 (검색은 한 번만 실행).
    docs = search_hybrid_docs(request.question)
    sources = [f"{doc.metadata.get('source', '?')} p.{doc.metadata.get('page', '?')}" for doc in docs]
    reply = answer_with_docs(request.question, docs)
    return ChatResponse(answer=reply, sources=sources)
