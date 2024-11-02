import { Obstacle } from "./obstacle.js";
import { Sounds } from "../../../background/sounds.js";

export class MovingObstacle extends Obstacle {
    constructor(x, y, width, height, speed, direction) {
        super(x, y, width, height);
        this.speed = speed;
        this.direction = direction; // 'horizontal' or 'vertical'
    }

    update(canvas, obstacles) {
        // Store the previous position to check for movement
        const prevX = this.x;
        const prevY = this.y;

        // Update position based on direction
        if (this.direction === 'horizontal') {
            this.x += this.speed;

            // Check for collision with boundaries
            if (this.x <= 0 || this.x + this.width >= canvas.width) {
                this.speed = -this.speed; // Change direction
                this.x = prevX; // Revert to previous position
                Sounds.soundEffects.collision.play();
            }
        } else if (this.direction === 'vertical') {
            this.y += this.speed;

            // Check for collision with boundaries
            if (this.y <= 0 || this.y + this.height >= canvas.height) {
                this.speed = -this.speed; // Change direction
                this.y = prevY; // Revert to previous position
                Sounds.soundEffects.collision.play();
            }
        }

        // Check for collisions with other obstacles
        obstacles.forEach(obstacle => {
            if (this === obstacle) {
                return;
            }
            if (this.collidesWith(obstacle)) {
                // Determine the direction of collision and resolve
                if (this.direction === 'horizontal') {
                    if (this.speed > 0) {
                        // Moving right
                        this.x = obstacle.x - this.width; // Move to the left of the obstacle
                    } else {
                        // Moving left
                        this.x = obstacle.x + obstacle.width; // Move to the right of the obstacle
                    }
                } else if (this.direction === 'vertical') {
                    if (this.speed > 0) {
                        // Moving down
                        this.y = obstacle.y - this.height; // Move above the obstacle
                    } else {
                        // Moving up
                        this.y = obstacle.y + obstacle.height; // Move below the obstacle
                    }
                }
                this.speed = -this.speed; // Change direction after resolving collision
                Sounds.soundEffects.collision.play();
            }
        });
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }

    onCollision(player) {
        return;
    }
}
