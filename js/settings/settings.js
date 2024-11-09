document.addEventListener("DOMContentLoaded", function () {
    const settingsButton = document.getElementById('settingsButton');
    const settingsSidebar = document.getElementById('settingsSidebar');
    const colorPalette = document.getElementById('colorPalette');
    const playerColors = { player1: "#FF0000", player2: "#00FF00", player3: "#0000FF", player4: "#FFFF00" }; // Default colors
    let currentPlayer = null;

    // Toggle the settings sidebar
    settingsButton.onclick = function () {
        settingsSidebar.classList.toggle('active'); // Toggle sidebar visibility
        settingsButton.classList.toggle('active');  // Shift button when sidebar is open
    };

    const gameStarted = sessionStorage.getItem('gameStarted') === 'true';

    document.querySelectorAll('.color-selector').forEach(rect => {
        if (gameStarted) {
            // If game started, disable color selectors
            rect.classList.add('disabled');
            rect.style.pointerEvents = 'none';
        } else {
            // If game not started, re-enable color selectors
            rect.classList.remove('disabled');
            rect.style.pointerEvents = 'auto';
        }
    });

    // Rest of the color selection code
    document.querySelectorAll('.color-selector').forEach((rect) => {
        rect.addEventListener('click', (event) => {
            if (gameStarted) return; // Prevent opening color palette if game has started

            currentPlayer = rect;
            const rectBounds = rect.getBoundingClientRect();
            colorPalette.style.top = `${rectBounds.bottom + window.scrollY}px`;
            colorPalette.style.left = `${rectBounds.left + window.scrollX}px`;
            updateColorPalette(rect.id);
            colorPalette.style.display = 'grid';
        });
    });

    // Update color palette to show only colors not currently chosen by other players
    function updateColorPalette(currentPlayerId) {
        // Collect all chosen colors except the current player's color
        const chosenColors = Object.values(playerColors).filter(color => color !== playerColors[currentPlayerId]);

        // Iterate through each color option in the palette
        document.querySelectorAll('.color-option').forEach(option => {
            const color = rgbToHex(option.style.backgroundColor);

            // Show option if it's not chosen by another player, otherwise hide it
            if (chosenColors.includes(color)) {
                option.style.display = 'none';
            } else {
                option.style.display = 'inline-block';
            }
        });
    }

    // Apply the selected color to the player's color selector and update border color
    document.querySelectorAll('.color-option').forEach(colorOption => {
        colorOption.addEventListener('click', () => {
            const selectedColor = colorOption.style.backgroundColor;
            if (currentPlayer) {
                // Update the color for the current player and the UI element
                currentPlayer.style.backgroundColor = selectedColor;
                const playerId = currentPlayer.id; // e.g., "player1", "player2", etc.
                playerColors[playerId] = rgbToHex(selectedColor); // Store the new color

                // Save the new color in sessionStorage for persistence
                sessionStorage.setItem(`playerColor${playerId.charAt(playerId.length - 1)}`, rgbToHex(selectedColor));

                // Apply the new color to the player's control section border
                document.getElementById(`${playerId}Control`).style.borderColor = rgbToHex(selectedColor);
            }
            // Hide the color palette after a selection is made
            colorPalette.style.display = 'none';
        });
    });

    // Hide the color palette if clicking outside of it
    document.addEventListener('click', (event) => {
        if (!colorPalette.contains(event.target) && !event.target.classList.contains('color-selector')) {
            colorPalette.style.display = 'none';
        }
    });

    // Utility function to convert RGB to HEX color
    function rgbToHex(rgb) {
        const rgbArr = rgb.match(/\d+/g).map(Number);
        return `#${rgbArr.map(x => x.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
    }

    // Load saved colors from sessionStorage
    Object.keys(playerColors).forEach((playerId, index) => {
        const savedColor = sessionStorage.getItem(`playerColor${index + 1}`);
        if (savedColor) {
            playerColors[playerId] = savedColor;
            document.getElementById(playerId).style.backgroundColor = savedColor;
            // Also update the border color
            document.getElementById(`${playerId}Control`).style.borderColor = savedColor;
        }
    });
});
