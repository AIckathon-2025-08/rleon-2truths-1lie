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
      votingUrl: `http://localhost:5173/vote/${game.id}`,
      resultsUrl: `http://localhost:5173/results/${game.id}`,
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