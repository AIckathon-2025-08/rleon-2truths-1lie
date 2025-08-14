# PRP-003: Frontend Voting Interface

**Created**: August 14, 2025  
**Source**: Decomposed from PRP-001  
**Deadline**: 60 minutes implementation  
**Complexity**: Moderate (Frontend only, 6-8 files)

## API Contract Integration

### REST API Client Interface

#### API Service Layer
```typescript
// src/services/api.js
class VotingAPI {
  constructor() {
    this.baseURL = 'http://localhost:3001/api';
  }

  // Create new game
  async createGame(formData: FormData): Promise<CreateGameResponse> {
    const response = await fetch(`${this.baseURL}/games`, {
      method: 'POST',
      body: formData // Contains: name, photo (File), statements (JSON), correctAnswer
    });
    return response.json();
  }

  // Get game data
  async getGame(gameId: string): Promise<GameResponse> {
    const response = await fetch(`${this.baseURL}/games/${gameId}`);
    return response.json();
  }
}

// API Response Types (matching backend contract)
interface CreateGameResponse {
  success: boolean;
  gameId: string;
  votingUrl: string;
  resultsUrl: string;
  adminSecret: string;
}

interface GameResponse {
  success: boolean;
  game: {
    id: string;
    candidate: {
      name: string;
      photoUrl: string;
    };
    statements: [string, string, string];
    votes: { 0: number; 1: number; 2: number; };
    revealed: boolean;
    correctAnswer?: number;
    totalVotes: number;
  };
}
```

### Socket.io Client Integration

#### Socket Hook Implementation
```typescript
// src/hooks/useSocket.js
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnected(true);
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from server');
    });

    return () => newSocket.close();
  }, []);

  return { socket, connected };
};

// Socket Event Handlers
export const useGameSocket = (gameId: string) => {
  const { socket, connected } = useSocket();
  const [votes, setVotes] = useState({ 0: 0, 1: 0, 2: 0 });
  const [revealed, setRevealed] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  useEffect(() => {
    if (!socket || !gameId) return;

    // Join game room
    socket.emit('join-game', { gameId });

    // Listen for vote updates
    socket.on('vote-update', (data) => {
      if (data.gameId === gameId) {
        setVotes(data.votes);
      }
    });

    // Listen for answer reveal
    socket.on('answer-reveal', (data) => {
      if (data.gameId === gameId) {
        setRevealed(true);
        setCorrectAnswer(data.correctAnswer);
        setVotes(data.finalVotes);
      }
    });

    return () => {
      socket.off('vote-update');
      socket.off('answer-reveal');
    };
  }, [socket, gameId]);

  const castVote = (vote: 0 | 1 | 2) => {
    if (!socket || !connected) return;
    
    const sessionId = localStorage.getItem('sessionId') || 
                     (() => {
                       const id = crypto.randomUUID();
                       localStorage.setItem('sessionId', id);
                       return id;
                     })();

    socket.emit('cast-vote', { gameId, vote, sessionId });
  };

  const revealAnswer = (adminSecret: string) => {
    if (!socket || !connected) return;
    socket.emit('reveal-answer', { gameId, adminSecret });
  };

  return { votes, revealed, correctAnswer, connected, castVote, revealAnswer };
};
```

## Implementation Specification

### Core Requirements
**React Application**:
- 3 main pages: Admin Setup, Voting Interface, Live Results
- Real-time Socket.io integration for live updates
- Test IO branding with TailwindCSS
- Form handling with file upload
- Responsive design for desktop and mobile

### Technical Stack
```json
// package.json dependencies
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "socket.io-client": "^4.7.0",
  "tailwindcss": "^3.3.0",
  "@vitejs/plugin-react": "^4.0.0",
  "vite": "^4.4.0"
}
```

### Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── AdminSetup.jsx       # Game creation form
│   │   ├── VotingInterface.jsx  # Employee voting page
│   │   ├── LiveResults.jsx      # Real-time results display
│   │   ├── ProgressBar.jsx      # Vote progress component
│   │   └── PhotoUpload.jsx      # File upload component
│   ├── hooks/
│   │   └── useSocket.js         # Socket.io React integration
│   ├── services/
│   │   └── api.js               # REST API client
│   ├── styles/
│   │   └── index.css            # TailwindCSS with Test IO theme
│   ├── App.jsx                  # Main routing component
│   └── main.jsx                 # React entry point
├── public/
├── tailwind.config.js           # Test IO color configuration
├── vite.config.js
├── package.json
└── Dockerfile
```

### Test IO Theme Configuration

#### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'testio': {
          blue: '#1E40AF',
          teal: '#0891B2',
          gray: '#6B7280',
          white: '#FFFFFF'
        }
      }
    }
  },
  plugins: []
}
```

#### styles/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply bg-testio-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium;
  }
  
  .btn-secondary {
    @apply bg-testio-teal text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors;
  }
  
  .card {
    @apply bg-white border border-gray-200 rounded-lg shadow-md p-6;
  }
  
  .progress-bar {
    @apply bg-testio-teal rounded-full transition-all duration-300;
  }
  
  .input-field {
    @apply border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-testio-blue;
  }
}
```

### Component Implementation

#### App.jsx - Main Router
```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminSetup from './components/AdminSetup';
import VotingInterface from './components/VotingInterface';
import LiveResults from './components/LiveResults';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-testio-blue text-white py-4">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold">Two Truths & A Lie - Test IO</h1>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<AdminSetup />} />
            <Route path="/admin" element={<AdminSetup />} />
            <Route path="/vote/:gameId" element={<VotingInterface />} />
            <Route path="/results/:gameId" element={<LiveResults />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
```

#### components/AdminSetup.jsx
```jsx
import React, { useState } from 'react';
import { VotingAPI } from '../services/api';
import PhotoUpload from './PhotoUpload';

const AdminSetup = () => {
  const [formData, setFormData] = useState({
    name: '',
    photo: null,
    statements: ['', '', ''],
    correctAnswer: 0
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const api = new VotingAPI();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('photo', formData.photo);
      formDataToSend.append('statements', JSON.stringify(formData.statements));
      formDataToSend.append('correctAnswer', formData.correctAnswer.toString());

      const response = await api.createGame(formDataToSend);
      
      if (response.success) {
        setResult(response);
      } else {
        alert('Error creating game');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating game');
    } finally {
      setLoading(false);
    }
  };

  const updateStatement = (index, value) => {
    const newStatements = [...formData.statements];
    newStatements[index] = value;
    setFormData({ ...formData, statements: newStatements });
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <h2 className="text-2xl font-bold text-testio-blue mb-6">Game Created Successfully!</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voting URL (Share with employees):
              </label>
              <div className="input-field bg-gray-50">
                {result.votingUrl}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Results URL (For live tracking):
              </label>
              <div className="input-field bg-gray-50">
                {result.resultsUrl}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Secret (Save this to reveal answer):
              </label>
              <div className="input-field bg-gray-50 font-mono text-sm">
                {result.adminSecret}
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => {setResult(null); setFormData({name: '', photo: null, statements: ['','',''], correctAnswer: 0});}}
            className="btn-secondary mt-6"
          >
            Create Another Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-testio-blue mb-6">Create New Game</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Candidate Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field w-full"
              required
            />
          </div>

          <PhotoUpload 
            onPhotoSelect={(photo) => setFormData({ ...formData, photo })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Three Statements (2 truths, 1 lie)
            </label>
            {formData.statements.map((statement, index) => (
              <div key={index} className="mb-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={formData.correctAnswer === index}
                    onChange={() => setFormData({ ...formData, correctAnswer: index })}
                    className="text-testio-blue"
                  />
                  <label className="text-sm text-gray-600">This is the lie</label>
                </div>
                <textarea
                  value={statement}
                  onChange={(e) => updateStatement(index, e.target.value)}
                  className="input-field w-full mt-1"
                  rows="2"
                  placeholder={`Statement ${index + 1}...`}
                  required
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || !formData.photo || !formData.name || formData.statements.some(s => !s.trim())}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Creating Game...' : 'Create Game'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSetup;
```

#### components/VotingInterface.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { VotingAPI } from '../services/api';
import { useGameSocket } from '../hooks/useSocket';

const VotingInterface = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);
  const [selectedVote, setSelectedVote] = useState(null);
  
  const { votes, revealed, correctAnswer, connected, castVote } = useGameSocket(gameId);
  const api = new VotingAPI();

  useEffect(() => {
    const loadGame = async () => {
      try {
        const response = await api.getGame(gameId);
        if (response.success) {
          setGame(response.game);
          // Check if user already voted
          const sessionId = localStorage.getItem('sessionId');
          const hasVoted = localStorage.getItem(`voted_${gameId}`);
          if (hasVoted) {
            setVoted(true);
            setSelectedVote(parseInt(hasVoted));
          }
        }
      } catch (error) {
        console.error('Error loading game:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [gameId]);

  const handleVote = (voteIndex) => {
    if (voted || revealed) return;
    
    castVote(voteIndex);
    setVoted(true);
    setSelectedVote(voteIndex);
    localStorage.setItem(`voted_${gameId}`, voteIndex.toString());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-testio-blue">Loading game...</div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="card max-w-md mx-auto text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">Game Not Found</h2>
        <p>The game you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-testio-blue mb-4">
            Two Truths & A Lie
          </h2>
          <div className="flex flex-col items-center space-y-4">
            {game.candidate.photoUrl && (
              <img
                src={game.candidate.photoUrl}
                alt={game.candidate.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-testio-teal"
              />
            )}
            <h3 className="text-xl font-semibold text-gray-800">
              {game.candidate.name}
            </h3>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 text-center mb-6">
            {revealed 
              ? "Results revealed! See which statement was the lie:"
              : voted 
              ? "Thanks for voting! Waiting for results..."
              : "Which statement do you think is the lie?"
            }
          </p>
          
          <div className="space-y-4">
            {game.statements.map((statement, index) => {
              const voteCount = votes[index] || 0;
              const totalVotes = votes[0] + votes[1] + votes[2];
              const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
              
              const isCorrectAnswer = revealed && correctAnswer === index;
              const isUserVote = selectedVote === index;
              
              return (
                <div
                  key={index}
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    revealed && isCorrectAnswer
                      ? 'border-red-500 bg-red-50'
                      : isUserVote
                      ? 'border-testio-blue bg-blue-50'
                      : voted || revealed
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      : 'border-gray-200 hover:border-testio-teal hover:bg-teal-50'
                  }`}
                  onClick={() => handleVote(index)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-gray-800 flex-1">{statement}</p>
                    {(voted || revealed) && (
                      <span className="text-sm font-semibold text-testio-blue ml-4">
                        {voteCount} votes ({percentage.toFixed(0)}%)
                      </span>
                    )}
                  </div>
                  
                  {revealed && isCorrectAnswer && (
                    <div className="text-red-600 font-semibold text-sm mt-2">
                      ✗ This was the lie!
                    </div>
                  )}
                  
                  {isUserVote && (
                    <div className="text-testio-blue font-semibold text-sm mt-2">
                      ✓ Your vote
                    </div>
                  )}
                  
                  {(voted || revealed) && (
                    <div className="mt-3 bg-gray-200 rounded-full h-2">
                      <div
                        className={`progress-bar h-2 ${
                          revealed && isCorrectAnswer ? 'bg-red-500' : 'bg-testio-teal'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <div className="flex justify-between items-center">
            <span>Connection: {connected ? '🟢 Live' : '🔴 Disconnected'}</span>
            <span>Total votes: {votes[0] + votes[1] + votes[2]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingInterface;
```

#### components/LiveResults.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { VotingAPI } from '../services/api';
import { useGameSocket } from '../hooks/useSocket';
import ProgressBar from './ProgressBar';

const LiveResults = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminSecret, setAdminSecret] = useState('');
  const [showAdminControls, setShowAdminControls] = useState(false);
  
  const { votes, revealed, correctAnswer, connected, revealAnswer } = useGameSocket(gameId);
  const api = new VotingAPI();

  useEffect(() => {
    const loadGame = async () => {
      try {
        const response = await api.getGame(gameId);
        if (response.success) {
          setGame(response.game);
        }
      } catch (error) {
        console.error('Error loading game:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [gameId]);

  const handleRevealAnswer = () => {
    if (!adminSecret.trim()) {
      alert('Please enter admin secret');
      return;
    }
    revealAnswer(adminSecret);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-testio-blue">Loading results...</div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="card max-w-md mx-auto text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">Game Not Found</h2>
        <p>The game you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  const totalVotes = votes[0] + votes[1] + votes[2];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-testio-blue mb-4">
            Live Results - {game.candidate.name}
          </h2>
          <div className="flex justify-center items-center space-x-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-testio-teal">{totalVotes}</div>
              <div className="text-sm text-gray-600">Total Votes</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl ${connected ? 'text-green-500' : 'text-red-500'}`}>
                {connected ? '🟢' : '🔴'}
              </div>
              <div className="text-sm text-gray-600">
                {connected ? 'Live Updates' : 'Disconnected'}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {game.statements.map((statement, index) => {
            const voteCount = votes[index] || 0;
            const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
            const isCorrectAnswer = revealed && correctAnswer === index;
            
            return (
              <div
                key={index}
                className={`p-6 rounded-lg border ${
                  isCorrectAnswer 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <p className="text-gray-800 flex-1 text-lg">{statement}</p>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-testio-blue">
                      {voteCount}
                    </div>
                    <div className="text-sm text-gray-600">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
                
                <ProgressBar 
                  percentage={percentage}
                  isCorrectAnswer={isCorrectAnswer}
                />
                
                {isCorrectAnswer && (
                  <div className="mt-3 text-red-600 font-semibold flex items-center">
                    <span className="text-xl mr-2">✗</span>
                    This was the lie!
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!revealed && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <button
                onClick={() => setShowAdminControls(!showAdminControls)}
                className="btn-secondary"
              >
                {showAdminControls ? 'Hide Admin Controls' : 'Show Admin Controls'}
              </button>
              
              {showAdminControls && (
                <div className="mt-4 max-w-md mx-auto">
                  <div className="flex space-x-2">
                    <input
                      type="password"
                      value={adminSecret}
                      onChange={(e) => setAdminSecret(e.target.value)}
                      placeholder="Enter admin secret..."
                      className="input-field flex-1"
                    />
                    <button
                      onClick={handleRevealAnswer}
                      className="btn-primary"
                      disabled={!adminSecret.trim()}
                    >
                      Reveal Answer
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Use the admin secret from game creation
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveResults;
```

#### components/ProgressBar.jsx
```jsx
import React from 'react';

const ProgressBar = ({ percentage, isCorrectAnswer = false }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
      <div
        className={`h-4 rounded-full transition-all duration-500 ease-out ${
          isCorrectAnswer 
            ? 'bg-red-500' 
            : 'bg-gradient-to-r from-testio-teal to-testio-blue'
        }`}
        style={{ 
          width: `${percentage}%`,
          minWidth: percentage > 0 ? '8px' : '0px'
        }}
      />
    </div>
  );
};

export default ProgressBar;
```

#### components/PhotoUpload.jsx
```jsx
import React, { useState } from 'react';

const PhotoUpload = ({ onPhotoSelect }) => {
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
      onPhotoSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Candidate Photo
      </label>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? 'border-testio-blue bg-blue-50'
            : 'border-gray-300 hover:border-testio-teal'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
      >
        {preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-testio-teal"
            />
            <button
              type="button"
              onClick={() => { setPreview(null); onPhotoSelect(null); }}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Remove Photo
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-4xl text-gray-400">📷</div>
            <div className="text-gray-600">
              <p>Drop a photo here or click to select</p>
              <p className="text-xs text-gray-500">JPEG, PNG up to 5MB</p>
            </div>
          </div>
        )}
        
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          required={!preview}
        />
      </div>
    </div>
  );
};

export default PhotoUpload;
```

## Quality Requirements

### Testing Strategy
```javascript
// Example component tests
describe('VotingInterface', () => {
  test('displays game data correctly', () => {
    // Test game loading and display
  });

  test('handles vote casting', () => {
    // Test vote submission and UI updates
  });

  test('shows real-time vote updates', () => {
    // Test Socket.io vote updates
  });
});
```

### Responsive Design
- Desktop-optimized admin interface
- Mobile-friendly voting interface
- Responsive progress bars and layouts
- Touch-friendly interaction elements

## Success Criteria

### Functional Requirements
- [ ] Admin can create games with photo upload
- [ ] Voting interface displays candidate and statements
- [ ] Real-time vote updates via Socket.io
- [ ] Live results page with progress bars
- [ ] Admin can reveal answers
- [ ] Session-based duplicate vote prevention

### UI/UX Requirements
- [ ] Test IO branding (blue #1E40AF, teal #0891B2)
- [ ] Responsive design for mobile and desktop
- [ ] Smooth animations and transitions
- [ ] Clear visual feedback for user actions
- [ ] Professional, clean aesthetic

### Technical Requirements
- [ ] React 18 with functional components and hooks
- [ ] TailwindCSS with custom Test IO theme
- [ ] Socket.io client integration with reconnection
- [ ] File upload with preview and validation
- [ ] React Router for navigation
- [ ] Error handling and loading states

**Next Action**: Frontend can be implemented independently using these exact specifications and API contracts.