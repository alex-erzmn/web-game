document.addEventListener("DOMContentLoaded", function () {

    // ---------- Openning the settings sidebar ----------

    const settingsButton = document.getElementById('settingsButton');
    const settingsSidebar = document.getElementById('settingsSidebar');

    settingsButton.onclick = function () {
        settingsSidebar.classList.toggle('active');
        settingsButton.classList.toggle('active');
    };

  
    // ---------- Settings for changing the player colors ----------

    const colorPalette = document.getElementById('colorPalette');
    const gameStarted = sessionStorage.getItem('gameStarted') === 'true';
    const playerColors = { player1: "#FF0000", player2: "#00FF00", player3: "#0000FF", player4: "#FFDC40" };
    let currentPlayer = null;

    // Manage enable / disable color selection depending on game status
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

    // Manage opening color palette
    document.querySelectorAll('.color-selector').forEach((rect) => {
        rect.addEventListener('click', (event) => {
            if (gameStarted) return;

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
        const chosenColors = Object.values(playerColors).filter(color => color !== playerColors[currentPlayerId]);

        document.querySelectorAll('.color-option').forEach(option => {
            const color = rgbToHex(option.style.backgroundColor);
          
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
                currentPlayer.style.backgroundColor = selectedColor;
                const playerId = currentPlayer.id; 
                playerColors[playerId] = rgbToHex(selectedColor); 

                sessionStorage.setItem(`playerColor${playerId.charAt(playerId.length - 1)}`, rgbToHex(selectedColor));
                document.getElementById(`${playerId}Control`).style.borderColor = rgbToHex(selectedColor);
            }
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
            // Also update the border color for controls
            document.getElementById(`${playerId}Control`).style.borderColor = savedColor;
        }
    });
});
