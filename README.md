Based on the course ‘W3Cx JS.0xJavaScript Introduction’ by Michael Buffat on edx, this project was created to implement a web game with JavaScript.


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
You can play the game with up to four players using the same keyboard. By clicking on the settings wheel at the upper left-hand corner, you can change
the players colors but also see each players controls to move the player. On the upper right-hand corner you can also turn on/off the background music 
or sound effects.
By choosing the amount of players in the center and clicking on the start game button you can initialize the start of the game. After a countdown
of 5 seconds the first level will start. After each player has reached the exit a 3 seconds countdown will introduce the next level.
You can see the current and upcoming levels on the left side and the current player scores on the right side of the centered game canvas. Of course you
can still check the players controls but not change their colors anymore. If you want to restart the game you can go back to the main menu with a click
on the button underneath the game canvas.



# Implementation Details
This game was implemented using the best practices of ‘W3Cx JS.0xJavaScript Introduction’. This includes theoretical concepts of a gameLoop, FPS based updating,
save() and restore() in the draw methods and so on. To explain the whole implementation, I would like to first give an overview about the chosen structure and design of this game. Then I will focus on main difficulties and problems and go into detail about the current solutions for these problems. In the end, there will be a part about possible future work such as improvements or extensions of 'Square-Escape'.

## Design
The web game is consisting out of two pages. The main menu page and the game page. The main menu page is the opener for this game and should offer all necessary settings for the players to configure and start the game. The game page then includes the game canvas, in which the actual game is presented and played. To seperate these two pages, there are two different .php files (index.php and game.php).

The JavaScript files are structured in the following way. There are the game.js, gameController.js and utility.js on the top level. game.js represents a game in which mainly the gameLoop will run. With the gameController.js there is a interface to control and create a game. The utility.js class currently only holds one method, but could be extended with more in the future.

To ensure the game.js class only manages the game process (and some additional tasks like countdown or measuring the FPS) the other responsibilites are seperated into Managers. There are four (main) managers:

- PlayerManager
- LevelManager
- EvaluationManager
- CollisionManager

In the following chapters I will explain the design decisions regarding these for managers.

### Player
In the folder Player, you can find all player relevant classes. There is the player itself, the playerManager and actually a fifth manager, the inputManager.
The player is represented as an rectangle with a position (x, y) and a direction vector (dx, dy) to safe the current movement depending on the input given be the player. There are also some more attributs to handle player squeezing, the players trail and item effects. The playerManager is called by the game to update all players and draw them. The inputManager is mainly only responsible to manage the inputs and is called by the playerManager.

Please note that there are predefined shapes (rectangle and circle) which have x and y positions and in case of the rectangle a width and height and in case of the circle a radius. This allows to detect collision between objects more generic.

### Levels
In the levels folder there is a level Object to hold all the level relevant objects, a levels.json which stores are predefined levels, a levelFactory which is responsible for loading the levels from this json and storing each levelData into a level object. The levelManager finally calls the factory to call all the levels in its constructor. The level Manager is analogous to the playerManager responsible for updating and drawing all the level related objects such as obstacles, enemies or items. This manager is also responisble for changing levels.

Each level is consisting out of elements. There are start.js and exit.js (exit is derived from circle) which are mandatory and representing the players start position and the exit location. In addition a level can consist of optional elements like obstacles, items, enemies or effects. Obstacles rectangles, which can either be static or moving obstacles (vertically or horizontally). Enemies are as well rectangles which move randomly and can hold different types of weapons (projectile or missile). Items are collectable objects which can speed up the player, increase his size or shield him from projectiles. Effects are permanent areas which can speed up or slow down a player or invert its controls. All the elements provide their own update and draw method.

A level can also have a boolean named fog. This boolean tells the levelManager, whether fog should be activated or not. If true, the whole canvas will be black and all the players have their own small visibility circle. This makes a level much harder because the structure is not already revealed from the beginnning.

### Evaluation
The evaluation is encapsulated in the evaluationManager which is responisble for updating the score table and presenting the end screen after last level. The actual points are hold in each player and added in the collisionManager as soon as a player collides with the exit.

### Collision
The collision was by far the hardest part of implemeting this small game. There is a generic method in the collisionDetection.js class which can detect a collision between circle, rectangle or canvas (its borders) but not handle. This collision detection is used from the collisionManager which is handling all the collision consequences for player, enemies and movingObstacles. A player should not go threw an obstacles, an enemies should push a player, a moving Obstacles should change its direction when colliding with another movingObstacle and a projectile should be destroyed when colliding with a static object. There are many more situations in which the collision causes a certain consequence. This handling is encapsulated in this class.


## Difficlties & Solutions

### Collision Detection
As said, the collision was by far the hardest part. There to detect a collision may sound easy but as the dynamic of the game is basically a sequence of states, to detect all collision correctly might not always be trivial. For example if a player has a very high speed, he might tunnel any object because his updated position after one frame skipped the boundaries of that object and a collision will not find any overlap.

To handle the problem about tunneling, the update of at least players and movingObstacles is divided into a certain number of steps which allows to check the collision at each small step to detect a collision on the whole path even with a high speed.


### Collision Handling
In addition to the difficulties in regard of detection each collision, the handling of all the collision were challenging too. For example if a rectangle collides a rectangle exactly at its corners, it might stay fixed as the collision handling may cause the rectangle to not move in both directions. This might not be the intended behavior. 

To solve this problem, the minimum overlap is calculated (see #handleActorWithObstacleCollision).


### Player Squeezing
If a moving obstacle is pushing a player against another obstacle, I wanted the player to squeeze and be resetted. There are a few challenges related to this. For example, How does the effect persist over multiple frames? How does the position of the player remains at the squeezing position.

The current solution does not solve the squeezing perfect but at least gives a feeling about being squeezed. If the player after moved by an movingObstacle is colliding with either canvas or obstacles, the player is marked as isSqueezed, which will start the squeezed animation for the next 10 frames (see #handleSqueezedAnimation).


### Fog Effect
The fog effect, which fills the whole level with darkness except of the players was a little bit challenging in the beginning. If the level is drawn and after that the whole level covered in black it is difficult to created multiple white visiblity circles without cleaning the drawn level underneath behind the visibility circle.

As solution the fog is drawn using a seperate canvas which overlays the game canvas. In that way the level can be drawn on the game canvas as usual and just the view is restricted by this overlaying canvas which can easily be drawn fully black except of the players visiblity circles.


## Future Work
To improve the game physics the collision handling could be optimized also handling e.g. vertical moving obstacles or more kind of shapes instead of only rectangles and circles. 

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