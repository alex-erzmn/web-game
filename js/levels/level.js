export class Level {
    constructor(start, exit, obstacles, movingObstacles, enemies, items, layouts) {
        this.start = start;
        this.exit = exit;
        this.obstacles = obstacles;
        this.movingObstacles = movingObstacles;
        this.enemies = enemies;
        this.items = items;
        this.layouts = layouts;
    }
}