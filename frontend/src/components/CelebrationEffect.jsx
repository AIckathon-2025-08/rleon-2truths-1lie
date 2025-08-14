import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

const CelebrationEffect = ({ winners, onComplete }) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Auto-stop confetti after 3 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <>
      {showConfetti && (
        <Confetti
          numberOfPieces={100}
          recycle={false}
          colors={['#1E40AF', '#0891B2', '#10B981']} // TestIO colors
        />
      )}

      <div className="winners-display space-y-2">
        {winners.map(winner => (
          <div
            key={winner.id}
            className="winner-badge animate-bounce bg-blue-700 text-white px-4 py-2 rounded-full"
          >
            🏆 {winner.name} nailed it!
          </div>
        ))}
      </div>
    </>
  );
};

export default CelebrationEffect;
