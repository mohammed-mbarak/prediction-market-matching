#!/bin/sh
echo "Waiting for backend..."
while ! nc -z backend 8000; do
  sleep 2
done
echo "Backend is up, starting Nginx..."
exec nginx -g "daemon off;"
