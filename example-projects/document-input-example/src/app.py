"""Streamlit으로 만든 화면(웹 UI). 사용자가 서류 사진을 올리면
OCR -> 정형화까지의 결과를 눈으로 확인할 수 있게 보여줍니다.

Streamlit은 "파이썬 코드만으로 웹 화면을 뚝딱 만들어주는" 도구입니다.
HTML/CSS/JavaScript를 몰라도, st.file_uploader() 같은 함수 한 줄이 곧 화면의 버튼이나 입력창이 됩니다.

실행:
    streamlit run src/app.py
"""
import streamlit as st  # 참고 https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/03_document_structuring/03_document_structuring.ipynb

from ocr import extract_text_from_image
from structurer import structure_text

st.set_page_config(page_title="서류 사진 -> 정형 데이터 변환", page_icon="📄")
st.title("📄 서류 사진 -> 정형 데이터 변환 (B파트 예시)")
st.caption("사진을 올리면 OCR로 글자를 읽고, AI가 정리해서 JSON으로 만들어줍니다.")

# file_uploader: "파일 올려주세요" 버튼과 창을 한 줄로 만들어주는 Streamlit 함수입니다.
# type으로 이미지 파일만 받도록 제한해뒀습니다.
uploaded_file = st.file_uploader("서류 이미지를 업로드하세요", type=["png", "jpg", "jpeg"])

if uploaded_file is not None:
    # 업로드된 이미지를 화면에 미리 보여줍니다.
    st.image(uploaded_file, caption="업로드한 이미지", use_container_width=True)

    # 버튼을 눌러야 실제 OCR/AI 호출이 일어나게 해서, 이미지를 바꿀 때마다 자동으로 비용이 나가지 않게 합니다.
    if st.button("분석 시작"):
        image_bytes = uploaded_file.getvalue()

        with st.spinner("OCR로 글자를 읽는 중..."):
            raw_text = extract_text_from_image(image_bytes)

        st.subheader("1. OCR 원문 (오타가 섞여있을 수 있어요)")
        st.text_area("raw_text", raw_text, height=200, label_visibility="collapsed")

        with st.spinner("AI가 내용을 정리하는 중..."):
            structured = structure_text(raw_text)

        st.subheader("2. 정형화된 JSON (다음 단계인 RAG 검색에 사용됩니다)")
        # model_dump_json: Pydantic 객체를 사람이 읽기 좋은 JSON 문자열로 바꿔주는 함수입니다.
        st.json(structured.model_dump_json(indent=2))

        # 여기가 B파트와 C파트가 만나는 지점입니다.
        # JSON을 화면에 보여주고 끝내면 "그래서 이걸 어디에 쓰지?"로 남기 때문에,
        # 실제로 C파트에 넣을 질의 문자열까지 만들어서 그대로 복사할 수 있게 보여줍니다.
        search_query = structured.to_search_query()

        st.subheader("3. 이 JSON으로 만든 검색 질의 (C파트로 넘어갈 입력)")
        st.code(search_query, language="text")
        st.caption(
            "위 문자열이 `rag-regulation-example`의 `query.py`가 받는 질문이 됩니다. "
            "어떻게 조립하는지는 `schema.py`의 `to_search_query()`를 보세요."
        )

        st.markdown("C파트를 띄워뒀다면 이 명령을 그대로 붙여넣어 이어서 실행해볼 수 있습니다.")
        # 질의를 큰따옴표로 감싸서 넘기므로, 질의 안에 큰따옴표가 섞여 있으면 거기서 명령이
        # 끊깁니다. 서류에 따옴표가 있으면(예: "재택근무" 승인 건) 실제로 생길 수 있는 일이라,
        # 명령 예시에서는 작은따옴표로 바꿔서 보여줍니다.
        shell_safe_query = search_query.replace('"', "'")
        st.code(f'python src/query.py "{shell_safe_query}"', language="bash")
