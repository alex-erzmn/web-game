
document.querySelectorAll('input[name="players"]').forEach((radio) => {
    radio.addEventListener('click', (event) => {
        onChangePlayerCount(Number(event.target.value));
    });
});

const squaresContainer = document.querySelector('.squares-container');
let playerCount = 0; // Default to 1 player
const maxSquares = 50; // Maximum number of squares allowed at any one time
let currentSquares = 0; // Counter for currently existing squares

// Available colors for squares depending on player count
const colorSets = {
    0: ['rgba(255, 255, 255, 0.6)'], // White for default
    1: ['rgba(255, 255, 255, 0.6)', 'rgba(255, 0, 0, 0.6)'], // White and Red for 1 player
    2: ['rgba(255, 255, 255, 0.6)', 'rgba(255, 0, 0, 0.6)', 'rgba(0, 0, 255, 0.6)'], // White, Red, Blue for 2 players
    3: ['rgba(255, 255, 255, 0.6)', 'rgba(255, 0, 0, 0.6)', 'rgba(0, 0, 255, 0.6)', 'rgba(50, 205, 50, 0.6)'], // White, Red, Blue, Bright Green for 3 players
    4: ['rgba(255, 255, 255, 0.6)', 'rgba(255, 0, 0, 0.6)', 'rgba(0, 0, 255, 0.6)', 'rgba(50, 205, 50, 0.6)', 'rgba(210, 105, 30, 0.6)'] // White, Red, Blue, Bright Green, Bright Brown for 4 players
};


// Function to change player count and update square colors
function onChangePlayerCount(count) {
    playerCount = count;
}

// Function to get a random alpha value for transparency
function getRandomTransparency() {
    return Math.random() * (1 - 0.3) + 0.3; // Random value between 0.3 and 1.0
}

// Function to create a single square
function createSquare() {
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
    setInterval(() => {
        if (currentSquares < maxSquares) { // Check if we can add a new square
            createSquare();
        }
    }, 500); // Continue the interval
}

// Initialize square generation
startSquareGeneration();