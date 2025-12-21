# Prediction Market Matching Engine

A full-stack application implementing order matching logic for a prediction market exchange, allowing users to trade YES/NO shares on events. Prices for YES/NO always sum to 100 cents. This project demonstrates core matching algorithms, order books, trades, and real-time updates in a React frontend.

## Overview

This application implements a simplified prediction market exchange:
- Users submit BUY/SELL orders for YES or NO shares on an event.
- The system ensures YES + NO = 100 cents.
- Orders are processed using FIFO/price-priority matching.
- Partial fills and market orders are supported.
- Demonstrates real-time order book and trade updates via a React UI.

## Features
**Backend**
- FastAPI REST API
- In-memory order book management
- Matching engine with price/FIFO priority
- Partial fills and market order support
- Concurrency handling (thread-safe)
- Automatic API documentation via Swagger/OpenAPI

**Frontend**
- React + Vite frontend
- Order submission form (BUY/SELL, YES/NO, limit/market orders)
- Live order book visualization
- Trade history display
- Responsive design (desktop + mobile)
- Real-time updates using polling

## Architecture

┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  Frontend   │──────▶│    API      │──────▶│ Matching    │
│  (React)    │◀─────│  (FastAPI)  │◀─────│  Engine     │
└─────────────┘       └─────────────┘       └─────────────┘

- Frontend communicates via HTTP/REST API.
- Backend handles order validation, matching, and order book maintenance.
- Matching Engine applies price + time priority for orders.


## Quick Start

**Backend**
FastAPI service managing orders, order book, and trades.

**Features**
- REST endpoints for order submission and retrieval
- Efficient in-memory order book (priority queues/sorted structures)
- Matching logic: limit/market orders, partial fills, no self-matching
- Type-safe with Pydantic models
- Automatic Swagger & ReDoc API docs


**Running Locally**
- cd backend
- python -m venv venv
- source venv/bin/activate  # Windows: venv\Scripts\activate
- pip install -r requirements.txt
- uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload

**API docs:**
Swagger UI: http://localhost:8000/docs
ReDoc: http://localhost:8000/redoc


**Frontend**
React-based interface for interacting with the prediction market.

**Features**
- Submit new orders (BUY/SELL, YES/NO, price, quantity)
- View live order book (YES/NO bids/asks)
- Trade history with timestamps and accounts
- Auto-refresh every 2 seconds for real-time updates
- Responsive layout for desktop/mobile

**Running Locally**
- cd frontend
- npm install
- npm run dev

Frontend runs at: http://localhost:5173

## Installation and Quick Start

**Using Docker (Recommended)**
- git clone <repository-url>
- cd prediction-market-matching
- cp .env.example .env
- docker-compose up --build

- Frontend: http://localhost:80 (production)
- Backend API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs


## Without Docker
1. Start the backend:
- cd backend
- pip install -r requirements.txt
- uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

2. Start the frontend:
- cd frontend
- npm install
- npm run dev


## Docker Setup
- Backend: Python 3.9-slim with uvicorn + FastAPI
- Frontend: Node.js + Vite build, served with Nginx
- Docker Compose orchestrates both services
- Proxy setup allows /api requests from frontend to backend

## API Endpoints

**Orders**
- POST /orders – Submit a new order
- Request body: market_id, account_id, side (YES/NO), order_type (BUY/SELL), price, quantity
- Response: Newly created order and any resulting trades
- GET /orders/{order_id} – Get specific order by its ID
- Response: Order details including filled/remaining quantity, status, timestamp

**Order Book**
- GET /order-book/{market_id} – Get the current order book for a market
- Response: Snapshot of resting orders for YES and NO sides

- GET /trades/{market_id}?limit=50 – Get recent trades for a market
- Optional query parameter: limit (default: 50)

**Market Information**
- GET /health – Health check
- GET / – Root endpoint with API information
- GET /docs – Swagger UI documentation
- GET /redoc – ReDoc documentation

**Order Types**
- Limit Orders: Orders with specific price
- Market Orders: Orders executed at the best available price (price=0)
- YES/NO Orders: Buy/Sell orders for YES or NO shares

**Matching Rules**
- Price Priority: Better prices execute first
- FIFO: Orders at same price execute in time priority
- No Self-Matching: Orders from same account don't match
- Partial Fills: Orders can be partially filled
- YES+NO=100: Price invariant maintained


## Assessment Requirements Coverage
This implementation satisfies the take-home assignment:

**Backend**
- Receives orders via API
- Maintains in-memory order book
- Implements matching engine (FIFO + price priority)
- Supports BUY/SELL, YES/NO, limit/market, partial fills
- Prevents self-matching, enforces minimum order quantity
- Concurrency-safe for single-market order processing

**Frontend**
- Form for submitting orders
- Displays current order book (YES/NO)
- Shows resulting trades
- Auto-refreshes and real-time updates

**Data Structures**
Priority queues or sorted lists used for efficient matching

**Dockerized**
Full-stack app runs via docker-compose