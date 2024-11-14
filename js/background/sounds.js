// Initialize sound effects in an object
const soundEffects = {
    collision: new Howl({
        src: ['assets/sounds/collision.mp3'],
        volume: 0.1,
    }),
    goalReached: new Howl({
        src: ['assets/sounds/goalReached.mp3'],
        volume: 0.1,
    }),
    allLevelsCompleted: new Howl({
        src: ['assets/sounds/allLevelsCompleted.mp3'],
        volume: 0.1,
    }),
    squeeze: new Howl({
        src: ['assets/sounds/squeeze.mp3'],
        volume: 0.1,
    }),
    shot: new Howl({
        src: ['assets/sounds/shot.mp3'],
        volume: 0.1,
    }),
    gotShot: new Howl({
        src: ['assets/sounds/gotShot.mp3'],
        volume: 0.1,
    }),
};

// Background music
const backgroundMusic = {
    gameBackgroundMusic: new Howl({
        src: ['assets/audio/background.mp3'],
        loop: true,
        volume: 0.1,
    }),
    mainBackgroundMusic: new Howl({
        src: ['assets/audio/mainBackground.mp3'],
        loop: true,
        volume: 0.1,
    })
};

// Export sound instances
export const Sounds = {
    backgroundMusic: backgroundMusic,
    soundEffects: soundEffects,
};
