import streamlit as st
from catching_info import get_btc_price, get_btc_news, get_price_change_since_last_close, get_percentage_price_change_since_last_close
import time
from datetime import datetime

st.set_page_config(
    page_title='Bitcoin RAG Dashboard',
    page_icon='📈',
    layout='wide',
)

st.experimental_rerun_interval = 1000

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
    price_box = st.empty()
    diff_box = st.empty()
    percentage_diff = st.empty()

with right_col:
    st.subheader('News')
    right_box = st.empty()



btc_price = get_btc_price()
diff = get_price_change_since_last_close()
price_box.markdown(
    f"""
    <h2 style='font-size:48px;'>
        {f'Price: {btc_price:.0f} USD'}
    </h2>
    """,
    unsafe_allow_html=True
)

diff_box.markdown(
    f"""
    <h3 style='font-size:30px;'>
        {f'difference {diff:.0f}'}
    </h3>
    """,
    unsafe_allow_html=True
)

percentage_diff.markdown(
    f"""
    <h3 style='font-size:30px;'>
        {f'difference in %: {get_percentage_price_change_since_last_close():.2f}%'}
    </h3>
    """,
    unsafe_allow_html=True
)

@st.cache_data(ttl=300)
def get_btc_news_cached(n):
    return get_btc_news(n)

news = get_btc_news_cached(50)

news_html = ""
for pub_date, item in sorted(
    news,
    key=lambda x: datetime.strptime(x[0], '%d.%m.%Y %H:%M:%S'),
    reverse=True,
):
    news_html += f"""
    <div style="
        border: 2px solid #4F8BF9;
        border-radius: 18px;
        padding: 18px 22px 14px 22px;
        margin-bottom: 18px;
        background: #f8f9fa;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        position: relative;
    ">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-size: 1.5em; font-weight: bold; color: #222;">{item['title']}</span>
            <span style="font-size: 0.95em; color: #888; margin-left: 16px;">{pub_date}</span>
        </div>
        <div style="margin-top: 10px; font-size: 1.08em; color: #444;">
            {item['summary']}
        </div>
    </div>
    """
right_box.markdown(news_html, unsafe_allow_html=True)



