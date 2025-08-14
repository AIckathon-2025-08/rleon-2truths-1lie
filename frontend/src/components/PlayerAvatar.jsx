import { useMemo } from 'react';

const PlayerAvatar = ({ playerName, size = 32 }) => {
  const avatarUrl = useMemo(() => {
    const seed = btoa(playerName || 'anonymous').replace(/[^a-zA-Z0-9]/g, '');
    return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundColor=1e40af,0891b2&size=${size}`;
  }, [playerName, size]);

  return (
    <img
      src={avatarUrl}
      alt={`${playerName} avatar`}
      className={`rounded-full border-2 border-cyan-600 w-${size} h-${size}`}
      loading="lazy"
    />
  );
};

export default PlayerAvatar;
