import { CollisionDetection } from './collisionDetection.js';
import { Sounds } from '../background/sounds.js';
import { MovingObstacle } from '../levels/elements/obstacles/movingObstacle.js';

export class CollisionManager {
    constructor(game) {
        this.game = game;
    }

    // ---------- Player Collision Checks ----------

    checkPlayerCollisions() {
        const players = this.game.getNotFinishedPlayers();
        const effects = this.game.getEffects();
        const enemies = this.game.getEnemies();
        const obstacles = this.game.getObstacles();
        const canvas = this.game.getCanvas();
        const start = this.game.getStart();
        const exit = this.game.getExit();

        players.forEach(player => {
            this.#checkPlayerWithFansCollisions(player, effects);
            this.#checkPlayerWithEnemiesCollisions(player, enemies, obstacles, canvas, start);
            this.#checkPlayerWithObstaclesCollisions(player, obstacles);
            this.#checkPlayerWithBoundariesCollisions(player, canvas);
            this.#checkPlayerWithMovingObstaclesCollisions(player, obstacles, canvas, start);
            this.#checkPlayerWithPlayersCollisions(player, players, obstacles, canvas);
            this.#checkPlayerWithItemsCollisions(player);
            this.#checkPlayerWithExitCollision(player, exit);
        });
    }

    #checkPlayerWithFansCollisions(player, effects) {
        effects.forEach(effect => {
            if (CollisionDetection.checkCollision(player, effect)) {
                effect.applyEffect(player);
            }
        })
    }

    /** 
     * Check whether a player is colliding with an enemie or its projectiles. In case a projectiles (in case enemy throws projectiles) collides with (hit) the player,
     * the player is killed and will be resetted to the starting position of the current level. If the player collides with the enemy itself he will just be pushed.
     * @param {*} player Player which collisions are to be detected 
     * @param {*} enemies Enemies the player might collide with
     * @param {*} obstacles Obstacles the 
     * @param {*} canvas The game canvas
     * @param {*} start The starting position of the current level
     */
    #checkPlayerWithEnemiesCollisions(player, enemies, obstacles, canvas, start) {
        enemies.forEach(enemy => {
            enemy.projectiles.forEach((projectile, index) => {
                if (!player.isShielded && CollisionDetection.checkCollision(player, projectile)) {
                    player.updatePosition(this.game.getStart().x, this.game.getStart().y)
                    enemy.projectiles.splice(index, 1);
                    return; // No further checks needed!
                }
            });
            this.#checkPlayerEnemyCollision(player, enemy, obstacles, canvas, start);
        });
    }

    #checkPlayerEnemyCollision(player, enemy, obstacles, canvas, start) {
        let playerReset = false;

        if (CollisionDetection.checkCollision(enemy, player)) {
            // Calculate the overlap in both x and y directions
            const overlapX = (player.x + player.width / 2) - (enemy.x + enemy.width / 2);
            const overlapY = (player.y + player.height / 2) - (enemy.y + enemy.height / 2);

            // Determine the primary axis of collision (the larger overlap indicates the direction)
            if (Math.abs(overlapX) > Math.abs(overlapY)) {
                if (overlapX > 0) {
                    player.updatePosition(enemy.x + enemy.width, player.y);
                } else {
                    player.updatePosition(enemy.x - enemy.width, player.y);
                }
            } else {
                if (overlapY > 0) {
                    player.updatePosition(player.x, enemy.y + enemy.height);
                } else {
                    player.updatePosition(player.x, enemy.y - enemy.height);
                }
            }

            // Calculate push direction vector
            const pushDirection = { x: enemy.dx, y: enemy.dy };

            // Check if player is now stuck (squeezed) against boundary or obstacle
            let isSqueezed = false;
            if (this.#checkPlayerObstacleCollision(player, obstacles)) {
                // Determine the obstacle normal at the collision point
                const obstacleNormal = this.#getObstacleNormal(player, obstacles);
                isSqueezed = this.#isPushDirectionPerpendicular(pushDirection, obstacleNormal);
            } else if (CollisionDetection.checkCollision(player, canvas)) {
                // Determine boundary normal based on player position
                const boundaryNormal = this.#getBoundaryNormal(player, canvas);
                isSqueezed = this.#isPushDirectionPerpendicular(pushDirection, boundaryNormal);
            }

            // Apply squeeze effect if player is stuck against a boundary or obstacle directly
            if (isSqueezed && !player.isSqueezed) {
                player.isSqueezed = true;
                player.squeezeFactor = 1.0;
                player.squeezeSteps = 10;
                player.squeezeDirection = pushDirection;
                Sounds.soundEffects.squeeze.play();
                playerReset = true;
            }
        }

        this.#handleSqueezedAnimation(player, start);
        return playerReset;
    }

    // ----------------- Handle Squeezing Detection -----------------

    // Helper function to get the normal vector of the boundary
    #getBoundaryNormal(player, canvas) {
        if (player.x <= 0) return { x: 1, y: 0 };              // Left boundary
        if (player.x + player.width >= canvas.width) return { x: -1, y: 0 }; // Right boundary
        if (player.y <= 0) return { x: 0, y: 1 };              // Top boundary
        if (player.y + player.height >= canvas.height) return { x: 0, y: -1 }; // Bottom boundary
        return null;
    }

    // Helper function to get the normal vector of the obstacle at collision point
    #getObstacleNormal(player, obstacle) {
        // Calculate overlap in each direction
        const leftOverlap = player.x + player.width - obstacle.x;             // Overlap on the left side
        const rightOverlap = obstacle.x + obstacle.width - player.x;          // Overlap on the right side
        const topOverlap = player.y + player.height - obstacle.y;             // Overlap on the top side
        const bottomOverlap = obstacle.y + obstacle.height - player.y;        // Overlap on the bottom side

        // Find the minimum overlap to determine the collision side
        const minOverlap = Math.min(leftOverlap, rightOverlap, topOverlap, bottomOverlap);

        // Determine the side of collision and return the appropriate normal vector
        if (minOverlap === leftOverlap) {
            return { x: -1, y: 0 }; // Collision on the left, normal points right
        } else if (minOverlap === rightOverlap) {
            return { x: 1, y: 0 };  // Collision on the right, normal points left
        } else if (minOverlap === topOverlap) {
            return { x: 0, y: -1 }; // Collision on the top, normal points down
        } else if (minOverlap === bottomOverlap) {
            return { x: 0, y: 1 };  // Collision on the bottom, normal points up
        }

        return null; // No collision detected
    }


    // Helper function to check if push direction is mostly perpendicular to the normal
    #isPushDirectionPerpendicular(pushDirection, normal) {
        if (!normal) return false;
        // Normalize push direction and calculate dot product with the normal
        const pushMagnitude = Math.sqrt(pushDirection.x ** 2 + pushDirection.y ** 2);
        const normalizedPush = { x: pushDirection.x / pushMagnitude, y: pushDirection.y / pushMagnitude };
        const dotProduct = normalizedPush.x * normal.x + normalizedPush.y * normal.y;

        // If dotProduct is close to zero, push is perpendicular, indicating "squeezed"
        return Math.abs(dotProduct) < 0.5; // Adjust threshold for "perpendicular" as needed
    }

    #checkPlayerWithObstaclesCollisions(player, obstacles) {
        obstacles.forEach(obstacle => {
            if (CollisionDetection.checkCollision(player, obstacle)) {
                // Calculate overlaps on each side
                const overlapTop = player.y + player.height - obstacle.y;
                const overlapBottom = obstacle.y + obstacle.height - player.y;
                const overlapLeft = player.x + player.width - obstacle.x;
                const overlapRight = obstacle.x + obstacle.width - player.x;

                // Find the minimum overlap
                const minOverlap = Math.min(overlapTop, overlapBottom, overlapLeft, overlapRight);

                // Resolve collision based on the smallest overlap direction
                if (minOverlap === overlapTop) {
                    // Collision from the top
                    player.updatePosition(player.x, obstacle.y - player.height);
                } else if (minOverlap === overlapBottom) {
                    // Collision from the bottom
                    player.updatePosition(player.x, obstacle.y + obstacle.height);
                } else if (minOverlap === overlapLeft) {
                    // Collision from the left
                    player.updatePosition(obstacle.x - player.width, player.y);
                } else if (minOverlap === overlapRight) {
                    // Collision from the right
                    player.updatePosition(obstacle.x + obstacle.width, player.y);
                }
            }
        });
    }

    /**
     * Check if the player is colliding with the canvas boundaries of the game. In case a collision is detected the players position 
     * will be fixed to the boundaries.
     * @param {*} player The player whose collisions are to be detected
     * @param {*} canvas The game canvas
     */
    #checkPlayerWithBoundariesCollisions(player, canvas) {
        if (CollisionDetection.checkCollision(player, canvas)) {
            if (player.y < 0) {
                player.updatePosition(player.x, 0);
            } else if (player.y + player.height > canvas.height) {
                player.updatePosition(player.x, canvas.height - player.height);
            }

            if (player.x < 0) {
                player.updatePosition(0, player.y);
            } else if (player.x + player.width > canvas.width) {
                player.updatePosition(canvas.width - player.width, player.y);
            }
        }
    }

    #checkPlayerWithMovingObstaclesCollisions(player, obstacles, canvas, start) {
        // Check if player is colliding with movingObstacle (maybe pushed or squeezed)
        this.#checkPlayerWithMovingObstacle(
            player, obstacles.filter(obs => obs instanceof MovingObstacle),
            canvas, obstacles, start
        );
    }

    #checkPlayerWithPlayersCollisions(player, players, obstacles, canvas) {
        // TODO: check should maybe not be for all players. Otherwise they do double movement? Or is OK?
        players.forEach(otherPlayer => {
            if (player !== otherPlayer) {  // Avoid self-collision check
                this.#checkPlayerPlayerCollision(player, otherPlayer, obstacles, canvas);
            }
        });
    }

    /**
     * Check if a player is colliding with any item. If so, trigger activatePowerUp for the certain item and remove it from the game.
     * @param {*} player The player to detect collisions for
     */
    #checkPlayerWithItemsCollisions(player) {
        let items = this.game.getItems();
        items.forEach(item => {
            if (CollisionDetection.checkCollision(player, item)) {
                player.activatePowerUp(item);
                this.game.removeItem(item);
            }
        });
    }

    /**
     * Check if a player is colliding with (reaching) the game's exit. If so, add points to the player, update the score table, 
     * add player to already finished players, set players finished flag to true and play the goal reached sound.
     * @param {*} player The player to detect collisions for
     * @param {*} exit The exit of the game
     */
    #checkPlayerWithExitCollision(player, exit) {
        const finishedPlayers = this.game.getFinishedPlayers();
        if (CollisionDetection.checkCollision(player, exit) && !finishedPlayers.has(player)) {
            player.points += 4 - finishedPlayers.size;
            finishedPlayers.add(player);
            player.finished = true;
            Sounds.soundEffects.goalReached.play();
        }
    }

    #checkPlayerWithMovingObstacle(player, movingObstacles, canvas, obstacles, start) {
        let playerReset = false;

        movingObstacles.forEach(movingObstacle => {
            if (CollisionDetection.checkCollision(movingObstacle, player)) {
                // Prevent the player from overlapping with the obstacle's boundary
                if (Math.abs(movingObstacle.dx) > Math.abs(movingObstacle.dy)) {
                    if (player.x < movingObstacle.x) {
                        player.updatePosition(movingObstacle.x - player.width, player.y); // Align to the left
                    } else {
                        player.updatePosition(movingObstacle.x + movingObstacle.width, player.y); // Align to the right
                    }
                } else {
                    if (player.y < movingObstacle.y) {
                        player.updatePosition(player.x, movingObstacle.y - player.height); // Align to the top
                    } else {
                        player.updatePosition(player.x, movingObstacle.y + movingObstacle.height); // Align to the bottom
                    }
                }

                // Apply obstacle's movement to the player if not squeezed
                if (!player.isSqueezed) {
                    player.x += movingObstacle.dx;
                    player.y += movingObstacle.dy;
                }

                // Check if player is stuck (squeezed)
                const isSqueezed = this.#checkPlayerObstacleCollision(player, obstacles) ||
                    CollisionDetection.checkCollision(player, canvas);

                if (isSqueezed && !player.isSqueezed) {
                    player.isSqueezed = true;
                    player.squeezeFactor = 1.0;
                    player.squeezeSteps = 10;
                    player.squeezeDirection = { dx: movingObstacle.dx, dy: movingObstacle.dy };
                    Sounds.soundEffects.squeeze.play();
                    playerReset = true;
                }
            }
        });

        this.#handleSqueezedAnimation(player, start);

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

    #handleSqueezedAnimation(player, start) {
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
                    player.x = start.x;
                    player.y = start.y;
                    player.isSqueezed = false;
                    player.widthFactor = 1.0;
                    player.heightFactor = 1.0;
                    player.squeezeFactor = 1.0;
                }, 100); // Small delay to show the stretch effect
            }
        }
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
                player.updatePosition(newCurrentX, player.y);
                if (CollisionDetection.checkCollision(player, canvas) ||
                    this.#checkPlayerObstacleCollision(player, obstacles)) {
                    player.updatePosition(previousX, player.y); // Revert if collision detected
                }

                // --- Check collision for otherPlayer on the x-axis ---
                let previousOtherX = otherPlayer.x;
                otherPlayer.updatePosition(newOtherX, otherPlayer.y);
                if (CollisionDetection.checkCollision(otherPlayer, canvas) ||
                    this.#checkPlayerObstacleCollision(otherPlayer, obstacles)) {
                    otherPlayer.updatePosition(previousOtherX, otherPlayer.y); // Revert if collision detected
                }

            } else {
                // Push along the y-axis
                const newCurrentY = player.y - Math.sign(dy) * pushDistance;
                const newOtherY = otherPlayer.y + Math.sign(dy) * pushDistance;

                // --- Check collision for player on the y-axis ---
                let previousY = player.y;
                player.updatePosition(player.x, newCurrentY);
                if (CollisionDetection.checkCollision(player, canvas) ||
                    this.#checkPlayerObstacleCollision(player, obstacles)) {
                    player.updatePosition(player.x, previousY); // Revert if collision detected
                }

                // --- Check collision for otherPlayer on the y-axis ---
                let previousOtherY = otherPlayer.y;
                otherPlayer.updatePosition(otherPlayer.x, newOtherY);
                if (CollisionDetection.checkCollision(otherPlayer, canvas) ||
                    this.#checkPlayerObstacleCollision(otherPlayer, obstacles)) {
                    otherPlayer.updatePosition(otherPlayer.x, previousOtherY); // Revert if collision detected
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

    // ---------- Enemy Collision Checks ----------

    checkEnemyCollisions() {
        const enemies = this.game.getEnemies();
        const obstacles = this.game.getObstacles()
        const canvas = this.game.getCanvas();
        const exit = this.game.getExit();

        enemies.forEach(enemy => {
            this.#checkEnemyWithEnemiesCollisions(enemy, enemies);
            this.#checkEnemyWithObstaclesCollisions(enemy, obstacles);
            this.#checkEnemyWithBoundariesCollisions(enemy, canvas);
            this.#checkEnemiesProjectilesWithObstaclesOrBoundariesCollisions(enemy, obstacles, canvas);
            this.#checkEnemiesProjectilesWithProjectilesCollisions(enemy, enemies);
        });
    }

    #checkEnemyWithEnemiesCollisions(enemy, enemies) {
        enemies.forEach(otherEnemy => {
            if (enemy !== otherEnemy && CollisionDetection.checkCollision(enemy, otherEnemy)) {
                // Calculate overlap on both x and y axes
                const dxOverlap = (enemy.x + enemy.width / 2) - (otherEnemy.x + otherEnemy.width / 2);
                const dyOverlap = (enemy.y + enemy.height / 2) - (otherEnemy.y + otherEnemy.height / 2);

                // Push enemies apart along the axis of collision
                if (Math.abs(dxOverlap) > Math.abs(dyOverlap)) {
                    // Horizontal collision
                    if (dxOverlap > 0) {
                        enemy.x += 1;  // Push enemy right
                        otherEnemy.x -= 1;  // Push otherEnemy left
                    } else {
                        enemy.x -= 1;  // Push enemy left
                        otherEnemy.x += 1;  // Push otherEnemy right
                    }
                } else {
                    // Vertical collision
                    if (dyOverlap > 0) {
                        enemy.y += 1;  // Push enemy down
                        otherEnemy.y -= 1;  // Push otherEnemy up
                    } else {
                        enemy.y -= 1;  // Push enemy up
                        otherEnemy.y += 1;  // Push otherEnemy down
                    }
                }
            }
        });
    }

    #checkEnemyWithObstaclesCollisions(enemy, obstacles) {
        obstacles.forEach(obstacle => {
            if (CollisionDetection.checkCollision(enemy, obstacle)) {
                // Determine overlap direction and adjust enemy's position to prevent moving through obstacle
                const dxOverlap = (enemy.x + enemy.width / 2) - (obstacle.x + obstacle.width / 2);
                const dyOverlap = (enemy.y + enemy.height / 2) - (obstacle.y + obstacle.height / 2);

                // Resolve the overlap on the axis with the least overlap (push enemy away from obstacle)
                if (Math.abs(dxOverlap) > Math.abs(dyOverlap)) {
                    // Horizontal collision with obstacle
                    if (dxOverlap > 0) {
                        enemy.x = obstacle.x + obstacle.width;  // Push enemy to the right of obstacle
                    } else {
                        enemy.x = obstacle.x - enemy.width;  // Push enemy to the left of obstacle
                    }
                } else {
                    // Vertical collision with obstacle
                    if (dyOverlap > 0) {
                        enemy.y = obstacle.y + obstacle.height;  // Push enemy below obstacle
                    } else {
                        enemy.y = obstacle.y - enemy.height;  // Push enemy above obstacle
                    }
                }
            }
        });
    }

    #checkEnemyWithBoundariesCollisions(enemy, canvas) {
        if (CollisionDetection.checkCollision(enemy, canvas)) {
            enemy.x = Math.max(0, Math.min(canvas.width - enemy.width, enemy.x)); // Adjust for enemy width
            enemy.y = Math.max(0, Math.min(canvas.height - enemy.height, enemy.y)); // Adjust for enemy height
        }
    }

    #checkEnemiesProjectilesWithObstaclesOrBoundariesCollisions(enemy, obstacles, canvas) {
        enemy.projectiles.forEach((projectile, index) => {
            // Check for collision with obstacles
            obstacles.forEach(obstacle => {
                if (CollisionDetection.checkCollision(projectile, obstacle)) {
                    // Trigger particle break effect on the projectile
                    projectile.createBreakEffect();

                    // Stop the projectile's movement after collision
                    projectile.dx = 0;
                    projectile.dy = 0;

                    // Remove the projectile immediately if all particles have expired
                    if (projectile.allParticlesExpired()) {
                        enemy.projectiles.splice(index, 1);
                    }
                }
            });

            if (CollisionDetection.checkCollision(projectile, canvas)) {
                enemy.projectiles.splice(index, 1);
            }
        });
    }

    #checkEnemiesProjectilesWithProjectilesCollisions(enemy, enemies) {
        enemy.projectiles.forEach((projectile, indexProjectile) => {
            enemies.forEach(otherEnemy => {
                otherEnemy.projectiles.forEach((otherProjectile, indexOtherProjectile) => {
                    if (projectile != otherProjectile && CollisionDetection.checkCollision(projectile, otherProjectile)) {
                        enemy.projectiles.splice(indexProjectile, 1);
                        otherEnemy.projectiles.splice(indexOtherProjectile, 1);
                    }
                });
            });
        });
    }

    // ---------- Moving Obstacle Collision Checks ----------

    checkMovingObstacleCollisions() {
        const movingObstacles = this.game.getObstacles().filter(obs => obs instanceof MovingObstacle);
        const staticObstacles = this.game.getObstacles().filter(obs => !(obs instanceof MovingObstacle));
        const canvas = this.game.getCanvas();

        movingObstacles.forEach(movingObstacle => {
            this.#checkMovingObstacleWithBoundariesCollisions(movingObstacle, canvas);
            this.#checkMovingObstacleWithStaticObstaclesCollisions(movingObstacle, staticObstacles);
            this.#checkMovingObstacleWithMovingObstaclesCollisions(movingObstacle, movingObstacles);
        });
    }

    // Check collision between a moving obstacle and all static obstacles
    #checkMovingObstacleWithStaticObstaclesCollisions(movingObstacle, staticObstacles) {
        staticObstacles.forEach(staticObstacle => {
            if (CollisionDetection.checkCollision(movingObstacle, staticObstacle)) {
                // Detect which side the moving obstacle collided on (top, bottom, left, or right)
                if (movingObstacle.x < staticObstacle.x && movingObstacle.x + movingObstacle.width > staticObstacle.x) {
                    // Collision from the left
                    movingObstacle.dx = -Math.abs(movingObstacle.dx);
                } else if (movingObstacle.x > staticObstacle.x && movingObstacle.x < staticObstacle.x + staticObstacle.width) {
                    // Collision from the right
                    movingObstacle.dx = Math.abs(movingObstacle.dx);
                }

                if (movingObstacle.y < staticObstacle.y && movingObstacle.y + movingObstacle.height > staticObstacle.y) {
                    // Collision from the top
                    movingObstacle.dy = -Math.abs(movingObstacle.dy);
                } else if (movingObstacle.y > staticObstacle.y && movingObstacle.y < staticObstacle.y + staticObstacle.height) {
                    // Collision from the bottom
                    movingObstacle.dy = Math.abs(movingObstacle.dy);
                }

                Sounds.soundEffects.collision.play();
            }
        });
    }

    #checkMovingObstacleWithBoundariesCollisions(movingObstacle, canvas) {
        if (CollisionDetection.checkCollision(movingObstacle, canvas)) {
            // Determine which boundary the moving obstacle collided with
            if (movingObstacle.x <= 0 || movingObstacle.x + movingObstacle.width >= canvas.width) {
                // Horizontal boundary collision, invert dx
                movingObstacle.dx = -movingObstacle.dx;
                Sounds.soundEffects.collision.play();
            }

            if (movingObstacle.y <= 0 || movingObstacle.y + movingObstacle.height >= canvas.height) {
                // Vertical boundary collision, invert dy
                movingObstacle.dy = -movingObstacle.dy;
                Sounds.soundEffects.collision.play();
            }
        }
    }

    #checkMovingObstacleWithMovingObstaclesCollisions(movingObstacle, movingObstacles) {
        movingObstacles.forEach(otherObstacle => {
            if (movingObstacle !== otherObstacle && CollisionDetection.checkCollision(movingObstacle, otherObstacle)) {
                // Determine axis of collision to change direction accordingly
                const dxOverlap = (movingObstacle.x + movingObstacle.width / 2) - (otherObstacle.x + otherObstacle.width / 2);
                const dyOverlap = (movingObstacle.y + movingObstacle.height / 2) - (otherObstacle.y + otherObstacle.height / 2);

                // Reverse direction only for movingObstacle based on collision axis
                if (Math.abs(dxOverlap) > Math.abs(dyOverlap)) {
                    // Horizontal collision
                    movingObstacle.dx = -movingObstacle.dx;
                } else {
                    // Vertical collision
                    movingObstacle.dy = -movingObstacle.dy;
                }

                // Play sound effect once for the collision
                Sounds.soundEffects.collision.play();
            }
        });
    }
}