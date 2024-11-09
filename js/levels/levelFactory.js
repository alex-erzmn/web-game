import { Level } from './level.js';
import { Obstacle } from './elements/obstacles/obstacle.js';
import { MovingObstacle } from './elements/obstacles/movingObstacle.js';
import { Exit } from './elements/exit.js';
import { Start } from './elements/start.js';
import { Enemy } from './elements/enemies/enemy.js';
import { Item } from './elements/items/item.js';

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
                new Enemy(enemyData.x, enemyData.y)
            ) || [];

            const items = levelData.items?.map(itemData => 
                new Item(itemData.x, itemData.y, itemData.type)
            ) || [];

            return new Level(start, exit, obstacles, enemies, items); // No separate movingObstacles array
        });
    }

    // Factory method to create obstacles based on their type
    static createObstacle(data) {
        switch (data.type) {
            case 'Obstacle':
                return new Obstacle(data.x, data.y, data.width, data.height, data.color);
            case 'MovingObstacle':
                return new MovingObstacle(data.x, data.y, data.width, data.height, data.color, data.speed, data.direction);
            // Add more cases here for other obstacle types
            default:
                throw new Error(`Unknown obstacle type: ${data.type}`);
        }
    }
}
