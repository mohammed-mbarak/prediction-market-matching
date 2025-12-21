from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .matching_engine import MatchingEngine
from .schemas import OrderCreate, OrderResponse, Trade as TradeSchema, OrderBookSnapshot
from .models import Order
import uuid

app = FastAPI(title="Prediction Market Matching Engine")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize matching engine
matching_engine = MatchingEngine()


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Prediction Market Matching Engine API",
        "version": "1.0.0",
        "endpoints": {
            "submit_order": "/orders (POST)",
            "get_order": "/orders/{order_id} (GET)",
            "get_order_book": "/order-book/{market_id} (GET)",
            "get_trades": "/trades/{market_id} (GET)",
            "health": "/health (GET)",
            "docs": "/docs (GET)",
            "redoc": "/redoc (GET)"
        }
    }


@app.post("/orders", response_model=dict)
async def create_order(order: OrderCreate):
    """Submit a new order."""
    try:
        # Validate minimum quantity
        if order.quantity < 1:
            raise HTTPException(status_code=400, detail="Minimum order quantity is 1")

        # Validate side
        if order.side not in ["YES", "NO"]:
            raise HTTPException(status_code=400, detail="Invalid side, must be YES or NO")

        # Process order
        result = matching_engine.process_order(
            market_id=order.market_id,
            order_data=order.model_dump()  # Pydantic v2
        )

        # Convert trades to Pydantic models
        trades = [TradeSchema(**t.__dict__) for t in result["trades"]]

        # Convert order to Pydantic model
        order_resp = OrderResponse(
            order_id=result["order"].order_id,
            account_id=result["order"].account_id,
            market_id=result["order"].market_id,
            side=result["order"].side,
            order_type=result["order"].order_type,
            price=result["order"].price,
            quantity=result["order"].quantity,
            filled_quantity=result["order"].filled_quantity,
            status=result["order"].status,
            timestamp=result["order"].timestamp,
            remaining_quantity=result["order"].remaining_quantity
        )

        return {
            "order": order_resp,
            "trades": trades
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/orders/{order_id}", response_model=OrderResponse)
async def get_order(order_id: str):
    """Get specific order by order_id."""
    order = matching_engine.get_order_by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return OrderResponse(
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
        remaining_quantity=order.remaining_quantity
    )


@app.get("/order-book/{market_id}", response_model=OrderBookSnapshot)
async def get_order_book(market_id: str):
    """Get the current order book for a market."""
    order_book = matching_engine.get_order_book(market_id)
    snapshot = order_book.get_order_book_snapshot()
    return snapshot


@app.get("/trades/{market_id}", response_model=list[TradeSchema])
async def get_trades(market_id: str, limit: int = 50):
    """Get recent trades for a market."""
    order_book = matching_engine.get_order_book(market_id)
    trades = order_book.get_trades(limit)
    # Convert to Pydantic for proper JSON serialization
    return [TradeSchema(**t.__dict__) for t in trades]


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
