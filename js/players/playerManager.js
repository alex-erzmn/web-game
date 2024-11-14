import { Player } from "./player.js";
import { InputManager } from "./inputManager.js";

export class PlayerManager {
    constructor(game) {
        this.game = game;
        this.inputManager = new InputManager();
        this.players = [];
        this.finishedPlayers = new Set();
    }

    initializePlayers() {
        const playerCount = parseInt(sessionStorage.getItem('playerCount')) || 1;
        const defaultColors = ["#FF0000", "#00FF00", "#0000FF", "#ffdc40"];
        const playerControls = [
            { controls: { up: 'w', down: 's', left: 'a', right: 'd' } },
            { controls: { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' } },
            { controls: { up: 'i', down: 'k', left: 'j', right: 'l' } },
            { controls: { up: 't', down: 'g', left: 'f', right: 'h' } },
        ];

        for (let i = 0; i < playerCount; i++) {
            // Fetch the color from sessionStorage if available; otherwise, use the default color
            const color = sessionStorage.getItem(`playerColor${i + 1}`) || defaultColors[i];
            const controls = playerControls[i].controls;
            this.players.push(new Player(0, 0, color, controls)); // Pass color to the Player
        }
    }

    updatePlayers(delta) {
        this.players.forEach(player => {
            // Reset dx and dy to zero at the start of each update
            player.dx = 0;
            player.dy = 0;
            const speed = player.speed * delta;

            // Check if controls are inverted
            const isInverted = player.isControlInverted;

            // Set dx and dy based on input for movement direction
            const upKey = this.inputManager.isKeyPressed(player.controls.up);
            const downKey = this.inputManager.isKeyPressed(player.controls.down);
            const leftKey = this.inputManager.isKeyPressed(player.controls.left);
            const rightKey = this.inputManager.isKeyPressed(player.controls.right);

            // Apply inverted controls if necessary
            player.dy = isInverted ? (downKey ? -1 : (upKey ? 1 : 0)) : (upKey ? -1 : (downKey ? 1 : 0));
            player.dx = isInverted ? (rightKey ? -1 : (leftKey ? 1 : 0)) : (leftKey ? -1 : (rightKey ? 1 : 0));

            // Normalize speed for diagonal movement
            if (player.dx !== 0 && player.dy !== 0) {
                // Scale down dx and dy to keep diagonal speed constant
                const diagonalSpeed = Math.sqrt(0.5); // ≈ 0.707
                player.dx *= diagonalSpeed * speed;
                player.dy *= diagonalSpeed * speed;
            } else {
                // Set dx and dy to the full speed for single direction movement
                player.dx *= speed;
                player.dy *= speed;
            }

            // Only move if the player hasn't finished
            if (!player.finished) {
                player.smallMove(5, this.game);
                // player.move(); // Now using dx and dy to move
            }
        });
    }

    resetPlayers() {
        this.players.forEach(player => {
            player.finished = false;
            player.isControlInverted = false;
        });
        this.finishedPlayers.clear();
    }

    drawPlayers(ctx) {
        this.players.forEach(player => {
            if (!player.finished) {
                player.draw(ctx);
            }
        });
    }

    checkPlayersReachedExit() {
        if (this.finishedPlayers.size === this.players.length) {
            this.game.stop();
            this.game.nextLevel();
        }
    }
}
