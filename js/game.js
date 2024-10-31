import { Player } from './player.js';
import { LevelFactory } from './levels/levelFactory.js';
import { GamePhysics } from './gamePhysics.js';
import { MovingObstacle } from './levels/elements/obstacles/movingObstacle.js';
import { Sounds } from './sounds.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        this.levels = [];
        this.currentLevel = 0;
        this.players = [];
        this.finishedPlayers = new Set();
        this.obstacles = [];
        this.enemies = [];
        this.items = [];
        this.layout = [];
        this.exit = null;
        this.input = {};
        this.countdownActive = false;
        this.countdownNumber = 5;
        this.gameRunning = false;
        this.overlapBuffer = 30; // buffer frames to avoid collisions at start
        this.framesSinceStart = 0; // track frames since start for initial overlap

        const playerCount = parseInt(sessionStorage.getItem('playerCount')) || 1;
        this.setupInput();
        this.initializePlayers(playerCount);
        this.updateScoreTable();

        LevelFactory.loadLevels('./js/levels/levels.json').then(levels => {
            this.levels = levels;
            this.prepareStage();
            this.startCountdown(5, () => {
                Sounds.backgroundMusic.play();
                this.gameRunning = true; // Game is now running
                this.gameLoop(); // Start the game loop
            }); // Start with a 5-second countdown
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

    startCountdown(countdownNumber, callback) {
        this.countdownActive = true;  // Set countdown state to active
        this.countdownNumber = countdownNumber; // Initialize countdown number

        const countdownInterval = setInterval(() => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas for each countdown frame
            this.drawCountdown(this.countdownNumber); // Draw the countdown number

            if (this.countdownNumber <= 0) {
                clearInterval(countdownInterval); // Stop the countdown
                this.countdownActive = false; // Set countdown state to inactive
                callback();  // Call the provided callback function
            }
            this.countdownNumber--; // Decrement countdown number
        }, 1000); // Update every second
    }

    drawCountdown(number) {
        this.ctx.fillStyle = 'black';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(number, this.canvasWidth / 2, this.canvasHeight / 2); // Draw countdown number in the center of the canvas
    }

    prepareStage() {
        const currentLevelData = this.levels[this.currentLevel];
        this.obstacles = currentLevelData.obstacles;
        this.exit = currentLevelData.exit;
        this.enemies = currentLevelData.enemies;
        this.items = currentLevelData.items;
        this.layout = currentLevelData.layout;
        this.framesSinceStart = 0; // reset overlap buffer on new level

        const startPosition = currentLevelData.start;
        this.players.forEach(player => {
            player.x = startPosition.x;
            player.y = startPosition.y;
        });
    }

    nextLevel() {
        this.currentLevel++;
        if (this.currentLevel < this.levels.length) {
            this.prepareStage();
            this.startCountdown(3, () => {
                this.gameRunning = true; // Ensure the game is still running after countdown
            }); // Start countdown for the next level
        } else {
            this.gameRunning = false;
            this.gameFinished();
        }
    }

    gameFinished() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'black';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText("All levels completed!", this.canvasWidth / 2, this.canvasHeight / 2);

        this.startConfetti();
        Sounds.soundEffects.allLevelsCompleted.play();
    }

    startConfetti() {
        const duration = 5 * 1000; // 5 seconds
        const end = Date.now() + duration;
    
        const interval = setInterval(() => {
            const timeLeft = end - Date.now();
            confetti({
                particleCount: 100,
                startVelocity: 30,
                spread: 360,
                origin: {
                    x: Math.random(), // Random x-coordinate (0-1)
                    y: Math.random() - 0.2 // Random y-coordinate (0-0.2)
                },
            });
    
            if (timeLeft <= 0) {
                clearInterval(interval);
            }
        }, 250);
    }

    gameLoop() {
        if (this.gameRunning) {
            this.update();
            this.draw();
            requestAnimationFrame(this.gameLoop.bind(this));
        }
    }

    update() {
        if (!this.countdownActive) { // Only update if countdown is not active
            this.framesSinceStart++;

            // Update moving obstacles by filtering through the obstacles array
            this.obstacles.forEach(movingObstacle => {
                if (movingObstacle instanceof MovingObstacle) {
                    movingObstacle.update(this.canvas, this.obstacles);
                }
            });

            // Moving Player
            this.players.forEach(player => {
                // Separate new positions for x and y
                let newX = player.x;  // Proposed new X
                let newY = player.y;  // Proposed new Y

                // Calculate proposed new positions based on input
                if (this.input[player.controls.up]) newY -= player.speed; // Move up
                if (this.input[player.controls.down]) newY += player.speed; // Move down
                if (this.input[player.controls.left]) newX -= player.speed; // Move left
                if (this.input[player.controls.right]) newX += player.speed; // Move right

                var playerResettet = false;

                // Check if player collides with moving obstacles
                this.obstacles.forEach(movingObstacle => {
                    if (movingObstacle instanceof MovingObstacle && movingObstacle.collidesWith(player)) {
                        // Push the player in the moving direction of the obstacle
                        if (movingObstacle.direction === 'horizontal') {
                            player.x += movingObstacle.speed;
                        } else if (movingObstacle.direction === 'vertical') {
                            player.y += movingObstacle.speed;
                        }

                        // Check for boundary collision after push
                        if (GamePhysics.checkCollisionWithObstacles(player, this.obstacles)
                            || GamePhysics.checkCollisionWithBoundaries(player, this.canvas)) {
                            // Reset player to starting position
                            player.x = this.levels[this.currentLevel].start.x;
                            player.y = this.levels[this.currentLevel].start.y;
                            playerResettet = true;
                            Sounds.soundEffects.collision.play();
                        }
                    }
                });

                if (!playerResettet) {
                    // First, try moving vertically
                    const originalY = player.y;
                    player.y = newY;

                    if (GamePhysics.checkCollisionWithObstacles(player, this.obstacles)
                        || GamePhysics.checkCollisionWithBoundaries(player, this.canvas)) {
                        // Collision detected, revert to original Y position
                        player.y = originalY;
                    }

                    // Now, try moving horizontally
                    const originalX = player.x;
                    player.x = newX;

                    if (GamePhysics.checkCollisionWithObstacles(player, this.obstacles)
                        || GamePhysics.checkCollisionWithBoundaries(player, this.canvas)) {
                        // Collision detected, revert to original X position
                        player.x = originalX;
                    }
                }

                if (this.framesSinceStart > this.overlapBuffer) {
                    GamePhysics.checkPlayerCollisions(player, this.players, this.canvas, this.obstacles, this.movingObstacles);
                }

            });

            this.checkPlayerReachedExit();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.players.forEach(player => {
            if (!player.finished) {
                player.draw(this.ctx);
            }
        });
        this.obstacles.forEach(obstacle => obstacle.draw(this.ctx)); // Draw static obstacles
        if (this.exit) this.exit.draw(this.ctx); // Draw the exit point

        this.updateScoreTable();
    }

    updateScoreTable() {
        const scoreTableBody = document.querySelector('#scoreTable tbody');
        scoreTableBody.innerHTML = ''; // Clear existing scores

        const sortedPlayers = this.players.sort((a, b) => b.points - a.points);

        sortedPlayers.forEach((player, index) => {
            const row = document.createElement('tr');

            // Create a cell for the color square
            const playerCell = document.createElement('td');
            const colorSquare = this.createColorSquare(player.color); // Create square
            playerCell.appendChild(colorSquare); // Append square to the cell

            const scoreCell = document.createElement('td');
            scoreCell.textContent = player.points; // Display player score

            if (index === 0) { // Check if it's the first player
                const crownIcon = document.createElement('span'); // Create span for crown
                crownIcon.classList.add('fa-solid', 'fa-crown'); // Add Font Awesome classes
                crownIcon.style.color = 'gold'; // Optional: Set color for the crown
                crownIcon.style.marginLeft = '10px'; // Optional: Add some spacing to the left
                scoreCell.appendChild(crownIcon); // Append crown icon to the score cell
            }

            row.appendChild(playerCell);
            row.appendChild(scoreCell);
            scoreTableBody.appendChild(row);
        });
    }

    // Function to create a colored square
    createColorSquare(color) {
        const square = document.createElement('div');
        square.style.width = '20px'; // Set width for the square
        square.style.height = '20px'; // Set height for the square
        square.style.backgroundColor = color; // Set the background color
        square.style.display = 'inline-block'; // Keep the square inline
        square.style.marginRight = '10px'; // Add space between square and text
        return square;
    }

    checkPlayerReachedExit() {
        // Check if each player has reached the exit
        this.players.forEach((player) => {
            if (this.exit && this.exit.checkPlayerReached(player) && !this.finishedPlayers.has(player)) {
                player.points += 4 - this.finishedPlayers.size; // Award points based on the order of finish
                this.finishedPlayers.add(player); // Mark player as finished
                player.finished = true; // Set a flag to make them disappear visually
                Sounds.soundEffects.goalReached.play(); // Play goal reached sound
            }
        });

        // Only proceed if all players have reached the exit
        if (this.finishedPlayers.size === this.players.length) {
            this.players.forEach((player) => player.finished = false);
            this.finishedPlayers.clear();
            this.nextLevel(); // Move to the next level
        }
    }
}

window.onload = () => new Game();
