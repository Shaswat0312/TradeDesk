#!/bin/bash

echo "Starting TradeDesk..."

echo "Starting Docker containers (PostgreSQL + Redis)..."
docker compose up -d

echo "Waiting for containers to be ready..."
sleep 3

echo "Starting backend server..."
cd backend
npm run dev