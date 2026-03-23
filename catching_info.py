import yfinance as yf

def get_btc_price():
    btc = yf.Ticker("BTC-USD")
    data = btc.fast_info.get('lastPrice')
    if data is None:
        data = btc.history(period="1d", interval="1m")
        return data["Close"].iloc[-1]

    return data

def get_btc_news():
    btc = yf.Ticker("BTC-USD")

    news = btc.get_news(count=1)
    first_news = news[0]

    url = first_news["content"]['canonicalUrl']['url']
    return url


print(get_btc_price())
print(get_btc_news())


