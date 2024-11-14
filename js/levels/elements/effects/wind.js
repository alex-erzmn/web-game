import { WindParticle } from "./windParticle.js";
import { Effect } from "./effect.js";

export class Wind extends Effect {
    constructor(x, y, dx, dy, width, height, force) {
        super(x, y, width, height);
        this.dx = dx;
        this.dy = dy;
        this.force = force; 
    }

    update() {
        if (Math.random() < 0.3) {
            const particle = new WindParticle(
                this.x + Math.random() * this.width,
                this.y + Math.random() * this.height,  
                this.dx * this.force + (Math.random() - 0.5) * 2,  
                this.dy * this.force + (Math.random() - 0.5) * 2 
            );
            this.particles.push(particle);
        }

        this.particles.forEach(particle => particle.update());
        this.particles = this.particles.filter(p => !p.isGone());
    }

    draw(ctx) {
        ctx.save();
        this.particles.forEach(particle => particle.draw(ctx));
        ctx.restore();
    }

    applyEffect(player) {
        if (this.isPlayerInRange(player)) {
            player.dx += this.dx * this.force;
            player.dy += this.dy * this.force;
        }
    }
}
