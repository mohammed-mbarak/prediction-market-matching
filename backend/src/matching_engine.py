from typing import Dict
from .order_book import OrderBook


class MatchingEngine:
    def __init__(self):
        self.order_books: Dict[str, OrderBook] = {}
    
    def get_order_book(self, market_id: str) -> OrderBook:
        """Get or create order book for a market."""
        if market_id not in self.order_books:
            self.order_books[market_id] = OrderBook(market_id)
        return self.order_books[market_id]
    
    def process_order(self, market_id: str, order_data: dict) -> dict:
        """Process a new order through the matching engine."""
        from .models import Order
        import uuid
        
        order_book = self.get_order_book(market_id)
        
        # Create order object
        order = Order(
            order_id=str(uuid.uuid4()),
            **order_data
        )
        
        # Match the order
        trades = order_book.add_order(order)
        
        return {
            "order": order,
            "trades": trades
        }