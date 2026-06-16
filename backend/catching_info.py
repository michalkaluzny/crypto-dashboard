import yfinance as yf
from datetime import datetime

def get_close_price_history(period, interval):
    '''
    Gets the historical price data from the Yahoo Finance API.

    :return: pandas.Series: Historical price data.
    '''
    try:
        btc = yf.Ticker("BTC-USD")
        hist = btc.history(period=period, interval=interval)
        return hist['Close']
    except Exception as e:
        print(f"Error fetching BTC price history: {e}")
        raise

def get_btc_price_data():
    btc = yf.Ticker("BTC-USD")
    info = btc.fast_info
    try:
        price = info.get('lastPrice')
        if price is None:
            price = btc.history(period="1d", interval="1h")
            price = price["Close"].iloc[-1]
    except Exception as e:
        print(f"Error fetching Bitcoin price data: {e}")
        raise

    try:
        prev_close_price = info.get('previousClose')
        diff = price - prev_close_price
        percentage_diff = (diff / prev_close_price) * 100
    except Exception as e:
        print(f"Error fetching Bitcoin price difference: {e}")
        raise

    return {
        'price': price,
        'percentage_diff': percentage_diff,
        'prev_close_price': prev_close_price,
        'diff': diff,
    }

def get_btc_news(count : int = 1):
    '''
    Gets the 3 latest bitcoin news headlines.

    :param count: int: Number of news to get.
    :return: As many news items as given in the count along with the publication date.
    '''
    try:
        btc = yf.Ticker("BTC-USD")

        news = btc.get_news(count=count)
        results =  []
        for i, new in enumerate(news[:count]):
            url = new["content"]['canonicalUrl']['url']
            title = new['content']['title']
            pub_date = new["content"]['pubDate']
            summary = new["content"]['summary']
            pub_date = change_date_type(pub_date)
            results.append([pub_date, {'title': title, 'summary' : summary, 'url' : url}])
        return results
    except Exception as e:
        print(f"Error fetching news: {e}")
        raise

def change_date_type(date):
    """
    Converts an ISO 8601 date string to a readable European format.

    :param date: str: Date string in ISO format (e.g., from Yahoo Finance).
    :return: str: Formatted date string as 'DD.MM.YYYY HH:MM:SS'.
    """
    try:
        date_utc = datetime.fromisoformat(date.replace('Z', '+00:00'))
        changed_date = date_utc.strftime('%d.%m.%Y %H:%M:%S')
        return changed_date
    except Exception as e:
        print(f"Error converting date: {e}")
        raise


