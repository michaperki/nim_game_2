// games/nimGame.js

class NimGame {
    constructor() {
        // Initialize game state
        this.state = {
            // Define your game state here, for example:
            piles: [3, 4, 5] // Initial number of stones in each pile
        };

        // add players
        this.players = [];
    }

    // Method to make a move in the Nim game
    makeMove(playerId, pileIndex, stonesToRemove) {
        // Add logic to validate the move and update game state
        // For example:
        if (!this.isValidMove(pileIndex, stonesToRemove)) {
            // Handle invalid move
            return false;
        }

        // Update game state
        this.state.piles[pileIndex] -= stonesToRemove;

        // Check win condition
        if (this.isGameOver()) {
            // Handle game over
            return true;
        }

        // Broadcast updated game state to players
        // You'll need to implement this part using WebSocket
        this.broadcastGameState();

        return true;
    }

    // Method to check if a move is valid
    isValidMove(pileIndex, stonesToRemove) {
        // Add logic to validate the move
        // For example:
        if (pileIndex < 0 || pileIndex >= this.state.piles.length) {
            // Invalid pile index
            return false;
        }

        if (stonesToRemove <= 0 || stonesToRemove > this.state.piles[pileIndex]) {
            // Invalid number of stones to remove
            return false;
        }

        return true;
    }

    // Method to check if the game is over (all piles empty)
    isGameOver() {
        return this.state.piles.every(pile => pile === 0);
    }

    // Method to broadcast game state to players
    broadcastGameState() {
        // Implement WebSocket logic to broadcast game state to players
    }
}

module.exports = NimGame;
