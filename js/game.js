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

        // Game
        this.then = 0;
        this.gameRunning = false;

        // Managers
        this.playerManager = new PlayerManager(this);
        this.evaluationManager = new EvaluationManager(this);
        this.levelManager = new LevelManager(this);
        this.collisionManager = new CollisionManager(this);

        this.playerManager.initializePlayers();
        this.evaluationManager.updateScoreTable();
        this.levelManager.initializeLevels();

        // Initialize FPS tracking variables
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
        this.startCountdown(1, () => {
            Sounds.backgroundMusic.gameBackgroundMusic.play();
            this.gameRunning = true;
            this.then = new Date().getTime();
            this.mainLoop();
        });
    }

    stop() {
        this.gameRunning = false;
    }

    measureFPS(now) {
        // Calculate time difference between frames
        const diffTime = now - this.lastTime;

        // Update FPS every second
        if (diffTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = now;
        }

        // Display FPS in the fps-container div
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
            let delta = (now - this.then) / 10;
            
            this.measureFPS(now); // Update and display FPS

            this.clearCanvas();
            this.update(delta);
            this.checkCollisions();
            this.draw();
            this.playerManager.checkPlayersReachedExit();

            requestAnimationFrame(this.mainLoop.bind(this));

            this.then = now;
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    update(delta) {
        // TODO: Use delta to ensure the same behavior in case of lower fps! (speed * delta) / 1000; 
        this.levelManager.updateLevel(delta);
        this.playerManager.updatePlayers(delta);

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
        this.drawFogOfWar();

        this.ctx.restore();
    }

    // Updated drawFogOfWar function using an off-screen canvas for fog overlay
    drawFogOfWar() {
        // Only draw fog if enabled for the current level
        if (!this.levelManager.getCurrentLevelFog()) return;

        // Step 1: Create an off-screen canvas for the fog layer
        const fogCanvas = document.createElement('canvas');
        fogCanvas.width = this.canvasWidth;
        fogCanvas.height = this.canvasHeight;
        const fogCtx = fogCanvas.getContext('2d');

        // Step 2: Draw a full-screen dark fog layer on the off-screen canvas
        fogCtx.fillStyle = 'rgba(0, 0, 0, 1)'; // Dark fog layer, adjust opacity as needed
        fogCtx.fillRect(0, 0, fogCanvas.width, fogCanvas.height);

        // Step 3: Set composite operation to 'destination-out' for each player's visibility bubble
        fogCtx.globalCompositeOperation = 'destination-out';

        // Draw a gradient "visibility bubble" for each player
        this.getPlayers().forEach(player => {
            if (!player.finished) {
                const playerCenterX = player.x + player.width / 2; // Center X
                const playerCenterY = player.y + player.height / 2; // Center Y
                const visibilityRadius = 100; // Adjust as needed for each player's visibility

                // Create a radial gradient for the visibility bubble around the player's center
                const gradient = fogCtx.createRadialGradient(
                    playerCenterX, playerCenterY, visibilityRadius * 0.5, // Inner radius of gradient
                    playerCenterX, playerCenterY, visibilityRadius         // Outer radius
                );

                gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');   // Transparent in the center
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');   // Opaque at the edges

                // Apply the gradient as a "cut-out" from the fog
                fogCtx.fillStyle = gradient;
                fogCtx.fillRect(playerCenterX - visibilityRadius, playerCenterY - visibilityRadius,
                    visibilityRadius * 2, visibilityRadius * 2);
            }
        });

        // Step 4: Reset the composite operation for fogCtx
        fogCtx.globalCompositeOperation = 'source-over';

        // Step 5: Draw the off-screen fog canvas onto the main canvas
        this.ctx.save();
        this.ctx.globalAlpha = 1; // Adjust this for fog transparency on the main canvas
        this.ctx.drawImage(fogCanvas, 0, 0);
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