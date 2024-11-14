import { Level } from './level.js';
import { Obstacle } from './elements/obstacles/obstacle.js';
import { MovingObstacle } from './elements/obstacles/movingObstacle.js';
import { Exit } from './elements/exit.js';
import { Start } from './elements/start.js';
import { Enemy } from './elements/enemies/enemy.js';
import { ShieldItem } from "./elements/items/shieldItem.js";
import { SizeItem } from "./elements/items/sizeItem.js";
import { SpeedItem } from "./elements/items/speedItem.js";
import { Wind } from './elements/effects/wind.js';
import { Mud } from './elements/effects/mud.js';
import { Inverter } from './elements/effects/inverter.js';

/**
 * Factory class to create levels from JSON data
 */
export class LevelFactory {
    static async loadLevels(url) {
        const response = await fetch(url);
        const data = await response.json();
        return LevelFactory.parseLevels(data.levels);
    }

    static parseLevels(levelsData) {
        return levelsData.map(levelData => {
            const start = new Start(levelData.start.x, levelData.start.y);
            const exit = new Exit(levelData.exit.x, levelData.exit.y);

            const obstacles = levelData.obstacles?.map(obstacleData =>
                LevelFactory.createObstacle(obstacleData)
            ) || [];

            const enemies = levelData.enemies?.map(enemyData =>
                new Enemy(enemyData.x, enemyData.y, enemyData.type)
            ) || [];

            const items = levelData.items?.map(itemData =>
                LevelFactory.createItem(itemData)
            ) || [];

            const effects = levelData.effects?.map(effectsData =>
                LevelFactory.createEffect(effectsData)
            ) || [];

            const fog = levelData?.fog || false;

            return new Level(start, exit, obstacles, enemies, items, effects, fog);
        });
    }

    // Factory method to create obstacles based on their type
    static createObstacle(data) {
        switch (data.type) {
            case 'Obstacle':
                return new Obstacle(data.x, data.y, data.width, data.height, data.color);
            case 'MovingObstacle':
                return new MovingObstacle(data.x, data.y, data.dx, data.dy, data.width, data.height, data.color);
            default:
                throw new Error(`Unknown obstacle type: ${data.type}`);
        }
    }

    // Factory method to create items based on their type
    static createItem(data) {
        switch (data.type) {
            case 'Speed':
                return new SpeedItem(data.x, data.y);
            case 'Size':
                return new SizeItem(data.x, data.y);
            case 'Shield':
                return new ShieldItem(data.x, data.y);
            default:
                throw new Error(`Unknown item type: ${data.type}`);
        }
    }

    // Factory method to create effects based on their type
    static createEffect(data) {
        switch (data.type) {
            case 'Wind':
                return new Wind(data.x, data.y, data.dx, data.dy, data.width, data.height, data.force);
            case 'Mud':
                return new Mud(data.x, data.y, data.width, data.height, data.slowDownFactor);
            case 'Inverter':
                return new Inverter(data.x, data.y, data.width, data.height);
            default:
                throw new Error(`Unknown effect type: ${data.type}`);
        }
    }
}
