"""노트북이 실행 중에 내려받는 외부 데이터가 아직 그 자리에 있는지 확인한다.

이 저장소는 데이터를 커밋하지 않고 전부 런타임에 내려받습니다.
그래서 주소 하나가 옮겨지면 **해당 시리즈가 첫 셀에서 통째로 멈춥니다.**
아무도 실행해보지 않으면 알아챌 방법이 없어서, 주소만 따로 확인합니다.

    python tools/check_data_sources.py

실패가 있으면 종료 코드 1을 돌려줍니다.
"""
from __future__ import annotations

import sys
import urllib.error
import urllib.request

TIMEOUT = 30

# (쓰는 곳, 설명, URL)
SOURCES = [
    ("text-classification-practice 01·02·03", "KLUE-YNAT 학습 데이터",
     "https://raw.githubusercontent.com/KLUE-benchmark/KLUE/main/klue_benchmark/ynat-v1.1/ynat-v1.1_train.json"),
    ("text-classification-practice 01·02·03", "KLUE-YNAT 평가 데이터",
     "https://raw.githubusercontent.com/KLUE-benchmark/KLUE/main/klue_benchmark/ynat-v1.1/ynat-v1.1_dev.json"),
    ("tabular-ml-practice 00~04", "seaborn taxis (회귀용)",
     "https://raw.githubusercontent.com/mwaskom/seaborn-data/master/taxis.csv"),
    ("tabular-ml-practice 00~04", "seaborn titanic (분류용)",
     "https://raw.githubusercontent.com/mwaskom/seaborn-data/master/titanic.csv"),
    ("ml-curriculum 04·05", "MNIST (torchvision 기본 미러)",
     "https://ossci-datasets.s3.amazonaws.com/mnist/train-images-idx3-ubyte.gz"),
    ("rag-pipeline-practice 01", "크롤링 연습용 사이트",
     "https://quotes.toscrape.com/"),
    ("text-classification-practice 03", "klue/roberta-small 모델 카드",
     "https://huggingface.co/klue/roberta-small/resolve/main/config.json"),
]


def check(url: str) -> tuple[bool, str]:
    req = urllib.request.Request(url, method="GET", headers={
        "User-Agent": "Mozilla/5.0 (compatible; ml-tutorial-linkcheck/1.0)",
        # 큰 파일을 통째로 받지 않도록 앞부분만 요청한다.
        "Range": "bytes=0-1023",
    })
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
            return True, f"HTTP {r.status}"
    except urllib.error.HTTPError as e:
        # 206(부분 응답)과 200은 정상. Range를 지원하지 않는 서버도 있다.
        if e.code in (200, 206, 416):
            return True, f"HTTP {e.code}"
        return False, f"HTTP {e.code} {e.reason}"
    except Exception as e:
        return False, f"{type(e).__name__}: {e}"


def main() -> int:
    bad = []
    for where, what, url in SOURCES:
        ok, detail = check(url)
        print(f"{'OK  ' if ok else 'FAIL'}  {what:<28} {detail:<12} ({where})")
        if not ok:
            bad.append((what, url, detail))

    if bad:
        print(f"\n닿지 않는 주소 {len(bad)}건 — 해당 노트북은 지금 첫 셀에서 멈춥니다.\n")
        for what, url, detail in bad:
            print(f"  - {what}\n    {url}\n    {detail}")
        return 1
    print(f"\n{len(SOURCES)}개 주소 모두 정상")
    return 0


if __name__ == "__main__":
    sys.exit(main())
