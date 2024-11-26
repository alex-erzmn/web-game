<!-- Settings button in the top-left corner -->
<div class="settings-container">
    <button id="settingsButton" class="settings-button"><i class="fa-solid fa-gear"></i></button>
</div>


<div class="settings-sidebar" id="settingsSidebar">
    <div class="settings-content">
        <h2>Settings</h2>
        <p>
            Player Colors:
        <div id="colorSelectors">
            <div id="player1" class="color-selector" style="background-color: #FF0000;"></div>
            <div id="player2" class="color-selector" style="background-color: #00FF00;"></div>
            <div id="player3" class="color-selector" style="background-color: #0000FF;"></div>
            <div id="player4" class="color-selector" style="background-color: #FFDC40;"></div>
        </div>

        <!-- Color Palette with predefined colors -->
        <div id="colorPalette" class="color-palette">
            <!-- Predefined color options -->
            <div class="color-option" style="background-color: #FF0000;"></div>
            <div class="color-option" style="background-color: #00FF00;"></div>
            <div class="color-option" style="background-color: #0000FF;"></div>
            <div class="color-option" style="background-color: #FFDC40;"></div>
            <div class="color-option" style="background-color: #FF00FF;"></div>
            <div class="color-option" style="background-color: #00FFFF;"></div>
            <div class="color-option" style="background-color: #FFA500;"></div>
            <div class="color-option" style="background-color: #802d2d;"></div>
            <div class="color-option" style="background-color: #9cff62;"></div>
            <div class="color-option" style="background-color: #a46efc;"></div>
            <div class="color-option" style="background-color: #4ba8ff;"></div>
        </div>
        </p>

        <p>
            Enable background animation: <input type="checkbox" id="enableAnimations" checked>
        </p>
    </div>

    <!-- Player control section -->
    <div class="settings-content">
        <h2>Player Controls</h2>
        <div class="layout-option">
            <div>
                <input type="radio" name="keyboardLayout" id="qwertz" value="QWERTZ" checked>
                <label for="qwertz">QWERTZ</label>
            </div>
            <div>
                <input type="radio" name="keyboardLayout" id="azerty" value="AZERTY">
                <label for="azerty">AZERTY</label>
            </div>
        </div>

        <div class="control-map">
            <div class="player-control" id="player1Control">
                <div class="control-keys">
                    <div class="key-row">
                        <span class="key">W</span>
                    </div>
                    <div class="key-row">
                        <span class="key">A</span>
                        <span class="key">S</span>
                        <span class="key">D</span>
                    </div>
                </div>
            </div>
            <div class="player-control" id="player2Control">
                <div class="control-keys">
                    <div class="key-row">
                        <span class="key">&#8593;</span>
                    </div>
                    <div class="key-row">
                        <span class="key">&#8592;</span>
                        <span class="key">&#8595;</span>
                        <span class="key">&#8594;</span>
                    </div>
                </div>
            </div>
            <div class="player-control" id="player3Control">
                <div class="control-keys">
                    <div class="key-row">
                        <span class="key">T</span>
                    </div>
                    <div class="key-row">
                        <span class="key">F</span>
                        <span class="key">G</span>
                        <span class="key">H</span>
                    </div>
                </div>
            </div>
            <div class="player-control" id="player4Control">
                <div class="control-keys">
                    <div class="key-row">
                        <span class="key">I</span>
                    </div>
                    <div class="key-row">
                        <span class="key">J</span>
                        <span class="key">K</span>
                        <span class="key">L</span>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <div class="settings-content">
        <h2>Credits</h2>
        <p>Created by <strong>Alexander ERZMANN</strong></p>
        <p>Music recommended by <strong>Yeji LEE</strong></p>
    </div>
</div>

<!-- Sound control buttons in the top-right corner -->
<div class="sound-container">
    <button id="muteMusicButton" class="mute-button"><i class="fas fa-music"></i><span class="visually-hidden">Mute
            Music Button</span></button>
    <button id="muteSoundButton" class="mute-button"><i class="fas fa-volume-up"></i><span class="visually-hidden">Mute
            Sound Button</span></button>
</div>