### Prediction Market Matching Engine - Frontend
React + Vite frontend for interacting with the prediction market backend.

## Overview
Provides a clean, modern interface to:
- Submit BUY/SELL orders for YES/NO shares
- View the live order book (bids & asks)
- See trade history with timestamps
- Monitor market updates in real-time 

Built with React 18, Tailwind CSS, and Axios.

## Features
- Order Submission: Form for sending orders to backend
- Order Book Display: Live bids & asks for YES/NO
- Trade History: Most recent trades with buyer/seller info
- Market Statistics: Auto-refreshing every 2 seconds
- Responsive Design: Works on mobile & desktop
- Proxy Support: API requests proxied in development to backend


## Installation & Running Locally

**Install Dependencies** 
cd frontend
npm install

**Start Dev Server**
npm run dev

Default URL: http://localhost:5173

**Environment Variables**
Create .env or .env.local:
VITE_API_BASE_URL=http://localhost:8000   # Backend API URL


**Build for Production**
npm run build

Outputs static files to dist/. Can be served via Nginx, Vercel, or any static file server.


## Docker Setup
# Node + Vite
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Nginx to serve frontend
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

- Frontend Docker uses Vite build → Nginx serve
- Proxy API requests via /api if needed


## Technologies
- React 18, Vite
- TypeScript (optional)
- Tailwind CSS for styling
- Axios for API calls
- React Hook Form for order submission


## License
MIT License
