// HistoryScreen - 歷史紀錄
export class HistoryScreen {
    constructor(canvasWidth, canvasHeight) {
        this.width = canvasWidth;
        this.height = canvasHeight;
        this.fadeAlpha = 0;
        this.fadeIn = true;

        // 從 localStorage 載入數據
        this.loadStats();
    }

    loadStats() {
        this.highScore = parseInt(localStorage.getItem('memoryLane_highScore') || '0');
        this.totalMemories = parseInt(localStorage.getItem('memoryLane_totalMemories') || '0');
        this.gamesPlayed = parseInt(localStorage.getItem('memoryLane_gamesPlayed') || '0');
        this.bestRun = parseInt(localStorage.getItem('memoryLane_bestRun') || '0');
    }

    update() {
        // 淡入效果
        if (this.fadeIn && this.fadeAlpha < 1) {
            this.fadeAlpha += 0.02;
            if (this.fadeAlpha >= 1) {
                this.fadeAlpha = 1;
                this.fadeIn = false;
            }
        }
    }

    handleInput(key) {
        if (key === 'Escape' || key === 'Enter' || key === ' ') {
            return 'back';
        }
        return null;
    }

    render(ctx) {
        // 背景
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#0a0e27');
        gradient.addColorStop(1, '#2d2d5f');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.save();
        ctx.globalAlpha = this.fadeAlpha;

        // 標題
        ctx.fillStyle = '#FFB6C1';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('歷史紀錄', this.width / 2, 80);

        // 分隔線
        ctx.strokeStyle = '#FF69B4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.width / 2 - 150, 110);
        ctx.lineTo(this.width / 2 + 150, 110);
        ctx.stroke();

        // 統計數據
        const stats = [
            { label: '最高分數', value: this.highScore, icon: '🏆' },
            { label: '收集哈逗寶', value: this.totalMemories, icon: '🌭' },
            { label: '遊戲次數', value: this.gamesPlayed, icon: '🎮' },
            { label: '最佳紀錄', value: this.bestRun, icon: '⭐' }
        ];

        const startY = 180;
        const spacing = 90;

        stats.forEach((stat, index) => {
            const y = startY + index * spacing;

            // 繪製背景框
            ctx.fillStyle = 'rgba(255, 105, 180, 0.2)';
            ctx.fillRect(this.width / 2 - 250, y - 30, 500, 60);

            ctx.strokeStyle = '#FF69B4';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.width / 2 - 250, y - 30, 500, 60);

            // 繪製圖標
            ctx.font = '32px Arial';
            ctx.fillText(stat.icon, this.width / 2 - 200, y);

            // 繪製標籤
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '24px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(stat.label, this.width / 2 - 150, y);

            // 繪製數值
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 28px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(stat.value.toString(), this.width / 2 + 230, y);
        });

        ctx.restore();

        // 返回提示
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('按 ESC、Enter 或 空白鍵 返回', this.width / 2, this.height - 30);
    }
}
