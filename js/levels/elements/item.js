export class Item {
    constructor(type, x, y) {
        this.type = type; // e.g., 'speedUp', 'speedDown', 'teleport'
        this.x = x;
        this.y = y;
        this.size = 20; // Size of the item (e.g., 20x20 pixels)
        this.active = true; // Track if the item is active
        this.image = this.loadImage(); // Load the appropriate image for the item type
    }

    loadImage() {
        const img = new Image();
        switch (this.type) {
            case 'speedUp':
                img.src = 'assets/images/item.png'; // Replace with the actual path to your image
                break;
            case 'speedDown':
                img.src = 'assets/images/item.png'; // Replace with the actual path to your image
                break;
            case 'teleport':
                img.src = 'assets/images/item.png'; // Replace with the actual path to your image
                break;
            default:
                img.src = 'assets/images/item.png'; // Fallback image
        }
        return img;
    }

    draw(ctx) {
        if (this.image.complete) { // Check if the image is loaded
            ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
        }
    }
}