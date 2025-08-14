# Two Truths & A Lie Game

An interactive town hall game where employees vote on which statement they think is the lie about their candidates. Built for Test IO with real-time voting engagement and professional branding.

## 🎯 Project Overview

- **Frontend**: React + TailwindCSS with Test IO branding
- **Backend**: Node.js + Express + Socket.io for real-time voting
- **Architecture**: Monorepo with Docker Compose deployment
- **Status**: 50% complete - Backend fully implemented and tested, Frontend ready for development

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
├── backend/                # Node.js + Express + Socket.io ✅
│   ├── server.js          # Main server with Socket.io
│   ├── routes/            # REST API endpoints  
│   ├── middleware/        # File upload handling
│   ├── utils/             # Game state management
│   └── uploads/           # Candidate photos
├── frontend/              # React + TailwindCSS ✅
├── PRPs/                  # Product Requirement Prompts
├── WIREFRAMES.md          # UI design specifications
├── CLAUDE.md              # Development instructions
└── docker-compose.yml     # Deployment configuration
```

## 🎮 Game Flow

1. **Admin Setup**: Upload candidate photo, enter name and 3 statements
2. **Game Creation**: Generate unique voting link and results URL
3. **Real-time Voting**: Employees vote on which statement is the lie
4. **Live Results**: Progress bars update in real-time as votes come in
5. **Answer Reveal**: Admin reveals the correct answer

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

## 🐳 Docker Deployment

```bash
# Development
docker-compose up --build

# Production
docker-compose -f docker-compose.prod.yml up --build
```

## 📚 Documentation

- [Wireframes](./WIREFRAMES.md) - Complete UI design specifications
- [Development Guide](./CLAUDE.md) - Detailed development instructions
- [PRPs](./PRPs/) - Product Requirement Prompts and planning

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