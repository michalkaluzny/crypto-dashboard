import streamlit as st
from catching_info import get_btc_price, get_btc_news
import time

st.set_page_config(
    page_title='Bitcoin RAG Dashboard',
    page_icon='📈',
    layout='wide',
)
st.markdown(
    """
    <h1 style='text-align: center; margin-top: 0;'>
        Bitcoin RAG Dashboard
    </h1>
    <h2 style='text-align: center; margin-top: 0;'>
        Bitcoin news and currency analysis panel
    </h2>
    """,
    unsafe_allow_html=True
)

left_col, right_col = st.columns([1, 1], gap='large')

with left_col:
    st.subheader('Price')
    price_box = st.empty()

with right_col:
    st.subheader('News')
    right_box = st.empty()

while True:
    btc_price = get_btc_price()
    price_box.markdown(
        f"""
        <h2 style='font-size:48px;'>
            {btc_price}
        </h2>
        """,
        unsafe_allow_html=True
    )

    news = get_btc_news()
    right_box.write(news if news else 'brak newsow')

    time.sleep(10)



