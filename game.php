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
</body>

</html>