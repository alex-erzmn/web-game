import { Sounds } from "../background/sounds.js";

document.addEventListener("DOMContentLoaded", function () {
    const muteMusicButton = document.getElementById("muteMusicButton");
    const muteSoundButton = document.getElementById("muteSoundButton");
    const soundEffects = Sounds.soundEffects;
    const backgroundMusic = Sounds.backgroundMusic;

    // Retrieve saved states from sessionStorage or set defaults
    let isMusicMuted = sessionStorage.getItem("isMusicMuted") === "true";
    let isSoundMuted = sessionStorage.getItem("isSoundMuted") === "true";

    // Set initial button icons based on saved states
    muteMusicButton.innerHTML = isMusicMuted ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fas fa-music"></i>';
    muteSoundButton.innerHTML = isSoundMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';

    // Apply initial mute states to the sounds
    for (const sound in backgroundMusic) {
        backgroundMusic[sound].mute(isMusicMuted);
    }
    for (const sound in soundEffects) {
        soundEffects[sound].mute(isSoundMuted);
    }

    // Add event listener for mute music button
    muteMusicButton.addEventListener("click", function () {
        isMusicMuted = !isMusicMuted;
        muteMusicButton.innerHTML = isMusicMuted ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fas fa-music"></i>';
        
        for (const sound in backgroundMusic) {
            backgroundMusic[sound].mute(isMusicMuted);
        }

        // Save the updated state to sessionStorage
        sessionStorage.setItem("isMusicMuted", isMusicMuted);
    });

    // Add event listener for mute sound button
    muteSoundButton.addEventListener("click", function () {
        isSoundMuted = !isSoundMuted;
        muteSoundButton.innerHTML = isSoundMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';

        for (const sound in soundEffects) {
            soundEffects[sound].mute(isSoundMuted);
        }

        // Save the updated state to sessionStorage
        sessionStorage.setItem("isSoundMuted", isSoundMuted);
    });
});