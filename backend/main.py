from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import Price, News, PriceHistory, ChatBot, ChatRequest
from catching_info import(
    get_btc_news,
    get_close_price_history,
    get_btc_price_data
)
from typing import List
from chatbot import get_ai_response
import logging
import os

logging.basicConfig(
      level=logging.INFO,
      format="%(asctime)s %(name)s %(levelname)s %(message)s",
)

app = FastAPI()

origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/price", response_model=Price)
def read_price():
    """
    Gets actual BTC price, difference between the current price and the previous close price

    :return: object Price with actual price, difference and percentage difference
    """
    try:
        data = get_btc_price_data()
        return Price(
            price=data['price'],
            diff = data['diff'],
            percentage_diff=data['percentage_diff'],
        )
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Could not fetch price: {str(e)}")

@app.get("/news", response_model=List[News])
def read_news():
    """
    Gets a list of news articles from the Yahoo Finance API

    :return: object News with title, url summary and pub date
    """
    try:
        raw_news = get_btc_news(20)
        return[
            News(
                title=item[1]["title"],
                url=item[1]["url"],
                summary=item[1]["summary"],
                pub_date=item[0]
            )
            for item in raw_news
        ]
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Could not fetch news: {str(e)}")

@app.get("/price_history", response_model=PriceHistory)
def read_price_history(period: str = '1d', interval: str = '1m'):
    """
    Gets historical price data from the Yahoo Finance API

    :param period: the period in which we will see price changes
    :param interval: time interval of the charged price
    :return: object PriceHistory with timestamps and prices
    """
    try:
        price_history = get_close_price_history(period, interval)
        return PriceHistory(
            timestamps = [str(ts) for ts in price_history.index],
            prices = price_history.values.tolist(),
        )
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Could not fetch price history: {str(e)}")


@app.post("/chatbot", response_model=ChatBot)
def read_chatbot(request: ChatRequest):
    """
    Endpoint which gets chatbot response

    :param request: object with user text
    :return: object ChatBot with user text and chatbot response
    """
    return ChatBot(
        user_input = request.text,
        answer = get_ai_response(request.text)
    )