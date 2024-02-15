const http = require('http');
const { WebSocketServer } = require('ws');
const games = require('./games');

const url = require('url');
const uuidv4 = require('uuid').v4;

const server = http.createServer();
const wss = new WebSocketServer({ server });
const port = 8000;

let game; // Declaring game variable

const connections = {};
const users = {};

const handleMessage = (bytes, id) => {
    const message = JSON.parse(bytes);
    console.log(`Received message: ${JSON.stringify(message)}`);

    switch (message.type) {
        case 'create':
            game = new games.NimGame();
            broadcastState();
            break;
        case 'join':
            const { username } = users[id];
            if (!game) {
                console.log('No game created. Please create a game first.');
                return;
            }
            const newPlayerId = uuidv4(); // Generate UUID for playerId
            users[id].playerId = newPlayerId; // Associate playerId with the user
            if (!game.players.includes(username)) {
                game.players.push(username);
                if (game.players.length === 2) {
                    broadcastState();
                }
            } else {
                console.log('Player is already in the game. ');
            }
            break;

        case 'move':
            const { playerId, pileIndex, stonesToRemove } = message.payload;
            if (!game) {
                console.log('No game created. Please create a game first.');
                return;
            }
            if (game.players.indexOf(playerId) === -1) {
                console.log('Player not found in game.');
                console.log('Player ID:', playerId);
                console.log('Game players:', game.players);
                return;
            }
            if (game.players.indexOf(playerId) !== game.currentPlayer) {
                console.log('Not your turn.');
                return;
            }
            if (game.makeMove(playerId, pileIndex, stonesToRemove)) {
                broadcastState();
            }
            break;
        default:
            console.log(`Unknown message type: ${message.type}`);
    }
};

const handleClose = (id) => {
    console.log(`Connection closed: ${id}`);
    delete connections[id];
    delete users[id];
    broadcastState();
}

wss.on('connection', (connection, request) => {
    const { username } = url.parse(request.url, true).query;
    const id = uuidv4();
    console.log(`New connection: ${id} for ${username}`);

    connections[id] = connection;
    users[id] = {
        username: username,
        state: {}
    };

    connection.on('message', message => handleMessage(message, id))
    connection.on('close', () => handleClose(id));

})

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

const broadcastState = () => {
    const state = {
        game: game ? game.state : null, // Check if game exists
        players: Object.keys(users).map(id => ({
            id,
            username: users[id].username
        }))
    };

    Object.keys(connections).forEach(id => {
        connections[id].send(JSON.stringify(state));
    });
}

// Broadcast initial game state to all players
broadcastState();
