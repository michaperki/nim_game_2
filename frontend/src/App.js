import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const SERVER_URL = 'ws://localhost:8000'; // Replace with your server URL

const App = () => {
  const [gameState, setGameState] = useState({
    piles: [3, 4, 5]
  });
  const [pileIndex, setPileIndex] = useState(0);
  const [stonesToRemove, setStonesToRemove] = useState(1);

  // Define playerId
  const playerId = 'player1'; // Example player ID

  // Define sendMove function to send move data to the server
  const sendMove = (pileIndex, stonesToRemove) => {
    const socket = io(SERVER_URL);
    socket.emit('move', {
      playerId,
      pileIndex,
      stonesToRemove
    });

    socket.on('gameState', (newGameState) => {
      setGameState(newGameState);
      console.log('Received updated game state');
      console.log(newGameState);
    });

  };

  const handlePileIndexChange = (event) => {
    setPileIndex(parseInt(event.target.value));
  };

  const handleStonesToRemoveChange = (event) => {
    setStonesToRemove(parseInt(event.target.value));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMove(pileIndex, stonesToRemove);
  };

  useEffect(() => {
    const socket = io(SERVER_URL);

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('gameState', (newGameState) => {
      setGameState(newGameState);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Nim Game</h1>
      <form onSubmit={handleSubmit}>
        <input type="number" value={pileIndex} onChange={handlePileIndexChange} />
        <input type="number" value={stonesToRemove} onChange={handleStonesToRemoveChange} />
        <button type="submit">Make Move</button>
      </form>
    </div>
  );
};

export default App;
