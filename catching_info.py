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

def get_price_change_since_last_close():
    '''
    It takes the current Bitcoin price and the previous close price of Bitcoin
    and calculates the difference.

    :return: float: the difference between the current and previous closing price of Bitcoin.
    '''
    current_price = get_btc_price()
    btc = yf.Ticker("BTC-USD")
    prev_close_price = btc.fast_info.get('previousClose')
    diff = current_price - prev_close_price
    return diff

def get_percentage_price_change_since_last_close():
    '''
    Shows the difference between the current price and the previous close price of bitcoin in percentage.

    :return: float: the difference between the current price and the previous close price of bitcoin in percentage.
    '''
    diff = get_price_change_since_last_close()
    btc = yf.Ticker("BTC-USD")
    prev_close_price = btc.fast_info.get('previousClose')
    percentage_diff = (diff / prev_close_price) * 100
    return percentage_diff



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


