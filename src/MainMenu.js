// MainMenu - 主選單系統
export class MainMenu {
    constructor(canvasWidth, canvasHeight) {
        this.width = canvasWidth;
        this.height = canvasHeight;

        // 選單選項
        this.options = [
            { text: '製作人的話', action: 'creator' },
            { text: '遊戲開始', action: 'start' },
            { text: '歷史紀錄', action: 'history' }
        ];

        this.selectedIndex = 1; // 預設選擇「遊戲開始」

        // 動畫效果
        this.titleScale = 1.0;
        this.titleScaleDirection = 1;
        this.pulseTimer = 0;

        // 星星背景動畫
        this.stars = [];
        this.initStars();
    }

    initStars() {
        // 創建隨機星星
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2 + 0.5,
                twinkle: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.02 + 0.01
            });
        }
    }

    update() {
        // 標題脈動動畫
        this.pulseTimer += 0.05;
        this.titleScale = 1.0 + Math.sin(this.pulseTimer) * 0.05;

        // 星星閃爍
        this.stars.forEach(star => {
            star.twinkle += star.speed;
        });
    }

    handleInput(key) {
        if (key === 'ArrowUp' || key === 'w' || key === 'W') {
            this.selectedIndex = (this.selectedIndex - 1 + this.options.length) % this.options.length;
        } else if (key === 'ArrowDown' || key === 's' || key === 'S') {
            this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
        } else if (key === 'Enter' || key === ' ') {
            return this.options[this.selectedIndex].action;
        }
        return null;
    }

    // 處理觸控輸入
    handleTouch(x, y) {
        // 虛擬按鈕位置 (右下角)
        const buttonSize = 60;
        const buttonSpacing = 70;
        const rightX = this.width - 80;
        const bottomY = this.height - 80;

        // 上按鈕
        const upButton = {
            x: rightX - buttonSpacing,
            y: bottomY - buttonSpacing,
            size: buttonSize
        };

        // 下按鈕
        const downButton = {
            x: rightX - buttonSpacing,
            y: bottomY,
            size: buttonSize
        };

        // 確認按鈕
        const selectButton = {
            x: rightX,
            y: bottomY - buttonSpacing / 2,
            size: buttonSize
        };

        // 檢查虛擬按鈕點擊
        const distToUp = Math.hypot(x - upButton.x, y - upButton.y);
        const distToDown = Math.hypot(x - downButton.x, y - downButton.y);
        const distToSelect = Math.hypot(x - selectButton.x, y - selectButton.y);

        if (distToUp < buttonSize / 2) {
            // 上移選項
            this.selectedIndex = (this.selectedIndex - 1 + this.options.length) % this.options.length;
            return null;
        } else if (distToDown < buttonSize / 2) {
            // 下移選項
            this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
            return null;
        } else if (distToSelect < buttonSize / 2) {
            // 確認選擇
            return this.options[this.selectedIndex].action;
        }

        // 檢查直接點擊選單選項
        const startY = 300;
        const spacing = 80;
        const buttonWidth = 300;
        const buttonHeight = 50;

        for (let i = 0; i < this.options.length; i++) {
            const optionY = startY + i * spacing;
            const buttonX = this.width / 2 - buttonWidth / 2;
            const buttonTop = optionY - buttonHeight / 2;

            if (x >= buttonX && x <= buttonX + buttonWidth &&
                y >= buttonTop && y <= buttonTop + buttonHeight) {
                this.selectedIndex = i;
                return this.options[i].action;
            }
        }
        return null;
    }

    render(ctx) {
        // 繪製漸層背景
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#0a0e27');
        gradient.addColorStop(0.5, '#1a1a3e');
        gradient.addColorStop(1, '#2d2d5f');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);

        // 繪製星星
        this.stars.forEach(star => {
            const alpha = (Math.sin(star.twinkle) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fillRect(star.x, star.y, star.size, star.size);
        });

        // 繪製標題
        ctx.save();
        ctx.translate(this.width / 2, 150);
        ctx.scale(this.titleScale, this.titleScale);

        // 標題陰影
        ctx.shadowColor = 'rgba(255, 105, 180, 0.8)';
        ctx.shadowBlur = 20;

        ctx.fillStyle = '#FFB6C1';
        ctx.strokeStyle = '#FF69B4';
        ctx.lineWidth = 4;
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.strokeText('哈逗寶', 0, -20);
        ctx.fillText('哈逗寶', 0, -20);

        ctx.font = 'bold 28px Arial';
        ctx.fillStyle = '#DDA0DD';
        ctx.fillText('Hotdog Babe', 0, 20);

        ctx.restore();

        // 繪製選單選項
        const startY = 300;
        const spacing = 80;

        this.options.forEach((option, index) => {
            const y = startY + index * spacing;
            const isSelected = index === this.selectedIndex;

            // 選中效果
            if (isSelected) {
                // 繪製選中框
                ctx.fillStyle = 'rgba(255, 105, 180, 0.3)';
                ctx.fillRect(this.width / 2 - 150, y - 25, 300, 50);

                // 繪製邊框
                ctx.strokeStyle = '#FF69B4';
                ctx.lineWidth = 3;
                ctx.strokeRect(this.width / 2 - 150, y - 25, 300, 50);

                // 繪製箭頭
                ctx.fillStyle = '#FFB6C1';
                ctx.font = '24px Arial';
                ctx.fillText('▶', this.width / 2 - 180, y);
                ctx.fillText('◀', this.width / 2 + 180, y);
            }

            // 繪製選項文字
            ctx.font = isSelected ? 'bold 32px Arial' : '28px Arial';
            ctx.fillStyle = isSelected ? '#FFB6C1' : '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            if (isSelected) {
                ctx.shadowColor = 'rgba(255, 105, 180, 0.8)';
                ctx.shadowBlur = 15;
            } else {
                ctx.shadowBlur = 0;
            }

            ctx.fillText(option.text, this.width / 2, y);
        });

        ctx.shadowBlur = 0;

        // 繪製提示文字
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('使用 ↑↓ 或 W/S 選擇，Enter 或 空白鍵 確認', this.width / 2, this.height - 30);

        // 繪製虛擬按鈕 (手機用)
        if ('ontouchstart' in window) {
            this.drawVirtualButtons(ctx);
        }
    }

    drawVirtualButtons(ctx) {
        const buttonSize = 60;
        const buttonSpacing = 70;
        const rightX = this.width - 80;
        const bottomY = this.height - 80;

        // 上按鈕
        ctx.fillStyle = 'rgba(255, 105, 180, 0.7)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(rightX - buttonSpacing, bottomY - buttonSpacing, buttonSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('▲', rightX - buttonSpacing, bottomY - buttonSpacing);

        // 下按鈕
        ctx.fillStyle = 'rgba(255, 105, 180, 0.7)';
        ctx.beginPath();
        ctx.arc(rightX - buttonSpacing, bottomY, buttonSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('▼', rightX - buttonSpacing, bottomY);

        // 確認按鈕
        ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
        ctx.beginPath();
        ctx.arc(rightX, bottomY - buttonSpacing / 2, buttonSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#000000';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('✓', rightX, bottomY - buttonSpacing / 2);
    }
}
