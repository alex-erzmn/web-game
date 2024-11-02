document.addEventListener("DOMContentLoaded", function () {
    const settingsButton = document.getElementById('settingsButton');
    const settingsSidebar = document.getElementById('settingsSidebar');

    settingsButton.onclick = function () {
        settingsSidebar.classList.toggle('active'); // Toggle sidebar visibility
        settingsButton.classList.toggle('active');  // Shift button when sidebar is open
    };
});