import { Level } from './level.js';
import { Obstacle } from './elements/obstacles/obstacle.js';
import { MovingObstacle } from './elements/obstacles/movingObstacle.js';
import { Exit } from './elements/exit.js';
import { Start } from './elements/start.js';
import { Enemie } from './elements/enemies/enemie.js';
import { Item } from './elements/items/item.js';
import { Layout } from './layouts/Layout.js';

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
                new Enemie(
                    { x: enemyData.start?.x || 0, y: enemyData.start?.y || 0 },  // Default start position if undefined
                    enemyData.shape || 'circle',  // Default shape
                    enemyData.speed || 1,  // Default speed
                    enemyData.movement || 'linear',  // Default movement
                    enemyData.weapon || null  // Default weapon
                )
            ) || [];

            const items = levelData.items?.map(itemData => new Item()) || [];  // Default to an empty array if items are missing
            const layouts = levelData.layouts?.map(levelData => new Layout()) || [];

            return new Level(start, exit, obstacles, enemies, items, layouts); // No separate movingObstacles array
        });
    }

    // Factory method to create obstacles based on their type
    static createObstacle(data) {
        switch (data.type) {
            case 'Obstacle':
                return new Obstacle(data.x, data.y, data.width, data.height);
            case 'MovingObstacle':
                return new MovingObstacle(data.x, data.y, data.width, data.height, data.speed, data.direction);
            // Add more cases here for other obstacle types
            default:
                throw new Error(`Unknown obstacle type: ${data.type}`);
        }
    }
}
