import { Game } from '../game.js';
import { CollisionDetection } from './collisionDetection.js';
import { Sounds } from '../background/sounds.js';
import { MovingObstacle } from '../levels/elements/obstacles/movingObstacle.js';

export class CollisionManager {
    constructor(game) {
        this.game = game;
    }

    // ---------- Player Collision Checks ----------

    checkPlayerCollisions() {
        const players = this.game.getPlayers();
        const enemies = this.game.getEnemies();
        const obstacles = this.game.getObstacles();
        const canvas = this.game.getCanvas();
        const start = this.game.getStart();
        const exit = this.game.getExit();

        players.forEach(player => {

            // Check if player collides with enemy or its projectiles
            enemies.forEach(enemy => {
                enemy.projectiles.forEach(projectile => {
                    if (this.#checkCollisionWithProjectiles(player, projectile)) {
                        player.x = this.game.getStart().x;
                        player.y = this.game.getStart().y;
                        Sounds.soundEffects.gotShot.play();
                        return;
                    }
                });
                this.#checkPlayerEnemyCollision(player, enemy, obstacles, canvas, start);
            });

            // Check if player is colliding with boundary or obstacles

            if (this.#checkPlayerObstacleCollision(player, obstacles)) {
                obstacles.forEach(obstacle => {
                    if (CollisionDetection.checkCollision(player, obstacle)) {
                        // Check if collision is on the top or bottom of the obstacle
                        if (player.y + player.height > obstacle.y && player.y < obstacle.y) {
                            // Player is colliding from the top
                            player.move(player.x, obstacle.y - player.height);
                        } else if (player.y < obstacle.y + obstacle.height && player.y + player.height > obstacle.y + obstacle.height) {
                            // Player is colliding from the bottom
                            player.move(player.x, obstacle.y + obstacle.height);
                        }

                        // Check if collision is on the left or right of the obstacle
                        if (player.x + player.width > obstacle.x && player.x < obstacle.x) {
                            // Player is colliding from the left
                            player.move(obstacle.x - player.width, player.y);
                        } else if (player.x < obstacle.x + obstacle.width && player.x + player.width > obstacle.x + obstacle.width) {
                            // Player is colliding from the right
                            player.move(obstacle.x + obstacle.width, player.y);
                        }
                    }
                });
            }

            if (this.#checkPlayerBoundaryCollision(player, canvas)) {
                if (player.y < 0) {
                    // Player went above the top boundary
                    player.move(player.x, 0);
                } else if (player.y + player.height > canvas.height) {
                    // Player went below the bottom boundary
                    player.move(player.x, canvas.height - player.height);
                }

                if (player.x < 0) {
                    // Player went past the left boundary
                    player.move(0, player.y);
                } else if (player.x + player.width > canvas.width) {
                    // Player went past the right boundary
                    player.move(canvas.width - player.width, player.y);
                }
            }

            // Check if player is colliding with movingObstacle (maybe pushed or squeezed)
            this.#checkPlayerWithMovingObstacle(
                player, obstacles.filter(obs => obs instanceof MovingObstacle),
                canvas, obstacles, start
            );

            // TODO: check should maybe not be for all players. Otherwise they do double movement? Or is OK?
            players.forEach(otherPlayer => {
                if (player !== otherPlayer) {  // Avoid self-collision check
                    this.#checkPlayerPlayerCollision(player, otherPlayer, obstacles, canvas);
                }
            });

            this.#checkPlayerItemCollisions(player);
            this.#checkPlayerExitCollision(player, exit);
        });
    }

    #checkPlayerWithMovingObstacle(player, movingObstacles, canvas, obstacles, levelStartPosition) {
        let playerReset = false;

        movingObstacles.forEach(movingObstacle => {
            if (CollisionDetection.checkCollision(movingObstacle, player)) {
                // Prevent the player from overlapping with the obstacle's boundary
                if (Math.abs(movingObstacle.direction.dx) > Math.abs(movingObstacle.direction.dy)) {
                    if (player.x < movingObstacle.x) {
                        player.move(movingObstacle.x - player.width, player.y); // Align to the left
                    } else {
                        player.move(movingObstacle.x + movingObstacle.width, player.y); // Align to the right
                    }
                } else {
                    if (player.y < movingObstacle.y) {
                        player.move(player.x, movingObstacle.y - player.height); // Align to the top
                    } else {
                        player.move(player.x, movingObstacle.y + movingObstacle.height); // Align to the bottom
                    }
                }

                // Apply obstacle's movement to the player if not squeezed
                if (!player.isSqueezed) {
                    player.x += movingObstacle.direction.dx * movingObstacle.speed;
                    player.y += movingObstacle.direction.dy * movingObstacle.speed;
                }

                // Check if player is stuck (squeezed)
                const isSqueezed = this.#checkPlayerObstacleCollision(player, obstacles) ||
                    this.#checkPlayerBoundaryCollision(player, canvas);

                if (isSqueezed && !player.isSqueezed) {
                    player.isSqueezed = true;
                    player.squeezeFactor = 1.0;
                    player.squeezeSteps = 10;
                    player.squeezeDirection = movingObstacle.direction;
                    Sounds.soundEffects.squeeze.play();
                    playerReset = true;
                }
            }
        });

        // Handle squeeze animation and reset
        if (player.isSqueezed) {
            const { dx, dy } = player.squeezeDirection;
            if (Math.abs(dx) > Math.abs(dy)) {
                player.widthFactor = Math.max(0.4, player.squeezeFactor);
                player.heightFactor = 1.1 - player.squeezeFactor * 0.1;
            } else {
                player.widthFactor = 1.1 - player.squeezeFactor * 0.1;
                player.heightFactor = Math.max(0.4, player.squeezeFactor);
            }

            player.squeezeFactor -= 0.07;
            player.squeezeSteps--;

            if (player.squeezeSteps <= 0) {
                player.widthFactor = 1.2;
                player.heightFactor = 1.2;
                setTimeout(() => {
                    player.x = levelStartPosition.x;
                    player.y = levelStartPosition.y;
                    player.isSqueezed = false;
                    player.widthFactor = 1.0;
                    player.heightFactor = 1.0;
                    player.squeezeFactor = 1.0;
                }, 100);
            }
        }

        return playerReset;
    }

    // Check if a player collides with an obstacle
    #checkPlayerObstacleCollision(player, obstacles) {
        for (const obstacle of obstacles) {
            if (CollisionDetection.checkCollision(player, obstacle)) {
                return true; // Stop immediately if a collision is found
            }
        }
        return false; // Only returns false if no collisions are detected
    }

    #checkPlayerBoundaryCollision(player, canvas) {
        return CollisionDetection.checkCollision(player, canvas);
    }


    #checkPlayerEnemyCollision(player, enemy, obstacles, canvas, levelStartPosition) {
        let playerReset = false;

        if (CollisionDetection.checkCollision(enemy, player)) {
            // Calculate the player movement based on enemy's direction vector
            const directionMagnitude = Math.sqrt(enemy.direction.x ** 2 + enemy.direction.y ** 2);

            // Normalize direction and scale by enemy speed
            const moveX = (enemy.direction.x / directionMagnitude) * enemy.speed;
            const moveY = (enemy.direction.y / directionMagnitude) * enemy.speed;

            // Move the player along the enemy's direction vector
            player.x += moveX;
            player.y += moveY;

            // Check if player is now stuck (squeezed) against boundary or obstacle
            const isSqueezed = this.#checkPlayerObstacleCollision(player, obstacles) ||
                this.#checkPlayerBoundaryCollision(player, canvas);

            if (isSqueezed && !player.isSqueezed) {
                player.isSqueezed = true;
                player.squeezeFactor = 1.0;
                player.squeezeSteps = 10;
                player.squeezeDirection = { x: enemy.direction.x, y: enemy.direction.y };
                Sounds.soundEffects.squeeze.play();
                playerReset = true;
            }
        }

        // Handle squeeze animation with realistic effect
        if (player.isSqueezed) {
            // Calculate squeeze effects based on direction magnitude
            if (Math.abs(player.squeezeDirection.x) > Math.abs(player.squeezeDirection.y)) {
                // Horizontal compression
                player.widthFactor = Math.max(0.4, player.squeezeFactor);
                player.heightFactor = 1.1 - player.squeezeFactor * 0.1;
            } else {
                // Vertical compression
                player.widthFactor = 1.1 - player.squeezeFactor * 0.1;
                player.heightFactor = Math.max(0.4, player.squeezeFactor);
            }

            // Gradually reduce the squeeze factor to simulate easing
            player.squeezeFactor -= 0.07;
            player.squeezeSteps--;

            if (player.squeezeSteps <= 0) {
                // Brief stretch effect before resetting
                player.widthFactor = 1.2;
                player.heightFactor = 1.2;
                setTimeout(() => {
                    // Reset player to start position and size
                    player.x = levelStartPosition.x;
                    player.y = levelStartPosition.y;
                    player.isSqueezed = false;
                    player.widthFactor = 1.0;
                    player.heightFactor = 1.0;
                    player.squeezeFactor = 1.0;
                }, 100); // Small delay to show the stretch effect
            }
        }

        return playerReset;
    }


    #checkPlayerPlayerCollision(player, otherPlayer, obstacles, canvas) {
        if (player !== otherPlayer && this.#arePlayersColliding(player, otherPlayer)) {
            // Calculate the horizontal and vertical distances
            const dx = otherPlayer.x - player.x;
            const dy = otherPlayer.y - player.y;
            const pushDistance = 2; // Customize this distance for the "push" strength

            // Determine primary push direction (horizontal or vertical)
            if (Math.abs(dx) > Math.abs(dy)) {
                // Push along the x-axis
                const newCurrentX = player.x - Math.sign(dx) * pushDistance;
                const newOtherX = otherPlayer.x + Math.sign(dx) * pushDistance;

                // --- Check collision for player on the x-axis ---
                let previousX = player.x;
                player.move(newCurrentX, player.y);
                if (this.#checkPlayerBoundaryCollision(player, canvas) ||
                    this.#checkPlayerObstacleCollision(player, obstacles)) {
                    player.move(previousX, player.y); // Revert if collision detected
                }

                // --- Check collision for otherPlayer on the x-axis ---
                let previousOtherX = otherPlayer.x;
                otherPlayer.move(newOtherX, otherPlayer.y);
                if (this.#checkPlayerBoundaryCollision(otherPlayer, canvas) ||
                    this.#checkPlayerObstacleCollision(otherPlayer, obstacles)) {
                    otherPlayer.move(previousOtherX, otherPlayer.y); // Revert if collision detected
                }

            } else {
                // Push along the y-axis
                const newCurrentY = player.y - Math.sign(dy) * pushDistance;
                const newOtherY = otherPlayer.y + Math.sign(dy) * pushDistance;

                // --- Check collision for player on the y-axis ---
                let previousY = player.y;
                player.move(player.x, newCurrentY);
                if (this.#checkPlayerBoundaryCollision(player, canvas) ||
                    this.#checkPlayerObstacleCollision(player, obstacles)) {
                    player.move(player.x, previousY); // Revert if collision detected
                }

                // --- Check collision for otherPlayer on the y-axis ---
                let previousOtherY = otherPlayer.y;
                otherPlayer.move(otherPlayer.x, newOtherY);
                if (this.#checkPlayerBoundaryCollision(otherPlayer, canvas) ||
                    this.#checkPlayerObstacleCollision(otherPlayer, obstacles)) {
                    otherPlayer.move(otherPlayer.x, previousOtherY); // Revert if collision detected
                }
            }
        }
    }

    #arePlayersColliding(player, otherPlayer) {
        // Basic circle collision based on a radius around each player
        const collisionRadius = 10; // Customize based on player size
        const dist = Math.hypot(player.x - otherPlayer.x, player.y - otherPlayer.y);
        return dist < collisionRadius * 2; // Players are "colliding" if distance is less than twice the radius
    }

    #checkCollisionWithProjectiles(player, projectile) {
        return (
            player.x < projectile.x + projectile.width &&
            player.x + player.width > projectile.x &&
            player.y < projectile.y + projectile.height &&
            player.y + player.height > projectile.y
        );
    }

    #checkPlayerItemCollisions(player) {
        let items = this.game.getItems();  // Use 'let' here instead of 'const'
        items.forEach(item => {
            if (CollisionDetection.checkCollision(player, item)) {
                player.activatePowerUp(item.type); // Activate power-up when collected
                this.game.removeItem(item);
            }
        });
    }
    

    // ---------- Enemy Collision Checks ----------

    checkEnemyCollisions() {
        const enemies = this.game.getEnemies();

        enemies.forEach(enemy => {
            enemies.forEach(otherEnemy => {
                if (enemy !== otherEnemy && CollisionDetection.checkCollision(enemy, otherEnemy)) {
                    console.log("ENEMY COLLISION!");
                }
            });
        });
    }

    // ---------- Moving Obstacle Collision Checks ----------

    checkMovingObstacleCollisions() {
        const movingObstacles = this.game.getObstacles().filter(obs => obs instanceof MovingObstacle);
        const staticObstacles = this.game.getObstacles().filter(obs => !(obs instanceof MovingObstacle));
        const canvas = this.game.getCanvas();

        movingObstacles.forEach(movingObstacle => {
            // Check boundary collision for each moving obstacle
            this.#checkMovingObstacleBoundaryCollision(movingObstacle, canvas);

            // Check collisions between moving obstacles and static obstacles
            this.#checkMovingObstacleWithStaticObstacles(movingObstacle, staticObstacles);

            // Check collisions between moving obstacles
            this.#checkMovingObstacleWithOtherMovingObstacles(movingObstacle, movingObstacles);
        });
    }

    // Check collision between a moving obstacle and all static obstacles
    #checkMovingObstacleWithStaticObstacles(movingObstacle, staticObstacles) {
        staticObstacles.forEach(staticObstacle => {
            if (CollisionDetection.checkCollision(movingObstacle, staticObstacle)) {
                // Detect which side the moving obstacle collided on (top, bottom, left, or right)
                if (movingObstacle.x < staticObstacle.x && movingObstacle.x + movingObstacle.width > staticObstacle.x) {
                    // Collision from the left
                    movingObstacle.direction.dx = -Math.abs(movingObstacle.direction.dx);
                } else if (movingObstacle.x > staticObstacle.x && movingObstacle.x < staticObstacle.x + staticObstacle.width) {
                    // Collision from the right
                    movingObstacle.direction.dx = Math.abs(movingObstacle.direction.dx);
                }

                if (movingObstacle.y < staticObstacle.y && movingObstacle.y + movingObstacle.height > staticObstacle.y) {
                    // Collision from the top
                    movingObstacle.direction.dy = -Math.abs(movingObstacle.direction.dy);
                } else if (movingObstacle.y > staticObstacle.y && movingObstacle.y < staticObstacle.y + staticObstacle.height) {
                    // Collision from the bottom
                    movingObstacle.direction.dy = Math.abs(movingObstacle.direction.dy);
                }

                Sounds.soundEffects.collision.play();
            }
        });
    }

    #checkMovingObstacleBoundaryCollision(movingObstacle, canvas) {
        if (movingObstacle.x <= 0 || movingObstacle.x + movingObstacle.width >= canvas.width) {
            // Horizontal boundary collision, invert dx
            movingObstacle.direction.dx = -movingObstacle.direction.dx;
            Sounds.soundEffects.collision.play();
        }

        if (movingObstacle.y <= 0 || movingObstacle.y + movingObstacle.height >= canvas.height) {
            // Vertical boundary collision, invert dy
            movingObstacle.direction.dy = -movingObstacle.direction.dy;
            Sounds.soundEffects.collision.play();
        }
    }

    #checkMovingObstacleWithOtherMovingObstacles(movingObstacle, movingObstacles) {
        movingObstacles.forEach(otherObstacle => {
            if (movingObstacle !== otherObstacle && CollisionDetection.checkCollision(movingObstacle, otherObstacle)) {
                // Determine axis of collision to change direction accordingly
                const dxOverlap = (movingObstacle.x + movingObstacle.width / 2) - (otherObstacle.x + otherObstacle.width / 2);
                const dyOverlap = (movingObstacle.y + movingObstacle.height / 2) - (otherObstacle.y + otherObstacle.height / 2);

                // Reverse direction only for movingObstacle based on collision axis
                if (Math.abs(dxOverlap) > Math.abs(dyOverlap)) {
                    // Horizontal collision
                    movingObstacle.direction.dx = -movingObstacle.direction.dx;
                } else {
                    // Vertical collision
                    movingObstacle.direction.dy = -movingObstacle.direction.dy;
                }

                // Play sound effect once for the collision
                Sounds.soundEffects.collision.play();
            }
        });
    }

    #checkPlayerExitCollision(player, exit) {
        const finishedPlayers = this.game.getFinishedPlayers();
        if (CollisionDetection.checkCollision(player, exit) && !finishedPlayers.has(player)) {
            player.points += 4 - finishedPlayers.size;
            finishedPlayers.add(player);
            player.finished = true;
            Sounds.soundEffects.goalReached.play();
        }
    }
}