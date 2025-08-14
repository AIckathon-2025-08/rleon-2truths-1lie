# PRP-001: Two Truths & A Lie Real-Time Voting System

**Created**: August 14, 2025  
**Source**: PRPs/1-planning/PLANNING-Two-Truths-And-A-Lie-Game.md  
**Deadline**: 2-hour hackathon implementation  
**Complexity**: Moderate (8-12 files, WebSocket coordination)

## Research Context & Architectural Analysis

### Research Integration
**Planning Research Foundation**: Comprehensive analysis completed identifying proven MERN + Socket.io patterns from production applications:
- **koolkishan/chat-app-react-nodejs** (881 stars): Validated Socket.io event patterns and Express integration
- **piyush-eon/mern-chat-app** (576 stars): Real-time messaging architecture and connection management
- **TailwindCSS v4**: Custom color theming for Test IO brand compliance

**MCP Research Findings**:
- **Socket.io Server Patterns**: `io.on('connection')` with event-driven architecture for scalable real-time communication
- **React Integration**: `useEffect` + `useState` hooks for Socket.io client state management
- **CORS Configuration**: `{origin: "http://localhost:3000", credentials: true}` for development security

### Architectural Scope
**Component Integration Requirements**:
- **Frontend**: 3 React pages (Admin Setup, Voting Interface, Live Results) with shared Socket.io context
- **Backend**: Express server with Socket.io real-time layer and in-memory game state management
- **Real-time Data Flow**: Bidirectional WebSocket communication for vote casting and live result updates
- **File Handling**: Local image upload for candidate photos with basic validation

**Existing Patterns to Leverage**:
- **Test IO Branding**: TailwindCSS custom properties for consistent color palette (#1E40AF, #0891B2)
- **Docker Compose**: Development environment with frontend/backend service coordination
- **Proven Socket.io Events**: Connection management, room joining, message broadcasting patterns

## Implementation Specification

### Core Requirements
**Real-Time Voting System**:
1. **Admin Game Creation**: Photo upload + candidate name + 3 statements (2 truths, 1 lie)
2. **Employee Voting Interface**: Real-time voting on which statement is the lie
3. **Live Results Display**: Progress bars updating in real-time as votes are cast
4. **Answer Reveal**: Admin-triggered reveal of correct answer to all participants

**Technical Stack**:
- **Frontend**: React 18 + Vite + TailwindCSS 4 + Socket.io-client
- **Backend**: Node.js + Express + Socket.io + Multer (file upload)
- **Development**: Docker Compose for one-command deployment
- **Storage**: In-memory Map/Object storage for hackathon speed

### Integration Points
**Socket.io Event Architecture**:
```javascript
// Server Events (backend/server.js)
io.on('connection', (socket) => {
  socket.on('create-game', (gameData) => { /* Admin creates game */ });
  socket.on('join-game', (gameId) => { /* Player joins voting */ });
  socket.on('cast-vote', ({gameId, vote, sessionId}) => { /* Vote submission */ });
  socket.on('join-results', (gameId) => { /* Subscribe to live results */ });
  socket.on('reveal-answer', (gameId) => { /* Admin reveals answer */ });
});

// Client Integration (frontend/src/hooks/useSocket.js)
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

**Data Model**:
```javascript
// Game State Structure
const games = new Map(); // gameId -> GameData
const sessions = new Set(); // sessionId tracking for duplicate prevention

// GameData Interface
{
  id: string,
  candidate: {
    name: string,
    photo: string, // base64 or file path
  },
  statements: [string, string, string],
  correctAnswer: number, // 0, 1, or 2
  votes: {
    0: number, // votes for statement 1
    1: number, // votes for statement 2
    2: number, // votes for statement 3
  },
  revealed: boolean,
  createdAt: Date,
}
```

### Interface Requirements
**Test IO Brand Compliance**:
```css
/* TailwindCSS Configuration (frontend/tailwind.config.js) */
@theme {
  --color-testio-blue: #1E40AF;
  --color-testio-teal: #0891B2;
  --color-testio-gray: #6B7280;
  --color-testio-white: #FFFFFF;
}

/* Component Styling Patterns */
.btn-primary: bg-testio-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors
.btn-secondary: bg-testio-teal text-white px-4 py-2 rounded-md hover:bg-teal-700
.card: bg-white border border-gray-200 rounded-lg shadow-md p-6
.progress-bar: bg-testio-teal rounded-full transition-all duration-300
```

**Page Components**:
1. **AdminSetup.jsx** (`/admin`): Photo upload, name input, 3 statement fields, correct answer selection
2. **VotingInterface.jsx** (`/vote/:gameId`): Candidate display, statement voting buttons, live vote count
3. **LiveResults.jsx** (`/results/:gameId`): Real-time progress bars, reveal functionality (admin only)

## Quality Requirements

### Testing Strategy
**Behavioral Testing Approach**:
- **Socket.io Integration**: Test connection establishment, event emission/reception, reconnection handling
- **Real-time Updates**: Verify vote casting triggers immediate UI updates across all connected clients
- **Session Management**: Validate duplicate vote prevention using browser session IDs
- **File Upload**: Test image upload, validation, and display functionality

**Component Testing**:
```javascript
// Example: Testing real-time vote updates
test('should update progress bars when votes are cast', async () => {
  // Setup mock Socket.io connection
  // Cast vote via Socket.io event
  // Assert progress bar updates reflect new vote counts
});
```

### Documentation Needs
**Implementation Documentation**:
- **README.md**: Docker Compose setup instructions, development guide, Test IO brand guidelines
- **API Documentation**: Socket.io event specifications and payload structures
- **Deployment Guide**: Production Docker configuration and environment variables

**Demo Requirements**:
- **Screenshots**: All 3 page states with Test IO branding visible
- **Screen Recording**: Complete voting flow from admin setup to results reveal
- **Architecture Diagram**: Component and data flow visualization

### Performance Considerations
**Real-time Scalability**:
- **Connection Limits**: Socket.io default settings support 100+ concurrent connections for hackathon demo
- **Memory Management**: In-memory storage suitable for single-session games (production would use Redis/MongoDB)
- **Network Optimization**: Event payload minimization for responsive mobile experience

## Coordination Strategy

### Recommended Approach
**Task-Coordinator Management**: This feature requires **moderate coordination** due to:
- **Multi-service Architecture**: Frontend + Backend + Socket.io integration points
- **Real-time Testing**: Cross-browser validation and WebSocket connection testing
- **Brand Compliance**: Test IO styling verification across all components
- **Docker Orchestration**: Development environment setup and deployment validation

### Implementation Phases
**Phase 1: Project Infrastructure** (20 minutes)
- Initialize `./2truths1lie` directory structure
- Configure React + Vite + TailwindCSS with Test IO theming
- Setup Express + Socket.io backend with CORS configuration
- Create Docker Compose for development environment

**Phase 2: Backend Real-Time Logic** (40 minutes)
- Implement Socket.io server with game state management
- Create file upload endpoints for candidate photos
- Build real-time event handlers (vote casting, results broadcasting)
- Add session-based duplicate vote prevention

**Phase 3: Frontend React Components** (45 minutes)
- Develop Socket.io React hook and context provider
- Build AdminSetup page with photo upload and form validation
- Create VotingInterface with real-time vote submission
- Implement LiveResults with progress bars and reveal functionality

**Phase 4: Integration & Documentation** (15 minutes)
- End-to-end testing of complete voting flow
- Docker deployment validation and optimization
- README.md creation with setup instructions and screenshots
- Screen recording of full user journey

### Risk Mitigation
**High-Risk Areas & Mitigation**:
1. **Socket.io Connection Issues**: Pre-validated connection patterns from research, fallback to HTTP polling
2. **File Upload Complexity**: Simple local storage approach, avoid cloud integration overhead
3. **Real-time Synchronization**: Event-driven architecture with immediate state broadcasting
4. **Test IO Brand Compliance**: Pre-defined utility classes and color variables ready for implementation

### Dependencies
**Prerequisites**:
- Node.js 18+ with npm (package management)
- Docker and Docker Compose (deployment)
- Modern browser with WebSocket support (development/testing)

**External Integrations**: None (self-contained system for hackathon requirements)

## Success Criteria

### Functional Success
**Core Voting Flow**:
- [ ] Admin can create game with photo upload and 3 statements
- [ ] Generated voting link allows employee participation
- [ ] Real-time vote casting with immediate UI feedback across all clients
- [ ] Live results page shows updating progress bars as votes arrive
- [ ] Admin can reveal correct answer, visible to all participants

**Real-Time Communication**:
- [ ] Socket.io connection established and maintained across page navigation
- [ ] Vote events trigger immediate updates on all connected results pages
- [ ] Graceful handling of connection drops with automatic reconnection
- [ ] Session-based duplicate vote prevention working correctly

### Integration Success
**System Architecture Validation**:
- [ ] Frontend and backend services communicate via Socket.io events
- [ ] File upload integration working for candidate photos
- [ ] Docker Compose one-command deployment (`docker-compose up --build`)
- [ ] Test IO branding consistent across all pages and components

**Cross-Browser Compatibility**:
- [ ] Desktop browsers (Chrome, Firefox, Safari) support complete voting flow
- [ ] Mobile responsiveness for voting interface (admin features desktop-only acceptable)
- [ ] WebSocket fallback handling for network issues

### Quality Gates
**Code Quality**:
- [ ] React functional components with hooks following modern patterns
- [ ] Socket.io event naming follows kebab-case convention
- [ ] TailwindCSS utility classes for Test IO brand compliance
- [ ] Error boundaries and graceful degradation for connection failures

**Documentation & Deployment**:
- [ ] README.md with single-command setup instructions
- [ ] Screenshots demonstrating Test IO professional aesthetic
- [ ] Screen recording showing complete voting flow (admin → vote → results)
- [ ] Docker environment validated and optimized for immediate demo

**Hackathon Readiness**:
- [ ] Complete implementation within 2-hour deadline
- [ ] Professional Test IO branding matching reference standards
- [ ] Functional demo ready for immediate presentation
- [ ] All technical requirements met for hackathon evaluation criteria

---

**Next Action**: Execute this PRP using `execute-prp` command with task-coordinator for intelligent workflow orchestration and deadline management.