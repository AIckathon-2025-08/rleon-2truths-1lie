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

export const useGameSocket = (gameId) => {
  const { socket, connected } = useSocket();
  const [votes, setVotes] = useState({ 0: 0, 1: 0, 2: 0 });
  const [revealed, setRevealed] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  useEffect(() => {
    if (!socket || !gameId) return;

    socket.emit('join-game', { gameId });

    socket.on('vote-update', (data) => {
      if (data.gameId === gameId) {
        setVotes(data.votes);
      }
    });

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

  const castVote = (vote) => {
    if (!socket || !connected) return;
    
    const sessionId = localStorage.getItem('sessionId') || 
                     (() => {
                       const id = crypto.randomUUID();
                       localStorage.setItem('sessionId', id);
                       return id;
                     })();

    socket.emit('cast-vote', { gameId, vote, sessionId });
  };

  const revealAnswer = (adminSecret) => {
    if (!socket || !connected) return;
    socket.emit('reveal-answer', { gameId, adminSecret });
  };

  return { votes, revealed, correctAnswer, connected, castVote, revealAnswer };
};