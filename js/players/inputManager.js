export class InputManager {
    constructor() {
        this.inputStates = {};

        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    onKeyDown(event) {
        this.inputStates[event.key] = true;
    }

    onKeyUp(event) {
        this.inputStates[event.key] = false;
    }

    isKeyPressed(key) {
        return !!this.inputStates[key];
    }
    
    reset() {
        this.inputStates = {};
    }
}
