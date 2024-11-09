import { Rectangle } from "../gamePhysics/shapes/rectangle.js";

export class Player extends Rectangle {
    constructor(x, y, color, controls) {
        super(x, y, 20, 20, color);
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

        // Array to store trail segments
        this.trail = [];
        this.maxTrailLength = 5; // Adjust for longer or shorter trails

        // item effects
        this.isSpeedBoosted = false;
        this.isSizeBoosted = false;
        this.isShielded = false;
        this.boostDuration = 5000; // 5 seconds for boost duration
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
                this.width *= 1.5;
                this.height *= 1.5;
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
                this.width /= 1.5;
                this.height /= 1.5;
                break;
            case "shield":
                this.isShielded = false;
                break;
            default:
                break;
        }
    }

    move(newX, newY) {
        // Add current position to the trail before updating position
        this.trail.push({ x: this.x, y: this.y, opacity: 0.1 }); // Start with 50% opacity

        // Limit trail length
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift(); // Remove the oldest trail segment
        }

        // Update player position
        this.x = newX;
        this.y = newY;
    }

    // Helper function to convert hex color to individual RGB components
    hexToRgb(hex) {
        // Remove the '#' if present
        hex = hex.replace('#', '');

        // Parse the RGB components from the hex string
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        return { r, g, b }; // Return an object with r, g, and b components
    }

    draw(ctx) {
        ctx.save();

        // Convert the hex color to RGB components
        const { r, g, b } = this.hexToRgb(this.color);

        // Draw each trail segment with its current opacity
        if (this.isShielded) {
            this.trail.forEach(segment => {
                ctx.fillStyle = `rgba(230, 230, 230, ${segment.opacity})`; // Use RGB values and opacity for trail
                ctx.fillRect(segment.x, segment.y, this.width, this.height);
            });
        } else {
            this.trail.forEach(segment => {
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${segment.opacity})`; // Use RGB values and opacity for trail
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
