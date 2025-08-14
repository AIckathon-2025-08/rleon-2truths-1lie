class VotingAPI {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  }

  async createGame(formData) {
    const response = await fetch(`${this.baseURL}/games`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  }

  async getGame(gameId) {
    const response = await fetch(`${this.baseURL}/games/${gameId}`);
    return response.json();
  }
}

export { VotingAPI };
