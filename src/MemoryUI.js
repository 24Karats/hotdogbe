// MemoryUI - 回憶收集提示介面
export class MemoryUI {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.isVisible = false;
        this.currentMemory = null;
        this.fadeAlpha = 0;
        this.displayTime = 0;
        this.maxDisplayTime = 120; // 2秒（60fps）
    }

    // 顯示收集提示
    show(memorySpot) {
        this.currentMemory = memorySpot;
        this.isVisible = true;
        this.fadeAlpha = 1;
        this.displayTime = 0;
    }

    // 更新淡入淡出
    update() {
        if (!this.isVisible) return;

        this.displayTime++;

        // 最後30幀開始淡出
        if (this.displayTime > this.maxDisplayTime - 30) {
            this.fadeAlpha = Math.max(0, (this.maxDisplayTime - this.displayTime) / 30);
        }

        // 時間到後隱藏
        if (this.displayTime >= this.maxDisplayTime) {
            this.isVisible = false;
            this.currentMemory = null;
            this.fadeAlpha = 0;
        }
    }

    // 渲染收集提示
    render(ctx) {
        if (!this.isVisible || !this.currentMemory) return;

        ctx.save();
        ctx.globalAlpha = this.fadeAlpha;

        // 提示框位置（螢幕上方中央）
        const boxWidth = 400;
        const boxHeight = 100;
        const boxX = (this.canvasWidth - boxWidth) / 2;
        const boxY = 50;

        // 繪製半透明背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        // 繪製邊框
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // 繪製愛心圖示
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('💝', boxX + 40, boxY + 55);

        // 繪製「收集到哈逗寶！」
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('收集到哈逗寶！', boxX + boxWidth / 2, boxY + 30);

        // 繪製回憶標題
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '18px Arial';
        ctx.fillText(this.currentMemory.title, boxX + boxWidth / 2, boxY + 55);

        // 繪製日期（如果有）
        if (this.currentMemory.data.date) {
            ctx.fillStyle = '#AAAAAA';
            ctx.font = '14px Arial';
            ctx.fillText(this.currentMemory.data.date, boxX + boxWidth / 2, boxY + 78);
        }

        ctx.restore();
    }
}
