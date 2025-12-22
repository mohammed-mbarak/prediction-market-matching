import heapq
import uuid
from typing import Dict, List
from threading import Lock

from .models import Order, Trade
from .schemas import OrderResponse


class OrderBook:
    def __init__(self, market_id: str):
        self.market_id = market_id

        self.yes_bids = []
        self.yes_asks = []
        self.no_bids = []
        self.no_asks = []

        self.orders: Dict[str, Order] = {}
        self.trades: List[Trade] = []

        self.lock = Lock()

    def _add_to_heap(self, heap: List, order: Order, is_bid: bool) -> None:
        price = -order.price if is_bid else order.price
        heapq.heappush(heap, (price, order.timestamp.timestamp(), order.order_id))

    def add_order(self, order: Order) -> List[Trade]:
        with self.lock:
            self.orders[order.order_id] = order

            if order.side == "YES":
                opposite, same, is_bid = (
                    (self.yes_asks, self.yes_bids, True)
                    if order.order_type == "BUY"
                    else (self.yes_bids, self.yes_asks, False)
                )
            else:
                opposite, same, is_bid = (
                    (self.no_asks, self.no_bids, True)
                    if order.order_type == "BUY"
                    else (self.no_bids, self.no_asks, False)
                )

            trades = self._match_order(order, opposite)

            if order.remaining_quantity > 0 and order.price > 0:
                self._add_to_heap(same, order, is_bid)

            return trades

    def _match_order(self, incoming: Order, opposite: List) -> List[Trade]:
        trades = []

        while opposite and incoming.remaining_quantity > 0:
            price, _, order_id = opposite[0]
            price = -price if incoming.order_type == "SELL" else price

            resting = self.orders[order_id]

            if resting.account_id == incoming.account_id:
                break

            can_match = (
                incoming.price >= price if incoming.order_type == "BUY"
                else incoming.price <= price
            ) or incoming.is_market_order

            if not can_match:
                break

            qty = min(incoming.remaining_quantity, resting.remaining_quantity)

            incoming.fill(qty)
            resting.fill(qty)

            trade = Trade(
                trade_id=str(uuid.uuid4()),
                market_id=self.market_id,
                buyer_account=incoming.account_id if incoming.order_type == "BUY" else resting.account_id,
                seller_account=resting.account_id if incoming.order_type == "BUY" else incoming.account_id,
                side=incoming.side,
                price=price,
                quantity=qty,
            )

            self.trades.append(trade)
            trades.append(trade)

            if resting.remaining_quantity == 0:
                heapq.heappop(opposite)

        return trades

    def get_order_book_snapshot(self) -> dict:
        with self.lock:

            def aggregate(heap: List, is_bid: bool):
                levels = {}
                for price, _, oid in heap:
                    price = -price if is_bid else price
                    order = self.orders[oid]
                    if order.remaining_quantity <= 0:
                        continue

                    level = levels.setdefault(price, {
                        "price": price,
                        "total_quantity": 0,
                        "orders": []
                    })

                    level["total_quantity"] += order.remaining_quantity
                    
                    # Create order dict with all required fields including remaining_quantity
                    order_dict = order.__dict__.copy()
                    order_dict["remaining_quantity"] = order.remaining_quantity
                    level["orders"].append(OrderResponse(**order_dict))

                return sorted(levels.values(), key=lambda x: x["price"], reverse=is_bid)

            return {
                "market_id": self.market_id,
                "yes_bids": aggregate(self.yes_bids, True),
                "yes_asks": aggregate(self.yes_asks, False),
                "no_bids": aggregate(self.no_bids, True),
                "no_asks": aggregate(self.no_asks, False),
            }

    def get_trades(self, limit: int = 50) -> List[Trade]:
        with self.lock:
            return sorted(self.trades, key=lambda t: t.timestamp)[-limit:]