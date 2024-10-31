export class Level {
    constructor(start, exit, obstacles, enemies, items, layouts) {
        this.start = start;
        this.exit = exit;
        this.obstacles = obstacles;
        this.enemies = enemies;
        this.items = items;
        this.layouts = layouts;
    }
}