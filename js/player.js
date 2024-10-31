export class Player {
    constructor(x, y, color, controls) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.color = color;
        this.speed = 10;
        this.controls = controls;
        this.points = 0;
        this.finished = false;
    }

    move(input) {
        if (input[this.controls.left]) this.x -= this.speed;
        if (input[this.controls.right]) this.x += this.speed;
        if (input[this.controls.up]) this.y -= this.speed;
        if (input[this.controls.down]) this.y += this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
