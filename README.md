Based on the course ‘W3Cx JS.0xJavaScript Introduction’ by Michel Buffat on edx, this project was created to implement a web game with JavaScript.

# Overview
The game called *square escape* is a simple 2D multiplayer game, but with envolving levels.



## Main ideas
- All players are represented by a square of a different color. On the same machine, the game can be played by 1 to 4 players. By default, it can be played with the keyboard.
- Players all start all at the same position in the room, with a 5-4-3-2-1 countdown to start the game.
- All players must reach an exit, which by default will be represented by a clearly visible yellow circle with a black border, located within the level.
- Players can go in any direction, including diagonally.
- Collisions between players and with obstacles or other level elements are taken into account (you can't go through walls, but you can push other players).
- As levels increase, new elements appear.



## Level description
**Level 1:** In level 1 there is a rectangular room with walls around the edges, and the famous yellow-and-black circle in the bottom right-hand corner. As soon as the starting signal is given, players race to the exit. The first to arrive gets 4 points, the second 3, and so on.

**Levels 2-5:** Static obstacles appear, the path to the exit is no longer straight, but you have to follow the increasingly complicated corridors, sometimes with dead ends.

**Levels 6-10:** New elements appear - Moving obstacles can move vertically or horizontally. Moving obstacles can push and even squeeze a player.

**Levels 11-15:** New elements appera - Items appear on the field which can whether increase the players speed or increase the size (there is also a shield element, protecting the player from enemies projectiles later).

**Levels 16-20:** New elements appear - Effects and elements join the stage. Effects can speed up (wind) or slow down (mud) the player or invert its controls (inverter). Enemies walk randomly and can either shoot simple projectiles or missiles to hit the player. In consequence the player would set back to the current levels starting position.

Note that at every fifth level, a fog appears which reduces the players view to a small vision circle to make solving the level harder.



## How-To-Play
You can play with up to four players using the same keyboard. By clicking on the settings wheel in the top left-hand corner, you can change the colours of the players, and you can also see each player's controls to move them around. You can also turn on/off background music or sound effects in the top right corner.

By selecting the number of players in the middle and clicking the Start Game button, you can initialise the start of the game. After a 5 second countdown, the first level will begin. After each player has reached the exit, a 3 second countdown will introduce the next level. **The goal of each level is to reach the yellow exit circle.**

You can see the current and upcoming levels on the left and the current player scores on the right of the centre game screen. Of course, you can still check the player's controls, but you can no longer change their colours. If you want to restart the game, you can return to the main menu by clicking on the button below the game screen.





# Implementation Details
This game has been implemented using the best practices of the 'W3Cx JS.0xJavaScript Introduction'. This includes the theoretical concepts of a gameLoop, FPS based updating, save() and restore() in the draw methods and so on. To explain the whole implementation, I will first give an overview of the chosen structure and design of this game. Then I will focus on the main difficulties and problems and go into detail about the current solutions for these problems. Finally, there will be a part about possible future work like improvements or extensions of 'Square-Escape'.



## Design
The web game consists of two pages. The main menu page and the game page. The main menu page is the opening page of the game and should provide all the necessary settings for the players to configure and start the game. The game page then contains the game canvas, where the actual game is presented and played. To separate these two pages there are two different .php files (index.php and game.php).

The JavaScript files are structured as follows. On the top level there is game.js, gameController.js and utility.js. game.js represents a game, which mainly runs the gameLoop. The gameController.js provides an interface to control and create a game. The utility.js class currently only has one method, but could be extended with more useful generic functions in the future.

To ensure that the game.js class only manages the game process (and some additional tasks like countdown or measuring the FPS), the other responsibilities are separated into managers. There are four (main) managers:

- PlayerManager
- LevelManager
- EvaluationManager
- CollisionManager

There are a few things that are not managed by a specific manager that are grouped together in the "background" folder, as they are more background functions. These include managing the background animation, sounds and settings.

In the following chapters, I will explain the responsibilities for each manager.

### Player
The Player folder contains all the classes relevant to the player. There is the player itself, the playerManager and actually a fifth manager, the inputManager.
The player is represented as a rectangle with a position (x, y) and a direction vector (dx, dy) to secure the current movement depending on the input given to the player. There are also a few more attributes to handle player squeezing, player tracking and item effects. The playerManager is called by the game to update all players and draw them. The inputManager is mainly responsible for managing the inputs and is called by the playerManager.

Note that there are predefined shapes (rectangle and circle) which have x and y positions and in the case of the rectangle a width and height and in the case of the circle a radius. This allows collisions between objects to be detected more generally.

### Levels
In the levels folder there is a level object to hold all the level relevant objects, a levels.json which stores the predefined levels, a levelFactory which is responsible for loading the levels from this json and storing each levelData into a level object. Finally, the levelManager calls the factory to invoke all levels in its constructor. The levelManager is analogous to the playerManager which is responsible for updating and drawing all level related objects such as obstacles, enemies or items. This manager is also responsible for changing levels.

Each level consists of elements. There are start and exit (exit is derived from circle), which are mandatory and represent the player's start position and exit location. In addition, a level can consist of optional elements such as obstacles, items, enemies or effects. Obstacles are rectangles that can be either static or moving (vertically or horizontally). Enemies are also rectangles that move randomly and can hold different types of weapons (projectiles or missiles). Items are collectable objects that can speed up the player, increase their size or shield them from projectiles. Effects are permanent areas that can speed up, slow down or reverse the player's controls. All items have their own update and draw method.

A level can also have a boolean called fog. This boolean tells the levelManager whether fog should be enabled or not. If true, the whole screen will be black and all players will have their own small visibility circle. This makes a level much harder, because the structure is not revealed from the beginning.

### Evaluation
The scoring is encapsulated in the evaluationManager, which is responsible for updating the score table and displaying the final screen after the last level. The actual points are held in each player and added in the collisionManager when a player collides with the exit.

### Collision
The collision was by far the most difficult part of implementing this little game. There is a generic method in the collisionDetection class that can detect a collision between a circle, rectangle or canvas (its borders), but not handle it. This collision detection is used by the collisionManager, which handles all collision consequences for player, enemies and movingObstacles. A player should not be thrown by an obstacle, an enemy should not push a player, a moving obstacle should change its direction when colliding with another moving obstacle and a projectile should be destroyed when colliding with a static object. There are many more situations where the collision has a specific consequence. This handling is encapsulated in this class.



## Difficlties & Solutions

### Collision Detection
As I said, collision was by far the most difficult part. Detecting a collision may sound simple, but since the dynamics of the game are basically a sequence of states, it is not always trivial to detect all collisions correctly. For example, if a player has a very high speed, he might tunnel through any object, because his updated position after one frame will skip the boundaries of that object, and a collision detection method will not find any overlap.

To deal with the problem of tunneling, the update of at least players and movingObstacles is divided into a certain number of steps, allowing the collision to be checked at each small step, to detect a collision on the whole path even at high speed.

Of course, this will reduce performance if the number of steps is too large. So it might be a good idea to implement dynamic scaling based on the current speed of an object, to ensure that the number decreases the slower an object moves. Currently there is a static number of 5 steps at which the player and moving obstacles are updated.

### Collision Handling
In addition to the difficulties in detecting individual collisions, the handling of all collisions was also challenging. For example, if a rectangle collides with another rectangle exactly at its corners, it may remain fixed, as the collision handling may cause the rectangle to stop moving in both directions. This may not be the intended behaviour. 

To solve this problem, the minimum overlap is calculated (see #handleActorWithObstacleCollision).

### Player Squeezing
When a moving obstacle pushes a player into another obstacle, I wanted the player to be squeezed and be reset to the starting position of the current level. There are a few challenges with this. For example, how does the effect persist across multiple frames? How to keep the player's position at the squeeze position. 

The current solution does not solve squeezing perfectly, but at least it gives a sense of being squeezed. If the player collides with either the canvas or obstacles after being moved by a movingObstacle, the player is marked as isSqueezed, which starts the squeezed animation for the next 10 frames (see #handleSqueezedAnimation).

### Fog Effect
The fog effect, which fills the entire level with darkness except for the players, was a bit of a challenge at first. When the level is drawn and then the whole level is covered in black, it is difficult to create several white visibility circles without cleaning the drawn level behind the visibility circle.

The solution is to draw the fog using a separate canvas that overlays the game canvas. This way the level can be drawn on the game canvas as usual and only the view is restricted by this overlaying canvas, which can easily be drawn completely black except for the players' visibility circles.



## Future Work
To improve the physics of the game, the collision handling could be optimised to deal with vertically moving obstacles, for example, or more types of shapes instead of just rectangles and circles. 

The graphics are also rather basic at the moment and could be improved a lot.

There are a lot of extensions regarding new levels possible:

**Levels 21+:** Optional elements / improvements to add in the future:
- Different types of enemies (not only differentiate in the kind of weapon)
- Change the level topology
- New Effects (e.g. teleportation)
- Different shapes of obstacles (circles, triangles, etc.)
- Wall effects (electro, ...)
- Moving levels (like in Mario Bros)
- ...

Also additional modes could be reached from the main menu or even a builder for new levels.
