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
            this.#checkPlayerWithEffectsCollisions(player, effects);
            this.#checkPlayerWithEnemiesCollisions(player, enemies, obstacles, canvas, start);
            this.#checkPlayerWithObstaclesCollisions(player, obstacles);
            this.#checkPlayerWithBoundariesCollisions(player, canvas);
            this.#checkPlayerWithMovingObstaclesCollisions(player, obstacles, canvas, start);
            this.#checkPlayerWithPlayersCollisions(player, players, obstacles, canvas);
            this.#checkPlayerWithItemsCollisions(player);
            this.#checkPlayerWithExitCollision(player, exit);
        });
    }

    #checkPlayerWithEffectsCollisions(player, effects) {
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
            // Check if player is hit by enemy projectiles
            enemy.projectiles.forEach((projectile, index) => {
                if (!player.isShielded && CollisionDetection.checkCollision(player, projectile)) {
                    player.updatePosition(this.game.getStart().x, this.game.getStart().y)
                    enemy.projectiles.splice(index, 1);
                    return; // No further checks needed!
                }
            });
            // Check if player is hit by the enemy itself
            this.#checkPlayerEnemyCollision(player, enemy, obstacles, canvas, start);
        });
    }

    #checkPlayerEnemyCollision(player, enemy, obstacles, canvas, start) {
        let playerReset = false;

        if (CollisionDetection.checkCollision(enemy, player)) {
            const overlapX = (player.x + player.width / 2) - (enemy.x + enemy.width / 2);
            const overlapY = (player.y + player.height / 2) - (enemy.y + enemy.height / 2);

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

            const pushDirection = { x: enemy.dx, y: enemy.dy };

            const isSqueezed = this.#checkPlayerObstacleCollision(player, obstacles) ||
                CollisionDetection.checkCollision(player, canvas);

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

    /**
     * Check if the player is colliding with any static obstacles. In case a collision is detected the players position will be fixed to the obstacles boundaries.
     * @param {*} player The player whose collisions are to be detected
     * @param {*} obstacles The obstacles the player might collide with 
     */
    #checkPlayerWithObstaclesCollisions(player, obstacles) {
        const staticObstacles = obstacles.filter(obstacle => !(obstacle instanceof MovingObstacle));

        staticObstacles.forEach(obstacle => {
            if (CollisionDetection.checkCollision(player, obstacle)) {
                this.#handleActorWithObstacleCollision(player, obstacle);
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

    /**
     * Check if the player is colliding with any moving obstacles. In case a collision is detected the players position will be fixed to the obstacles boundaries.
     * The player can also be pushed by the moving obstacle. In case the player is pushed between the moving obstacle and another obstacle or the canvas boundaries he will be squeezed.
     * @param {*} player The player whose collisions are to be detected
     * @param {*} obstacles The obstacles the player might collide with (static and moving obstacles)
     * @param {*} canvas The game canvas
     * @param {*} start The starting position of the current level
     * @returns 
     */
    #checkPlayerWithMovingObstaclesCollisions(player, obstacles, canvas, start) {
        const movingObstacles = obstacles.filter(obs => obs instanceof MovingObstacle);
        let playerReset = false;

        movingObstacles.forEach(movingObstacle => {
            if (CollisionDetection.checkCollision(movingObstacle, player)) {
                this.#handleActorWithObstacleCollision(player, movingObstacle);

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
                return true;
            }
        }
        return false;
    }

    /**
     * Check if a player is colliding with other players. In case a collision is detected the players will be pushed apart along the axis of collision.
     * @param {*} player The player to detect collisions for
     * @param {*} players The other players in the game
     * @param {*} obstacles The obstacles the players might collide with
     * @param {*} canvas The game canvas
     */
    #checkPlayerWithPlayersCollisions(player, players, obstacles, canvas) {
        players.forEach(otherPlayer => {
            if (player !== otherPlayer && CollisionDetection.checkCollision(player, otherPlayer)) {
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

    // Handle squeeze animation with realistic effect
    #handleSqueezedAnimation(player, start) {
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

    // Handle collision between an actor (Player or Enemie) and an obstacle
    #handleActorWithObstacleCollision(actor, obstacle) {
        // Calculate overlaps on each side
        const overlapTop = actor.y + actor.height - obstacle.y;
        const overlapBottom = obstacle.y + obstacle.height - actor.y;
        const overlapLeft = actor.x + actor.width - obstacle.x;
        const overlapRight = obstacle.x + obstacle.width - actor.x;

        // Find the minimum overlap
        const minOverlap = Math.min(overlapTop, overlapBottom, overlapLeft, overlapRight);

        // Resolve collision based on the smallest overlap direction
        if (minOverlap === overlapTop) {
            // Collision from the top
            actor.updatePosition(actor.x, obstacle.y - actor.height);
        } else if (minOverlap === overlapBottom) {
            // Collision from the bottom
            actor.updatePosition(actor.x, obstacle.y + obstacle.height);
        } else if (minOverlap === overlapLeft) {
            // Collision from the left
            actor.updatePosition(obstacle.x - actor.width, actor.y);
        } else if (minOverlap === overlapRight) {
            // Collision from the right
            actor.updatePosition(obstacle.x + obstacle.width, actor.y);
        }
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

    /**
     * Check if an enemy is colliding with other enemies. In case a collision is detected the enemies will be pushed apart along the axis of collision.
     * @param {*} enemy The enemy to detect collisions for
     * @param {*} enemies The other enemies in the game
     */
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

    /**
     * Check if an enemy is colliding with any obstacles. In case a collision is detected the enemies position will be fixed to the obstacles boundaries.
     * @param {*} enemy The enemy to detect collisions for
     * @param {*} obstacles The obstacles the enemy might collide with
     */
    #checkEnemyWithObstaclesCollisions(enemy, obstacles) {
        obstacles.forEach(obstacle => {
            if (CollisionDetection.checkCollision(enemy, obstacle)) {
                this.#handleActorWithObstacleCollision(enemy, obstacle)
            }
        });
    }

    /**
     * Check if an enemy is colliding with the canvas boundaries of the game. In case a collision is detected the enemies position
     * will be fixed to the boundaries.
     * @param {*} enemy The enemy to detect collisions for
     * @param {*} canvas The game canvas
     */
    #checkEnemyWithBoundariesCollisions(enemy, canvas) {
        if (CollisionDetection.checkCollision(enemy, canvas)) {
            enemy.x = Math.max(0, Math.min(canvas.width - enemy.width, enemy.x)); // Adjust for enemy width
            enemy.y = Math.max(0, Math.min(canvas.height - enemy.height, enemy.y)); // Adjust for enemy height
        }
    }

    /**
     * Check if an enemy's projectiles are colliding with any obstacles or the canvas boundaries. In case a collision is detected the projectile will be removed.
     * @param {*} enemy The enemy to detect collisions for
     * @param {*} obstacles The obstacles the enemy's projectiles might collide with
     * @param {*} canvas The game canvas
     */
    #checkEnemiesProjectilesWithObstaclesOrBoundariesCollisions(enemy, obstacles, canvas) {
        enemy.projectiles.forEach((projectile, index) => {
            // Check for collision with obstacles
            obstacles.forEach(obstacle => {
                if (CollisionDetection.checkCollision(projectile, obstacle)) {
                    enemy.projectiles.splice(index, 1);
                }
            });

            if (CollisionDetection.checkCollision(projectile, canvas)) {
                enemy.projectiles.splice(index, 1);
            }
        });
    }

    /**
     * Check if an enemy's projectiles are colliding with other enemies' projectiles. In case a collision is detected both projectiles will be removed.
     * @param {*} enemy The enemy to detect collisions for
     * @param {*} enemies The other enemies in the game
     */
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

    /**
     * Check if a moving obstacle is colliding with any static obstacles. In case a collision is detected the moving obstacles direction will be changed.
     * @param {*} movingObstacle The moving obstacle to detect collisions
     * @param {*} staticObstacles The static obstacles the moving obstacle might collide with
     */
    #checkMovingObstacleWithStaticObstaclesCollisions(movingObstacle, staticObstacles) {
        staticObstacles.forEach(staticObstacle => {
            if (CollisionDetection.checkCollision(movingObstacle, staticObstacle)) {
                movingObstacle.dx = -movingObstacle.dx;
                movingObstacle.dy = -movingObstacle.dy;
            }
        });
    }

    /**
     * Check if a moving obstacle is colliding with the canvas boundaries of the game. In case a collision is detected the moving obstacles direction will be changed.
     * @param {*} movingObstacle The moving obstacle to detect collisions
     * @param {*} canvas The game canvas
     */
    #checkMovingObstacleWithBoundariesCollisions(movingObstacle, canvas) {
        if (CollisionDetection.checkCollision(movingObstacle, canvas)) {
            if (movingObstacle.x <= 0 || movingObstacle.x + movingObstacle.width >= canvas.width) {
                movingObstacle.dx = -movingObstacle.dx;
            }

            if (movingObstacle.y <= 0 || movingObstacle.y + movingObstacle.height >= canvas.height) {
                movingObstacle.dy = -movingObstacle.dy;
            }
        }
    }

    /**
     * Check if a moving obstacle is colliding with other moving obstacles. In case a collision is detected the moving obstacles direction will be changed.
     * @param {*} movingObstacle The moving obstacle to detect collisions
     * @param {*} movingObstacles The other moving obstacles in the game
     */
    #checkMovingObstacleWithMovingObstaclesCollisions(movingObstacle, movingObstacles) {
        movingObstacles.forEach(otherObstacle => {
            if (movingObstacle !== otherObstacle && CollisionDetection.checkCollision(movingObstacle, otherObstacle)) {
                movingObstacle.dx = -movingObstacle.dx;
                movingObstacle.dy = -movingObstacle.dy;
            }
        });
    }
}