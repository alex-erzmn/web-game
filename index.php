<?php
session_start();
if (!isset($abs_path)) {
    require_once "path.php";
}
?>

<!DOCTYPE html>
<html lang="de">

<head>
    <?php
    include $abs_path . '/common/head.php';
    ?>
    <link rel="stylesheet" href="css/index.css">
</head>

<body>

    <div class="settings-container">
        <button id="settingsButton" class="settings-button"><i class="fa-solid fa-gear"></i></button>
    </div>

    <!-- Sound control buttons in the top-right corner -->
    <div class="sound-container">
        <button id="muteMusicButton" class="mute-button"><i class="fas fa-music"></i><span class="visually-hidden">Mute Music Button</span></button>
        <button id="muteSoundButton" class="mute-button"><i class="fas fa-volume-up"></i><span class="visually-hidden">Mute Sound Button</span></button>
    </div>

    <div class="squares-container"></div> <!-- Container for flying squares -->

    <div class="container">
        <h1>Square Escape</h1>
        <fieldset id="playerSelection">
            <legend>Choose Number of Players</legend>
            <div class="player-option">
                <input type="radio" name="players" id="onePlayer" value="1">
                <label for="onePlayer">
                    <span class="player-icon" data-count="1"><i class="fa-regular fa-user"></i></span>
                    <span class="visually-hidden">One Player</span>
                </label>
            </div>
            <div class="player-option">
                <input type="radio" name="players" id="twoPlayers" value="2">
                <label for="twoPlayers">
                    <span class="player-icon" data-count="2">
                        <i class="fa-regular fa-user"></i>
                        <i class="fa-regular fa-user"></i>
                    </span>
                    <span class="visually-hidden">Two Players</span>
                </label>
            </div>
            <div class="player-option">
                <input type="radio" name="players" id="threePlayers" value="3">
                <label for="threePlayers">
                    <span class="player-icon" data-count="3">
                        <i class="fa-regular fa-user"></i>
                        <i class="fa-regular fa-user"></i>
                        <i class="fa-regular fa-user"></i>
                    </span>
                    <span class="visually-hidden">Three Players</span>
                </label>
            </div>
            <div class="player-option">
                <input type="radio" name="players" id="fourPlayers" value="4">
                <label for="fourPlayers">
                    <span class="player-icon" data-count="4">
                        <i class="fa-regular fa-user"></i>
                        <i class="fa-regular fa-user"></i>
                        <i class="fa-regular fa-user"></i>
                        <i class="fa-regular fa-user"></i>
                    </span>
                    <span class="visually-hidden">Four Players</span>
                </label>
            </div>
        </fieldset>
        <button class="start-button" onclick="startGame()">Start Game</button>
    </div>

    <?php 
    include $abs_path . '/settings.php';
    ?>

    <script>
        function startGame() {
            const selectedPlayers = document.querySelector('input[name="players"]:checked');
            if (!selectedPlayers) {
                return;
            }
            sessionStorage.setItem('playerCount', selectedPlayers.value);  // Save player count
            location.href = 'game.php';
        }
    </script>
</body>

</html>
