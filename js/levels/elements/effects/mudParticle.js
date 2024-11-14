export class MudParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 2 + Math.random() * 3; 
        this.alpha = 0.8; 
        this.lifeSpan = 60 + Math.random() * 30; 
        this.age = 0;
        this.color = 'rgba(139, 69, 19, '; 

        this.dx = (Math.random() - 0.5) * 0.5;
        this.dy = (Math.random() - 0.5) * 0.5;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;

        this.alpha = Math.max(0, this.alpha - 0.01); 
        this.age++;

        this.isExpired = this.age > this.lifeSpan;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = `${this.color}${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    isGone() {
        return this.isExpired;
    }
}
