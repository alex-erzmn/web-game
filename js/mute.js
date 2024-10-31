import { Sounds } from "./sounds.js";

document.addEventListener("DOMContentLoaded", function () {
    const muteMusicButton = document.getElementById("muteMusicButton");
    const muteSoundButton = document.getElementById("muteSoundButton");
    const soundEffects = Sounds.soundEffects;
    const backgroundMusic = Sounds.backgroundMusic;
    let isMusicMuted = false;
    let isSoundMuted = false;

    muteMusicButton.addEventListener("click", function () {
        isMusicMuted = !isMusicMuted;
        muteMusicButton.innerHTML = isMusicMuted ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fas fa-music"></i>';
        backgroundMusic.mute(isMusicMuted);
    });

    muteSoundButton.addEventListener("click", function () {
        isSoundMuted = !isSoundMuted;
        muteSoundButton.innerHTML = isSoundMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';

        for (const sound in soundEffects) {
            soundEffects[sound].mute(isSoundMuted);
        }
    });
});