"""저장소가 스스로 약속한 것들이 지켜지고 있는지 검사한다 (네트워크 불필요).

노트북이 48개라 손으로는 확인이 안 됩니다. 여기서 보는 것은 전부
README나 notebooks/NOTEBOOK_STYLE.md가 **이미 약속한 내용**입니다.

    python tools/check_repo.py

실패가 있으면 종료 코드 1을 돌려줍니다.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Windows 기본 콘솔은 cp949라서 한글 외의 기호(—, ✗)에서 그대로 죽습니다.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
REPO_URL = "https://colab.research.google.com/github/karzit/temp/blob/master/"

# 연습 문제가 없어 해설 노트북도 없는 노트북 (README에 명시된 예외)
NO_SOLUTIONS = {"notebooks/tabular-ml-practice/00_pandas_for_tabular/00_pandas_for_tabular.ipynb"}

failures: list[str] = []


def fail(msg: str) -> None:
    failures.append(msg)


def rel(p: Path) -> str:
    return p.relative_to(ROOT).as_posix()


def notebooks() -> list[Path]:
    return sorted(ROOT.glob("notebooks/**/*.ipynb"))


def load(p: Path) -> dict | None:
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception as e:  # 깨진 노트북은 Colab에서 아예 열리지 않는다
        fail(f"{rel(p)}: JSON으로 읽을 수 없습니다 ({type(e).__name__}: {e})")
        return None


def source(cell: dict) -> str:
    return "".join(cell.get("source", []))


# ---------------------------------------------------------------- 검사 항목
def check_valid_and_clean(p: Path, nb: dict) -> None:
    """유효한 nbformat 4인지, 실행 결과가 커밋되어 있지 않은지."""
    if nb.get("nbformat") != 4:
        fail(f"{rel(p)}: nbformat이 4가 아닙니다 ({nb.get('nbformat')})")

    for i, c in enumerate(nb.get("cells", [])):
        if c.get("cell_type") != "code":
            continue
        # README가 "실행 결과는 저장되어 있지 않습니다"라고 약속하고 있다.
        # 출력이 섞여 들어오면 diff가 지저분해지고, 학습자가 직접 실행하지 않게 된다.
        if c.get("outputs"):
            fail(f"{rel(p)}: 셀 {i}에 실행 결과가 저장되어 있습니다")
        if c.get("execution_count") is not None:
            fail(f"{rel(p)}: 셀 {i}에 실행 번호가 남아 있습니다")


def check_code_syntax(p: Path, nb: dict) -> None:
    """코드 셀이 파이썬으로 파싱되는지.

    노트북은 실행해봐야 알 수 있는 것이 많지만, 오타나 따옴표 짝이 안 맞는 것은
    실행 없이 잡을 수 있다. 셀을 손으로 고치다 깨뜨리는 일이 잦은 자리다.
    """
    def without(src: str, prefixes: tuple) -> str:
        """노트북 매직(`!pip ...`, `%matplotlib ...`)을 pass로 바꾼다.

        지우지 않고 pass로 두는 이유는 `if IN_COLAB:` 블록이 비면 그것대로
        문법 오류가 되기 때문이다.
        """
        out = []
        for line in src.split("\n"):
            stripped = line.lstrip()
            indent = line[:len(line) - len(stripped)]
            out.append(indent + "pass" if stripped.startswith(prefixes) else line)
        return "\n".join(out)

    for i, c in enumerate(nb.get("cells", [])):
        if c.get("cell_type") != "code":
            continue
        src = source(c)
        # `!`는 파이썬 연산자가 아니라 늘 매직이지만, `%`는 나눗셈이자 문자열 서식이라
        # 줄바꿈으로 이어진 코드의 첫 글자일 수 있다(`% (a, b)`). 그래서 `!`만 빼고
        # 먼저 시도하고, 그래도 안 되면 그때 `%`도 매직으로 보고 다시 시도한다.
        for prefixes in [("!",), ("!", "%")]:
            try:
                compile(without(src, prefixes), f"{rel(p)}:{i}", "exec")
                break
            except SyntaxError as e:
                last = e
        else:
            fail(f"{rel(p)}: 셀 {i}의 코드가 파싱되지 않습니다 — {last.msg} (line {last.lineno})")


def check_solutions_pair(p: Path) -> None:
    """본편 노트북마다 해설 노트북이 짝으로 있는지."""
    if p.stem.endswith("_solutions"):
        return
    if rel(p) in NO_SOLUTIONS:
        return
    sol = p.with_name(p.stem + "_solutions.ipynb")
    if not sol.exists():
        fail(f"{rel(p)}: 해설 노트북({sol.name})이 없습니다")


def check_absolute_links(p: Path, nb: dict) -> None:
    """노트북 본문의 저장소 내부 링크는 절대 URL이어야 한다.

    NOTEBOOK_STYLE.md 4절: 학습자 대부분은 Colab 배지로 노트북 하나만 열고,
    그 런타임에는 저장소가 없어서 상대 링크가 전부 깨진다.
    """
    pattern = re.compile(r"\]\((\.{1,2}/[^)]+|(?!https?:|#|mailto:)[^):]*\.(?:md|ipynb)[^)]*)\)")
    for i, c in enumerate(nb.get("cells", [])):
        if c.get("cell_type") != "markdown":
            continue
        for m in pattern.finditer(source(c)):
            fail(f"{rel(p)}: 셀 {i}의 링크가 상대 경로입니다 → {m.group(1)}"
                 f" (Colab에서 깨집니다. 절대 URL을 쓰세요)")


def check_colab_badge(p: Path, nb: dict) -> None:
    """첫 셀의 Colab 배지가 자기 자신을 가리키는지.

    배지는 대개 옆 노트북에서 복사해 오므로 경로만 안 고치는 실수가 잦다.
    그러면 학습자가 엉뚱한 노트북으로 갑니다.
    """
    if p.stem.endswith("_solutions"):
        return
    text = "".join(source(c) for c in nb.get("cells", [])[:2])
    urls = re.findall(r"https://colab\.research\.google\.com/github/[^\s)]+\.ipynb", text)
    if not urls:
        fail(f"{rel(p)}: 첫 셀에 Colab 배지가 없습니다")
        return
    expected = REPO_URL + rel(p)
    if urls[0] != expected:
        fail(f"{rel(p)}: Colab 배지가 다른 노트북을 가리킵니다\n"
             f"    배지: {urls[0]}\n    실제: {expected}")


def check_markdown_links() -> None:
    """.md 파일의 상대 링크가 실제로 존재하는 파일인지."""
    for md in sorted(ROOT.glob("**/*.md")):
        if ".git" in md.parts:
            continue
        text = md.read_text(encoding="utf-8")
        for m in re.finditer(r"\]\(([^)#\s]+)(?:#[^)\s]*)?\)", text):
            target = m.group(1)
            if target.startswith(("http://", "https://", "mailto:")):
                continue
            if not (md.parent / target).exists():
                fail(f"{rel(md)}: 링크가 가리키는 파일이 없습니다 → {target}")


def check_readme_badges() -> None:
    """루트 README의 Colab 배지 링크가 실제 노트북을 가리키는지."""
    text = (ROOT / "README.md").read_text(encoding="utf-8")
    for url in re.findall(r"https://colab\.research\.google\.com/github/karzit/temp/blob/master/([^\s)]+\.ipynb)", text):
        if not (ROOT / url).exists():
            fail(f"README.md: 배지가 없는 노트북을 가리킵니다 → {url}")


def main() -> int:
    nbs = notebooks()
    if not nbs:
        fail("notebooks/ 아래에서 노트북을 하나도 찾지 못했습니다")

    for p in nbs:
        nb = load(p)
        if nb is None:
            continue
        check_valid_and_clean(p, nb)
        check_code_syntax(p, nb)
        check_solutions_pair(p)
        check_absolute_links(p, nb)
        check_colab_badge(p, nb)

    check_markdown_links()
    check_readme_badges()

    print(f"노트북 {len(nbs)}개 검사")
    if failures:
        print(f"\n실패 {len(failures)}건\n")
        for f in failures:
            print("  -", f)
        return 1
    print("문제 없음")
    return 0


if __name__ == "__main__":
    sys.exit(main())
