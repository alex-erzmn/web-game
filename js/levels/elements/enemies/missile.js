import { Projectile } from "./projectile.js";

export class Missile extends Projectile {
    constructor(x, y, dx, dy) {
        super(x, y, dx, dy);
        this.speed = 1;              // Initial speed of the missile
        this.acceleration = 1.05;    // Acceleration multiplier
        this.maxSpeed = 7;          // Maximum speed cap
        this.turnRate = 0.4;         // Controls how quickly the missile turns towards the player
    }

    update(delta, players) {
        // If there are players, find the closest one
        if (players.length > 0) {
            const closestPlayer = this.findClosestPlayer(players);
            this.followPlayer(closestPlayer);
        }

        // Call the parent update method to update position
        super.update(delta);
    }

    findClosestPlayer(players) {
        let closestPlayer = players[0];
        let minDistance = this.calculateDistance(this, closestPlayer);

        players.forEach(player => {
            const distance = this.calculateDistance(this, player);
            if (distance < minDistance) {
                minDistance = distance;
                closestPlayer = player;
            }
        });
        return closestPlayer;
    }

    calculateDistance(obj1, obj2) {
        return Math.sqrt(Math.pow(obj2.x - obj1.x, 2) + Math.pow(obj2.y - obj1.y, 2));
    }

    followPlayer(player) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Calculate desired velocity direction normalized
        const desiredDx = dx / distance;
        const desiredDy = dy / distance;

        // Adjust the missile's direction gradually towards the player using the turnRate
        this.dx += (desiredDx - this.dx) * this.turnRate;
        this.dy += (desiredDy - this.dy) * this.turnRate;

        // Normalize the direction and apply the current speed
        const directionMagnitude = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        this.dx = (this.dx / directionMagnitude) * this.speed;
        this.dy = (this.dy / directionMagnitude) * this.speed;

        // Exponential speed increase with cap at maxSpeed
        if (this.speed < this.maxSpeed) {
            this.speed *= this.acceleration;  // Exponential increase
            if (this.speed > this.maxSpeed) {
                this.speed = this.maxSpeed;   // Cap speed to maxSpeed
            }
        }
    }

    draw(ctx) {
        if (this.particles.length === 0 && !this.hasCollided) {
            // Save the current canvas state
            ctx.save();

            // Move the canvas origin to the missile's position and rotate based on its direction
            ctx.translate(this.x, this.y);
            const angle = Math.atan2(this.dy, this.dx);
            ctx.rotate(angle);

            // Draw the missile body
            ctx.fillStyle = "gray";
            ctx.beginPath();
            ctx.ellipse(0, 0, 10, 4, 0, 0, 2 * Math.PI); // A narrow ellipse for the body
            ctx.fill();

            // Draw the nose cone (front of the missile)
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.moveTo(10, 0); // Tip of the nose
            ctx.lineTo(4, -2); // Base of the nose cone, left
            ctx.lineTo(4, 2);  // Base of the nose cone, right
            ctx.closePath();
            ctx.fill();

            // Draw the tail fins (small rectangles at the back)
            ctx.fillStyle = "black";
            ctx.fillRect(-8, -5, 3, 2); // Left fin
            ctx.fillRect(-8, 3, 3, 2);  // Right fin

            // Restore the canvas to its previous state
            ctx.restore();
        } else {
            this.#drawParticles(ctx);
        }
    }

    // Render particles
    #drawParticles(ctx) {
        this.particles.forEach(particle => particle.draw(ctx));
    }
}
