from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
import uuid


@dataclass
class Order:
    order_id: str
    account_id: str
    market_id: str
    side: str  # YES or NO
    order_type: str  # BUY or SELL
    price: int  # 0-100 cents
    quantity: int
    filled_quantity: int = 0
    status: str = "OPEN"
    timestamp: datetime = field(default_factory=datetime.now)
    
    @property
    def remaining_quantity(self) -> int:
        return self.quantity - self.filled_quantity
    
    @property
    def is_market_order(self) -> bool:
        return self.price == 0 and self.order_type == "SELL"
    
    def fill(self, quantity: int) -> None:
        if quantity > self.remaining_quantity:
            raise ValueError("Cannot fill more than remaining quantity")
        self.filled_quantity += quantity
        if self.filled_quantity == self.quantity:
            self.status = "FILLED"
        elif self.filled_quantity > 0:
            self.status = "PARTIALLY_FILLED"


@dataclass
class Trade:
    trade_id: str
    market_id: str
    buyer_account: str
    seller_account: str
    side: str  # YES or NO
    price: int
    quantity: int
    timestamp: datetime = field(default_factory=datetime.now)