import { Effect } from "./elements/effects/effect.js";
import { Enemy } from "./elements/enemies/enemy.js";
import { Exit } from "./elements/exit.js";
import { Item } from "./elements/items/item.js";
import { Obstacle } from "./elements/obstacles/obstacle.js";
import { Start } from "./elements/start.js";

/**
 * A level in the game
 */
export class Level {
    
    /**
     * Constructor of a level
     * @param {Start} start - The starting position of the player 
     * @param {Exit} exit - The exit position of the player
     * @param {Obstacle} obstacles - The obstacles in the level
     * @param {Enemy} enemies - The enemies in the level
     * @param {Item} items - The items in the level
     * @param {Effect} effects - The effects in the level
     * @param {Boolean} fog - If the level has fog
     */
    constructor(start, exit, obstacles, enemies, items, effects, fog) {
        this.start = start;
        this.exit = exit;
        this.obstacles = obstacles;
        this.enemies = enemies;
        this.items = items;
        this.effects = effects;
        this.fog = fog;
    }
}