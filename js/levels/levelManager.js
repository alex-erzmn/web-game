import { LevelFactory } from './levelFactory.js';
import { MovingObstacle } from './elements/obstacles/movingObstacle.js';

/**
 * Manages the levels in the game and their elements
 */
export class LevelManager {
    constructor(game) {
        this.game = game;
        this.levels = [];
        this.currentLevel = 1;
        this.obstacles = [];
        this.enemies = [];
        this.items = [];
        this.effects = [];
        this.start = null;
        this.exit = null;
        this.fog = [];
    }

    initializeLevels() {
        LevelFactory.loadLevels('./js/levels/levels.json').then(levels => {
            this.levels = levels;
            this.prepareStage();
        });
    }

    getCurrentLevelFog() {
        return this.levels[this.currentLevel - 1]?.fog || false;
    }

    removeItem(item) {
        this.items = this.items.filter(i => i !== item);
    }

    prepareStage() {
        const currentLevelData = this.levels[this.currentLevel - 1];
        this.obstacles = currentLevelData.obstacles;
        this.start = currentLevelData.start;
        this.exit = currentLevelData.exit;
        this.enemies = currentLevelData.enemies;
        this.items = currentLevelData.items;
        this.effects = currentLevelData.effects;
        this.fog = currentLevelData.fog;
        this.framesSinceStart = 0;

        const players = this.game.getPlayers();
        players.forEach(player => {
            player.x = this.start.x;
            player.y = this.start.y;
        });
        this.updateLevelOverview(this.currentLevel);
    }

    nextLevel() {
        this.currentLevel++;
        if (this.currentLevel > this.levels.length) {
            return false;
        }
        return true;
    }

    updateLevel(delta) {
        this.obstacles.forEach(movingObstacle => {
            if (movingObstacle instanceof MovingObstacle) {
                movingObstacle.update(10, delta, this.game);
            }
        });

        this.enemies.forEach(enemy => {
            enemy.update(this.game.getPlayers().filter(player => !player.finished), delta);
        });

        this.effects.forEach(effect => {
            effect.update();
        })

    }

    drawLevel(ctx) {
        this.enemies.forEach(enemy => enemy.draw(ctx));
        this.obstacles.forEach(obstacle => obstacle.draw(ctx));
        this.items.forEach(item => item.draw(ctx));
        this.effects.forEach(effect => effect.draw(ctx));
        this.exit.draw(ctx);
        this.drawFog(ctx);
    }

    updateLevelOverview(currentLevel) {
        const levelOverview = document.getElementById("level-overview");
        levelOverview.innerHTML = '';
    
        // Create the levels dynamically
        for (let i = 1; i <= this.levels.length; i++) {
            const levelDiv = document.createElement("div");
            levelDiv.classList.add("level");
            
            const levelText = document.createElement("span");
            levelText.innerText = `Level ${i}`;
            levelDiv.appendChild(levelText);
    
            // Check if the current level has fog enabled
            if (this.levels[i - 1].fog) {
                const fogIcon = document.createElement("i");
                fogIcon.classList.add("fa-regular", "fa-moon");
                fogIcon.classList.add("fog-icon");
                levelDiv.appendChild(fogIcon);
            }

            if (i === this.levels.length) {
                const trophyIcon = document.createElement("i");
                trophyIcon.classList.add("fa-solid", "fa-trophy");
                trophyIcon.classList.add("trophy-icon");
                levelDiv.appendChild(trophyIcon);
            }
        
            // Highlight the current level
            if (i === currentLevel) {
                levelDiv.id = "current-level";
            }
    
            levelOverview.appendChild(levelDiv);
        }
    
        // Scroll to the current level to keep it in view
        const currentLevelElement = document.getElementById("current-level");
        if (currentLevelElement) {
            currentLevelElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }   

    drawFog(ctx) {
        // Only draw fog if enabled for the current level
        if (!this.getCurrentLevelFog()) return;

        // Create an off-screen canvas for the fog layer
        const fogCanvas = document.createElement('canvas');
        fogCanvas.width = this.game.canvasWidth;
        fogCanvas.height = this.game.canvasHeight;
        const fogCtx = fogCanvas.getContext('2d');

        // Draw a full-screen dark fog layer on the off-screen canvas
        fogCtx.fillStyle = 'rgba(0, 0, 0, 1)';
        fogCtx.fillRect(0, 0, fogCanvas.width, fogCanvas.height);

        // Set composite operation to 'destination-out' for each player's visibility bubble
        fogCtx.globalCompositeOperation = 'destination-out';

        // Draw a gradient "visibility bubble" for each player
        this.game.getPlayers().forEach(player => {
            if (!player.finished) {
                const playerCenterX = player.x + player.width / 2; 
                const playerCenterY = player.y + player.height / 2; 
                const visibilityRadius = 100; 

                const gradient = fogCtx.createRadialGradient(
                    playerCenterX, playerCenterY, visibilityRadius * 0.5, 
                    playerCenterX, playerCenterY, visibilityRadius        
                );

                gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');   
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');   

                fogCtx.fillStyle = gradient;
                fogCtx.fillRect(playerCenterX - visibilityRadius, playerCenterY - visibilityRadius,
                    visibilityRadius * 2, visibilityRadius * 2);
            }
        });

        // Reset the composite operation for fogCtx
        fogCtx.globalCompositeOperation = 'source-over';

        // Draw the off-screen fog canvas onto the main canvas
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.drawImage(fogCanvas, 0, 0);
        ctx.restore();
    }
}