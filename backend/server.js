const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const gameRoutes = require('./routes/games');
const { castVote, revealAnswer, getGame } = require('./utils/gameManager');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
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
    const { gameId, vote, sessionId } = data;
    
    console.log(`Vote received: gameId=${gameId}, vote=${vote}, sessionId=${sessionId}`);
    
    const result = castVote(gameId, vote, sessionId);
    
    if (result.error) {
      socket.emit('error', {
        error: result.error,
        code: result.error === 'Game not found' ? 'GAME_NOT_FOUND' : 
              result.error === 'Already voted' ? 'ALREADY_VOTED' : 
              result.error === 'Invalid vote' ? 'INVALID_VOTE' : 'SERVER_ERROR'
      });
      return;
    }

    // Broadcast vote update to all clients in the game
    const game = getGame(gameId);
    const totalVotes = game.votes[0] + game.votes[1] + game.votes[2];
    
    io.to(gameId).emit('vote-update', {
      gameId,
      votes: game.votes,
      totalVotes
    });
    
    console.log(`Vote cast successfully: ${JSON.stringify(game.votes)}`);
  });

  socket.on('reveal-answer', (data) => {
    const { gameId, adminSecret } = data;
    
    console.log(`Answer reveal requested: gameId=${gameId}`);
    
    const result = revealAnswer(gameId, adminSecret);
    
    if (result.error) {
      socket.emit('error', {
        error: result.error,
        code: result.error === 'Game not found' ? 'GAME_NOT_FOUND' : 'UNAUTHORIZED'
      });
      return;
    }

    // Broadcast answer reveal to all clients in the game
    const game = getGame(gameId);
    
    io.to(gameId).emit('answer-reveal', {
      gameId,
      correctAnswer: result.correctAnswer,
      finalVotes: game.votes
    });
    
    console.log(`Answer revealed: ${result.correctAnswer}`);
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