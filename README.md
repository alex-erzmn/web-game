# web-game
Based on the course ‘W3Cx JS.0xJavaScript Introduction’ by Michael Buffat on edx, this project was created to implement a web game with JavaScript.


## description

In this project you'll be developing a simple 2D multiplayer game, but with evolving levels. Main gameplay idea:
- All players are represented by a square of a different color. On the same machine, the game can be played by 1 to 4 players. By default, it can be played with the keyboard, and optionally with GamePads (you don't have to integrate this feature, only if you want to). ✅
- Players all start in the top-left corner of the room, with a 5-4-3-2-1 countdown to start the game. ✅
- All players must reach an exit, which by default will be represented by a clearly visible yellow circle with a black border, located within the level.  ✅

As levels increase, new elements appear:
**Level 1:** For level 1, imagine a rectangular room with walls around the edges, and the famous yellow-and-black circle in the bottom right-hand corner. As soon as the starting signal is given, players race to the exit. The first to arrive gets 4 points, the second 3, and so on. Or you could imagine a scoring system based on the time taken to reach the exit. ✅
    - Players can go in any direction, including diagonally. You can imagine a limited “dash” option (quick acceleration for a very limited time) ✅
    - Collisions between players and with obstacles are taken into account (you can't go through walls, but you can push other players). ✅
**Levels 2-4:** vertical walls appear, the path to the exit is no longer straight, but you have to follow the increasingly complicated corridors, sometimes with dead ends. ✅
**Levels 4-8*:** walls can move vertically or horizontally. ✅

--------------------- Current state -------------------------

**Levels 8-15:** New elements appear: bonuses that increase the player's speed, malus that invert the controls for 3 seconds, zones on the course that slow down or teleport elsewhere. Fans speed up or slow down certain corridors...
**Levels 15-20:** certain walls must not be touched, otherwise you'll be electrocuted and have to start all over again.
    - It's up to you: you can add enemies, bouncing balls between walls, the possibility, as in Mario Kart, of picking up items that you can throw or drop, etc. 
    - switches that change the level topology
    - Moving exit 

The general idea is that you stick with simple geometric shapes so as not to waste too much time on graphics, and concentrate on gameplay and game design. Of course, I'm expecting to have Player, Obstacle, ObstacleAnimated, Bonus, Malus, Score, Enemy classes and subclasses, and so on.
For drawing and animation, adopt the best practices used in the mini game that appears from Module 2 of the online course (requestAnimationFrame for the main animation, use of graphic context save/restore in methods that draw, setInterval for enemy spam, hammerjs library for sound etc.).


use Howler.js for sounds and audio for games
hammerjs library for
sound