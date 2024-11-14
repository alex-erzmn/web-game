import { Rectangle } from "../../../gamePhysics/shapes/rectangle.js";
import { ExplosionParticle } from "./explosionParticle.js";

export class Projectile extends Rectangle {
    constructor(x, y, dx, dy) {
        super(x, y, 4, 4, "black");
        this.dx = dx;
        this.dy = dy;
        this.speed = 100
        this.particles = [];
        this.hasCollided = false;
    }

    createBreakEffect() {
        this.hasCollided = true;
        const numberOfParticles = 10;

        for (let i = 0; i < numberOfParticles; i++) {
            const particleDx = (Math.random() - 0.5) * 2;
            const particleDy = (Math.random() - 0.5) * 2;
            const size = Math.random() * 2 + 1;
            const life = 20;

            this.particles.push(new ExplosionParticle(this.x, this.y, particleDx, particleDy, size, life));
        }
    }

    allParticlesExpired() {
        return this.hasCollided && this.particles.length === 0;
    }

    update(delta) {
        if (this.particles.length === 0 && !this.hasCollided) {
            this.x += this.dx * this.speed * delta;
            this.y += this.dy * this.speed * delta;
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

    #drawParticles(ctx) {
        this.particles.forEach(particle => particle.draw(ctx));
    }

    #updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.update();
            return particle.isAlive();
        });
    }

}
