
document.querySelectorAll('input[name="players"]').forEach((radio) => {
    radio.addEventListener('click', (event) => {
        changeBackgroundGradient(Number(event.target.value));
    });
});
const squaresContainer = document.querySelector('.squares-container');
let playerCount = 0; // Default to 1 player
let squareInterval; // Store the interval ID

// Function to start the interval for creating squares
function startSquareGeneration() {
    clearInterval(squareInterval); // Clear any existing interval
    squareInterval = setInterval(createSquare, 500); // Restart the interval
}

// Function to change player count and update square colors
function changeBackgroundGradient(count) {
    playerCount = count;
    clearSquares(); // Clear existing squares when player count changes
    startSquareGeneration(); // Restart the interval with updated player count
}

// Function to clear all existing squares in the container
function clearSquares() {
    squaresContainer.innerHTML = ''; // Remove all squares by clearing the container's HTML
}

// Function to get a random alpha value for transparency
function getRandomTransparency() {
    return Math.random() * (1 - 0.3) + 0.3; // Random value between 0.3 and 1.0
}

// Available colors for squares depending on player count
const colorSets = {
    0: ['rgba(255, 255, 255, 0.6)'], // White for default
    1: ['rgba(255, 255, 255, 0.6)', 'rgba(255, 0, 0, 0.6)'], // White and Red for 1 player
    2: ['rgba(255, 255, 255, 0.6)', 'rgba(255, 0, 0, 0.6)', 'rgba(0, 0, 255, 0.6)'], // White, Red, Blue for 2 players
    3: ['rgba(255, 255, 255, 0.6)', 'rgba(255, 0, 0, 0.6)', 'rgba(0, 0, 255, 0.6)', 'rgba(0, 128, 0, 0.6)'], // White, Red, Blue, Green for 3 players
    4: ['rgba(255, 255, 255, 0.6)', 'rgba(255, 0, 0, 0.6)', 'rgba(0, 0, 255, 0.6)', 'rgba(0, 128, 0, 0.6)', 'rgba(139, 69, 19, 0.6)'] // White, Red, Blue, Green, Brown for 4 players
};

// Function to create a single square
function createSquare() {
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

    // Choose a color based on the updated player count
    const colorOptions = colorSets[playerCount];
    const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];

    // Generate a random transparency
    const randomTransparency = getRandomTransparency();

    // Set the background color with random transparency
    square.style.backgroundColor = randomColor.replace(/rgba?\((\d+), (\d+), (\d+), (\d+(\.\d+)?)\)/, (_, r, g, b) => {
        return `rgba(${r}, ${g}, ${b}, ${randomTransparency})`;
    });

    // Set a random animation duration
    const duration = Math.random() * 5 + 5; // Duration between 3s and 8s
    square.style.animationDuration = `${duration}s`;

    // Set animation properties for flying
    square.style.animationName = 'fly'; // Use the fly animation

    squaresContainer.appendChild(square);

    // Remove square after animation ends
    square.addEventListener('animationend', () => {
        square.remove();
    });
}

// Initialize square generation
startSquareGeneration();