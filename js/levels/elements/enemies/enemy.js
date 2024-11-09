// enemy.js
import { Projectile } from './projectile.js';
import { Rectangle } from '../../../gamePhysics/shapes/rectangle.js';
import { Sounds } from '../../../background/sounds.js';

export class Enemy extends Rectangle {
    constructor(x, y) {
        super(x, y, 20, 20, "purple");
        this.projectiles = [];
        
        // Shooting properties
        this.shootCooldown = 50;
        this.cooldownCounter = 0;

        // Movement properties
        this.speed = 2; // Movement speed
        this.direction = { x: 0, y: 0 };
        this.changeDirectionCooldown = 100; // Frames until changing direction
        this.directionCounter = 0;
    }

    update() {
        // Movement logic
        this.directionCounter--;
        if (this.directionCounter <= 0) {
            this.chooseRandomDirection();
            this.directionCounter = this.changeDirectionCooldown;
        }

        // Move enemy in the chosen direction
        this.x += this.direction.x * this.speed;
        this.y += this.direction.y * this.speed;

        // Boundary check to keep enemy within bounds (e.g., 800x600 canvas)
        this.x = Math.max(0, Math.min(800 - 20, this.x)); // Adjust 20 for enemy width
        this.y = Math.max(0, Math.min(600 - 20, this.y)); // Adjust 20 for enemy height

        // Shooting logic
        this.cooldownCounter--;
        if (this.cooldownCounter <= 0) {
            this.shoot();
            this.cooldownCounter = this.shootCooldown;
        }

        // Update all projectiles
        this.projectiles.forEach(projectile => projectile.update());

        // Remove projectiles that go off-screen
        this.projectiles = this.projectiles.filter(proj => proj.x >= 0 && proj.x <= 1200 && proj.y >= 0 && proj.y <= 700);
    }

    chooseRandomDirection() {
        const directions = [
            { x: 1, y: 0 },  // Move right
            { x: -1, y: 0 }, // Move left
            { x: 0, y: 1 },  // Move down
            { x: 0, y: -1 }, // Move up
            { x: 1, y: 1 },  // Move diagonally down-right
            { x: -1, y: 1 }, // Move diagonally down-left
            { x: 1, y: -1 }, // Move diagonally up-right
            { x: -1, y: -1 } // Move diagonally up-left
        ];
        this.direction = directions[Math.floor(Math.random() * directions.length)];
    }

    shoot() {
        const direction = 'down'; // Example direction; you can randomize if desired
        const projectile = new Projectile(this.x, this.y, direction);
        this.projectiles.push(projectile);
        Sounds.soundEffects.shot.play();
    }

    draw(ctx) {
        // Draw the enemy
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height); // Example enemy dimensions

        // Draw each projectile
        this.projectiles.forEach(projectile => projectile.draw(ctx));
    }
}
