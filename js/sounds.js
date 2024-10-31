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
    // Add more sound effects here
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

// Mute functionality for music and sound effects
let isMusicMuted = false;
let isSoundMuted = false;

const muteMusicButton = document.getElementById('muteMusicButton');
const muteSoundButton = document.getElementById('muteSoundButton');

muteMusicButton.addEventListener('click', () => {
    isMusicMuted = !isMusicMuted;
    backgroundMusic.mute(isMusicMuted);
    muteMusicButton.textContent = isMusicMuted ? 'Unmute Music' : 'Mute Music';
});

muteSoundButton.addEventListener('click', () => {
    isSoundMuted = !isSoundMuted;
    // Mute/unmute all sound effects
    for (const sound in soundEffects) {
        soundEffects[sound].mute(isSoundMuted);
    }
    muteSoundButton.textContent = isSoundMuted ? 'Unmute Sound' : 'Mute Sound';
});
