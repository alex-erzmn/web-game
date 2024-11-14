import { Utility } from "../utility.js";

document.addEventListener('DOMContentLoaded', function () {
    const squaresContainer = document.querySelector('.squares-container');
    let playerCount = Number(sessionStorage.getItem('playerCount')) || 0; // Default to 0 players
    const maxSquares = 50; // Maximum number of squares allowed at any one time
    let currentSquares = 0; // Counter for currently existing squares
    let squareGenerationInterval; // Store the interval ID to control the interval
    const enableAnimationsCheckbox = document.getElementById('enableAnimations'); // The checkbox to enable/disable animations

    // Function to load player colors from sessionStorage
    function loadPlayerColors() {
        return {
            player1: sessionStorage.getItem('playerColor1') || '#FF0000', // Default Red if not set
            player2: sessionStorage.getItem('playerColor2') || '#00FF00', // Default Green if not set
            player3: sessionStorage.getItem('playerColor3') || '#0000FF', // Default Blue if not set
            player4: sessionStorage.getItem('playerColor4') || '#FFFF00'  // Default Yellow if not set
        };
    }

    // Function to create color sets dynamically based on the current player colors
    function getColorSets(playerColors) {
        return {
            0: ['rgba(169, 169, 169, 0.6)'], // Grey for default (no player selected)
            1: ['rgba(169, 169, 169, 0.6)', playerColors.player1], // Grey and Player 1 color for 1 player
            2: ['rgba(169, 169, 169, 0.6)', playerColors.player1, playerColors.player2], // Grey, Player 1 and Player 2
            3: ['rgba(169, 169, 169, 0.6)', playerColors.player1, playerColors.player2, playerColors.player3], // Grey, Player 1, 2 and 3
            4: ['rgba(169, 169, 169, 0.6)', playerColors.player1, playerColors.player2, playerColors.player3, playerColors.player4] // Grey + All Players
        };
    }

    // Function to get a random alpha value for transparency
    function getRandomTransparency() {
        return Math.random() * (1 - 0.3) + 0.3; // Random value between 0.3 and 1.0
    }

    // Function to create a single square
    function createSquare() {
        const playerColors = loadPlayerColors(); // Always load the latest colors
        const colorSets = getColorSets(playerColors); // Update the color sets based on the current player colors

        if (currentSquares >= maxSquares) return; // Prevent creating more squares than allowed

        const square = document.createElement('div');
        square.className = 'square';

        // Randomize the size and position
        const size = Math.random() * 30 + 10; // Size between 10px and 40px
        square.style.width = `${size}px`;
        square.style.height = `${size}px`;

        // Random horizontal position
        square.style.left = `${Math.random() * 100}vw`;

        // Random vertical position starting from the bottom
        const startY = Math.random() * 50; // Start from 50% to 100% of the viewport height
        square.style.bottom = `${startY}vh`;

        // Choose colors based on the updated player count
        const colorOptions = colorSets[playerCount];
        const selectedColor  = colorOptions[Math.floor(Math.random() * colorOptions.length)];

        // Generate a random transparency
        const randomTransparency = getRandomTransparency();

        if (selectedColor.startsWith('#')) {
            // Convert hex color to rgba with transparency
            square.style.backgroundColor = Utility.hexToRgba(selectedColor, randomTransparency);
        } else {
            // If it's already in rgba format, just add the transparency
            square.style.backgroundColor = selectedColor.replace(/rgba?\((\d+), (\d+), (\d+),? (\d+(\.\d+)?)?\)/, (_, r, g, b) => {
                return `rgba(${r}, ${g}, ${b}, ${randomTransparency})`;
            });
        }

        // Set a random animation duration
        const duration = Math.random() * 5 + 5; // Duration between 5s and 10s
        square.style.animationDuration = `${duration}s`;

        // Set animation properties for flying
        square.style.animationName = 'fly'; // Use the fly animation

        squaresContainer.appendChild(square);
        currentSquares++; // Increment the square count

        // Remove square after animation ends
        square.addEventListener('animationend', () => {
            square.remove();
            currentSquares--; // Decrement the count after removing a square
        });
    }

    // Function to start the interval for creating squares
    function startSquareGeneration() {
        if (squareGenerationInterval) return; // Prevent starting a new interval if one is already running
        squareGenerationInterval = setInterval(() => {
            if (currentSquares < maxSquares) { // Check if we can add a new square
                createSquare();
            }
        }, 500); // Continue the interval every 500ms
    }

    // Function to stop the square generation
    function stopSquareGeneration() {
        clearInterval(squareGenerationInterval);
        squareGenerationInterval = null; // Reset the interval variable
    }

    // Initialize square generation based on checkbox state
    if (enableAnimationsCheckbox.checked) {
        startSquareGeneration(); // Start square creation if checkbox is checked
    }

    // Listen for changes to the "Enable background animation" checkbox
    enableAnimationsCheckbox.addEventListener('change', function () {
        if (enableAnimationsCheckbox.checked) {
            startSquareGeneration(); // Start creating squares
            sessionStorage.setItem('enableAnimations', 'true'); // Store in sessionStorage
        } else {
            stopSquareGeneration(); // Stop creating squares
            sessionStorage.setItem('enableAnimations', 'false'); // Store in sessionStorage
        }
    });

    // Load saved checkbox state from sessionStorage and apply it
    if (sessionStorage.getItem('enableAnimations') === 'false') {
        enableAnimationsCheckbox.checked = false;
        stopSquareGeneration(); // Ensure square generation is stopped if stored as false
    }

    // Ensure to call onChangePlayerCount when player count is selected
    document.querySelectorAll('input[name="players"]').forEach((radio) => {
        radio.addEventListener('click', (event) => {
            playerCount = Number(event.target.value); // Update player count based on selection
            sessionStorage.setItem('playerCount', playerCount); // Save selected player count in sessionStorage
        });
    });

    // Watch for changes in sessionStorage and update square generation accordingly
    window.addEventListener('storage', function (event) {
        if (event.storageArea === sessionStorage) {
            if (event.key.startsWith('playerColor')) {
                // Reload the player colors when they are updated in sessionStorage
                createSquare();
            } else if (event.key === 'enableAnimations') {
                // Reload the animation state when it is updated in sessionStorage
                if (sessionStorage.getItem('enableAnimations') === 'true') {
                    startSquareGeneration();
                } else {
                    stopSquareGeneration();
                }
            }
        }
    });
});
