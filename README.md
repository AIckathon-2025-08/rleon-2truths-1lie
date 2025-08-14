# Two Truths & A Lie Game

An interactive town hall game where employees vote on which statement they think is the lie about their candidates. Built for Test IO with real-time voting engagement and professional branding.

## 🎯 Project Overview

- **Frontend**: React + TailwindCSS with Test IO branding
- **Backend**: Node.js + Express + Socket.io for real-time voting
- **Architecture**: Monorepo with Docker Compose deployment
- **Status**: 90% complete - Backend tested, Frontend functional, Professional Docker setup complete

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- **Just** (modern command runner) - *recommended for best dev experience*

### Quick Setup with Just (Recommended)

**Install Just**:
```bash
# macOS/Linux (curl method)
curl --proto '=https' --tlsv1.2 -sSf https://just.systems/install.sh | bash -s -- --to ~/bin
export PATH="$HOME/bin:$PATH"

# macOS (Homebrew)
brew install just

# Any platform (Rust)
cargo install just
```

**Start Development**:
```bash
just setup      # Install all dependencies
just dev        # Start both frontend + backend servers
```

See [`DEV-SETUP.md`](./DEV-SETUP.md) for complete Just commands and modern development workflow.

### Traditional Setup (Alternative)

```bash
# Install backend dependencies
cd backend
npm install

# Start backend server (port 3001)
npm start

# In a new terminal - Install frontend dependencies
cd frontend
npm install

# Start frontend dev server (port 5173)
npm run dev
```

**Backend API**: http://localhost:3001  
**Frontend Dev**: http://localhost:5173

### Docker Development

```bash
# Start full stack with Docker Compose
docker-compose up --build
```

## 📁 Project Structure

```
alckathon/
├── backend/                    # Node.js + Express + Socket.io ✅
│   ├── Dockerfile             # Production-optimized container
│   ├── server.js              # Main server with Socket.io + health checks
│   ├── routes/                # REST API endpoints  
│   ├── middleware/            # File upload handling
│   ├── utils/                 # Game state management
│   └── uploads/               # Candidate photos
├── frontend/                   # React + TailwindCSS ✅
│   ├── Dockerfile             # Multi-stage build (Node.js → nginx)
│   ├── nginx.conf             # Reverse proxy + WebSocket config
│   ├── src/                   # React application with TestIO branding
│   └── public/                # Static assets
├── docker-compose.dev.yml      # Development environment
├── docker-compose.prod.yml     # Production environment  
├── docker-compose.demo.yml     # Competition demo environment
├── justfile                   # Modern command runner (2025)
├── PRPs/                      # Product Requirement Prompts
├── WIREFRAMES.md              # UI design specifications
└── CLAUDE.md                  # Development instructions
```

## 🎮 Game Flow

1. **Admin Setup**: Upload candidate photo, enter name and 3 statements
2. **Game Creation**: Generate unique voting link and results URL
3. **Real-time Voting**: Employees vote on which statement is the lie
4. **Live Results**: Progress bars update in real-time as votes come in
5. **Answer Reveal**: Admin reveals the correct answer

## 🎬 Live Demo & Screenshots

**📸 Visual Demo**: See [DEMO.md](./DEMO.md) for complete screenshot walkthrough

**🚀 Interactive Demo**: Run the full demonstration:
```bash
./run-demo.sh         # Interactive demo menu
./capture-demo-screenshots.sh  # Capture fresh screenshots
```

**Key Demo Features:**
- ✅ Complete admin-to-results workflow
- ✅ Vote hiding to prevent bias
- ✅ Dark/light theme switching  
- ✅ Real-time WebSocket updates
- ✅ Celebration effects on reveal
- ✅ Professional TestIO branding

## 🔧 API Endpoints

### REST API ✅ Implemented & Tested
- `POST /api/games` - Create new voting game with photo upload
- `GET /api/games/:gameId` - Get game information and vote counts  
- `GET /uploads/:filename` - Serve uploaded candidate photos

### Socket.io Events ✅ Implemented & Tested
- `join-game` - Join game room for real-time updates
- `cast-vote` - Vote casting with live broadcast to all clients
- `reveal-answer` - Admin answer reveal with authentication
- `vote-update` - Real-time vote count broadcasts
- `answer-reveal` - Answer reveal broadcasts

## 🎨 Test IO Branding

- **Primary Blue**: #1E40AF
- **Secondary Teal**: #0891B2
- **Accent Gray**: #6B7280
- **Background White**: #FFFFFF

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests (when ready)
cd frontend
npm test

# End-to-end tests
npm run test:e2e
```

## 📝 Development Commands

### Modern Workflow with Just (Recommended)
```bash
# Development
just dev           # Start both frontend + backend
just dev-frontend  # Frontend only (React + Vite)  
just dev-backend   # Backend only (Node.js + Socket.io)

# Quality Tools
just format        # Prettier code formatting
just lint          # ESLint code linting
just audit         # Security vulnerability scanning
just check         # Run all quality checks

# Build & Test
just build         # Production builds
just test          # Run unit tests
just test-e2e      # Playwright end-to-end tests

# Utilities
just clean         # Clean build artifacts
just install       # Install all dependencies
just setup         # Initial project setup

# Competition Commands
just demo          # Quick demo setup for judges
just --list        # Show all available commands
```

### Traditional npm Commands (Alternative)
```bash
# Backend
npm run dev        # Development with nodemon
npm run lint       # ESLint code quality
npm test           # Jest unit tests

# Frontend
npm run dev        # Vite development server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # ESLint + Prettier
npm run type-check # TypeScript validation
npm run test:e2e   # Playwright testing
```

## 🐳 Professional Docker Containerization

Complete multi-environment Docker setup with nginx reverse proxy, WebSocket support, and production optimizations.

### Quick Start with Docker

**Competition Demo** (Recommended for judges):
```bash
just docker-demo          # Start demo on http://localhost:8080
```

**Development Environment** (Hot reload + Live coding):
```bash
just docker-dev            # Start with volume mounts for live development
just docker-dev-logs       # View all container logs
just docker-dev-logs backend  # View backend logs only
```

**Production Environment** (Optimized + Health checks):
```bash
just docker-prod           # Start production containers on port 80
just docker-prod-logs      # View production logs
```

### Docker Compose Files

- **`docker-compose.dev.yml`** - Development with hot reload, volume mounts, exposed ports
- **`docker-compose.prod.yml`** - Production with health checks, restart policies, optimized builds
- **`docker-compose.demo.yml`** - Competition demo on port 8080, fast startup, easy cleanup

### Container Architecture

- **Frontend Container**: Multi-stage build (Node.js → nginx) with React app and reverse proxy
- **Backend Container**: Node.js + Express + Socket.io with non-root security
- **nginx Reverse Proxy**: Handles static files, API routing, and WebSocket upgrades for Socket.io

### Docker Utility Commands

```bash
just docker-build dev      # Build development images
just docker-build prod     # Build production images
just docker-clean          # Remove all containers, volumes, and images
just docker-stop demo      # Stop demo environment
just docker-restart prod   # Restart production containers
```

### Features
- ✅ **Cross-platform compatibility** (docker-compose vs docker compose)
- ✅ **Multi-stage builds** for optimized container sizes
- ✅ **nginx WebSocket proxy** preserving Socket.io real-time functionality
- ✅ **Health checks** and automatic restart policies
- ✅ **Volume persistence** for file uploads
- ✅ **Professional security** (non-root users, Alpine images)

## 📚 Documentation

- **[DEMO.md](./DEMO.md)** - 🎬 Complete visual demo with screenshots
- **[Wireframes](./WIREFRAMES.md)** - UI design specifications
- **[Development Guide](./CLAUDE.md)** - Detailed development instructions
- **[PRPs](./PRPs/)** - Product Requirement Prompts and planning

## 🏗️ Architecture

- **Real-time Communication**: Socket.io WebSocket connections
- **State Management**: In-memory storage with Map/Object for session data
- **File Upload**: Multer middleware for candidate photos
- **Session Management**: Browser-based session IDs to prevent duplicate voting
- **Error Handling**: Comprehensive validation and graceful degradation

## 🤝 Contributing

1. Follow Test IO brand guidelines for all UI components
2. Use established Socket.io event naming conventions (kebab-case)
3. Maintain real-time state synchronization across clients
4. Run linting and type checking before commits

## 📄 License

Internal Test IO project for hackathon development.