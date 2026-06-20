#!/bin/bash

TOKEN="paste_your_jwt_token_here"
SYMBOLS=("AAPL" "TSLA" "GOOGL" "MSFT" "AMZN")

for symbol in "${SYMBOLS[@]}"
do
  echo "Importing historical data for $symbol..."
  curl -s -X POST "http://localhost:5000/api/historical/import/$symbol" \
    -H "Authorization: Bearer $TOKEN"
  echo ""
  sleep 1
done

echo "All symbols imported."