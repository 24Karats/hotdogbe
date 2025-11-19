// InputManager - 處理鍵盤輸入
export class InputManager {
    constructor() {
        this.keys = {};

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

    // 檢查向左移動
    isLeft() {
        return this.isKeyPressed('a') ||
            this.isKeyPressed('arrowleft') ||
            this.isKeyPressed('ArrowLeft');
    }

    // 檢查向右移動
    isRight() {
        return this.isKeyPressed('d') ||
            this.isKeyPressed('arrowright') ||
            this.isKeyPressed('ArrowRight');
    }

    // 檢查跳躍
    isJump() {
        return this.isKeyPressed('w') ||
            this.isKeyPressed('arrowup') ||
            this.isKeyPressed('ArrowUp') ||
            this.isKeyPressed(' ') ||
            this.isKeyPressed('Space');
    }

    // 檢查攻擊
    isAttack() {
        return this.isKeyPressed('j') ||
            this.isKeyPressed('J') ||
            this.isKeyPressed('KeyJ');
    }

    // 檢查互動
    isInteract() {
        return this.isKeyPressed('e') ||
            this.isKeyPressed('E') ||
            this.isKeyPressed('KeyE') ||
            this.isKeyPressed('enter') ||
            this.isKeyPressed('Enter');
    }

    // 檢查關閉/取消
    isCancel() {
        return this.isKeyPressed('escape') ||
            this.isKeyPressed('Escape');
    }
}
