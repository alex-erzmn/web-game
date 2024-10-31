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

    <div class="settings-container">
        <button id="settingsButton" class="settings-button"><i class="fa-solid fa-gear"></i></button>
    </div>

    <!-- Sound control buttons in the top-right corner -->
    <div class="sound-container">
        <button id="muteMusicButton" class="mute-button"><i class="fas fa-music"></i></button>
        <button id="muteSoundButton" class="mute-button"><i class="fas fa-volume-up"></i></button>
    </div>

    <div class="squares-container"></div> <!-- Container for flying squares -->

    <div id="container">
        <div id="game-container">
            <canvas id="gameCanvas" width="1200" height="700">
                Canvas is not supported by your browser...
            </canvas>
            <button class="mainMenu-button" onclick="location.href='index.php'">Main Menu</button>
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

    <?php 
    include $abs_path . '/settings.php';
    ?>

</body>

</html>