### Prediction Market Matching Engine - Backend
FastAPI backend implementing order matching logic for a prediction market platform.

## Overview
The backend handles:
- Receiving new orders (POST /orders)
- Maintaining an in-memory order book for one or multiple markets
- Implementing FIFO + price-priority matching
- Supporting BUY/SELL for YES/NO shares
- Limit orders, market orders, partial fills
- Preventing self-matching
- Concurrency-safe processing

This service exposes a REST API for frontend consumption.

## Features
- Order Book Management: Efficient in-memory storage of orders
- Matching Engine: Implements matching logic for incoming orders
- Trade Management: Records executed trades with timestamps
- API Documentation: Swagger UI and ReDoc available automatically
- Health Checks: Endpoint to verify service status
- Concurrency: Locks for single-market processing


## Installation & Running Locally

**Using Python Virtual Environment**
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload

**Access:**
Swagger UI: http://localhost:8000/docs
ReDoc: http://localhost:8000/redoc

**Using Docker**
docker build -t prediction-backend .
docker run -p 8000:8000 prediction-backend


## API Endpoints

**Orders**
| Endpoint             | Method | Description                                                                               |
| -------------------- | ------ | ----------------------------------------------------------------------------------------- |
| `/orders`            | POST   | Submit a new order (`market_id`, `account_id`, `side`, `order_type`, `price`, `quantity`) |
| `/orders/{order_id}` | GET    | Retrieve a specific order                                                                 |

**Order Book** 
| Endpoint                  | Method | Description                       |
| ------------------------- | ------ | --------------------------------- |
| `/order-book/{market_id}` | GET    | Current snapshot of YES/NO orders |


**Trades**
| Endpoint                       | Method | Description                          |
| ------------------------------ | ------ | ------------------------------------ |
| `/trades/{market_id}?limit=50` | GET    | Get recent trades (default limit 50) |


**System**
| Endpoint  | Method | Description                 |
| --------- | ------ | --------------------------- |
| `/health` | GET    | Health check                |
| `/`       | GET    | Root endpoint with API info |


## Matching Rules
- Price Priority – better prices execute first
- FIFO – orders with the same price execute in order received
- No Self-Matching – orders from the same account cannot match
- Partial Fills – unmatched portion remains in order book
- YES+NO=100 – price invariant enforced 


## Dockerfile
- Python 3.9-slim
- uvicorn server with reload in dev
- Healthcheck included
- Non-root user (appuser) for security 

## License 
MIT License

