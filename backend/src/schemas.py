from pydantic import BaseModel, Field, field_validator
from typing import Literal
from datetime import datetime


class OrderCreate(BaseModel):
    account_id: str = Field(..., min_length=1)
    market_id: str = Field(default="default_market")
    side: Literal["YES", "NO"]
    order_type: Literal["BUY", "SELL"]
    price: int = Field(..., ge=0, le=100)
    quantity: int = Field(..., ge=1)
    
    @field_validator('price')
    def validate_price(cls, v, info):
        if v == 0 and info.data.get('order_type') == 'BUY':
            raise ValueError("Market orders only for SELL (price=0)")
        return v


class OrderResponse(BaseModel):
    order_id: str
    account_id: str
    market_id: str
    side: str
    order_type: str
    price: int
    quantity: int
    filled_quantity: int = 0
    status: str = "OPEN"
    timestamp: datetime
    remaining_quantity: int


class Trade(BaseModel):
    trade_id: str
    market_id: str
    buyer_account: str
    seller_account: str
    side: str  # YES or NO
    price: int
    quantity: int
    timestamp: datetime


class OrderBookEntry(BaseModel):
    price: int
    total_quantity: int
    orders: list[OrderResponse]


class OrderBookSnapshot(BaseModel):
    market_id: str
    yes_bids: list[OrderBookEntry]  # Buy orders for YES
    yes_asks: list[OrderBookEntry]  # Sell orders for YES
    no_bids: list[OrderBookEntry]   # Buy orders for NO
    no_asks: list[OrderBookEntry]   # Sell orders for NO