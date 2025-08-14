# 🏆 Two Truths & A Lie - Competition Dev Setup

Modern development workflow with **Just** (2025) - the flashy, impressive choice for competition judges!

## Quick Start

### 1. Install Just (Command Runner)
```bash
# macOS/Linux
curl --proto '=https' --tlsv1.2 -sSf https://just.systems/install.sh | bash -s -- --to ~/bin
export PATH="$HOME/bin:$PATH"

# Or via package managers
brew install just           # macOS
cargo install just          # Rust
```

### 2. Setup Project
```bash
just setup
```

### 3. Start Development
```bash
just dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Available Commands

### 🚀 Development
- `just dev` - Start both frontend + backend
- `just dev-frontend` - React + Vite only
- `just dev-backend` - Node.js + Socket.io only

### 🎯 Quality Tools
- `just format` - Prettier code formatting
- `just lint` - ESLint code linting
- `just audit` - Security vulnerability scanning
- `just check` - Run all quality checks

### 🏗️ Build & Test
- `just build` - Production builds
- `just test` - Run unit tests
- `just test-e2e` - Playwright end-to-end tests

### 🛠️ Utilities
- `just install` - Install all dependencies
- `just clean` - Clean build artifacts
- `just setup` - Initial project setup

### 🐳 Docker Commands
- `just docker-demo` - Competition demo on port 8080
- `just docker-dev` - Development with hot reload
- `just docker-prod` - Production environment
- `just docker-build dev` - Build development images
- `just docker-clean` - Clean up all containers/volumes
- `just docker-stop demo` - Stop demo environment

### 🏆 Competition Commands
- `just demo` - Quick demo setup for judges
- `just docker-demo` - Containerized demo (impressive!)
- `just pre-commit` - Run before committing
- `just prod-check` - Production readiness check

## Why Just Instead of Make?

✨ **Modern & Flashy**: Shows technical sophistication for 2025  
🚀 **Better DX**: Clear syntax and error messages  
🌐 **Cross-Platform**: Works on Windows, macOS, Linux  
📚 **Self-Documenting**: `just --list` shows all commands  
🎯 **Competition Appeal**: Trendy tool choice that impresses judges

## Tech Stack

- **Frontend**: React 19 + Vite + TailwindCSS v4
- **Backend**: Node.js + Express + Socket.io
- **Testing**: Jest + Playwright
- **Quality**: ESLint + Prettier
- **Dev Tools**: Just + modern workflow

Ready to win this competition! 🎮🏆