import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { VotingAPI } from '../services/api';
import { useGameSocket } from '../hooks/useSocket';
import ProgressBar from './ProgressBar';
import CelebrationEffect from './CelebrationEffect';
import SoundEffect from './SoundEffect';
import { getWinnerList } from '../utils/avatarUtils';

const LiveResults = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminSecret, setAdminSecret] = useState('');
  const [showAdminControls, setShowAdminControls] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [winners, setWinners] = useState([]);

  const { votes, revealed, correctAnswer, connected, revealAnswer } =
    useGameSocket(gameId, game?.votes);
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

  // Add effect to detect when answer is revealed
  useEffect(() => {
    if (revealed && correctAnswer !== null) {
      // Simple winner detection from existing data
      const sessionId = localStorage.getItem('sessionId');
      const playerName = localStorage.getItem(`playerName_${gameId}`);
      const userVote = localStorage.getItem(`voted_${gameId}`);
      
      // Check if current user won
      const userWon = parseInt(userVote) === correctAnswer;
      
      // For demo, create winner list (in real app, this would come from backend)
      const mockWinners = userWon ? [{ id: sessionId, name: playerName }] : [];
      
      setWinners(mockWinners);
      setShowCelebration(true);
    }
  }, [revealed, correctAnswer, gameId]);

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
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-testio-blue mb-4">
              Live Results - {game.candidate.name}
            </h2>
            <div className="flex items-center space-x-4">
              <SoundEffect trigger={showCelebration && winners.length > 0} />
            </div>
          </div>
          <div className="flex justify-center items-center space-x-6">
            <div className="text-center">
              {revealed ? (
                <>
                  <div className="text-3xl font-bold text-testio-teal">
                    {totalVotes}
                  </div>
                  <div className="text-sm" style={{color: 'var(--color-text-muted)'}}>Total Votes</div>
                </>
              ) : (
                <>
                  <div className="text-3xl font-bold text-testio-teal">
                    •••
                  </div>
                  <div className="text-sm" style={{color: 'var(--color-text-muted)'}}>Votes Hidden</div>
                </>
              )}
            </div>
            <div className="text-center">
              <div
                className={`text-3xl ${connected ? 'text-green-500' : 'text-red-500'}`}
              >
                {connected ? '🟢' : '🔴'}
              </div>
              <div className="text-sm" style={{color: 'var(--color-text-muted)'}}>
                {connected ? 'Live Updates' : 'Disconnected'}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {game.statements.map((statement, index) => {
            const voteCount = votes[index] || 0;
            const percentage =
              totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
            const isCorrectAnswer = revealed && correctAnswer === index;

            return (
              <div
                key={index}
                className={`p-6 rounded-lg border ${
                  isCorrectAnswer
                    ? 'border-red-500'
                    : 'border-gray-200 dark:border-gray-600'
                }`}
                style={{
                  backgroundColor: isCorrectAnswer 
                    ? (document.documentElement.classList.contains('dark') 
                        ? 'rgb(239 68 68 / 0.2)' 
                        : 'rgb(239 68 68 / 0.1)')
                    : 'var(--color-surface-elevated)',
                  color: 'var(--color-text)'
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <p className="flex-1 text-lg" style={{color: 'var(--color-text)'}}>{statement}</p>
                  <div className="text-right ml-4">
                    {revealed ? (
                      <>
                        <div className="text-2xl font-bold text-testio-blue">
                          {voteCount}
                        </div>
                        <div className="text-sm" style={{color: 'var(--color-text-muted)'}}>
                          {percentage.toFixed(1)}%
                        </div>
                      </>
                    ) : (
                      <div className="text-sm" style={{color: 'var(--color-text-muted)'}}>
                        Votes Hidden
                      </div>
                    )}
                  </div>
                </div>

                <ProgressBar
                  percentage={revealed ? percentage : 0}
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
                {showAdminControls
                  ? 'Hide Admin Controls'
                  : 'Show Admin Controls'}
              </button>

              {showAdminControls && (
                <div className="mt-4 max-w-md mx-auto">
                  <div className="flex space-x-2">
                    <input
                      type="password"
                      value={adminSecret}
                      onChange={e => setAdminSecret(e.target.value)}
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

        {/* Add celebration display after results */}
        {revealed && showCelebration && winners.length > 0 && (
          <div className="fixed inset-0 pointer-events-none z-50">
            <CelebrationEffect 
              winners={winners} 
              onComplete={() => setShowCelebration(false)} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveResults;
