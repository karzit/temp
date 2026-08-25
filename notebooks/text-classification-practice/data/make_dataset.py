"""가공식품 상품명 데이터셋 생성기.

AICE Professional 샘플문항(Text - 가공식품 카테고리 분류)과 같은 형태의 연습용 데이터를
만든다. 실제 시험 데이터는 공개되지 않으므로, 같은 구조(`상품명` -> `카테고리`)를 가진
데이터를 규칙 기반으로 합성해 쓴다.

    python make_dataset.py

를 실행하면 이 파일 옆에 세 개의 csv가 만들어진다.

    02_train.csv        상품명 + 카테고리 (훈련용)
    02_test_x.csv       상품명만 (예측 대상)
    02_test_y.csv       02_test_x.csv의 정답 (실제 시험에는 없다. 채점 연습용)

**일부러 지저분하게 만든다.** 공백/특수문자/대소문자가 섞이고, 결측과 중복이 들어 있고,
카테고리별 건수도 불균형하다. 전처리 없이 바로 학습하면 성능이 나오지 않도록 하기 위해서다.
"""

import random

import pandas as pd

SEED = 42
N_TRAIN = 5000
N_TEST = 1500

# 실제 상표를 피하기 위해 브랜드는 가공의 이름을 쓴다.
BRANDS = [
    "한결식품", "미소원", "오늘의밥상", "달래마을", "청우가", "온담", "그린테이블",
    "하루담은", "본가정성", "산들바람", "포미", "델리코", "마루한", "예담원",
]

# 카테고리별 (핵심어, 수식어) 사전.
# 핵심어 일부는 여러 카테고리에 일부러 겹쳐 둔다(치즈/불고기/우유/초코).
CATEGORIES = {
    "라면류": {
        "weight": 18,
        "core": ["라면", "컵라면", "우동", "짜장면", "쌀국수", "비빔면", "칼국수", "라볶이"],
        "mod": ["매운", "얼큰", "해물", "치즈", "불고기", "김치", "사골", "짜장", "된장", "왕뚜껑"],
        "unit": [("g", (90, 140)), ("개입", (4, 5)), ("컵", (1, 6))],
    },
    "과자/스낵": {
        "weight": 15,
        "core": ["감자칩", "쿠키", "크래커", "초코바", "젤리", "팝콘", "웨하스", "스낵", "파이"],
        "mod": ["허니버터", "초코", "치즈", "달콤한", "바삭", "오리지널", "딸기", "먹태"],
        "unit": [("g", (30, 400)), ("개입", (6, 24)), ("봉", (1, 12))],
    },
    "음료": {
        "weight": 13,
        "core": ["탄산음료", "주스", "이온음료", "탄산수", "식혜", "에이드", "생수"],
        "mod": ["제로", "무가당", "오렌지", "포도", "레몬", "복숭아", "저칼로리"],
        "unit": [("ml", (190, 2000)), ("L", (1, 2)), ("페트", (1, 24))],
    },
    "커피/차": {
        "weight": 11,
        "core": ["아메리카노", "카페라떼", "믹스커피", "원두", "녹차", "홍차", "보리차", "티백"],
        "mod": ["콜드브루", "디카페인", "우유", "달콤한", "블랙", "스틱", "볶은"],
        "unit": [("ml", (200, 500)), ("g", (100, 1000)), ("입", (20, 100))],
    },
    "유제품": {
        "weight": 10,
        "core": ["우유", "요거트", "치즈", "버터", "생크림", "요구르트", "연유"],
        "mod": ["저지방", "무설탕", "딸기", "플레인", "가공", "슬라이스", "그릭"],
        "unit": [("ml", (180, 1000)), ("g", (80, 500)), ("개입", (4, 16))],
    },
    "소스/조미료": {
        "weight": 9,
        "core": ["간장", "고추장", "된장", "마요네즈", "케첩", "식초", "참기름", "소금", "카레분말"],
        "mod": ["양조", "재래식", "불고기", "매운", "고소한", "저염", "국산콩"],
        "unit": [("g", (200, 1500)), ("ml", (300, 1800)), ("포", (2, 10))],
    },
    "통조림": {
        "weight": 8,
        "core": ["참치캔", "꽁치통조림", "골뱅이", "옥수수캔", "복숭아통조림", "스팸", "번데기"],
        "mod": ["살코기", "고추", "야채", "매운", "오리지널", "국산"],
        "unit": [("g", (100, 400)), ("캔", (1, 12)), ("개입", (3, 8))],
    },
    "냉동식품": {
        "weight": 8,
        "core": ["만두", "돈까스", "치킨너겟", "피자", "군만두", "새우튀김", "핫도그", "볶음밥"],
        "mod": ["김치", "고기", "치즈", "불고기", "바삭한", "왕", "새우"],
        "unit": [("g", (300, 1200)), ("개입", (4, 20)), ("봉", (1, 4))],
    },
    "즉석밥/간편식": {
        "weight": 5,
        "core": ["즉석밥", "컵밥", "죽", "국밥", "카레", "짜장밥", "레토르트", "덮밥"],
        "mod": ["햇반", "현미", "전복", "소고기", "매콤", "3분", "간편"],
        "unit": [("g", (200, 500)), ("개입", (3, 12)), ("인분", (1, 4))],
    },
    "시리얼/영양바": {
        "weight": 3,
        "core": ["시리얼", "그래놀라", "단백질바", "에너지바", "오트밀", "콘프레이크"],
        "mod": ["초코", "우유", "견과", "프로틴", "무설탕", "아몬드", "딸기"],
        "unit": [("g", (200, 900)), ("개입", (5, 12)), ("박스", (1, 3))],
    },
}


def _spec(rng, unit_spec):
    unit, (lo, hi) = rng.choice(unit_spec)
    value = rng.randint(lo, hi)
    if unit in ("g", "ml") and value > 100:
        value = round(value / 10) * 10
    return f"{value}{unit}"


# 여러 카테고리에 걸쳐 쓰이는 핵심어. 단어 하나만 보고는 카테고리를 정할 수 없게 만든다.
# (예: "치즈스틱"은 냉동식품일 수도, 과자일 수도 있다.)
SHARED_CORE = {
    "치즈스틱": ["냉동식품", "과자/스낵"],
    "라떼": ["커피/차", "유제품"],
    "카레": ["소스/조미료", "즉석밥/간편식"],
    "떡볶이": ["냉동식품", "즉석밥/간편식"],
    "누룽지": ["과자/스낵", "즉석밥/간편식"],
    "곡물음료": ["음료", "시리얼/영양바"],
}
# 어느 카테고리에나 붙는 마케팅 문구. 이런 단어는 분류에 아무 도움이 안 된다.
GENERIC_MOD = [
    "프리미엄", "대용량", "실속", "오리지널", "가정용", "선물용", "국내산",
    "인기", "정통", "수제", "신상품", "리뉴얼",
]

SHARED_BY_CAT = {}
for _word, _cats in SHARED_CORE.items():
    for _c in _cats:
        SHARED_BY_CAT.setdefault(_c, []).append(_word)


def _make_name(rng, cat):
    spec = CATEGORIES[cat]

    shared = SHARED_BY_CAT.get(cat, [])
    if shared and rng.random() < 0.22:
        core = rng.choice(shared)          # 어느 쪽 카테고리인지 애매한 상품
    else:
        core = rng.choice(spec["core"])

    mod = rng.choice(GENERIC_MOD) if rng.random() < 0.55 else rng.choice(spec["mod"])
    parts = [rng.choice(BRANDS), mod, core]

    if rng.random() < 0.10:
        parts.pop(2)                       # 핵심어가 아예 빠진 상품명(브랜드+수식어만)

    if rng.random() < 0.75:
        parts.append(_spec(rng, spec["unit"]))
    if rng.random() < 0.25:
        parts.append(rng.choice(["x2", "X3", "2+1", "기획", "증량", "NEW", "실온보관"]))

    name = " ".join(parts)

    # 여기부터가 노이즈. 실제 상품명 데이터가 지저분한 방식들을 흉내낸다.
    r = rng.random()
    if r < 0.15:
        name = name.replace(" ", "  ")          # 공백 중복
    elif r < 0.30:
        name = f"[{rng.choice(['무료배송', '오늘출발', '1+1', '행사'])}] {name}"
    elif r < 0.40:
        name = name.replace(" ", "_", 1)        # 구분자 혼용
    elif r < 0.48:
        name = f"{name} ({rng.choice(['대용량', '소포장', '수입산', '국내산'])})"

    if rng.random() < 0.12:
        name = f" {name} "                      # 앞뒤 공백
    return name


def _sample(rng, n):
    names, labels = [], []
    cats = list(CATEGORIES)
    weights = [CATEGORIES[c]["weight"] for c in cats]
    for cat in rng.choices(cats, weights=weights, k=n):
        names.append(_make_name(rng, cat))
        labels.append(cat)
    return pd.DataFrame({"상품명": names, "카테고리": labels})


def build():
    rng = random.Random(SEED)
    train = _sample(rng, N_TRAIN)
    test = _sample(rng, N_TEST)

    # 훈련 데이터에만 라벨 오류 3%를 섞는다. 사람이 붙인 라벨에도 늘 오류가 있고,
    # 그래서 훈련 정확도 100%를 목표로 삼으면 안 된다는 것을 보여주기 위해서다.
    cats = list(CATEGORIES)
    for i in rng.sample(range(len(train)), int(len(train) * 0.03)):
        train.loc[i, "카테고리"] = rng.choice(cats)

    # 훈련 데이터에만 결측 10건과 중복 60건을 섞는다(전처리 실습용).
    for i in rng.sample(range(len(train)), 10):
        train.loc[i, "상품명"] = None
    dup = train.dropna(subset=["상품명"]).sample(60, random_state=SEED)
    train = pd.concat([train, dup], ignore_index=True).sample(frac=1, random_state=SEED)
    train = train.reset_index(drop=True)

    return train, test


def main():
    train, test = build()
    train.to_csv("02_train.csv", index=False, encoding="utf-8-sig")
    test[["상품명"]].to_csv("02_test_x.csv", index=False, encoding="utf-8-sig")
    test[["카테고리"]].to_csv("02_test_y.csv", index=False, encoding="utf-8-sig")

    print(f"02_train.csv  {len(train)}행")
    print(f"02_test_x.csv {len(test)}행")
    print(train["카테고리"].value_counts())


if __name__ == "__main__":
    main()
