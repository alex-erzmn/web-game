import { Projectile } from "./projectile.js";

export class Missile extends Projectile {
    constructor(x, y, dx, dy) {
        super(x, y, dx, dy);
        this.speed = 5;
        this.acceleration = 1.05;
        this.maxSpeed = 25;
        this.turnRate = 0.6;
    }

    update(delta, players) {
        if (players.length > 0) {
            const closestPlayer = this.findClosestPlayer(players);
            this.followPlayer(closestPlayer);
        }

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
        const predictionFactor = 0.5;
        const predictedX = player.x + player.dx * predictionFactor;
        const predictedY = player.y + player.dy * predictionFactor;
    
        const dx = predictedX - this.x;
        const dy = predictedY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const desiredDx = dx / distance;
        const desiredDy = dy / distance;
    
        this.dx += (desiredDx - this.dx) * this.turnRate;
        this.dy += (desiredDy - this.dy) * this.turnRate;
    
        const directionMagnitude = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        this.dx = (this.dx / directionMagnitude) * this.speed;
        this.dy = (this.dy / directionMagnitude) * this.speed;
    
        if (this.speed < this.maxSpeed) {
            this.speed *= this.acceleration;
            if (this.speed > this.maxSpeed) {
                this.speed = this.maxSpeed;
            }
        }
    }
    

    draw(ctx) {
        if (this.particles.length === 0 && !this.hasCollided) {

            ctx.save();

            ctx.translate(this.x, this.y);
            const angle = Math.atan2(this.dy, this.dx);
            ctx.rotate(angle);

            ctx.fillStyle = "gray";
            ctx.beginPath();
            ctx.ellipse(0, 0, 10, 4, 0, 0, 2 * Math.PI);
            ctx.fill();

            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.moveTo(10, 0);
            ctx.lineTo(4, -2);
            ctx.lineTo(4, 2);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = "black";
            ctx.fillRect(-8, -5, 3, 2);
            ctx.fillRect(-8, 3, 3, 2);

            ctx.restore();
        } else {
            this.#drawParticles(ctx);
        }
    }

    #drawParticles(ctx) {
        this.particles.forEach(particle => particle.draw(ctx));
    }
}
