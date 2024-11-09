import { Player } from "./player.js";
import { InputManager } from "./inputManager.js";
import { CollisionManager } from '../gamePhysics/collisionManager.js';
import { Game } from '../game.js';

export class PlayerManager {
    constructor(game) {
        this.game = game;
        this.inputManager = new InputManager();
        this.players = [];
        this.finishedPlayers = new Set();
    }

    initializePlayers() {
        const playerCount = parseInt(sessionStorage.getItem('playerCount')) || 1;
        const defaultColors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"];
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

    updatePlayers() {
        this.players.forEach(player => {
            let newX = player.x;
            let newY = player.y;

            if (this.inputManager.isKeyPressed(player.controls.up)) newY -= player.speed;
            if (this.inputManager.isKeyPressed(player.controls.down)) newY += player.speed;
            if (this.inputManager.isKeyPressed(player.controls.left)) newX -= player.speed;
            if (this.inputManager.isKeyPressed(player.controls.right)) newX += player.speed;
            if (!player.finished) {
                player.move(newX, newY);
            }
        });
        this.checkPlayersReachedExit();
    }

    resetFinishedStatus() {
        this.players.forEach((player) => player.finished = false);
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
            this.game.nextLevel();
        }
    }
}
