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

    // Sanitize and validate name
    const sanitizedName = name.trim();
    if (sanitizedName.length === 0 || sanitizedName.length > 100) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name must be between 1 and 100 characters' 
      });
    }

    // Basic sanitization - remove potentially dangerous characters
    const nameRegex = /^[a-zA-Z0-9\s\-\.'\u00C0-\u017F]+$/;
    if (!nameRegex.test(sanitizedName)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name contains invalid characters' 
      });
    }

    let parsedStatements;
    try {
      parsedStatements = JSON.parse(statements);
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid JSON format for statements' 
      });
    }

    if (!Array.isArray(parsedStatements) || parsedStatements.length !== 3) {
      return res.status(400).json({ 
        success: false, 
        error: 'Statements must be array of 3 strings' 
      });
    }

    // Validate that all statements are strings and not empty
    const invalidStatements = parsedStatements.some(stmt => 
      typeof stmt !== 'string' || stmt.trim().length === 0
    );
    if (invalidStatements) {
      return res.status(400).json({ 
        success: false, 
        error: 'All statements must be non-empty strings' 
      });
    }

    const gameData = {
      candidate: {
        name: sanitizedName,
        photoPath: req.file ? req.file.filename : null
      },
      statements: parsedStatements,
      correctAnswer: parseInt(correctAnswer)
    };

    const game = createGame(gameData);
    
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    
    res.json({
      success: true,
      gameId: game.id,
      votingUrl: `${frontendUrl}/vote/${game.id}`,
      resultsUrl: `${frontendUrl}/results/${game.id}`,
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
            ? `${process.env.BACKEND_URL || "http://localhost:3001"}/uploads/${game.candidate.photoPath}`
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