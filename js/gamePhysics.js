export class GamePhysics {
    static checkCollisionWithBoundaries(player, canvas) {
        const canvasRect = canvas.getBoundingClientRect();

        // Define boundaries based on canvas rect and player size
        const leftBound = canvasRect.left; // Left edge of the canvas
        const rightBound = canvasRect.right; // Right edge of the canvas
        const topBound = canvasRect.top; // Top edge of the canvas
        const bottomBound = canvasRect.bottom; // Bottom edge of the canvas

        // Calculate player's new position relative to the window
        const playerLeft = player.x + canvasRect.left; // Absolute left position
        const playerRight = player.x + player.width + canvasRect.left; // Absolute right position
        const playerTop = player.y + canvasRect.top; // Absolute top position
        const playerBottom = player.y + player.height + canvasRect.top; // Absolute bottom position

        // Check if the new position is within the bounds
        const withinXBounds = playerLeft >= leftBound && playerRight <= rightBound;
        const withinYBounds = playerTop >= topBound && playerBottom <= bottomBound;

        return !withinXBounds || !withinYBounds;
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
}

function arePlayersColliding(currentPlayer, otherPlayer) {
    // Basic circle collision based on a radius around each player
    const collisionRadius = 10; // Customize based on player size
    const dist = Math.hypot(currentPlayer.x - otherPlayer.x, currentPlayer.y - otherPlayer.y);
    return dist < collisionRadius * 2; // Players are "colliding" if distance is less than twice the radius
}
