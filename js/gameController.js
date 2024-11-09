import { Game } from './game.js';

export class GameController {
    constructor() {
        this.gameInstance = null;
    }

    initializeGame() {
        this.gameInstance = new Game();
        this.gameInstance.start();
    }

    startGame() {
        if (!this.gameInstance) {
            this.initializeGame();
        } else {
            this.gameInstance.start();
        }
    }
}