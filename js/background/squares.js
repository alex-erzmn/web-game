import { Utility } from "../utility.js";

document.addEventListener('DOMContentLoaded', function () {
    const squaresContainer = document.querySelector('.squares-container');
    let playerCount = Number(sessionStorage.getItem('playerCount')) || 0;
    const maxSquares = 50;
    let currentSquares = 0;
    let squareGenerationInterval; 
    const enableAnimationsCheckbox = document.getElementById('enableAnimations');

    function loadPlayerColors() {
        return {
            player1: sessionStorage.getItem('playerColor1') || '#FF0000',
            player2: sessionStorage.getItem('playerColor2') || '#00FF00', 
            player3: sessionStorage.getItem('playerColor3') || '#0000FF', 
            player4: sessionStorage.getItem('playerColor4') || '#FFDC40'
        };
    }

    function getColorSets(playerColors) {
        return {
            0: ['rgba(169, 169, 169, 0.6)'], 
            1: ['rgba(169, 169, 169, 0.6)', playerColors.player1],
            2: ['rgba(169, 169, 169, 0.6)', playerColors.player1, playerColors.player2], 
            3: ['rgba(169, 169, 169, 0.6)', playerColors.player1, playerColors.player2, playerColors.player3],
            4: ['rgba(169, 169, 169, 0.6)', playerColors.player1, playerColors.player2, playerColors.player3, playerColors.player4]
        };
    }

    function getRandomTransparency() {
        return Math.random() * (1 - 0.3) + 0.3;
    }

    function createSquare() {
        const playerColors = loadPlayerColors();
        const colorSets = getColorSets(playerColors); 

        if (currentSquares >= maxSquares) return; 

        const square = document.createElement('div');
        square.className = 'square';

        const size = Math.random() * 30 + 10;
        square.style.width = `${size}px`;
        square.style.height = `${size}px`;

        square.style.left = `${Math.random() * 100}vw`;

        const startY = Math.random() * 50; 
        square.style.bottom = `${startY}vh`;

        const colorOptions = colorSets[playerCount];
        const selectedColor  = colorOptions[Math.floor(Math.random() * colorOptions.length)];

        const randomTransparency = getRandomTransparency();

        if (selectedColor.startsWith('#')) {
            square.style.backgroundColor = Utility.hexToRgba(selectedColor, randomTransparency);
        } else {
            square.style.backgroundColor = selectedColor.replace(/rgba?\((\d+), (\d+), (\d+),? (\d+(\.\d+)?)?\)/, (_, r, g, b) => {
                return `rgba(${r}, ${g}, ${b}, ${randomTransparency})`;
            });
        }

        const duration = Math.random() * 5 + 5;
        square.style.animationDuration = `${duration}s`;

        square.style.animationName = 'fly';

        squaresContainer.appendChild(square);
        currentSquares++;

        square.addEventListener('animationend', () => {
            square.remove();
            currentSquares--;
        });
    }

    function startSquareGeneration() {
        if (squareGenerationInterval) return;
        squareGenerationInterval = setInterval(() => {
            if (currentSquares < maxSquares) {
                createSquare();
            }
        }, 500);
    }

    function stopSquareGeneration() {
        clearInterval(squareGenerationInterval);
        squareGenerationInterval = null;
    }

    if (enableAnimationsCheckbox.checked) {
        startSquareGeneration(); 
    }

    enableAnimationsCheckbox.addEventListener('change', function () {
        if (enableAnimationsCheckbox.checked) {
            startSquareGeneration(); 
            sessionStorage.setItem('enableAnimations', 'true');
        } else {
            stopSquareGeneration(); 
            sessionStorage.setItem('enableAnimations', 'false'); 
        }
    });

    if (sessionStorage.getItem('enableAnimations') === 'false') {
        enableAnimationsCheckbox.checked = false;
        stopSquareGeneration(); 
    }

    document.querySelectorAll('input[name="players"]').forEach((radio) => {
        radio.addEventListener('click', (event) => {
            playerCount = Number(event.target.value);
            sessionStorage.setItem('playerCount', playerCount); 
        });
    });

    window.addEventListener('storage', function (event) {
        if (event.storageArea === sessionStorage) {
            if (event.key.startsWith('playerColor')) {
            
                createSquare();
            } else if (event.key === 'enableAnimations') {
          
                if (sessionStorage.getItem('enableAnimations') === 'true') {
                    startSquareGeneration();
                } else {
                    stopSquareGeneration();
                }
            }
        }
    });
});
