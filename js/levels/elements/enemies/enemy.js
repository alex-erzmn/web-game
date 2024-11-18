import { Missile } from './missile.js';
import { Projectile } from './projectile.js';
import { Rectangle } from '../../../gamePhysics/shapes/rectangle.js';
import { Sounds } from '../../../background/sounds.js';

export class Enemy extends Rectangle {
    constructor(x, y, projectileType) {
        super(x, y, 20, 20, "purple");

        this.projectiles = [];

        this.shootCooldown = 0.75;
        this.cooldownCounter = 0;

        this.speed = 200;
        this.dx = 0;
        this.dy = 0;
        this.changeDirectionCooldown = 120;
        this.directionCounter = 0;

        this.projectileType = projectileType || 'Projectile';
    }

    update(players, delta) {
        this.directionCounter--;
        if (this.directionCounter <= 0) {
            this.chooseRandomDirection();
            this.directionCounter = this.changeDirectionCooldown;
        }

        this.x += this.dx * delta;
        this.y += this.dy * delta;

        this.cooldownCounter -= delta;
        if (this.cooldownCounter <= 0) {
            this.shootAtClosestPlayer(players);
        }

        this.projectiles.forEach(projectile => projectile.update(delta, players));
    }

    chooseRandomDirection() {
        const angle = Math.random() * Math.PI * 2;
        this.dx = Math.cos(angle) * this.speed;
        this.dy = Math.sin(angle) * this.speed;
    }

    shootAtClosestPlayer(players) {
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

        if (!closestPlayer) return;

        const dx = closestPlayer.x - this.x;
        const dy = closestPlayer.y - this.y;

        const magnitude = Math.sqrt(dx * dx + dy * dy);
        const normalizedDx = (dx / magnitude) * 5;
        const normalizedDy = (dy / magnitude) * 5;

        let projectile;
        if (this.projectileType === 'Missile') {
            projectile = new Missile(this.x, this.y, normalizedDx, normalizedDy);
        } else {
            projectile = new Projectile(this.x, this.y, normalizedDx, normalizedDy);
        }

        this.projectiles.push(projectile);

        this.cooldownCounter = this.shootCooldown;

        Sounds.soundEffects.shot.play();
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        this.projectiles.forEach(projectile => projectile.draw(ctx));
    }
}
