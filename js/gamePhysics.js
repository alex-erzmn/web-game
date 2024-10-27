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
        return this.boxCollision(movingObstacle, obstacle)
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