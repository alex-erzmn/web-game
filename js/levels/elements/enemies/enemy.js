// Assuming Missile is a subclass of Projectile and is defined elsewhere
import { Missile } from './missile.js';
import { Projectile } from './projectile.js';
import { Rectangle } from '../../../gamePhysics/shapes/rectangle.js';
import { Sounds } from '../../../background/sounds.js';

export class Enemy extends Rectangle {
    constructor(x, y, projectileType) {
        super(x, y, 20, 20, "purple");

        this.projectiles = [];

        // Shooting properties
        this.shootCooldown = 80;
        this.cooldownCounter = 0;

        // Movement properties
        this.speed = 2;         // Speed at which the enemy moves
        this.dx = 0;            // Horizontal movement component
        this.dy = 0;            // Vertical movement component
        this.changeDirectionCooldown = 100; // Frames until changing direction
        this.directionCounter = 0;

        // Projectile type can be 'projectile' (for Projectile) or 'missile' (for Missile)
        this.projectileType = projectileType || 'projectile';  // Default to 'projectile' if not specified
    }

    update(players, delta) {
        // Movement logic
        this.directionCounter--;
        if (this.directionCounter <= 0) {
            this.chooseRandomDirection();
            this.directionCounter = this.changeDirectionCooldown;
        }

        // Move enemy in the chosen direction
        this.x += this.dx * delta;
        this.y += this.dy * delta;

        // Shooting logic
        this.cooldownCounter -= delta;
        if (this.cooldownCounter <= 0) {
            this.shootAtClosestPlayer(players);
        }

        // Update all projectiles
        this.projectiles.forEach(projectile => projectile.update(delta, players));
    }

    chooseRandomDirection() {
        // Randomly choose a direction by setting dx and dy
        const angle = Math.random() * Math.PI * 2; // Random angle in radians
        this.dx = Math.cos(angle) * this.speed;
        this.dy = Math.sin(angle) * this.speed;
    }

    shootAtClosestPlayer(players) {
        // Find the closest player
        let closestPlayer = null;
        let shortestDistance = Infinity;

        players.forEach(player => {
            if (player.finished) {
                return;
            }
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < shortestDistance) {
                shortestDistance = distance;
                closestPlayer = player;
            }
        });

        if (!closestPlayer) return; // If no players are found, do nothing

        // Calculate direction towards the closest player
        const dx = closestPlayer.x - this.x;
        const dy = closestPlayer.y - this.y;

        // Normalize direction
        const magnitude = Math.sqrt(dx * dx + dy * dy);
        const normalizedDx = (dx / magnitude) * 5; // Scale by speed
        const normalizedDy = (dy / magnitude) * 5;

        // Create the projectile based on the chosen projectileType
        let projectile;
        if (this.projectileType === 'missile') {
            // Create a Missile that follows the player
            projectile = new Missile(this.x, this.y, normalizedDx, normalizedDy);
        } else {
            // Default to the regular projectile
            projectile = new Projectile(this.x, this.y, normalizedDx, normalizedDy);
        }

        this.projectiles.push(projectile);

        // Reset cooldownCounter to prevent immediate shooting
        this.cooldownCounter = this.shootCooldown;

        // Play shooting sound
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
