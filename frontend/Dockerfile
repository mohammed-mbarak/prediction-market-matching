# =========================
# Stage 1: Build
# =========================
FROM node:20-alpine AS build

WORKDIR /app

# Copy only package files first (better caching)
COPY package*.json ./

# Harden npm against network instability
RUN npm cache clean --force \
 && npm config set fetch-retries 10 \
 && npm config set fetch-retry-mintimeout 60000 \
 && npm config set fetch-retry-maxtimeout 600000 \
 && npm install

# Copy the rest of the source code
COPY . .

# Build-time API base URL (used by Vite)
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Build production assets
RUN npm run build

# =========================
# Stage 2: Production (Nginx)
# =========================
FROM nginx:alpine AS prod

# Copy built frontend
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80

# Use JSON array form to run the script (signal-safe)
CMD ["/start.sh"]
