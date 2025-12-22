from dataclasses import dataclass, field
from datetime import datetime
import uuid


@dataclass
class Order:
    order_id: str
    account_id: str
    market_id: str
    side: str  # YES / NO
    order_type: str  # BUY / SELL
    price: int  # 0–100
    quantity: int
    filled_quantity: int = 0
    status: str = "OPEN"
    timestamp: datetime = field(default_factory=datetime.now)

    def __post_init__(self):
        if self.quantity < 1:
            raise ValueError("Minimum order quantity is 1")

        if not (0 <= self.price <= 100):
            raise ValueError("Price must be between 0 and 100")

        if self.price == 0 and self.order_type != "SELL":
            raise ValueError("Market orders must be SELL orders")

        if self.side not in {"YES", "NO"}:
            raise ValueError("Invalid side")

        if self.order_type not in {"BUY", "SELL"}:
            raise ValueError("Invalid order type")

    @property
    def remaining_quantity(self) -> int:
        return self.quantity - self.filled_quantity

    @property
    def is_market_order(self) -> bool:
        return self.price == 0

    def fill(self, qty: int) -> None:
        if qty > self.remaining_quantity:
            raise ValueError("Overfill")
        self.filled_quantity += qty
        self.status = (
            "FILLED" if self.remaining_quantity == 0 else "PARTIALLY_FILLED"
        )


@dataclass
class Trade:
    trade_id: str
    market_id: str
    buyer_account: str
    seller_account: str
    side: str
    price: int
    quantity: int
    timestamp: datetime = field(default_factory=datetime.now)
