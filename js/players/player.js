import { Rectangle } from "../gamePhysics/shapes/rectangle.js";
import { Utility } from "../utility.js";

export class Player extends Rectangle {
    constructor(x, y, color, controls) {
        super(x, y, 20, 20, color);
        this.dx = 0;
        this.dy = 0;
        this.speed = 5;
        this.controls = controls;
        this.points = 0;
        this.finished = false;

        this.isSqueezed = false;
        this.squeezeFactor = 1.0;
        this.squeezeSteps = 0;
        this.widthFactor = 1.0;
        this.heightFactor = 1.0;
        this.trail = [];
        this.maxTrailLength = 5;
        this.isSpeedBoosted = false;
        this.isSizeBoosted = false;
        this.isShielded = false;
        this.isControlInverted = false;
        this.boostDuration = 5000;
    }

    // Regular move
    move() {
        // Store the current position in the trail before moving
        this.trail.push({ x: this.x, y: this.y, opacity: 0.1 });

        // Limit trail length
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
        // Update position using dx and dy
        this.x += this.dx;
        this.y += this.dy;
    }

    // Smaller move and collision check to avoid unintended behavior
    smallMove(i, game) {
        this.trail.push({ x: this.x, y: this.y, opacity: 0.1 });

        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        for (let j = 0; j < i; j++) {
            this.x += this.dx / i;
            this.y += this.dy / i;
            // Check for collisions after each small step
            game.collisionManager.checkPlayerCollisions();
        }
    }

    updatePosition(x, y) {
        this.x = x;
        this.y = y;
    }

    // Activate power-up effects
    activatePowerUp(itemType) {
        switch (itemType) {
            case "speed":
                this.isSpeedBoosted = true;
                this.speed *= 1.5; // Increase speed by 50%
                setTimeout(() => this.deactivatePowerUp("speed"), this.boostDuration);
                break;
            case "size":
                this.isSizeBoosted = true;
                this.width = 50;
                this.height = 50;
                setTimeout(() => this.deactivatePowerUp("size"), this.boostDuration);
                break;
            case "shield":
                this.isShielded = true;
                setTimeout(() => this.deactivatePowerUp("shield"), this.boostDuration);
                break;
            default:
                break;
        }
    }

    // Deactivate power-up effects
    deactivatePowerUp(itemType) {
        switch (itemType) {
            case "speed":
                this.isSpeedBoosted = false;
                this.speed /= 1.5; // Reset speed to normal
                break;
            case "size":
                this.isSizeBoosted = false;
                this.width = 20;
                this.height = 20;
                break;
            case "shield":
                this.isShielded = false;
                break;
            default:
                break;
        }
    }

    draw(ctx) {
        ctx.save();

        // Draw each trail segment with its current opacity
        if (this.isShielded) {
            this.trail.forEach(segment => {
                ctx.fillStyle = `rgba(230, 230, 230, ${segment.opacity})`; // Use RGB values and opacity for trail
                ctx.fillRect(segment.x, segment.y, this.width, this.height);
            });
        } else {
            this.trail.forEach(segment => {
                ctx.fillStyle = Utility.hexToRgba(this.color, segment.opacity); // Use RGB values and opacity for trail
                ctx.fillRect(segment.x, segment.y, this.width, this.height);
            });
        }

        // Update the opacity of each segment based on its index in the trail
        this.trail.forEach((segment, index) => {
            segment.opacity = 0.2; // Fixed opacity for all trail segments
        });

        // Remove segments that are fully transparent
        this.trail = this.trail.filter(segment => segment.opacity > 0);

        // Apply squeeze effect by adjusting width and height factors
        const width = this.width * this.widthFactor;
        const height = this.height * this.heightFactor;


        // Draw the player itself
        ctx.fillStyle = this.color; // Draw the player using its color
        if (this.isSqueezed) {
            ctx.fillRect(this.x, this.y, width, height);
        } else if (this.isShielded) {
            ctx.strokeStyle = "#FFFF00"; // Yellow outline for shielded player
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        } else {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        ctx.restore();
    }
}
