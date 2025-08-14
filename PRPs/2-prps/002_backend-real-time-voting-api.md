# PRP-002: Backend Real-Time Voting API

**Created**: August 14, 2025  
**Source**: Decomposed from PRP-001  
**Deadline**: 60 minutes implementation  
**Complexity**: Moderate (Backend only, 4-6 files)

## API Contract Specification

### REST API Endpoints

#### POST `/api/games`
**Purpose**: Create new voting game
```typescript
// Request
interface CreateGameRequest {
  candidate: {
    name: string;
    photo: File; // multipart/form-data
  };
  statements: [string, string, string];
  correctAnswer: 0 | 1 | 2;
}

// Response
interface CreateGameResponse {
  success: boolean;
  gameId: string;
  votingUrl: string;
  resultsUrl: string;
  adminSecret: string;
}
```

#### GET `/api/games/:gameId`
**Purpose**: Get game information for voting/results
```typescript
// Response
interface GameResponse {
  success: boolean;
  game: {
    id: string;
    candidate: {
      name: string;
      photoUrl: string;
    };
    statements: [string, string, string];
    votes: {
      0: number;
      1: number; 
      2: number;
    };
    revealed: boolean;
    correctAnswer?: number; // only if revealed
    totalVotes: number;
  };
}
```

#### GET `/uploads/:filename`
**Purpose**: Serve uploaded candidate photos
```typescript
// Response: Image file (JPEG/PNG)
// Headers: Content-Type: image/jpeg|image/png
```

### Socket.io Events

#### Server → Client Events

```typescript
// Vote count update broadcast
interface VoteUpdateEvent {
  gameId: string;
  votes: {
    0: number;
    1: number;
    2: number;
  };
  totalVotes: number;
}

// Answer reveal broadcast
interface AnswerRevealEvent {
  gameId: string;
  correctAnswer: number;
  finalVotes: {
    0: number;
    1: number;
    2: number;
  };
}

// Error events
interface ErrorEvent {
  error: string;
  code: 'GAME_NOT_FOUND' | 'ALREADY_VOTED' | 'INVALID_VOTE' | 'SERVER_ERROR';
}
```

#### Client → Server Events

```typescript
// Join game room for real-time updates
interface JoinGameEvent {
  gameId: string;
}

// Cast vote
interface CastVoteEvent {
  gameId: string;
  vote: 0 | 1 | 2;
  sessionId: string; // Browser-generated unique ID
}

// Admin reveal answer
interface RevealAnswerEvent {
  gameId: string;
  adminSecret: string; // Simple admin verification
}
```

## Implementation Specification

### Core Requirements
**Express + Socket.io Server**:
- RESTful API for game CRUD operations
- Real-time WebSocket layer for live vote updates
- File upload handling for candidate photos
- Session-based duplicate vote prevention
- In-memory storage for hackathon speed

### Technical Stack
```javascript
// package.json dependencies
{
  "express": "^4.18.0",
  "socket.io": "^4.7.0",
  "multer": "^1.4.5",
  "cors": "^2.8.5",
  "uuid": "^9.0.0",
  "path": "built-in",
  "fs": "built-in"
}
```

### Project Structure
```
backend/
├── server.js              # Main Express + Socket.io server
├── routes/
│   └── games.js           # Game CRUD API routes
├── middleware/
│   └── upload.js          # Multer file upload configuration
├── utils/
│   └── gameManager.js     # Game state management utilities
├── uploads/               # Uploaded candidate photos
├── package.json
└── Dockerfile
```

### Data Models

#### Game State Schema
```javascript
// In-memory storage structure
const games = new Map(); // gameId -> GameData
const sessions = new Set(); // sessionId for duplicate prevention

interface GameData {
  id: string;
  candidate: {
    name: string;
    photoPath: string; // relative path to uploads/
  };
  statements: [string, string, string];
  correctAnswer: 0 | 1 | 2;
  votes: {
    0: number;
    1: number;
    2: number;
  };
  revealed: boolean;
  adminSecret: string; // UUID for admin operations
  createdAt: Date;
  votedSessions: Set<string>; // Track who voted
}
```

### Core Implementation Files

#### server.js
```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const gameRoutes = require('./routes/games');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/games', gameRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-game', ({ gameId }) => {
    socket.join(gameId);
    console.log(`Socket ${socket.id} joined game ${gameId}`);
  });

  socket.on('cast-vote', (data) => {
    // Handle vote casting with real-time broadcast
  });

  socket.on('reveal-answer', (data) => {
    // Handle admin answer reveal
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };
```

#### routes/games.js
```javascript
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const upload = require('../middleware/upload');
const { createGame, getGame } = require('../utils/gameManager');

const router = express.Router();

// POST /api/games - Create new game
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { name, statements, correctAnswer } = req.body;
    
    // Validation
    if (!name || !statements || correctAnswer === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    const parsedStatements = JSON.parse(statements);
    if (!Array.isArray(parsedStatements) || parsedStatements.length !== 3) {
      return res.status(400).json({ 
        success: false, 
        error: 'Statements must be array of 3 strings' 
      });
    }

    const gameData = {
      candidate: {
        name,
        photoPath: req.file ? req.file.filename : null
      },
      statements: parsedStatements,
      correctAnswer: parseInt(correctAnswer)
    };

    const game = createGame(gameData);
    
    res.json({
      success: true,
      gameId: game.id,
      votingUrl: `http://localhost:3000/vote/${game.id}`,
      resultsUrl: `http://localhost:3000/results/${game.id}`,
      adminSecret: game.adminSecret
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// GET /api/games/:gameId - Get game data
router.get('/:gameId', (req, res) => {
  try {
    const { gameId } = req.params;
    const game = getGame(gameId);
    
    if (!game) {
      return res.status(404).json({ 
        success: false, 
        error: 'Game not found' 
      });
    }

    res.json({
      success: true,
      game: {
        id: game.id,
        candidate: {
          name: game.candidate.name,
          photoUrl: game.candidate.photoPath 
            ? `http://localhost:3001/uploads/${game.candidate.photoPath}`
            : null
        },
        statements: game.statements,
        votes: game.votes,
        revealed: game.revealed,
        correctAnswer: game.revealed ? game.correctAnswer : undefined,
        totalVotes: game.votes[0] + game.votes[1] + game.votes[2]
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

module.exports = router;
```

#### middleware/upload.js
```javascript
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG and PNG allowed.'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload;
```

#### utils/gameManager.js
```javascript
const { v4: uuidv4 } = require('uuid');

// In-memory storage
const games = new Map();
const sessions = new Set();

function createGame(gameData) {
  const game = {
    id: uuidv4(),
    candidate: gameData.candidate,
    statements: gameData.statements,
    correctAnswer: gameData.correctAnswer,
    votes: { 0: 0, 1: 0, 2: 0 },
    revealed: false,
    adminSecret: uuidv4(),
    createdAt: new Date(),
    votedSessions: new Set()
  };

  games.set(game.id, game);
  return game;
}

function getGame(gameId) {
  return games.get(gameId);
}

function castVote(gameId, vote, sessionId) {
  const game = games.get(gameId);
  if (!game) return { error: 'Game not found' };

  if (game.votedSessions.has(sessionId)) {
    return { error: 'Already voted' };
  }

  if (![0, 1, 2].includes(vote)) {
    return { error: 'Invalid vote' };
  }

  game.votes[vote]++;
  game.votedSessions.add(sessionId);
  
  return { success: true, votes: game.votes };
}

function revealAnswer(gameId, adminSecret) {
  const game = games.get(gameId);
  if (!game) return { error: 'Game not found' };

  if (game.adminSecret !== adminSecret) {
    return { error: 'Unauthorized' };
  }

  game.revealed = true;
  return { success: true, correctAnswer: game.correctAnswer };
}

module.exports = {
  createGame,
  getGame,
  castVote,
  revealAnswer,
  games,
  sessions
};
```

## Quality Requirements

### Testing Strategy
```javascript
// Example API tests
describe('Games API', () => {
  test('POST /api/games creates game successfully', async () => {
    // Test game creation with file upload
  });

  test('GET /api/games/:id returns game data', async () => {
    // Test game retrieval
  });

  test('Socket.io vote casting updates game state', async () => {
    // Test real-time vote handling
  });
});
```

### Error Handling
- File upload validation (size, type)
- Missing required fields validation
- Duplicate vote prevention
- Game not found scenarios
- Socket.io connection error recovery

## Success Criteria

### Functional Requirements
- [ ] Create game with photo upload via REST API
- [ ] Retrieve game data via REST API
- [ ] Real-time vote casting via Socket.io
- [ ] Live vote count updates broadcast to all clients
- [ ] Admin answer reveal functionality
- [ ] Session-based duplicate vote prevention

### Technical Requirements
- [ ] Express server running on port 3001
- [ ] Socket.io WebSocket server with CORS configuration
- [ ] File upload to `uploads/` directory
- [ ] In-memory game state management
- [ ] Error handling and validation
- [ ] Structured logging for debugging

### API Contract Validation
- [ ] All REST endpoints return specified response formats
- [ ] All Socket.io events follow defined payload structures
- [ ] File upload endpoints handle multipart/form-data correctly
- [ ] CORS configuration allows frontend origin (localhost:3000)

**Next Action**: Backend can be implemented independently using these exact specifications. Frontend PRP will reference these same API contracts.