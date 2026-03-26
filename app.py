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

news = get_btc_news(50)

news_text = "\n\n".join([f'***{pub_date}*** - {item['title']} \n - {item['summary']}' for pub_date, item in sorted(
    news,
    key=lambda x: datetime.strptime(x[0], '%d.%m.%Y %H:%M:%S'),
    reverse=True
)])
right_box.markdown(news_text)

time.sleep(1)



