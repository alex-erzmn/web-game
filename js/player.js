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

         // Squeeze effect properties
         this.isSqueezed = false;
         this.squeezeFactor = 1.0; // Starts at normal size
         this.squeezeSteps = 0;
         this.widthFactor = 1.0;
         this.heightFactor = 1.0;
    }

    move(input) {
        if (input[this.controls.left]) this.x -= this.speed;
        if (input[this.controls.right]) this.x += this.speed;
        if (input[this.controls.up]) this.y -= this.speed;
        if (input[this.controls.down]) this.y += this.speed;
    }

  
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;

        // Apply squeeze effect by adjusting width and height factors
        const width = this.width * this.widthFactor;
        const height = this.height * this.heightFactor;

        // Center the squeeze effect on the player's position
        if(this.isSqueezed) {
        ctx.fillRect(this.x, this.y, width, height);
        } else {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        ctx.restore();
    }
}
