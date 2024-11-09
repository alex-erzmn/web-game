<?php
session_start();
if (!isset($abs_path)) {
    require_once "path.php";
}
?>


<!DOCTYPE html>
<html lang="en">

<head>
    <?php
    include $abs_path . '/common/head.php';
    ?>
    <link rel="stylesheet" href="css/game.css">
    <script type="module" src="./js/game.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.4.0/dist/confetti.browser.min.js"></script>
</head>

<body>

    <?php
    include $abs_path . '/common/settings.php';
    ?>

    <div class="squares-container"></div>

    <div id="container">
        <div class="level-overview-container">
            <div id="level-overview-header">
                <h2>Levels</h2>
            </div>
            <div id="level-overview">
                <!-- Levels will be dynamically populated here -->
                <!-- Example for level 1 (current level) and others -->
            </div>
        </div>
        <div id="game-container">
            <canvas id="gameCanvas" width="1200" height="700">
                Canvas is not supported by your browser...
            </canvas>
            <button class="mainMenu-button" onclick="backToMainMenu()">Main Menu</button>
        </div>
        <div>
            <div id="scoreTable">
                <h2>Ranking</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Player scores will be populated here -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <script type="module">
        import { GameController } from './js/gameController.js';

        window.onload = () => {
            const gameController = new GameController();
            gameController.startGame();
        };
    </script>
    <script>
        function backToMainMenu() {
            sessionStorage.setItem('gameStarted', 'false');  // Store that the game has started
            sessionStorage.clear('playerColor1')
            sessionStorage.clear('playerColor1')
            sessionStorage.clear('playerColor1')
            sessionStorage.clear('playerColor1')

            location.href = 'index.php';
        }
    </script>
</body>

</html>