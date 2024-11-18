import { Sounds } from './background/sounds.js';
import { LevelManager } from './levels/levelManager.js';
import { PlayerManager } from './players/playerManager.js';
import { EvaluationManager } from './evaluation/evaluationManager.js';
import { CollisionManager } from './gamePhysics/collisionManager.js';

export class Game {

    // -------------------------- Initialization --------------------------

    constructor() {
        // Initialize Canvas variables
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;

        // Initialize Game running variable
        this.gameRunning = false;

        // Initialize Managers
        this.playerManager = new PlayerManager(this);
        this.evaluationManager = new EvaluationManager(this);
        this.levelManager = new LevelManager(this);
        this.collisionManager = new CollisionManager(this);

        this.playerManager.initializePlayers();
        this.evaluationManager.updateScoreTable();
        this.levelManager.initializeLevels();

        // Initialize FPS tracking variables
        this.then = 0;
        this.lastTime = 0;
        this.fps = 0;
        this.frameCount = 0;
        this.fpsContainer = document.getElementById('fps-container');
    }

    getCanvas() {
        return this.canvas;
    }

    getContext() {
        return this.ctx
    }

    getPlayers() {
        return this.playerManager.players;
    }

    getFinishedPlayers() {
        return this.playerManager.finishedPlayers;
    }

    getNotFinishedPlayers() {
        return this.playerManager.players.filter(player => !player.finished);
    }

    getStart() {
        return this.levelManager.start;
    }

    getExit() {
        return this.levelManager.exit;
    }

    getObstacles() {
        return this.levelManager.obstacles;
    }

    getItems() {
        return this.levelManager.items;
    }

    getEffects() {
        return this.levelManager.effects;
    }

    removeItem(item) {
        this.levelManager.removeItem(item);
    }

    getEnemies() {
        return this.levelManager.enemies;
    }

    start() {
        this.startCountdown(0, () => {
            Sounds.backgroundMusic.gameBackgroundMusic.play();
            this.gameRunning = true;
            this.then = new Date().getTime();
            this.mainLoop();
        });
    }

    stop() {
        this.gameRunning = false;
    }

    // -------------------------- FPS Measurement --------------------------

    measureFPS(now) {
        const diffTime = now - this.lastTime;

        if (diffTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = now;
        }

        this.fpsContainer.innerHTML = `FPS: ${this.fps}`;
        this.frameCount++;
    }

    // -------------------------- Countdown Management --------------------------

    startCountdown(countdownNumber, callback) {
        const countdownInterval = setInterval(() => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawCountdown(countdownNumber);

            if (countdownNumber <= 0) {
                clearInterval(countdownInterval);
                callback();
            }
            countdownNumber--;
        }, 1000);
    }

    drawCountdown(number) {
        this.ctx.fillStyle = 'black';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(number, this.canvasWidth / 2, this.canvasHeight / 2);
    }

    // -------------------------- Game Loop --------------------------

    mainLoop() {
        if (this.gameRunning) {
            let now = new Date().getTime();
            let delta = (now - this.then) / 1000;
            
            this.measureFPS(now);
            this.clearCanvas();
            this.update(delta);
            this.checkCollisions();
            this.draw();
            this.playerManager.checkPlayersReachedExit();
            this.evaluationManager.updateScoreTable();

            requestAnimationFrame(this.mainLoop.bind(this));

            this.then = now;
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    update(delta) {
        this.levelManager.updateLevel(delta);
        this.playerManager.updatePlayers(delta);
    }

    checkCollisions() {
        this.collisionManager.checkPlayerCollisions();
        this.collisionManager.checkEnemyCollisions();
        this.collisionManager.checkMovingObstacleCollisions();
    }

    draw() {
        this.ctx.save();

        this.playerManager.drawPlayers(this.ctx);
        this.levelManager.drawLevel(this.ctx);

        this.ctx.restore();
    }

    nextLevel() {
        if (this.levelManager.nextLevel()) {
            this.gameRunning = false;
            this.startCountdown(1, () => {
                this.levelManager.prepareStage();
                this.playerManager.resetPlayers();
                this.gameRunning = true;
                this.then = new Date().getTime();
                this.mainLoop();
            });
        } else {
            this.gameRunning = false;
            this.evaluationManager.gameFinished();
        }
    }
}