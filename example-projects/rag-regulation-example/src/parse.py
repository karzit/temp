"""규정 문서의 텍스트를 "장 -> 절 -> 조 -> 항" 계층 트리로 파싱하는 부분입니다.

ingest.py가 원래 하던 일은 "1000자씩 뚝뚝 자르기"였습니다. 그런데 규정 문서에는
사람이 이미 정해둔 자연스러운 경계가 있습니다. 바로 **조항**입니다.

왜 이게 중요한지 예를 들어보겠습니다. "재택근무 중 연장근로 수당은 어떻게 되나요?"라는
질문의 답은 제11조 ③항에 있습니다. 그런데 1000자로 자르면 이런 일이 생깁니다:

    청크 A: "...제10조(휴게) ... 제11조(재택근무) ① 사원은 부서장의 승인을 받아
             주 2일의 범위에서 재택근무를 할 수 있다. ② 재택근무일의 소정근로시"
    청크 B: "간은 제9조 제2항을 준용한다. ③ 재택근무 중 발생한 연장근로에 대하여는..."

답이 청크 B에 있는데, 청크 B만 읽으면 이게 **무슨 조항인지 알 수가 없습니다**.
"제11조 재택근무"라는 제목이 청크 A에 있기 때문입니다. 검색도 안 잡히고, 잡혀도
AI가 출처를 "제11조 ③항"이라고 말해줄 수가 없습니다.

그래서 이 파일이 하는 일:
    1. 텍스트에서 "제1장", "제2절", "제11조(재택근무)", "①" 같은 표지를 찾아냅니다
    2. 각 조가 어느 장/절에 속하는지 계층 경로를 만듭니다
       -> "제3장 근무 > 제11조(재택근무)"
    3. 조 단위로 자르되, 조가 너무 길면 항(①②③) 단위로 한 번 더 자릅니다
    4. 각 조각 앞에 계층 경로를 붙여줍니다 (프리픽스)
       -> 조각만 따로 떼어놔도 "이게 어디 얘기인지" 알 수 있게

비유하자면, 1000자 청킹이 "책을 자로 재서 똑같은 길이로 찢는 것"이라면
이건 "목차를 보고 절 단위로 뜯어서, 각 장에 포스트잇으로 제목을 붙여두는 것"입니다.

단독 실행해서 결과를 눈으로 확인할 수 있습니다:
    python src/parse.py data/sample_regulation.txt
"""
from __future__ import annotations

import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

# ---------------------------------------------------------------------------
# 1. 표지(heading)를 찾아내는 정규식들
# ---------------------------------------------------------------------------
# 규정 문서는 형식이 꽤 정해져 있어서, 정규식만으로도 상당히 정확하게 잡힙니다.
# LLM에게 구조를 파악시키는 방법도 있지만(03 노트북의 정형 출력처럼), 조 번호처럼
# "틀리면 안 되는" 정보는 규칙 기반이 더 안전하고 비용도 0입니다.
#
# 정규식이 낯설다면 02 노트북 실습 8(정규식으로 텍스트 정제하기)을 먼저 보면 좋습니다.

# "제1장 총칙", "제2절 인사이동" 처럼 조보다 상위인 구분 단위입니다.
# 편/장/절/관 순서로 좁아집니다. 문서에 따라 일부만 쓰기도 합니다.
SECTION_RE = re.compile(r"^제\s*(\d+)\s*(편|장|절|관)\s*(.*)$")

# "제11조(재택근무)", "제11조의2(원격근무 보안)" 처럼 조 표지입니다.
#   - (\d+)      -> 조 번호 (11)
#   - (?:의\s*(\d+))?  -> "의2" 같은 가지번호. 없을 수도 있어서 ? 를 붙였습니다.
#   - \(([^)]*)\)      -> 괄호 안 제목. 이것도 없는 문서가 있어서 선택으로 뒀습니다.
ARTICLE_RE = re.compile(r"^제\s*(\d+)\s*조(?:\s*의\s*(\d+))?\s*(?:\(([^)]*)\))?")

# "①②③..." 항 번호입니다. 규정 문서는 거의 원문자를 씁니다.
CIRCLED = "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮"
PARAGRAPH_RE = re.compile(rf"(?=[{CIRCLED}])")


@dataclass
class Article:
    """조 하나를 나타냅니다. ingest.py가 이걸 받아서 청크로 만듭니다."""

    number: str  # "제11조" 또는 "제11조의2"
    sort_key: tuple[int, int]  # (11, 0) / (11, 2) — 번호 연속성 검증과 정렬에 씁니다
    title: str  # "재택근무" (없으면 빈 문자열)
    path: list[str] = field(default_factory=list)  # ["제3장 근무"] 처럼 상위 구분
    body: str = ""  # 조 표지 줄부터 다음 조 직전까지의 원문
    page: int = 1  # 이 조가 시작되는 페이지 (출처 표시용)

    @property
    def heading(self) -> str:
        """'제11조(재택근무)' 형태의 표시용 이름입니다."""
        return f"{self.number}({self.title})" if self.title else self.number

    @property
    def full_path(self) -> str:
        """'제3장 근무 > 제11조(재택근무)' — 청크 앞에 붙일 계층 경로입니다."""
        return " > ".join([*self.path, self.heading])


def _page_of(offset: int, page_starts: list[int]) -> int:
    """문자 위치(offset)가 몇 페이지에 해당하는지 찾습니다.

    PDF에서 페이지별로 뽑은 텍스트를 하나로 이어붙여서 파싱하기 때문에,
    "이 조가 몇 페이지에서 시작하는지"는 이렇게 역으로 계산해야 합니다.
    출처를 'p.7'처럼 보여주려면 이 값이 필요합니다.
    """
    page = 1
    for i, start in enumerate(page_starts, start=1):
        if offset >= start:
            page = i
        else:
            break
    return page


def parse_articles(pages: list[str]) -> list[Article]:
    """페이지별 텍스트 목록을 받아서, 조 단위 Article 목록으로 변환합니다.

    pages는 PyPDFLoader가 준 페이지 텍스트 리스트를 그대로 넣으면 됩니다.
    (텍스트 파일 하나라면 [전체_텍스트]처럼 1개짜리 리스트로 넣어도 동작합니다.)
    """
    # 페이지들을 하나로 이어붙이면서, 각 페이지가 몇 번째 글자에서 시작하는지 기록해둡니다.
    page_starts: list[int] = []
    cursor = 0
    for page_text in pages:
        page_starts.append(cursor)
        cursor += len(page_text) + 1  # +1은 아래에서 "\n"으로 이어붙이기 때문
    text = "\n".join(pages)

    articles: list[Article] = []
    # 지금까지 지나온 편/장/절/관을 (깊이, 표시이름) 쌍으로 쌓아둡니다.
    # 깊이를 같이 들고 있어야 "제2장을 만나면 이전 장과 그 아래 절을 전부 비운다"를
    # 정확히 할 수 있습니다. (문서에 편이 없고 장부터 시작하는 경우가 많아서,
    # 리스트 위치를 깊이로 그냥 쓰면 어긋납니다.)
    current_path: list[tuple[int, str]] = []
    current: Article | None = None
    body_lines: list[str] = []
    offset = 0

    for line in text.split("\n"):
        stripped = line.strip()
        line_start = offset
        offset += len(line) + 1

        # (1) 편/장/절/관 표지를 만나면 계층 경로를 갱신합니다.
        section_match = SECTION_RE.match(stripped)
        if section_match and not ARTICLE_RE.match(stripped):
            number, kind, title = section_match.groups()
            # 계층 깊이: 편(0) < 장(1) < 절(2) < 관(3).
            # "제3장"을 만나면 그보다 깊거나 같은 단계(이전 장, 그 아래 절)는 전부 버립니다.
            # 이렇게 해야 제3장으로 넘어갔을 때 제2장의 절이 경로에 남아 있지 않습니다.
            depth = "편장절관".index(kind)
            current_path = [entry for entry in current_path if entry[0] < depth]
            current_path.append((depth, f"제{number}{kind} {title}".strip()))
            continue

        # (2) 조 표지를 만나면 이전 조를 마감하고 새 조를 시작합니다.
        article_match = ARTICLE_RE.match(stripped)
        if article_match:
            if current is not None:
                current.body = "\n".join(body_lines).strip()
                articles.append(current)

            num, branch, title = article_match.groups()
            number = f"제{num}조의{branch}" if branch else f"제{num}조"
            current = Article(
                number=number,
                sort_key=(int(num), int(branch) if branch else 0),
                title=(title or "").strip(),
                path=[label for _depth, label in current_path],  # 지금 시점의 경로를 복사해둡니다
                page=_page_of(line_start, page_starts),
            )
            body_lines = [stripped]
            continue

        # (3) 그 밖의 줄은 현재 조의 본문으로 쌓습니다.
        #     조가 시작되기 전의 줄(문서 제목 등)은 버립니다.
        if current is not None:
            body_lines.append(stripped)

    if current is not None:
        current.body = "\n".join(body_lines).strip()
        articles.append(current)

    return articles


def _strip_heading(body: str) -> str:
    """본문 맨 앞의 조 표지("제12조(연장근로와 수당)")를 떼어냅니다.

    표지는 ingest.py가 계층 경로 프리픽스로 따로 붙여주기 때문에, 본문에까지 남겨두면
    같은 문구가 두 번 들어가서 임베딩만 흐려집니다.

    주의할 점: "제1조(목적) 이 규칙은 ..." 처럼 표지와 본문이 한 줄에 붙어 있는 경우가
    흔합니다. 그래서 첫 줄을 통째로 버리면 안 되고, 표지에 해당하는 부분만 잘라내야 합니다.
    """
    match = ARTICLE_RE.match(body)
    return body[match.end() :].strip() if match else body


def split_paragraphs(article: Article, max_chars: int = 900) -> list[tuple[str, str]]:
    """조 본문을 (필요하면 항 단위로 쪼개서) 돌려줍니다.

    반환값은 (항 표시, 본문) 튜플 목록입니다. 항 표시가 없으면 빈 문자열입니다.
    본문에서 조 표지는 빠져 있습니다 (_strip_heading 참고).

    짧은 조는 통째로 두는 게 문맥이 살아서 더 좋기 때문에, max_chars를 넘을 때만 쪼갭니다.
    """
    body = _strip_heading(article.body)

    if len(article.body) <= max_chars:
        return [("", body)]

    # 원문자 앞에서 자릅니다. (?=...) 는 "자르되 그 글자는 남겨둬"라는 뜻입니다(lookahead).
    parts = [part.strip() for part in PARAGRAPH_RE.split(body) if part.strip()]
    if len(parts) <= 1:
        return [("", body)]

    chunks: list[tuple[str, str]] = []
    for part in parts:
        marker = part[0] if part and part[0] in CIRCLED else ""
        chunks.append((marker, part))
    return chunks


def check_article_sequence(articles: list[Article]) -> list[str]:
    """조 번호가 중간에 건너뛰거나 중복되지 않았는지 확인합니다 (무결성 검증).

    PDF 텍스트 추출은 생각보다 자주 실패합니다. 두 단 편집(2단 조판)이나 표 안에 들어간
    조문은 통째로 누락되기도 합니다. 그런데 누락은 조용히 일어나기 때문에,
    검증하지 않으면 "챗봇이 그 조항만 유독 못 찾는" 상태로 서비스가 나갑니다.

    조 번호는 원래 1, 2, 3... 으로 이어지므로, 끊긴 지점을 찾으면
    "추출이 실패했을 가능성이 있는 위치"를 알 수 있습니다.
    """
    warnings: list[str] = []
    seen: set[tuple[int, int]] = set()
    previous = 0

    for article in sorted(articles, key=lambda a: a.sort_key):
        main, branch = article.sort_key

        if article.sort_key in seen:
            warnings.append(f"{article.number}가 중복 등장했습니다.")
        seen.add(article.sort_key)

        # 가지번호(제11조의2)는 본번호와 같은 자리이므로 연속성 검사에서 제외합니다.
        if branch:
            continue
        if previous and main > previous + 1:
            missing = ", ".join(f"제{n}조" for n in range(previous + 1, main))
            warnings.append(f"{missing}가 없습니다 (제{previous}조 다음이 {article.number}).")
        previous = main

    return warnings


if __name__ == "__main__":
    # 파서가 뭘 뽑아냈는지 눈으로 확인하는 용도입니다. OpenSearch도 OpenAI 키도 필요 없습니다.
    #     python src/parse.py data/sample_regulation.txt
    if len(sys.argv) < 2:
        print("사용법: python src/parse.py <문서.txt>")
        sys.exit(1)

    raw_text = Path(sys.argv[1]).read_text(encoding="utf-8")
    parsed = parse_articles([raw_text])

    print(f"조 {len(parsed)}개를 찾았습니다.\n")
    for item in parsed:
        pieces = split_paragraphs(item)
        suffix = f" -> {len(pieces)}개 조각으로 분할" if len(pieces) > 1 else ""
        print(f"  {item.full_path}  ({len(item.body)}자{suffix})")

    problems = check_article_sequence(parsed)
    print("\n[무결성 검증]")
    if problems:
        for problem in problems:
            print(f"  ⚠️  {problem}")
    else:
        print("  이상 없음")
