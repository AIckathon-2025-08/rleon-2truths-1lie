import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { VotingAPI } from '../services/api';
import { useGameSocket } from '../hooks/useSocket';
import ThemeToggle from './ThemeToggle';
import PlayerAvatar from './PlayerAvatar';

const VotingInterface = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);
  const [selectedVote, setSelectedVote] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [nameSubmitted, setNameSubmitted] = useState(false);

  const { votes, revealed, correctAnswer, connected, castVote } = useGameSocket(
    gameId,
    game?.votes
  );
  const api = new VotingAPI();

  useEffect(() => {
    const loadGame = async () => {
      try {
        const response = await api.getGame(gameId);
        if (response.success) {
          setGame(response.game);

          // Check for saved player name
          const savedName = localStorage.getItem(`playerName_${gameId}`);
          if (savedName) {
            setPlayerName(savedName);
            setNameSubmitted(true);
          }

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

  const handleNameSubmit = e => {
    e.preventDefault();
    if (playerName.trim()) {
      localStorage.setItem(`playerName_${gameId}`, playerName.trim());
      setNameSubmitted(true);
    }
  };

  const handleVote = voteIndex => {
    if (voted || revealed) return;

    castVote(voteIndex, playerName);
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

  // Show name form if name not submitted yet
  if (!nameSubmitted) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-testio-blue mb-2">
              Two Truths & A Lie
            </h2>
            <p className="text-gray-600">Enter your name to participate</p>
          </div>

          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                className="input-field w-full"
                placeholder="Enter your name..."
                required
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={!playerName.trim()}
            >
              Join Game
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-testio-blue">
              Two Truths & A Lie
            </h2>
            <ThemeToggle />
          </div>
          
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
            
            <div className="flex items-center space-x-3">
              <PlayerAvatar playerName={playerName} size={32} />
              <p className="text-sm text-gray-600">
                Welcome, <span className="font-semibold text-testio-blue">{playerName}</span>!
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 text-center mb-6">
            {revealed
              ? 'Results revealed! See which statement was the lie:'
              : voted
                ? 'Thanks for voting! Waiting for results...'
                : 'Which statement do you think is the lie?'}
          </p>

          <div className="space-y-4">
            {game.statements.map((statement, index) => {
              const voteCount = votes[index] || 0;
              const totalVotes = votes[0] + votes[1] + votes[2];
              const percentage =
                totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

              const isCorrectAnswer = revealed && correctAnswer === index;
              const isUserVote = selectedVote === index;

              return (
                <div
                  key={index}
                  className={`statement-card ${
                    revealed && isCorrectAnswer
                      ? 'statement-card-revealed-correct'
                      : isUserVote
                        ? 'statement-card-voted'
                        : voted || revealed
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                          : 'statement-card-hover border-gray-200'
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
                          revealed && isCorrectAnswer
                            ? 'bg-red-500'
                            : 'bg-testio-teal'
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

        <div className="border-t border-gray-200 pt-4 mt-6">
          <div className="flex justify-between items-center">
            <span
              className={`status-indicator ${connected ? 'status-live' : 'status-disconnected'}`}
            >
              {connected ? '🟢 Live Updates' : '🔴 Disconnected'}
            </span>
            <span className="text-lg font-semibold text-testio-blue">
              {votes[0] + votes[1] + votes[2]} votes cast
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingInterface;
