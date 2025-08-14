export const generateAvatarUrl = (playerName, options = {}) => {
  const { size = 64, style = 'adventurer' } = options;
  const seed = btoa(playerName || 'anonymous').replace(/[^a-zA-Z0-9]/g, '');

  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=1e40af,0891b2&size=${size}`;
};

export const getWinnerList = (votes, correctAnswer, voters) => {
  return voters
    .filter(voter => voter.vote === correctAnswer)
    .map(voter => ({
      id: voter.sessionId,
      name: voter.playerName || 'Anonymous',
    }));
};
