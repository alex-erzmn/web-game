import { LevelFactory } from './levelFactory.js';
import { Game } from '../game.js';
import { MovingObstacle } from './elements/obstacles/movingObstacle.js';
import { Item } from './elements/items/item.js';
import { Enemy } from "./elements/enemies/enemy.js";

export class LevelManager {
    constructor(game) {
        this.game = game;
        this.levels = [];
        this.currentLevel = 1;
        this.obstacles = [];
        this.enemies = [];
        this.items = [];
        this.start = null;
        this.exit = null;
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
        this.layout = currentLevelData.layout;
        this.framesSinceStart = 0;

        const players = this.game.getPlayers();
        players.forEach(player => {
            player.move(this.start.x, this.start.y);
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

    updateLevel() {
        this.obstacles.forEach(movingObstacle => {
            if (movingObstacle instanceof MovingObstacle) {
                movingObstacle.update(this.game.getCanvas(), this.obstacles);
            }
        });

        this.enemies.forEach(enemy => {
            enemy.update();
        });

    }

    drawLevel(ctx) {
        this.enemies.forEach(enemy => enemy.draw(ctx));
        this.obstacles.forEach(obstacle => obstacle.draw(ctx));
        this.items.forEach(item => item.draw(ctx));
        this.exit.draw(ctx);
    }

    updateLevelOverview(currentLevel) {
        const levelOverview = document.getElementById("level-overview");
        levelOverview.innerHTML = ''; // Clear existing levels
    
        // Create the levels dynamically
        for (let i = 1; i <= this.levels.length; i++) {
            const levelDiv = document.createElement("div");
            levelDiv.classList.add("level");
            levelDiv.innerText = `Level ${i}`;
            
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