import './Home.css';
import useWebSocket from 'react-use-websocket';
import React, { useEffect, useState } from 'react';

export function Home({ username }) {
    // home displays the buttons to create a new game or join an existing game
    const [gameId, setGameId] = useState('');
    const [gameState, setGameState] = useState({});
    const [players, setPlayers] = useState([]);
    const [playerId, setPlayerId] = useState(null);
    const [pileIndex, setPileIndex] = useState(0);
    const [stonesToRemove, setStonesToRemove] = useState(0);
    const [message, setMessage] = useState('');
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isYourTurn, setIsYourTurn] = useState(false);
    // you can only select stones from one pile at a time
    const [selectedPile, setSelectedPile] = useState(null);
    // you can only select stones from one pile at a time
    const [selectedStones, setSelectedStones] = useState([]);
    const [validMoveSelected, setValidMoveSelected] = useState(false);

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket('ws://localhost:8000', {
        onOpen: () => {
            console.log('WebSocket connection opened');
            sendJsonMessage({ type: 'join', username });
        },
        shouldReconnect: (closeEvent) => true
    });

    useEffect(() => {
        if (lastJsonMessage) {
            console.log(`Received message: ${JSON.stringify(lastJsonMessage)}`);
            setGameState(lastJsonMessage.game);
            setPlayers(lastJsonMessage.players);
            const playerId = Object.keys(lastJsonMessage.players).find(id => lastJsonMessage.players[id].username === username);
            console.log('Player ID:', playerId);
            setPlayerId(username);
        }
    }, [lastJsonMessage]);

    useEffect(() => {
        if (gameState.piles && gameState.piles.every(pile => pile === 0)) {
            setIsGameOver(true);
        }
    }
        , [gameState]);

    useEffect(() => {
        if (players.length === 2) {
            setIsGameStarted(true);
        }
    }
        , [players]);

    useEffect(() => {
        if (playerId === players[0]) {
            setIsYourTurn(true);
        }
    }
        , [playerId, players]);

    const handleCreateGame = () => {
        sendJsonMessage({ type: 'create', payload: { username } });
    }

    const handleJoinGame = () => {
        sendJsonMessage({ type: 'join', payload: { gameId, username } });
    }

    const handleMakeMove = () => {
        if (playerId) {
            sendJsonMessage({ type: 'move', payload: { playerId, pileIndex, stonesToRemove } });
        } else {
            console.error('Player ID is not set.');
        }
    }

    const handleStoneClick = (pileIndex, stones) => {
        console.log('handleStoneClick', pileIndex, stones);
        // if the pile is already selected, add the stones to the selected stones
        if (selectedPile === pileIndex) {
            setSelectedStones([...selectedStones, stones]);
        } else {
            setSelectedPile(pileIndex);
            setSelectedStones([stones]);
        }

        // Here, use a callback inside setState to access the updated state value
        setSelectedPile(prevPileIndex => {
            console.log('selectedPile', prevPileIndex);
            return prevPileIndex;
        });

        setSelectedStones(prevStones => {
            console.log('selectedStones', prevStones);
            return prevStones;
        });

        setValidMoveSelected(true);
        setIsYourTurn(true);
    }

    return (
        <>
            <h1>Welcome, {username}</h1>
            {isGameStarted ? (
                <>
                    <h2>Game in progress</h2>
                    <p>Players: {players.map(player => player.username).join(', ')}</p>
                    <div>
                        <h3>Piles:</h3>
                        {gameState.piles.map((stones, pileIndex) => (
                            <div key={pileIndex} className="pile">
                                <p>Pile {pileIndex + 1}: {stones} stones</p>
                                {Array.from({ length: stones }).map((_, stoneIndex) => (
                                    <Stone
                                        key={stoneIndex}
                                        onClick={() => handleStoneClick(pileIndex, stoneIndex + 1)}
                                        isSelected={selectedPile === pileIndex && selectedStones.includes(stoneIndex + 1)}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                    {isYourTurn ? validMoveSelected ? (
                        <button onClick={handleMakeMove}>Make move</button>
                    ) : (
                        <p>Select a valid move</p>
                    ) : (
                        <p>Waiting for other player to make a move</p>
                    )}
                    {isGameOver ? (
                        <p>Game over</p>
                    ) : null}
                </>
            ) : (
                <>
                    <h2>Start a new game</h2>
                    <button onClick={handleCreateGame}>Create game</button>
                    <h2>Join an existing game</h2>
                    <label>Enter game ID</label>
                    <input type="text" value={gameId} onChange={e => setGameId(e.target.value)} />
                    <button onClick={handleJoinGame}>Join game</button>
                    {players.length === 1 ? (
                        <button onClick={handleStartGame}>Start game</button>
                    ) : null}
                </>
            )}
        </>
    );
}

const Stone = ({ onClick, isSelected }) => (
    <div className={`stone ${isSelected ? 'selected' : ''}`} onClick={onClick}></div>
);


export default Home;
