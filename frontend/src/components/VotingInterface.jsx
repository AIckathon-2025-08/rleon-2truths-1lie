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