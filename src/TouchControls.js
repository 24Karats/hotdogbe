// TouchControls.js - 簡化的觸控控制（跑酷遊戲）
export class TouchControls {
    constructor(inputManager) {
        this.inputManager = inputManager;
        this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        // Button properties
        this.buttons = {
            jump: {
                active: false,
                touchId: null,
                x: 0, // Will be set based on canvas width
                y: 0, // Will be set based on canvas height
                radius: 50, // 縮小按鈕
                label: '跳',
                color: '#FFD700',
                action: 'jump'
            },
            duck: {
                active: false,
                touchId: null,
                x: 0,
                y: 0,
                radius: 50, // 縮小按鈕
                label: '蹲',
                color: '#4ECDC4',
                action: 'duck'
            }
        };

        // Bind touch events
        if (this.isTouchDevice) {
            this.bindTouchEvents();
        }
    }

    bindTouchEvents() {
        const canvas = document.getElementById('gameCanvas');

        canvas.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
        canvas.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
        canvas.addEventListener('touchend', (e) => this.onTouchEnd(e), { passive: false });
        canvas.addEventListener('touchcancel', (e) => this.onTouchEnd(e), { passive: false });
    }

    updatePositions(canvasWidth, canvasHeight) {
        // Update button positions (right side)
        const rightX = canvasWidth - 100;
        const bottomY = canvasHeight - 100;

        this.buttons.jump.x = rightX;
        this.buttons.jump.y = bottomY;

        this.buttons.duck.x = rightX - 120;
        this.buttons.duck.y = bottomY;
    }

    onTouchStart(event) {
        event.preventDefault();

        const canvas = event.target;
        const rect = canvas.getBoundingClientRect();

        for (let i = 0; i < event.changedTouches.length; i++) {
            const touch = event.changedTouches[i];
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            // Check if touch is on any button
            for (const [key, button] of Object.entries(this.buttons)) {
                const distToButton = Math.hypot(x - button.x, y - button.y);

                if (distToButton < button.radius && !button.active) {
                    button.active = true;
                    button.touchId = touch.identifier;
                    this.setButtonInput(button.action, true);
                    break;
                }
            }
        }
    }

    onTouchMove(event) {
        event.preventDefault();
    }

    onTouchEnd(event) {
        event.preventDefault();

        for (let i = 0; i < event.changedTouches.length; i++) {
            const touch = event.changedTouches[i];

            // Release buttons
            for (const [key, button] of Object.entries(this.buttons)) {
                if (button.active && touch.identifier === button.touchId) {
                    button.active = false;
                    button.touchId = null;
                    this.setButtonInput(button.action, false);
                }
            }
        }
    }

    setButtonInput(action, pressed) {
        switch (action) {
            case 'jump':
                this.inputManager.setTouchJump(pressed);
                break;
            case 'duck':
                this.inputManager.setTouchDuck(pressed);
                break;
        }
    }

    render(ctx) {
        if (!this.isTouchDevice) return;

        // Update positions based on current canvas size
        this.updatePositions(ctx.canvas.width, ctx.canvas.height);

        // Draw joystick - DISABLED: joystick not implemented yet
        // this.drawJoystick(ctx);

        // Draw buttons
        this.drawButtons(ctx);
    }

    drawJoystick(ctx) {
        const j = this.joystick;

        // Draw base
        ctx.fillStyle = this.joystick.active ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.arc(j.baseX, j.baseY, j.baseRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Draw knob
        const knobX = j.active ? j.knobX : j.baseX;
        const knobY = j.active ? j.knobY : j.baseY;

        ctx.fillStyle = this.joystick.active ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.5)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(knobX, knobY, j.knobRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    drawButtons(ctx) {
        for (const [key, button] of Object.entries(this.buttons)) {
            // Draw button circle
            ctx.fillStyle = button.active
                ? button.color
                : button.color + 'CC'; // Add transparency when not active
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 3;

            ctx.beginPath();
            ctx.arc(button.x, button.y, button.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Draw button label
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(button.label, button.x, button.y);

            // Draw press effect
            if (button.active) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.beginPath();
                ctx.arc(button.x, button.y, button.radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}
