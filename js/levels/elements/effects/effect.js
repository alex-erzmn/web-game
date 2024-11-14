import { Rectangle } from "../../../gamePhysics/shapes/rectangle.js";

export class Effect extends Rectangle {
    constructor(x, y, width, height) {
        super(x, y, width, height, "white");
        this.particles = [];
    }

    isPlayerInRange(player) {
        return (
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y
        );
    }
}