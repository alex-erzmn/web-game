export class InverterParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 3 + Math.random() * 3;
        this.alpha = 0.9;
        this.lifeSpan = 60 + Math.random() * 30;
        this.age = 0;
        
        this.color = `rgba(${128 + Math.random() * 50}, 0, ${128 + Math.random() * 50},`;
 
        this.angle = Math.random() * Math.PI * 2;
        this.angularVelocity = 0.05 + Math.random() * 0.03;
        this.radius = 1.5;

        this.dx = Math.cos(this.angle) * 0.3 + (Math.random() - 0.5) * 0.2;
        this.dy = Math.sin(this.angle) * 0.3 + (Math.random() - 0.5) * 0.2;
    }

    update() {
        this.angle += this.angularVelocity;
        this.x += this.dx + Math.cos(this.angle) * this.radius;
        this.y += this.dy + Math.sin(this.angle) * this.radius;

        this.alpha = Math.max(0, this.alpha - 0.015); 
        this.size *= 0.98;
        this.age++;

        this.isExpired = this.age > this.lifeSpan;
    }

    draw(ctx) {
        ctx.save();
        
        let gradient = ctx.createRadialGradient(this.x, this.y, this.size * 0.3, this.x, this.y, this.size);
        gradient.addColorStop(0, `${this.color}${this.alpha})`);
        gradient.addColorStop(1, `rgba(0, 128, 255, ${this.alpha * 0.5})`);

        ctx.fillStyle = gradient;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.alpha * 0.5})`;
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 4; i++) {
            const angle = this.angle + (i * Math.PI) / 2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + Math.cos(angle) * this.size * 1.2, this.y + Math.sin(angle) * this.size * 1.2);
            ctx.stroke();
        }
        
        ctx.restore();
    }

    isGone() {
        return this.isExpired;
    }
}
