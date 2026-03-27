import streamlit as st
from catching_info import get_btc_price, get_btc_news, get_price_change_since_last_close, get_percentage_price_change_since_last_close, get_close_price_history
from datetime import datetime
import plotly.express as px


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
    chart_box = st.empty()

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

st.markdown("""
    <style>
    .news-scroll-box {
        max-height: 600px;
        overflow-y: auto;
        padding-right: 8px;
    }
    .news-title-link,
    .news-title-link:visited,
    .news-title-link:active,
    .news-title-link:focus {
        color: #4F8BF9 !important;
        text-decoration: none !important;
        transition: color 0.2s;
    }
    .news-title-link:hover {
        color: #222 !important;
    }
    </style>
""", unsafe_allow_html=True)


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
    news_html += (
        f"<div style=\"border: 2px solid #4F8BF9; border-radius: 18px; padding: 18px 22px 14px 22px; margin-bottom: 18px; background: #f8f9fa; box-shadow: 0 2px 8px rgba(0,0,0,0.05); position: relative;\">"
        f"<div style=\"display: flex; justify-content: space-between; align-items: baseline;\">"
        f"<span style=\"font-size: 1.5em; font-weight: bold;\">"
        f"<a href='{item['url']}' class='news-title-link'>{item['title']}</a>"
        f"</span>"
        f"<span style=\"font-size: 0.95em; color: #888; margin-left: 16px;\">{pub_date}</span>"
        f"</div>"
        f"<div style=\"margin-top: 10px; font-size: 1.08em; color: #444;\">"
        f"{item['summary']}"
        f"</div>"
        f"</div>"
    )
right_box.markdown( f"<div class='news-scroll-box'>{news_html}</div>",
                            unsafe_allow_html=True
                    )

@st.cache_data(ttl=60)
def get_close_price_history_cached():
    return get_close_price_history()

hist = get_close_price_history_cached()
fig = px.line(hist)
fig.update_layout(
    hovermode='x',
    dragmode=False,
    xaxis_title=None,
    yaxis_title=None,
    showlegend=False,
    xaxis=dict(
        showspikes=True,
        spikecolor="#4F8BF9",
        spikethickness=2,
        spikedash='solid',
        spikemode='across'
    ),
    yaxis=dict(
        showspikes=False
    )
)
fig.update_traces(
    hovertemplate="<b>Data:</b> %{x}<br><b>Cena:</b> %{y:.2f} USD"
)

chart_box.plotly_chart(fig,
       config={
            'scrollZoom' : False,
            'displayModeBar': True,
            'doubleClick': 'reset',
            'modeBarButtonsToRemove': [
                'zoom2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d', 'pan2d'
            ]
       }
)




