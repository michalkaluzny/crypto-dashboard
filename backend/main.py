from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import Price, News, PriceHistory, ChatBot, ChatRequest
from catching_info import(
    get_btc_price,
    get_btc_news,
    get_close_price_history,
    get_price_change_since_last_close,
    get_percentage_price_change_since_last_close,
)
from typing import List
from chatbot import get_ai_response


app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/price", response_model=Price)
def read_price():
    try:
        return Price(
            price=get_btc_price(),
            diff = get_price_change_since_last_close(),
            percentage_diff=get_percentage_price_change_since_last_close(),
        )
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Could not fetch price: {str(e)}")

@app.get("/news", response_model=List[News])
def read_news():
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
    return ChatBot(
        user_input = request.text,
        answer = get_ai_response(request.text)
    )