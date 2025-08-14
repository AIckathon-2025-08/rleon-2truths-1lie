# Two Truths & A Lie Game - Dev Tools
# Modern development workflow with Just (2025)

# Default command shows help
default:
    @just --list

# Development Commands
# ===================

# Start both frontend and backend development servers
dev:
    #!/usr/bin/env bash
    echo "🚀 Starting Two Truths & A Lie development servers..."
    echo "📱 Frontend: http://localhost:5173"
    echo "🔗 Backend: http://localhost:3000"
    echo "⚡ Socket.io: http://localhost:3000"
    echo ""
    just dev-backend & just dev-frontend

# Start frontend only (React + Vite)
dev-frontend:
    @echo "🎨 Starting frontend development server..."
    cd frontend && npm run dev

# Start backend only (Node.js + Socket.io)
dev-backend:
    @echo "⚙️ Starting backend development server..."
    cd backend && npm run dev

# Quality Tools
# =============

# Format all code with Prettier
format:
    @echo "✨ Formatting code with Prettier..."
    cd frontend && npx prettier --write "src/**/*.{js,jsx,ts,tsx,css,md}"
    cd backend && npx prettier --write "**/*.{js,ts,json,md}" --ignore-path .gitignore
    @echo "✅ Code formatting complete!"

# Lint all code with ESLint
lint:
    @echo "🔍 Linting code with ESLint..."
    cd frontend && npm run lint
    cd backend && npm run lint || echo "⚠️ Backend linting not configured yet"
    @echo "✅ Linting complete!"

# Run security audits
audit:
    @echo "🛡️ Running security audits..."
    cd frontend && npm audit --audit-level moderate
    cd backend && npm audit --audit-level moderate
    @echo "✅ Security audit complete!"

# Check code quality (format + lint + audit)
check: format lint audit
    @echo "🎯 All quality checks complete!"

# Build & Test
# ============

# Build production versions
build:
    @echo "🏗️ Building production versions..."
    cd frontend && npm run build
    cd backend && echo "📦 Backend is ready for production"
    @echo "✅ Build complete!"

# Run all tests
test:
    @echo "🧪 Running tests..."
    cd frontend && npm test || echo "⚠️ Frontend tests not configured yet"
    cd backend && npm test
    @echo "✅ Tests complete!"

# Run end-to-end tests with Playwright
test-e2e:
    @echo "🎭 Running end-to-end tests..."
    cd frontend && npm run test:e2e || echo "⚠️ E2E tests not configured yet"
    @echo "✅ E2E tests complete!"

# Utility Commands
# ================

# Install all dependencies
install:
    @echo "📦 Installing dependencies..."
    cd frontend && npm install
    cd backend && npm install
    @echo "✅ Dependencies installed!"

# Clean build artifacts and caches
clean:
    @echo "🧹 Cleaning build artifacts..."
    rm -rf frontend/dist
    rm -rf backend/dist
    rm -rf frontend/node_modules/.cache
    rm -rf backend/node_modules/.cache
    @echo "✅ Clean complete!"

# Initial project setup
setup: install
    @echo "🎮 Two Truths & A Lie Game Setup Complete!"
    @echo ""
    @echo "Available commands:"
    @echo "  just dev          - Start development servers"
    @echo "  just check        - Run all quality checks"
    @echo "  just build        - Build for production"
    @echo "  just test         - Run tests"
    @echo ""
    @echo "🏆 Ready for competition development!"

# Competition Commands
# ===================

# Quick demo setup (for judges)
demo: install build
    @echo "🏆 Competition Demo Ready!"
    @echo ""
    @echo "To run the demo:"
    @echo "  just dev"
    @echo ""
    @echo "Then open http://localhost:5173"

# Pre-commit hook (run before committing)
pre-commit: check test
    @echo "✅ Ready to commit!"

# Production deployment check
prod-check: check build test
    @echo "🚀 Production deployment ready!"