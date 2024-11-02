<!-- Settings button in the top-left corner -->
<div class="settings-container">
    <button id="settingsButton" class="settings-button"><i class="fa-solid fa-gear"></i></button>
</div>


<div class="settings-sidebar" id="settingsSidebar">
    <div class="settings-content">
        <h2>Settings</h2>
        <p>
            Game Mode:
            <select id="gameMode">
                <option value="classic">Classic Mode</option>
                <option value="challenge">Challenge Mode</option>
                <option value="endless">Endless Mode</option>
            </select>
        </p>
        <p>
            Game Speed:
            <select id="gameSpeed">
                <option value="slow">Slow</option>
                <option value="normal" selected>Normal</option>
                <option value="fast">Fast</option>
            </select>
        </p>
        <p>
            Show Instructions: <input type="checkbox" id="showInstructions" checked>
        </p>
        <p>
            Background Theme:
            <select id="backgroundTheme">
                <option value="default">Default</option>
                <option value="dark">Dark Theme</option>
                <option value="light">Light Theme</option>
            </select>
        </p>
        <p>
            Enable Animations: <input type="checkbox" id="enableAnimations" checked>
        </p>
        <p>
            Difficulty Level:
            <select id="difficultyLevel">
                <option value="easy">Easy</option>
                <option value="medium" selected>Medium</option>
                <option value="hard">Hard</option>
            </select>
        </p>
    </div>
    <div class="settings-content">
        <h2>Credits</h2>
        <p>Created by <strong>Alexander ERZMANN</strong></p>
    </div>
</div>

<!-- Sound control buttons in the top-right corner -->
<div class="sound-container">
    <button id="muteMusicButton" class="mute-button"><i class="fas fa-music"></i><span class="visually-hidden">Mute
            Music Button</span></button>
    <button id="muteSoundButton" class="mute-button"><i class="fas fa-volume-up"></i><span class="visually-hidden">Mute
            Sound Button</span></button>
</div>