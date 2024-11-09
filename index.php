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

    <?php
    include $abs_path . '/common/settings.php';
    ?>

    <div class="squares-container"></div>

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
    <script type="module">
        import { Sounds } from './js/background/sounds.js';

        let musicPlaying = false; // Flag to track if music is playing


        document.querySelectorAll('input[name="players"]').forEach((radio) => {
            radio.addEventListener('change', (event) => {
                // Play music only if it's not already playing
                if (!musicPlaying) {
                    Sounds.backgroundMusic.mainBackgroundMusic.play(); // Start the background music
                    musicPlaying = true; // Set the flag to true
                }
            });
        });
    </script>
    <script>
        function startGame() {
            const selectedPlayers = document.querySelector('input[name="players"]:checked');
            if (!selectedPlayers) {
                return;
            }
            sessionStorage.setItem('playerCount', selectedPlayers.value);  // Save player count
            sessionStorage.setItem('gameStarted', 'true');  // Store that the game has started
            location.href = 'game.php';
        }
    </script>
</body>

</html>