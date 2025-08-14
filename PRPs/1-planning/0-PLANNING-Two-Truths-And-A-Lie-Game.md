# Two Truths & A Lie Game - Implementation Plan

**Project Type**: Product Development  
**Planning Date**: August 14, 2025  
**Timeline**: 2-hour hackathon deadline  
**Complexity**: Moderate (3-page app with real-time features)

## Executive Summary

Building a complete real-time voting system for Test IO town halls where employees vote on "Two Truths & A Lie" statements about their colleagues. The system features live voting updates, professional Test IO branding, and Docker deployment - all within a 2-hour development window.

## Validated Requirements

### Core Game Flow
1. **Admin Setup**: Upload candidate photo + name, create 3 statements (2 truths, 1 lie)
2. **Employee Voting**: Real-time voting interface for company employees  
3. **Live Results**: Progress bars update in real-time, admin reveals correct answer

### Technical Requirements
- **Real-time Communication**: WebSocket-based voting with Socket.io
- **Professional Branding**: Test IO blue (#1E40AF) and teal (#0891B2) color palette
- **Rapid Deployment**: Docker Compose for immediate bootability
- **Documentation**: README.md following hackathon template standards

### Success Criteria
- Complete 3-page voting flow functional within 2 hours
- Professional Test IO aesthetic with clean, structured layouts
- Real-time voting updates across all connected clients
- Docker deployment with screenshot and video demonstration

## Research Context & Best Practices

### Proven Socket.io Patterns
**Source**: `burakorkmez/mern-chat-app` (1048 stars), `koolkishan/chat-app-react-nodejs` (881 stars)
- **MERN Stack Architecture**: React frontend + Express backend + Socket.io real-time layer
- **Event-Driven Design**: Clear event naming (vote-cast, results-update, game-start)
- **Connection Management**: Automatic reconnection with error recovery patterns

### TailwindCSS Integration
**Source**: Official TailwindCSS v4 documentation
- **Custom Color Variables**: `@theme { --color-testio-blue: #1E40AF; --color-testio-teal: #0891B2; }`
- **Professional Utility Classes**: `bg-testio-blue text-white rounded-lg shadow-md`
- **Responsive Design**: Mobile-friendly with `sm:`, `md:`, `lg:` breakpoints

### Real-time Voting Architecture
**Source**: `sahat/newedenfaces-react` (850 stars), `teropa/redux-voting-server` (579 stars)  
- **In-Memory Storage**: Map/Object-based game state for hackathon speed
- **Session-Based Voting**: Browser session IDs prevent duplicate votes
- **Live Updates**: Bidirectional WebSocket communication for instant feedback

## Implementation Approach

### Phase 1: Project Setup & Infrastructure (20 minutes)
**Complexity**: Simple
**Agent**: developer

```bash
# Initialize project structure in ./2truths1lie
mkdir -p 2truths1lie/{frontend,backend}
cd 2truths1lie

# Frontend: React + Vite + TailwindCSS
npm create vite@latest frontend -- --template react
cd frontend && npm install && npm install tailwindcss socket.io-client
npx tailwindcss init

# Backend: Express + Socket.io
cd ../backend && npm init -y
npm install express socket.io cors multer
```

**Deliverables**:
- Project structure with frontend/backend separation
- TailwindCSS configured with Test IO custom colors
- Socket.io client/server dependencies installed
- Docker Compose configuration for development

### Phase 2: Core Game Logic & Backend (40 minutes)
**Complexity**: Moderate  
**Agent**: developer

**Backend Architecture** (`backend/server.js`):
```javascript
// Game state management
const games = new Map(); // gameId -> { candidate, statements, correctAnswer, votes }
const sessions = new Set(); // Track voting sessions to prevent duplicates

// Socket.io events
io.on('connection', (socket) => {
  socket.on('create-game', (gameData) => { /* Admin game creation */ });
  socket.on('cast-vote', (voteData) => { /* Employee voting */ });
  socket.on('join-results', (gameId) => { /* Live results subscription */ });
  socket.on('reveal-answer', (gameId) => { /* Admin answer reveal */ });
});
```

**Key Features**:
- RESTful API endpoints for game management
- Real-time WebSocket events for voting and results
- File upload handling for candidate photos
- Session-based duplicate vote prevention

### Phase 3: Frontend React Components (45 minutes)
**Complexity**: Moderate  
**Agent**: developer

**Component Architecture**:
```
src/
├── components/
│   ├── AdminSetup.jsx      # Game creation form
│   ├── VotingInterface.jsx # Employee voting page
│   ├── LiveResults.jsx     # Real-time results display
│   └── SocketProvider.jsx  # WebSocket context
├── hooks/
│   └── useSocket.js        # Socket.io React integration
└── styles/
    └── testio-theme.css    # Test IO brand colors
```

**TailwindCSS Theme Configuration**:
```css
@theme {
  --color-testio-blue: #1E40AF;
  --color-testio-teal: #0891B2;
  --color-testio-gray: #6B7280;
}
```

**Socket.io React Hook Pattern**:
```javascript
// Custom hook for Socket.io integration
const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  
  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);
    
    newSocket.on('connect', () => setConnected(true));
    newSocket.on('disconnect', () => setConnected(false));
    
    return () => newSocket.close();
  }, []);
  
  return { socket, connected };
};
```

### Phase 4: Docker & Documentation (15 minutes)
**Complexity**: Simple  
**Agent**: developer

**Docker Compose Configuration**:
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    depends_on: [backend]
  
  backend:
    build: ./backend  
    ports: ["3001:3001"]
    volumes: ["./uploads:/app/uploads"]
```

**Documentation Requirements**:
- README.md following AIckathon template format
- Setup instructions with single Docker command
- Screenshots of all 3 pages in action
- Screen recording of complete voting flow

## Risk Mitigation & Contingencies

### High-Risk Areas
1. **Socket.io Connection Issues**: Pre-tested connection patterns from research
2. **File Upload Complexity**: Simple local storage, avoid cloud integration  
3. **Styling Time Overruns**: Pre-defined TailwindCSS utility classes ready

### Fallback Strategies
- **No Real-time**: HTTP polling if WebSocket issues arise
- **Simplified UI**: Focus on functionality over visual polish
- **Mock Data**: Pre-populated game states for demonstration

## Test IO Brand Compliance

### Visual Requirements
- **Primary Colors**: Test IO blue (#1E40AF) for buttons and headers
- **Secondary Colors**: Teal (#0891B2) for accents and progress bars
- **Typography**: Clean sans-serif with strong visual hierarchy
- **Layout**: Professional structured blocks with appropriate whitespace

### Language & Tone
- Professional but approachable messaging
- Results-focused language ("Vote cast successfully", "Results updating live")
- Clear call-to-action buttons ("Submit Vote", "Reveal Answer")

## Success Metrics

### Functional Requirements ✅
- [ ] Complete 3-page voting flow (Admin → Voting → Results)
- [ ] Real-time vote updates across all connected clients
- [ ] Photo upload and display functionality
- [ ] Session-based duplicate vote prevention

### Technical Requirements ✅  
- [ ] Docker Compose one-command deployment
- [ ] Professional Test IO branding throughout
- [ ] Clean, structured codebase following React best practices
- [ ] Error handling for connection failures

### Documentation Requirements ✅
- [ ] README.md with setup instructions
- [ ] Screenshots of all page states
- [ ] Screen recording of complete user flow
- [ ] Code comments for key Socket.io integration points

## Implementation Timeline

**Total Duration**: 2 hours (120 minutes)

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Setup & Infrastructure | 20 min | Working dev environment |
| Backend Logic | 40 min | Socket.io server + API |
| Frontend Components | 45 min | 3-page React application |
| Docker & Documentation | 15 min | Deployment + docs |

## Next Steps

Ready for immediate implementation. Execute phases sequentially using the developer agent, with regular testing at each milestone to ensure hackathon deadline compliance.

**Command to begin**: Start with Phase 1 project initialization in the `./2truths1lie` directory.