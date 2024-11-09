import { Circle } from "../../../gamePhysics/shapes/circle.js";

export class Item extends Circle {
    constructor(x, y, type) {
        super(x, y, 15, "white");
        this.type = type; // Type of the item (e.g., "speed", "size", etc.)
        this.color = this.getColorForType(type);
        this.image = new Image(); // Create a new Image instance
        this.loadImageForType(type);
    }

    // Get the color based on the item type
    getColorForType(type) {
        switch (type) {
            case "speed":
                return "#00FF00"; // Green for speed boost
            case "size":
                return "#FF4500"; // Orange for size boost
            case "shield":
                return "#0000FF"; // Blue for shield
            default:
                return "#FFFF00"; // Default to yellow
        }
    }

    // Load image based on item type
    loadImageForType(type) {
        switch (type) {
            case "speed":
                this.image.src = "assets/images/speed.png"; // Replace with the actual path to your icon
                break;
            case "size":
                this.image.src = "assets/images/size.png";
                break;
            case "shield":
                this.image.src = "assets/images/shield.png";
                break;
            default:
                this.image.src = "assets/images/speed.png";
                break;
        }
    }

    // Draw the item on the canvas
    draw(ctx) {
        if (this.image.complete) { // Check if the image is loaded
            ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        } else {
            // Fallback to drawing a colored circle if image is not yet loaded
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.stroke();
        }
    }
}
