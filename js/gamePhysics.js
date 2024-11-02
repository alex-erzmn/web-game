import { Sounds } from './background/sounds.js';

export class GamePhysics {

    static checkCollisionWithBoundaries(player, canvas) {

        // Check for collision with boundaries
        if (player.x <= 0 - player.width / 4 || player.x + player.width / 2 >= canvas.width) {
            return true;
        }

        // Check for collision with boundaries
        if (player.y <= 0 - player.height / 4 || player.y + player.height / 2 >= canvas.height) {
            return true;
        }

        return false;
    }

    static checkPlayerCollisions(currentPlayer, players, canvas, obstacles) {
        players.forEach(otherPlayer => {
            if (currentPlayer !== otherPlayer && arePlayersColliding(currentPlayer, otherPlayer)) {
                // Calculate the push direction
                const angle = Math.atan2(otherPlayer.y - currentPlayer.y, otherPlayer.x - currentPlayer.x);
                const pushDistance = 2; // Customize this distance to set the "push" strength

                // Temporarily calculate new positions for currentPlayer and otherPlayer
                const newCurrentX = currentPlayer.x - pushDistance * Math.cos(angle);
                const newCurrentY = currentPlayer.y - pushDistance * Math.sin(angle);
                const newOtherX = otherPlayer.x + pushDistance * Math.cos(angle);
                const newOtherY = otherPlayer.y + pushDistance * Math.sin(angle);

                // --- Check collisions for each axis independently for currentPlayer ---

                // X-axis for currentPlayer
                if (!GamePhysics.checkCollisionWithBoundaries({ ...currentPlayer, x: newCurrentX, y: currentPlayer.y }, canvas) &&
                    !GamePhysics.checkCollisionWithObstacles({ ...currentPlayer, x: newCurrentX, y: currentPlayer.y }, obstacles)) {
                    currentPlayer.x = newCurrentX;
                }

                // Y-axis for currentPlayer
                if (!GamePhysics.checkCollisionWithBoundaries({ ...currentPlayer, x: currentPlayer.x, y: newCurrentY }, canvas) &&
                    !GamePhysics.checkCollisionWithObstacles({ ...currentPlayer, x: currentPlayer.x, y: newCurrentY }, obstacles)) {
                    currentPlayer.y = newCurrentY;
                }

                // --- Check collisions for each axis independently for otherPlayer ---

                // X-axis for otherPlayer
                if (!GamePhysics.checkCollisionWithBoundaries({ ...otherPlayer, x: newOtherX, y: otherPlayer.y }, canvas) &&
                    !GamePhysics.checkCollisionWithObstacles({ ...otherPlayer, x: newOtherX, y: otherPlayer.y }, obstacles)) {
                    otherPlayer.x = newOtherX;
                }

                // Y-axis for otherPlayer
                if (!GamePhysics.checkCollisionWithBoundaries({ ...otherPlayer, x: otherPlayer.x, y: newOtherY }, canvas) &&
                    !GamePhysics.checkCollisionWithObstacles({ ...otherPlayer, x: otherPlayer.x, y: newOtherY }, obstacles)) {
                    otherPlayer.y = newOtherY;
                }
            }
        });
    }

    static checkPlayerWithMovingObstacle(player, movingObstacles, canvas, obstacles, levelStartPosition) {
        let playerReset = false;
    
        movingObstacles.forEach(movingObstacle => {
            if (movingObstacle.collidesWith(player)) {
                // Move player along with the obstacle's direction
                if (movingObstacle.direction === 'horizontal') {
                    player.x += movingObstacle.speed;
                } else if (movingObstacle.direction === 'vertical') {
                    player.y += movingObstacle.speed;
                }
    
                // Check if player is now stuck (squeezed) against boundary or obstacle
                const isSqueezed = GamePhysics.checkCollisionWithObstacles(player, obstacles) ||
                                   GamePhysics.checkCollisionWithBoundaries(player, canvas);
    
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
    
        // Handle squeeze animation with realistic effect
        if (player.isSqueezed) {
            // Apply different compression factors based on the squeeze direction
            if (player.squeezeDirection === 'horizontal') {
                player.widthFactor = Math.max(0.4, player.squeezeFactor); // Shrink horizontally
                player.heightFactor = 1.1 - player.squeezeFactor * 0.1;   // Slight vertical stretch
            } else if (player.squeezeDirection === 'vertical') {
                player.widthFactor = 1.1 - player.squeezeFactor * 0.1;    // Slight horizontal stretch
                player.heightFactor = Math.max(0.4, player.squeezeFactor); // Shrink vertically
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

    
    // Check if a player collides with an obstacle
    static checkCollisionWithObstacles(player, obstacles) {
        // Create a bounding box for the player's new position
        const playerBox = {
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height
        };

        // Check each obstacle to see if there's a collision
        for (let obstacle of obstacles) {
            const obstacleBox = {
                x: obstacle.x,
                y: obstacle.y,
                width: obstacle.width,
                height: obstacle.height
            };

            if (this.boxCollision(playerBox, obstacleBox)) {
                return true;
            }
        }
        return false;
    }

    static checkCollisionMovingObstacleWithObstacle(movingObstacle, obstacle) {
        return this.boxCollision(movingObstacle, obstacle);
    }

    // Helper function to check if two rectangles (boxes) overlap
    static boxCollision(boxA, boxB) {
        return (
            boxA.x < boxB.x + boxB.width &&
            boxA.x + boxA.width > boxB.x &&
            boxA.y < boxB.y + boxB.height &&
            boxA.y + boxA.height > boxB.y
        );
    }

   static circleSquareCollision(square, circle) {
    const circleX = circle.x;
    const circleY = circle.y;
    const circleRadius = circle.radius;

    const squareX = square.x;
    const squareY = square.y;
    const squareWidth = square.width;
    const squareHeight = square.height;

    // Find the closest point on the square to the circle's center
    const closestX = Math.max(squareX, Math.min(circleX, squareX + squareWidth));
    const closestY = Math.max(squareY, Math.min(circleY, squareY + squareHeight));

    // Calculate the distance from the circle's center to this closest point
    const distanceX = circleX - closestX;
    const distanceY = circleY - closestY;
    const distanceSquared = distanceX * distanceX + distanceY * distanceY;

    // Check if this distance is less than or equal to the circle's radius squared
    return distanceSquared <= (circleRadius * circleRadius);
}
}

function arePlayersColliding(currentPlayer, otherPlayer) {
    // Basic circle collision based on a radius around each player
    const collisionRadius = 10; // Customize based on player size
    const dist = Math.hypot(currentPlayer.x - otherPlayer.x, currentPlayer.y - otherPlayer.y);
    return dist < collisionRadius * 2; // Players are "colliding" if distance is less than twice the radius
}
