import yfinance as yf
from datetime import datetime

def get_btc_price():
    '''
    Gets the current bitcoin price from the Yahoo Finance API.

    :return: float: Actual Bitcoin price.
    '''
    btc = yf.Ticker("BTC-USD")
    data = btc.fast_info.get('lastPrice')
    if data is None:
        data = btc.history(period="1d", interval="1m")
        return data["Close"].iloc[-1]
    return data

def get_btc_news(count : int = 1):
    '''
    Gets the 3 latest bitcoin news headlines.

    :param count: int: Number of news to get.
    :return: As many news items as given in the count along with the publication date.
    '''
    btc = yf.Ticker("BTC-USD")

    news = btc.get_news(count=count)

    results = {}
    for i, new in enumerate(news[:count]):
        url = new["content"]['canonicalUrl']['url']
        pub_date = new["content"]['pubDate']
        pub_date = change_date_type(pub_date)
        results[pub_date] = url

    return results

def change_date_type(date):
    """
    Converts an ISO 8601 date string to a readable European format.

    :param date: str: Date string in ISO format (e.g., from Yahoo Finance).
    :return: str: Formatted date string as 'DD.MM.YYYY HH:MM:SS'.
    """
    date_utc = datetime.fromisoformat(date.replace('Z', '+00:00'))
    changed_date = date_utc.strftime('%d.%m.%Y %H:%M:%S')
    return changed_date


print(get_btc_price())
print(get_btc_news(5))


#posortowac je od nanjnowszego dod najstarszego


