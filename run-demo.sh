#!/bin/bash

# Demo Runner Script
echo "🎯 Two Truths & A Lie - Demo Options"
echo "===================================="

echo ""
echo "Choose demo type:"
echo "1) 📜 Command line demo (bash script)"
echo "2) 🌐 Browser automation demo (Playwright)"
echo "3) 🚀 Quick API test"
echo ""

read -p "Enter choice (1-3): " choice

case $choice in
  1)
    echo "Running command line demo..."
    ./demo-e2e-flow.sh
    ;;
  2)
    echo "Running Playwright browser demo..."
    if command -v node &> /dev/null; then
      node demo-playwright-e2e.js
    else
      echo "❌ Node.js not found. Please install Node.js to run browser demo."
    fi
    ;;
  3)
    echo "Running quick API test..."
    echo ""
    echo "Testing backend API..."
    
    # Test if backend is running
    if curl -s http://localhost:3001/api/games > /dev/null; then
      echo "✅ Backend is running"
      
      # Create a quick test game
      echo "Creating test game..."
      curl -s -X POST http://localhost:3001/api/games \
        -H "Content-Type: application/json" \
        -d '{
          "name": "Quick Test",
          "statements": ["Statement 1", "Statement 2", "Statement 3"],
          "correctAnswer": 0
        }' | jq '.'
      
    else
      echo "❌ Backend not running. Please start with: cd backend && npm start"
    fi
    
    # Test if frontend is running
    if curl -s http://localhost:5173 > /dev/null; then
      echo "✅ Frontend is running at http://localhost:5173"
    else
      echo "❌ Frontend not running. Please start with: cd frontend && npm run dev"
    fi
    ;;
  *)
    echo "Invalid choice. Please run again and select 1, 2, or 3."
    ;;
esac

echo ""
echo "Demo complete! 🎉"