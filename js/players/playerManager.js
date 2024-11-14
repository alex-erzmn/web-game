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
            const color = sessionStorage.getItem(`playerColor${i + 1}`) || defaultColors[i];
            const controls = playerControls[i].controls;
            this.players.push(new Player(0, 0, color, controls));
        }
    }

    updatePlayers(delta) {
        this.players.forEach(player => {
    
            player.dx = 0;
            player.dy = 0;
            const speed = player.speed * delta;

            const isInverted = player.isControlInverted;

            const upKey = this.inputManager.isKeyPressed(player.controls.up);
            const downKey = this.inputManager.isKeyPressed(player.controls.down);
            const leftKey = this.inputManager.isKeyPressed(player.controls.left);
            const rightKey = this.inputManager.isKeyPressed(player.controls.right);

            player.dy = isInverted ? (downKey ? -1 : (upKey ? 1 : 0)) : (upKey ? -1 : (downKey ? 1 : 0));
            player.dx = isInverted ? (rightKey ? -1 : (leftKey ? 1 : 0)) : (leftKey ? -1 : (rightKey ? 1 : 0));

            if (player.dx !== 0 && player.dy !== 0) {
                const diagonalSpeed = Math.sqrt(0.5);
                player.dx *= diagonalSpeed * speed;
                player.dy *= diagonalSpeed * speed;
            } else {
                player.dx *= speed;
                player.dy *= speed;
            }

            if (!player.finished) {
                player.move(5, this.game);
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
