const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const gameRoutes = require('./routes/games');
const { castVote, revealAnswer, getGame } = require('./utils/gameManager');
const logger = require('./utils/logger');

// Load environment variables
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
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
  logger.info('Client connected', { socketId: socket.id });

  socket.on('join-game', ({ gameId }) => {
    socket.join(gameId);
    logger.debug('Socket joined game', { socketId: socket.id, gameId });
  });

  socket.on('cast-vote', (data) => {
    const { gameId, vote, sessionId } = data;
    
    logger.info('Vote received', { gameId, vote, sessionId, socketId: socket.id });
    
    const result = castVote(gameId, vote, sessionId);
    
    if (result.error) {
      logger.warn('Vote casting failed', { gameId, sessionId, error: result.error });
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
    
    logger.info('Vote cast successfully', { gameId, votes: game.votes, totalVotes });
  });

  socket.on('reveal-answer', (data) => {
    const { gameId, adminSecret } = data;
    
    logger.info('Answer reveal requested', { gameId, socketId: socket.id });
    
    const result = revealAnswer(gameId, adminSecret);
    
    if (result.error) {
      logger.warn('Answer reveal failed', { gameId, error: result.error });
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
    
    logger.info('Answer revealed successfully', { gameId, correctAnswer: result.correctAnswer });
  });

  socket.on('disconnect', () => {
    logger.info('Client disconnected', { socketId: socket.id });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  logger.info('Server started successfully', { 
    port: PORT, 
    environment: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
  });
});

module.exports = { app, io };