// InputManager - 處理鍵盤輸入和觸控輸入
export class InputManager {
    constructor() {
        this.keys = {};

        // Touch input state
        this.touchInput = {
            left: false,
            right: false,
            jump: false,
            duck: false,
            interact: false
        };

        // 綁定事件監聽器
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
    }

    onKeyDown(event) {
        this.keys[event.key.toLowerCase()] = true;
        this.keys[event.code] = true;
    }

    onKeyUp(event) {
        this.keys[event.key.toLowerCase()] = false;
        this.keys[event.code] = false;
    }

    // 檢查按鍵是否被按下
    isKeyPressed(key) {
        return this.keys[key] || false;
    }

    // Touch input setters
    setTouchLeft(value) {
        this.touchInput.left = value;
    }

    setTouchRight(value) {
        this.touchInput.right = value;
    }

    setTouchJump(value) {
        this.touchInput.jump = value;
    }

    setTouchDuck(value) {
        this.touchInput.duck = value;
    }

    setTouchInteract(value) {
        this.touchInput.interact = value;
    }

    // 檢查向左移動 (鍵盤或觸控)
    isLeft() {
        return this.isKeyPressed('a') ||
            this.isKeyPressed('arrowleft') ||
            this.isKeyPressed('ArrowLeft') ||
            this.touchInput.left;
    }

    // 檢查向右移動 (鍵盤或觸控)
    isRight() {
        return this.isKeyPressed('d') ||
            this.isKeyPressed('arrowright') ||
            this.isKeyPressed('ArrowRight') ||
            this.touchInput.right;
    }

    // 檢查跳躍 (鍵盤或觸控)
    isJump() {
        return this.isKeyPressed('w') ||
            this.isKeyPressed('arrowup') ||
            this.isKeyPressed('ArrowUp') ||
            this.isKeyPressed(' ') ||
            this.isKeyPressed('Space') ||
            this.touchInput.jump;
    }

    // 檢查蹲下 (鍵盤或觸控)
    isDuck() {
        return this.isKeyPressed('s') ||
            this.isKeyPressed('arrowdown') ||
            this.isKeyPressed('ArrowDown') ||
            this.touchInput.duck;
    }

    // 檢查互動 (鍵盤或觸控)
    isInteract() {
        return this.isKeyPressed('e') ||
            this.isKeyPressed('E') ||
            this.isKeyPressed('KeyE') ||
            this.isKeyPressed('enter') ||
            this.isKeyPressed('Enter') ||
            this.touchInput.interact;
    }

    // 檢查關閉/取消
    isCancel() {
        return this.isKeyPressed('escape') ||
            this.isKeyPressed('Escape');
    }
}

