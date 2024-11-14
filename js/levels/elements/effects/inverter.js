import { Effect } from "./effect.js";
import { InverterParticle } from "./inverterParticle.js";

export class Inverter extends Effect {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.cooldown = 0;
        this.effectDuration = 5; 
    }

    applyEffect(player) {
        if (this.isPlayerInRange(player)) {
            player.isControlInverted = true;
        }
    }

    update() {
        if (Math.random() < 0.2) {
            const particle = new InverterParticle(
                this.x + Math.random() * this.width,
                this.y + Math.random() * this.height
            );
            this.particles.push(particle);
        }

        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => !p.isGone());
    }

    draw(ctx) {
        ctx.save();
        this.particles.forEach(p => p.draw(ctx));
        ctx.restore();
    }
}
