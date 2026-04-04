from pydantic import BaseModel
from typing import List

class Price(BaseModel):
    price: float
    diff : float
    percentage_diff: float

    class Config:
        arbitrary_types_allowed = True

class PriceHistory(BaseModel):
    timestamps: List[str]
    prices: List[float]

class News(BaseModel):
    title: str
    url: str
    summary: str
    pub_date:str






