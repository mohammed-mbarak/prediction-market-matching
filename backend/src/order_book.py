import heapq
import uuid
from typing import Dict, List
from threading import Lock

from .models import Order, Trade
from .schemas import OrderResponse


class OrderBook:
    def __init__(self, market_id: str):
        self.market_id = market_id

        # Heaps
        self.yes_bids = []  # max-heap (negative price)
        self.yes_asks = []  # min-heap
        self.no_bids = []   # max-heap
        self.no_asks = []   # min-heap

        self.orders: Dict[str, Order] = {}
        self.trades: List[Trade] = []

        self.lock = Lock()

    def _add_to_heap(self, heap: List, order: Order, is_bid: bool) -> None:
        if is_bid:
            heapq.heappush(
                heap,
                (-order.price, order.timestamp.timestamp(), order.order_id)
            )
        else:
            heapq.heappush(
                heap,
                (order.price, order.timestamp.timestamp(), order.order_id)
            )

    def add_order(self, order: Order) -> List[Trade]:
        with self.lock:
            self.orders[order.order_id] = order

            if order.side == "YES":
                if order.order_type == "BUY":
                    opposite = self.yes_asks
                    same = self.yes_bids
                    is_bid = True
                else:
                    opposite = self.yes_bids
                    same = self.yes_asks
                    is_bid = False
            else:  # NO
                if order.order_type == "BUY":
                    opposite = self.no_asks
                    same = self.no_bids
                    is_bid = True
                else:
                    opposite = self.no_bids
                    same = self.no_asks
                    is_bid = False

            trades = self._match_order(order, opposite)

            # Add remaining limit orders to book
            if order.remaining_quantity > 0 and order.price > 0:
                self._add_to_heap(same, order, is_bid)

            return trades

    def _match_order(self, incoming: Order, opposite: List) -> List[Trade]:
        trades = []

        while opposite and incoming.remaining_quantity > 0:
            price, ts, order_id = opposite[0]

            # Convert bid price back to positive
            if incoming.order_type == "SELL":
                price = -price

            resting = self.orders[order_id]

            # 🚫 Prevent self-matching
            if resting.account_id == incoming.account_id:
                break

            # Price crossing logic
            if incoming.order_type == "BUY":
                can_match = incoming.price >= price or incoming.is_market_order
            else:
                can_match = incoming.price <= price or incoming.is_market_order

            if not can_match:
                break

            trade_qty = min(
                incoming.remaining_quantity,
                resting.remaining_quantity
            )

            incoming.fill(trade_qty)
            resting.fill(trade_qty)

            if incoming.order_type == "BUY":
                buyer = incoming.account_id
                seller = resting.account_id
            else:
                buyer = resting.account_id
                seller = incoming.account_id

            trade = Trade(
                trade_id=str(uuid.uuid4()),
                market_id=self.market_id,
                buyer_account=buyer,
                seller_account=seller,
                side=incoming.side,
                price=price,
                quantity=trade_qty
            )

            trades.append(trade)
            self.trades.append(trade)

            if resting.remaining_quantity == 0:
                heapq.heappop(opposite)

        return trades

    def get_order_book_snapshot(self) -> dict:
        with self.lock:

            def aggregate(heap: List, is_bid: bool):
                levels = {}

                for price, ts, order_id in heap:
                    if is_bid:
                        price = -price

                    order = self.orders[order_id]
                    if order.remaining_quantity <= 0:
                        continue

                    if price not in levels:
                        levels[price] = {
                            "price": price,
                            "total_quantity": 0,
                            "orders": []
                        }

                    levels[price]["total_quantity"] += order.remaining_quantity
                    levels[price]["orders"].append(
                        OrderResponse(
                            order_id=order.order_id,
                            account_id=order.account_id,
                            market_id=order.market_id,
                            side=order.side,
                            order_type=order.order_type,
                            price=order.price,
                            quantity=order.quantity,
                            filled_quantity=order.filled_quantity,
                            status=order.status,
                            timestamp=order.timestamp,
                            remaining_quantity=order.remaining_quantity,
                        )
                    )

                return sorted(
                    levels.values(),
                    key=lambda x: x["price"],
                    reverse=is_bid
                )

            return {
                "market_id": self.market_id,
                "yes_bids": aggregate(self.yes_bids, True),
                "yes_asks": aggregate(self.yes_asks, False),
                "no_bids": aggregate(self.no_bids, True),
                "no_asks": aggregate(self.no_asks, False),
            }

    def get_trades(self, limit: int = 50) -> List[Trade]:
        with self.lock:
            return self.trades[-limit:]
