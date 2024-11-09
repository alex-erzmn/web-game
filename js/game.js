import { Sounds } from './background/sounds.js';
import { LevelManager } from './levels/levelManager.js';
import { PlayerManager } from './players/playerManager.js';
import { EvaluationManager } from './evaluation/evaluationManager.js';
import { CollisionManager } from './gamePhysics/collisionManager.js';

export class Game {

    // -------------------------- Initialization --------------------------

    constructor() {
        // Canvas components
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        this.then = new Date().getTime();

        this.gameRunning = false;
        this.overlapBuffer = 30;
        this.framesSinceStart = 0;

        // Managers
        this.playerManager = new PlayerManager(this);
        this.evaluationManager = new EvaluationManager(this);
        this.levelManager = new LevelManager(this);
        this.collisionManager = new CollisionManager(this);

        this.playerManager.initializePlayers();
        this.evaluationManager.updateScoreTable();
        this.levelManager.initializeLevels();
    }

    getCollisionManager() {
        return this.collisionManager;
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

    removeItem(item) {
        this.levelManager.removeItem(item);
    }

    getEnemies() {
        return this.levelManager.enemies;
    }

    start() {
        this.startCountdown(1, () => {
            Sounds.backgroundMusic.gameBackgroundMusic.play();
            this.gameRunning = true;
            this.mainLoop();
        });
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
            let delta = now - this.then;

            this.clearCanvas();
            this.update(delta);
            this.checkCollisions();
            this.draw();

            requestAnimationFrame(this.mainLoop.bind(this));

            this.then = now;
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    update(delta) {
        this.framesSinceStart++;


        
        this.levelManager.updateLevel();
        this.playerManager.updatePlayers();
        
        // TODO: Use this to ensure even with lower FPS the speed of objects remains the same

        //calcDistanceToMove(delta, speed) {
        //    return (speed * delta) / 1000; 
        //}

        this.evaluationManager.updateScoreTable();
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
                this.playerManager.resetFinishedStatus();
                this.gameRunning = true;
                this.mainLoop();
            });
        } else {
            this.gameRunning = false;
            this.evaluationManager.gameFinished();
        }
    }
}