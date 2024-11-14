import { Rectangle } from "../../../gamePhysics/shapes/rectangle.js";
import { Particle } from "./particle.js";

export class Projectile extends Rectangle {
    constructor(x, y, dx, dy) {
        super(x, y, 4, 4, "black");
        this.dx = dx;
        this.dy = dy;
        this.particles = [];
        this.hasCollided = false;  // Track if the projectile has collided
    }

    // Generate particles on collision
    createBreakEffect() {
        this.hasCollided = true;  // Set the flag to true on collision
        const numberOfParticles = 10;

        for (let i = 0; i < numberOfParticles; i++) {
            const particleDx = (Math.random() - 0.5) * 2;  // Random horizontal speed
            const particleDy = (Math.random() - 0.5) * 2;  // Random vertical speed
            const size = Math.random() * 2 + 1;  // Random size for each piece
            const life = 20;  // Lifetime of each particle

            this.particles.push(new Particle(this.x, this.y, particleDx, particleDy, size, life));
        }
    }

    // Check if all particles are expired
    allParticlesExpired() {
        return this.hasCollided && this.particles.length === 0;
    }

    update(delta) {
        if (this.particles.length === 0 && !this.hasCollided) {
            this.x += this.dx * delta;
            this.y += this.dy * delta;
        } else {
            this.#updateParticles();
        }
    }

    draw(ctx) {
        if (this.particles.length === 0 && !this.hasCollided) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        } else {
            this.#drawParticles(ctx);
        }
    }

    // Render particles
    #drawParticles(ctx) {
        this.particles.forEach(particle => particle.draw(ctx));
    }

    // Update particles in the projectile
    #updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.update();
            return particle.isAlive();
        });
    }

}
