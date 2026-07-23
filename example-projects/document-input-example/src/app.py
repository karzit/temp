"""Streamlit으로 만든 화면(웹 UI). 사용자가 서류 사진을 올리면
OCR -> 정형화까지의 결과를 눈으로 확인할 수 있게 보여준다.

Streamlit은 "파이썬 코드만으로 웹 화면을 뚝딱 만들어주는" 도구야.
HTML/CSS/JavaScript를 몰라도, st.file_uploader() 같은 함수 한 줄이 곧 화면의 버튼이나 입력창이 된다.

실행:
    streamlit run src/app.py
"""
import streamlit as st  # 참고 https://colab.research.google.com/github/karzit/temp/blob/master/notebooks/rag-pipeline-practice/03_document_structuring/03_document_structuring.ipynb

from ocr import extract_text_from_image
from structurer import structure_text

st.set_page_config(page_title="서류 사진 -> 정형 데이터 변환", page_icon="📄")
st.title("📄 서류 사진 -> 정형 데이터 변환 (B파트 예시)")
st.caption("사진을 올리면 OCR로 글자를 읽고, AI가 정리해서 JSON으로 만들어줍니다.")

# file_uploader: "파일 올려주세요" 버튼과 창을 한 줄로 만들어주는 Streamlit 함수.
# type으로 이미지 파일만 받도록 제한해뒀다.
uploaded_file = st.file_uploader("서류 이미지를 업로드하세요", type=["png", "jpg", "jpeg"])

if uploaded_file is not None:
    # 업로드된 이미지를 화면에 미리 보여준다.
    st.image(uploaded_file, caption="업로드한 이미지", use_container_width=True)

    # 버튼을 눌러야 실제 OCR/AI 호출이 일어나게 해서, 이미지를 바꿀 때마다 자동으로 비용이 나가지 않게 한다.
    if st.button("분석 시작"):
        image_bytes = uploaded_file.getvalue()

        with st.spinner("OCR로 글자를 읽는 중..."):
            raw_text = extract_text_from_image(image_bytes)

        st.subheader("1. OCR 원문 (오타가 섞여있을 수 있어요)")
        st.text_area("raw_text", raw_text, height=200, label_visibility="collapsed")

        with st.spinner("AI가 내용을 정리하는 중..."):
            structured = structure_text(raw_text)

        st.subheader("2. 정형화된 JSON (다음 단계인 RAG 검색에 사용됩니다)")
        # model_dump_json: Pydantic 객체를 사람이 읽기 좋은 JSON 문자열로 바꿔주는 함수.
        st.json(structured.model_dump_json(indent=2))
