import CelebrationEffect from '../components/CelebrationEffect';
import PlayerAvatar from '../components/PlayerAvatar';
import SoundEffect from '../components/SoundEffect';

// Test component for independent celebration system testing
const CelebrationTest = () => {
  const testWinners = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Charlie' },
  ];

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold text-blue-700">
        Celebration System Test
      </h1>

      {/* Test CelebrationEffect */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-semibold mb-4">Confetti & Winner Badges</h2>
        <CelebrationEffect
          winners={testWinners}
          onComplete={() => console.log('Celebration complete!')}
        />
      </div>

      {/* Test PlayerAvatar */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-semibold mb-4">Player Avatars</h2>
        <div className="flex space-x-4 items-center">
          <div className="text-center">
            <PlayerAvatar playerName="John Doe" size={64} />
            <p className="text-sm mt-1">John Doe (64px)</p>
          </div>
          <div className="text-center">
            <PlayerAvatar playerName="Jane Smith" size={32} />
            <p className="text-sm mt-1">Jane Smith (32px)</p>
          </div>
          <div className="text-center">
            <PlayerAvatar playerName="Anonymous" size={48} />
            <p className="text-sm mt-1">Anonymous (48px)</p>
          </div>
        </div>
      </div>

      {/* Test SoundEffect */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-semibold mb-4">Sound Effects</h2>
        <div className="flex space-x-4">
          <SoundEffect trigger={false} />
          <button
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
            onClick={() => {
              const audio = new Audio('/sounds/victory-chime.mp3');
              audio.volume = 0.3;
              audio.play().catch(console.error);
            }}
          >
            Test Victory Sound
          </button>
        </div>
      </div>
    </div>
  );
};

export default CelebrationTest;
