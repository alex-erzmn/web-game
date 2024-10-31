// Initialize sound effects in an object
const soundEffects = {
    collision: new Howl({
        src: ['assets/sounds/collision.mp3'],
        volume: 0.5,
    }),
    goalReached: new Howl({
        src: ['assets/sounds/goalReached.mp3'],
        volume: 0.5,
    }),
    allLevelsCompleted: new Howl({
        src: ['assets/sounds/allLevelsCompleted.mp3'],
        volume: 0.5,
    }),
};

// Background music
const backgroundMusic = new Howl({
    src: ['assets/audio/background.mp3'],
    loop: true,
    volume: 0.5,
});

// Export sound instances
export const Sounds = {
    backgroundMusic: backgroundMusic,
    soundEffects: soundEffects,
};
