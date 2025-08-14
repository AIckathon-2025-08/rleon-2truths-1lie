# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

The year is 2025.

## Repository Overview

This is the **Two Truths & A Lie Game** project - an interactive town hall game where employees vote on which statement they think is the lie about their candidates. The system enables real-time voting engagement for company town hall meetings with Test IO branding and professional aesthetic.

## Current Status & Roadmap

**System Readiness**: 25% complete - Planning and architecture complete, ready for development implementation.

### ✅ Completed Infrastructure
- **Game Architecture**: Real-time voting system with Socket.io WebSocket communication
- **Visual Design**: Test IO brand style guide with professional blue/teal color palette  
- **Tech Stack Selection**: React + TailwindCSS frontend, Node.js/Express backend
- **Wireframes**: Complete UI wireframes for admin setup, voting, and results pages

### 🎯 Current Development Phase
- **Phase 1**: Frontend React application with Test IO styling and TailwindCSS setup
- **Phase 2**: Backend Express server with Socket.io real-time voting infrastructure  
- **Phase 3**: Docker Compose deployment setup and documentation

### 📋 Future Features
- **Game Timer**: Optional countdown for voting rounds
- **Multiple Rounds**: Support for several candidates in one session
- **Enhanced Analytics**: Detailed voting patterns and engagement metrics

## Context-Enriched Decision Making Protocol

- **Executive Context Authority**: You will maintain decision-making authority based on comprehensive context across all agent interactions and research findings
- **Research Context Building**: Proactively gather and organize research context (Crawl4AI, Octocode, SequentialThinking, etc.) to inform intelligent coordination decisions
- **Cross-Agent Context Synthesis**: Integrate findings from agent status reports, research discoveries, and implementation progress to make informed coordination choices
- **Context-Informed Coordination**: Use enriched context to make intelligent agent selection, workflow routing, and complexity assessment decisions
- **Citation & Provenance Tracking**: All research includes source URLs, timestamps, and context provenance for transparency and decision justification
- **Dynamic Context Updates**: Continuously enrich context based on agent findings, user feedback, and implementation discoveries to improve decision quality
- **Intelligent Decision Making**: Use enriched context to make coordination decisions when possible, escalate to user when context is insufficient

## Environment & Setup

### Prerequisites & Key Dependencies
- **Node.js v18+** with **npm** (recommended package manager)
- **Core Libraries**: 
  - React 18.x (frontend UI framework)
  - TailwindCSS 4.x (styling with Test IO brand colors)
  - Express.js (backend web server)
  - Socket.io (real-time WebSocket communication)
  - Vite (development build tool)
- **Testing & Quality**:
  - Playwright (automated browser testing and visual validation)
  - Jest (unit testing framework)
  - React Testing Library (component testing utilities)

### Environment Variables
```bash
# Development Configuration
NODE_ENV=development
PORT=3000
SOCKET_PORT=3001

# Test IO Brand Colors (CSS Custom Properties)
--testio-primary-blue=#1E40AF
--testio-secondary-teal=#0891B2  
--testio-accent-gray=#6B7280
--testio-background-white=#FFFFFF
```

### Project Structure
```
alckathon/
├── frontend/               # React + TailwindCSS application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Admin, Voting, Results pages  
│   │   ├── hooks/          # Socket.io connection hooks
│   │   └── styles/         # Test IO brand styling
│   └── package.json
├── backend/                # Node.js + Express + Socket.io
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── sockets/        # WebSocket event handlers
│   │   └── utils/          # Game state management
│   └── package.json
├── docker-compose.yml      # Development deployment
├── WIREFRAMES.md           # UI design specifications
└── testio-brand-reference.png  # Brand style reference
```

## Quality & Development Standards

### Code Quality Requirements
- **React Patterns**: Functional components with hooks, modern JSX syntax
- **TypeScript**: Strongly typed for better development experience  
- **TailwindCSS**: Utility-first styling with Test IO color palette
- **Socket.io Events**: Clear event naming (vote-cast, results-update, game-start)
- **Error Handling**: Proper WebSocket connection error recovery
- **File Organization**: Feature-based directory structure
- **Playwright Testing**: Comprehensive UI automation, visual regression testing, and user flow validation

### Test IO Brand Compliance
- **Color Palette**: Use Test IO's professional blue (#1E40AF) and teal (#0891B2) 
- **Typography**: Clean sans-serif fonts with strong hierarchy
- **Language Tone**: Professional but approachable, results-focused
- **Visual Elements**: Clean layouts with structured content blocks
- **User Experience**: Emphasis on clarity and professional presentation

### Installation Commands
```bash
# Frontend Development
cd frontend && npm install
npm run dev

# Backend Development  
cd backend && npm install
npm start

# Full Stack Development
docker-compose up --build
```

### Quality Commands
```bash
# Frontend
npm run lint      # ESLint for code quality
npm run type-check # TypeScript validation
npm test          # Jest + React Testing Library
npm run test:e2e  # Playwright end-to-end testing

# Backend
npm run lint      # ESLint for Node.js
npm test          # Jest for API testing
npm run dev       # Nodemon for development

# Visual & UI Testing
npx playwright test              # Run all Playwright tests
npx playwright test --ui         # Interactive test runner
npx playwright show-report      # View test results
npx playwright codegen          # Generate test code
```

## Architecture Patterns

### Real-time Voting System
- **Game State**: In-memory storage using Map/Object for session data
- **WebSocket Events**: Bidirectional communication for live vote updates
- **Session Management**: Browser-based session IDs to prevent duplicate voting
- **Data Flow**: Admin creates game → Players vote → Live results update

### Component Architecture
- **Admin Setup Page** (`/admin`): Game creation form with photo upload
- **Voting Page** (`/vote/:gameId`): Real-time voting interface  
- **Results Page** (`/results/:gameId`): Live progress bars and reveal functionality
- **Socket Context**: React context provider for WebSocket connection state

### Research-Backed Patterns
Based on analysis of successful real-time applications:
- **MERN Stack**: Proven pattern from `burakorkmez/mern-chat-app` (1048 stars)
- **Socket.io Integration**: Battle-tested patterns from `koolkishan/chat-app-react-nodejs` (881 stars)
- **TailwindCSS Setup**: Modern utility-first approach following official documentation
- **Vite Configuration**: Fast development with optimized build process

## Key Features & Functionality

### Core Game Flow
1. **Admin Setup**: Upload candidate photo, enter name and 3 statements
2. **Game Creation**: Generate unique voting link and results URL
3. **Real-time Voting**: Employees vote on which statement is the lie
4. **Live Results**: Progress bars update in real-time as votes come in
5. **Answer Reveal**: Admin reveals the correct answer

### Technical Implementation
- **File Upload**: Local storage for candidate photos
- **Vote Validation**: Session-based duplicate prevention
- **State Synchronization**: All connected clients receive live updates
- **Error Recovery**: Graceful WebSocket reconnection handling
- **Mobile Responsive**: Works on desktop browsers (mobile not required per KISS principle)

## Agent Coordination Guidelines

### Task Complexity Assessment
- **Simple Tasks** (1-3 files): Direct implementation by developer agent
- **Moderate Tasks** (4-8 files): task-coordinator manages workflow
- **Complex Tasks** (9+ files): Multi-phase coordination with checkpoints

### Test IO Brand Requirements
- All UI components must follow Test IO's professional aesthetic
- Color usage must be consistent with brand reference screenshot
- Language and messaging should be professional but approachable
- Clean, structured layouts with appropriate whitespace

### WebSocket Development Standards
- Clear event naming conventions (kebab-case)
- Proper error handling for connection failures
- Graceful degradation for users without WebSocket support
- Real-time state synchronization across all connected clients

## Development Workflow

### Feature Planning Process
1. **Research Phase**: Use MCP tools to find proven patterns
2. **Design Phase**: Create wireframes following Test IO brand guidelines
3. **Implementation Phase**: Develop with real-time testing and Playwright validation
4. **Quality Phase**: Playwright automated testing for cross-browser compatibility, visual regression, and error handling

### Testing Strategy
- **Unit Tests**: Component logic and utility functions
- **Integration Tests**: Socket.io event handling and state management
- **Visual Testing**: Playwright for automated UI testing, screenshot comparison, and Test IO brand compliance validation
- **User Flow Testing**: Complete voting process from admin to results using Playwright automation
- **Cross-Browser Testing**: Playwright multi-browser validation (Chrome, Firefox, Safari)
- **Responsive Testing**: Playwright viewport testing for desktop compatibility

### Deployment Process
- **Development**: Local Docker Compose for full stack development
- **Production**: Docker containers with proper environment configuration
- **Documentation**: Clear setup instructions and API documentation

---

## References

- `WIREFRAMES.md` - Complete UI wireframes and architecture decisions
- `testio-brand-reference.png` - Test IO visual style reference for consistent branding