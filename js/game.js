import { Player } from './player.js';
import { LevelFactory } from './levels/levelFactory.js';
import { GamePhysics } from './gamePhysics.js';
import { MovingObstacle } from './levels/elements/obstacles/movingObstacle.js';
import { Sounds } from './background/sounds.js';

export class Game {

    // -------------------------- Initialization --------------------------

    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        this.confettiInstance = confetti.create(this.canvas, { resize: true });
        this.players = [];
        this.finishedPlayers = new Set();

        // Level components
        this.levels = [];
        this.currentLevel = 0;
        this.obstacles = [];
        this.enemies = [];
        this.items = [];
        this.layout = [];
        this.exit = null;

        this.input = {};
        this.countdownActive = false;
        this.gameRunning = false;
        this.overlapBuffer = 30;
        this.framesSinceStart = 0;

        const playerCount = parseInt(sessionStorage.getItem('playerCount')) || 1;
        this.setupInput();
        this.initializePlayers(playerCount);
        this.updateScoreTable();

        LevelFactory.loadLevels('./js/levels/levels.json').then(levels => {
            this.levels = levels;
            this.prepareStage();
            this.startCountdown(5, () => {
                Sounds.backgroundMusic.gameBackgroundMusic.play();
                this.gameRunning = true;
                this.gameLoop();
            });
        });
    }

    initializePlayers(playerCount) {
        const playerConfigs = [
            { color: "red", controls: { up: 'w', down: 's', left: 'a', right: 'd' } },
            { color: "blue", controls: { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' } },
            { color: "green", controls: { up: 'i', down: 'k', left: 'j', right: 'l' } },
            { color: "brown", controls: { up: 't', down: 'g', left: 'f', right: 'h' } },
        ];

        for (let i = 0; i < playerCount; i++) {
            const config = playerConfigs[i];
            this.players.push(new Player(0, 0, config.color, config.controls));
        }
    }

    setupInput() {
        window.addEventListener('keydown', (e) => {
            this.input[e.key] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.input[e.key] = false;
        });
    }

    // -------------------------- Countdown Management --------------------------

    startCountdown(countdownNumber, callback) {
        this.countdownActive = true;
        const countdownInterval = setInterval(() => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawCountdown(countdownNumber);

            if (countdownNumber <= 0) {
                clearInterval(countdownInterval);
                this.countdownActive = false;
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

    gameLoop() {
        if (this.gameRunning) {
            this.update();
            this.draw();
            requestAnimationFrame(this.gameLoop.bind(this));
        }
    }

   update() {
    if (!this.countdownActive) {
        this.framesSinceStart++;

        this.obstacles.forEach(movingObstacle => {
            if (movingObstacle instanceof MovingObstacle) {
                movingObstacle.update(this.canvas, this.obstacles);
            }
        });

        this.players.forEach(player => {
            let newX = player.x;
            let newY = player.y;

            if (this.input[player.controls.up]) newY -= player.speed;
            if (this.input[player.controls.down]) newY += player.speed;
            if (this.input[player.controls.left]) newX -= player.speed;
            if (this.input[player.controls.right]) newX += player.speed;

            const playerResetted = GamePhysics.checkPlayerWithMovingObstacle(
                player, this.obstacles.filter(obs => obs instanceof MovingObstacle),
                this.canvas, this.obstacles, this.levels[this.currentLevel].start
            );

            if (!playerResetted) {
                const originalY = player.y;
                player.y = newY;
                if (GamePhysics.checkCollisionWithObstacles(player, this.obstacles) ||
                    GamePhysics.checkCollisionWithBoundaries(player, this.canvas)) {
                    player.y = originalY;
                }

                const originalX = player.x;
                player.x = newX;
                if (GamePhysics.checkCollisionWithObstacles(player, this.obstacles) ||
                    GamePhysics.checkCollisionWithBoundaries(player, this.canvas)) {
                    player.x = originalX;
                }
            }

            if (this.framesSinceStart > this.overlapBuffer) {
                GamePhysics.checkPlayerCollisions(player, this.players, this.canvas, this.obstacles);
            }
        });

        this.checkPlayerReachedExit();
        this.updateScoreTable();
    }
}

    draw() {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.players.forEach(player => {
            if (!player.finished) {
                player.draw(this.ctx);
            }
        });
        this.obstacles.forEach(obstacle => obstacle.draw(this.ctx));
        this.items.forEach(item => item.draw(this.ctx));
        this.exit.draw(this.ctx);

        this.ctx.restore();
    }

    updateScoreTable() {
        const scoreTableBody = document.querySelector('#scoreTable tbody');
        scoreTableBody.innerHTML = '';

        const sortedPlayers = this.players.sort((a, b) => b.points - a.points);

        sortedPlayers.forEach((player, index) => {
            const row = document.createElement('tr');

            const playerCell = document.createElement('td');
            const colorSquare = this.createColorSquare(player.color);
            playerCell.appendChild(colorSquare);

            const scoreCell = document.createElement('td');
            scoreCell.textContent = player.points;

            if (index === 0) {
                const crownIcon = document.createElement('span');
                crownIcon.classList.add('fa-solid', 'fa-crown');
                crownIcon.style.color = 'gold';
                crownIcon.style.marginLeft = '10px';
                scoreCell.appendChild(crownIcon);
            }

            row.appendChild(playerCell);
            row.appendChild(scoreCell);
            scoreTableBody.appendChild(row);
        });
    }

    createColorSquare(color) {
        const square = document.createElement('div');
        square.style.width = '20px';
        square.style.height = '20px';
        square.style.backgroundColor = color;
        square.style.display = 'inline-block';
        square.style.marginRight = '10px';
        return square;
    }

    checkPlayerReachedExit() {
        this.players.forEach((player) => {
            if (this.exit && GamePhysics.circleSquareCollision(player, this.exit) && !this.finishedPlayers.has(player)) {
                player.points += 4 - this.finishedPlayers.size;
                this.finishedPlayers.add(player);
                player.finished = true;
                Sounds.soundEffects.goalReached.play();
            }
        });

        if (this.finishedPlayers.size === this.players.length) {
            this.nextLevel();
        }
    }

    // -------------------------- Level Management --------------------------

    prepareStage() {
        const currentLevelData = this.levels[this.currentLevel];
        this.obstacles = currentLevelData.obstacles;
        this.exit = currentLevelData.exit;
        this.enemies = currentLevelData.enemies;
        this.items = currentLevelData.items;
        this.layout = currentLevelData.layout;
        this.framesSinceStart = 0;

        const startPosition = currentLevelData.start;
        this.players.forEach(player => {
            player.x = startPosition.x;
            player.y = startPosition.y;
        });
    }

    nextLevel() {
        this.currentLevel++;
        if (this.currentLevel < this.levels.length) {
            this.gameRunning = false;
            this.startCountdown(3, () => {
                this.prepareStage();
                this.players.forEach((player) => player.finished = false);
                this.finishedPlayers.clear();
                this.gameRunning = true;
                this.gameLoop();
            });
        } else {
            this.gameRunning = false;
            this.gameFinished();
        }
    }

    // -------------------------- Game End Management --------------------------

    gameFinished() {
        const winner = this.players.reduce((max, player) => (player.points > max.points ? player : max));

        // Draw the end screen text directly on the canvas
        this.drawEndScreen(winner); // DOES NOT WORK FOR SOME REASON :/

        // Start the confetti animation
        this.startConfetti();


        // Play sound for game completion
        Sounds.soundEffects.allLevelsCompleted.play();
    }

    drawEndScreen(winner) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();

        this.ctx.fillStyle = 'black';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText("All levels completed!", this.canvasWidth / 2, this.canvasHeight / 2);

        this.ctx.fillStyle = winner.color;
        this.ctx.font = '60px Arial';
        this.ctx.fillText(`Winner: ${winner.color} player!`, this.canvasWidth / 2, this.canvasHeight / 2);

        this.ctx.restore();
    }

    startConfetti() {
        const duration = 5 * 1000;
        const end = Date.now() + duration;

        const interval = setInterval(() => {
            const timeLeft = end - Date.now();
            this.confettiInstance({
                particleCount: 100,
                startVelocity: 30,
                spread: 360,
                origin: {
                    x: Math.random(),
                    y: Math.random() - 0.2
                },
            });

            if (timeLeft <= 0) {
                clearInterval(interval);
            }
        }, 250);
    }
}

window.onload = () => new Game();
