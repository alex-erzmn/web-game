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


## Future Work
**Levels 21+:** Optional elements / improvements to add in the future:
- Different types of enemies (not only differentiate in the kind of weapon)
- Change the level topology
- New Effects (e.g. teleportation)
- Different shapes of obstacles (circles, triangles, etc.)
- Wall effects (electro, ...)
- Moving levels (like in Mario Bros)
- ...


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
This game was implemented using

## Design
- Manager to encapsulate responsibilities

## Difficulties
- CollisionManagement!!!

## Solutions
- ???

##


TODO:
- A Good README in the repo, that explains what you did: design, difficulties, solutions, how to play etc.
