import { Rectangle } from "../gamePhysics/shapes/rectangle.js";
import { Utility } from "../utility.js";
import { SpeedItem } from "../levels/elements/items/speedItem.js";
import { SizeItem } from "../levels/elements/items/sizeItem.js";
import { ShieldItem } from "../levels/elements/items/shieldItem.js";

export class Player extends Rectangle {
    constructor(x, y, color, controls) {
        super(x, y, 20, 20, color);
        this.dx = 0;
        this.dy = 0;
        this.speed = 500;
        this.controls = controls;
        this.points = 0;
        this.finished = false;

        // Squeeze effect variables
        this.isSqueezed = false;
        this.squeezeFactor = 1.0;
        this.squeezeSteps = 0;
        this.widthFactor = 1.0;
        this.heightFactor = 1.0;

        // Trail variables
        this.trail = [];
        this.maxTrailLength = 5;

        // Power-up effects
        this.isSpeedBoosted = false;
        this.isSizeBoosted = false;
        this.isShielded = false;
        this.isControlInverted = false;
        this.boostDuration = 5000;
    }

    /**
     * Move the player by a certain amount of divisions
     * @param {number} i - The amount of divisions to move the player by 
     * @param {object} game - The game object
     */
    move(i, game) {
        this.trail.push({ x: this.x, y: this.y, opacity: 0.1 });

        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        for (let j = 0; j < i; j++) {
            this.x += this.dx / i;
            this.y += this.dy / i;
            game.collisionManager.checkPlayerCollisions();
        }
    }

    updatePosition(x, y) {
        this.x = x;
        this.y = y;
    }

    // Activate power-up effects
    activatePowerUp(item) {
        if (item instanceof SpeedItem) {
            this.isSpeedBoosted = true;
            this.speed *= 1.3;
            setTimeout(() => this.deactivatePowerUp("speed"), this.boostDuration);
        } else if (item instanceof SizeItem) {
            this.isSizeBoosted = true;
            this.width = 50;
            this.height = 50;
            setTimeout(() => this.deactivatePowerUp("size"), this.boostDuration);
        } else if (item instanceof ShieldItem) {
            this.isShielded = true;
            setTimeout(() => this.deactivatePowerUp("shield"), this.boostDuration);
        }
    }


    // Deactivate power-up effects
    deactivatePowerUp(itemType) {
        switch (itemType) {
            case "speed":
                this.isSpeedBoosted = false;
                this.speed /= 1.3;
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

        if (this.isShielded) {
            this.trail.forEach(segment => {
                ctx.fillStyle = `rgba(230, 230, 230, ${segment.opacity})`;
                ctx.fillRect(segment.x, segment.y, this.width, this.height);
            });
        } else {
            this.trail.forEach(segment => {
                ctx.fillStyle = Utility.hexToRgba(this.color, segment.opacity);
                ctx.fillRect(segment.x, segment.y, this.width, this.height);
            });
        }

        this.trail.forEach((segment) => {
            segment.opacity = 0.2;
        });

        this.trail = this.trail.filter(segment => segment.opacity > 0);


        const width = this.width * this.widthFactor;
        const height = this.height * this.heightFactor;

        ctx.fillStyle = this.color;
        if (this.isSqueezed) {
            ctx.fillRect(this.x, this.y, width, height);
        } else if (this.isShielded) {
            ctx.strokeStyle = "#FFFF00";
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        } else {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        ctx.restore();
    }
}
