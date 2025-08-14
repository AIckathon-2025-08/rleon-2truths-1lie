import { useState, useEffect } from 'react';

const SoundEffect = ({ trigger, soundType = 'victory' }) => {
  const [audioEnabled, setAudioEnabled] = useState(false);

  useEffect(() => {
    if (trigger && audioEnabled) {
      const audio = new Audio('/sounds/victory-chime.mp3');
      audio.volume = 0.3; // Keep it subtle
      audio.play().catch(() => {
        // User hasn't interacted yet - that's fine
        console.log('Audio requires user interaction first');
      });
    }
  }, [trigger, audioEnabled]);

  return (
    <button
      onClick={() => setAudioEnabled(!audioEnabled)}
      className="text-xs text-gray-500 hover:text-blue-700"
    >
      🔊 {audioEnabled ? 'Sound On' : 'Sound Off'}
    </button>
  );
};

export default SoundEffect;
