import { Rectangle } from './shapes/rectangle.js';
import { Circle } from './shapes/circle.js';

export class CollisionDetection {

    static checkCollision(shapeA, shapeB) {
        if (shapeA instanceof Rectangle && shapeB instanceof Rectangle) {
            return this.#rectangleRectangleCollision(shapeA, shapeB);
        } else if (shapeA instanceof Rectangle && shapeB instanceof Circle) {
            return this.#rectangleCircleCollision(shapeA, shapeB);
        } else if (shapeA instanceof Circle && shapeB instanceof Rectangle) {
            return this.#rectangleCircleCollision(shapeB, shapeA);
        } else if (shapeA instanceof Circle && shapeB instanceof Circle) {
            return this.#circleCircleCollision(shapeA, shapeB);
        } else if (shapeA instanceof Rectangle && shapeB instanceof HTMLCanvasElement) {
            return this.#rectangleCanvasCollision(shapeA, shapeB);
        } else if (shapeA instanceof HTMLCanvasElement && shapeB instanceof Rectangle) {
            return this.#rectangleCanvasCollision(shapeB, shapeA);
        } else if (shapeA instanceof Circle && shapeB instanceof HTMLCanvasElement) {
            return this.#circleCanvasCollision(shapeA, shapeB);
        } else if (shapeA instanceof HTMLCanvasElement && shapeB instanceof Circle) {
            return this.#circleCanvasCollision(shapeB, shapeA);
        }
        throw new Error("Unsupported shape types for collision detection.");
    }

    static #rectangleRectangleCollision(rectA, rectB) {
        return (
            rectA.x < rectB.x + rectB.width &&
            rectA.x + rectA.width > rectB.x &&
            rectA.y < rectB.y + rectB.height &&
            rectA.y + rectA.height > rectB.y
        );
    }

    static #rectangleCircleCollision(rect, circle) {
        const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
        const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
        const distanceX = circle.x - closestX;
        const distanceY = circle.y - closestY;
        return (distanceX * distanceX + distanceY * distanceY) <= (circle.radius * circle.radius);
    }

    static #circleCircleCollision(circleA, circleB) {
        const dx = circleA.x - circleB.x;
        const dy = circleA.y - circleB.y;
        const distanceSquared = dx * dx + dy * dy;
        const radiusSum = circleA.radius + circleB.radius;
        return distanceSquared < radiusSum * radiusSum;
    }

    static #rectangleCanvasCollision(rect, canvas) {
        return (
            rect.x < 0 ||
            rect.y < 0 ||
            rect.x + rect.width > canvas.width ||
            rect.y + rect.height > canvas.height
        );
    }

    static #circleCanvasCollision(circle, canvas) {
        return (
            circle.x - circle.radius < 0 ||
            circle.y - circle.radius < 0 ||
            circle.x + circle.radius > canvas.width ||
            circle.y + circle.radius > canvas.height
        );
    }
}




