import { LevelFactory } from './levelFactory.js';
import { MovingObstacle } from './elements/obstacles/movingObstacle.js';

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

    getCurrentLevelFog() {
        return this.levels[this.currentLevel - 1]?.fog || false;
    }

    removeItem(item) {
        this.items = this.items.filter(i => i !== item);
    }

    initializeLevels() {
        LevelFactory.loadLevels('./js/levels/levels.json').then(levels => {
            this.levels = levels;
            this.prepareStage();
        });
    }

    prepareStage() {
        const currentLevelData = this.levels[this.currentLevel - 1];
        this.obstacles = currentLevelData.obstacles;
        this.start = currentLevelData.start;
        this.exit = currentLevelData.exit;
        this.enemies = currentLevelData.enemies;
        this.items = currentLevelData.items;
        this.effects = currentLevelData.fans;
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
                movingObstacle.update(delta);
            }
        });

        this.enemies.forEach(enemy => {
            enemy.update(this.game.getPlayers().filter(obj => !obj.isFinished), delta);
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
    }

    updateLevelOverview(currentLevel) {
        const levelOverview = document.getElementById("level-overview");
        levelOverview.innerHTML = ''; // Clear existing levels
    
        // Create the levels dynamically
        for (let i = 1; i <= this.levels.length; i++) {
            const levelDiv = document.createElement("div");
            levelDiv.classList.add("level");
            
            // Create a span for the level text
            const levelText = document.createElement("span");
            levelText.innerText = `Level ${i}`;
            levelDiv.appendChild(levelText);
    
            // Check if the current level has fog enabled
            if (this.levels[i - 1].fog) {
                const fogIcon = document.createElement("i");
                fogIcon.classList.add("fa-regular", "fa-moon");
                fogIcon.classList.add("fog-icon"); // Add an extra class for styling
                levelDiv.appendChild(fogIcon); // Append the fog icon next to the level text
            }
    
            // Highlight the current level
            if (i === currentLevel) {
                levelDiv.id = "current-level";
            }
    
            levelOverview.appendChild(levelDiv);
        }
    
        // Optionally scroll to the current level to keep it in view
        const currentLevelElement = document.getElementById("current-level");
        if (currentLevelElement) {
            currentLevelElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }   
}