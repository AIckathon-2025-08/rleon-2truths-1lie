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