window.onload = function() {
document.getElementById('settingsButton').onclick = function () {
    document.getElementById('settingsPopup').style.display = 'flex'; // Show popup
};

document.getElementById('closeSettingsButton').onclick = function () {
    document.getElementById('settingsPopup').style.display = 'none'; // Hide popup
};
}

window.onclick = function (event) {
    const popup = document.getElementById('settingsPopup');
    if (event.target === popup) {
        popup.style.display = 'none';
    }
};
