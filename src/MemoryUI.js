// MemoryUI - 回憶顯示介面
export class MemoryUI {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.isVisible = false;
        this.currentMemory = null;
        this.fadeAlpha = 0;
        this.targetAlpha = 0;
    }

    // 顯示回憶
    show(memoryData) {
        this.currentMemory = memoryData;
        this.isVisible = true;
        this.targetAlpha = 1;
    }

    // 隱藏回憶
    hide() {
        this.targetAlpha = 0;
        setTimeout(() => {
            if (this.fadeAlpha === 0) {
                this.isVisible = false;
                this.currentMemory = null;
            }
        }, 300);
    }

    // 更新淡入淡出
    update() {
        if (this.fadeAlpha < this.targetAlpha) {
            this.fadeAlpha = Math.min(this.fadeAlpha + 0.05, this.targetAlpha);
        } else if (this.fadeAlpha > this.targetAlpha) {
            this.fadeAlpha = Math.max(this.fadeAlpha - 0.05, this.targetAlpha);
        }
    }

    // 渲染回憶 UI
    render(ctx) {
        if (!this.isVisible || !this.currentMemory) return;

        ctx.save();
        ctx.globalAlpha = this.fadeAlpha;

        // 半透明背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        // 主要內容區域
        const boxWidth = 600;
        const boxHeight = 400;
        const boxX = (this.canvasWidth - boxWidth) / 2;
        const boxY = (this.canvasHeight - boxHeight) / 2;

        // 繪製內容框
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        // 繪製邊框
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 4;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // 繪製標題
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.currentMemory.title, this.canvasWidth / 2, boxY + 40);

        // 繪製日期（如果有）
        if (this.currentMemory.data.date) {
            ctx.font = '14px Arial';
            ctx.fillStyle = '#888888';
            ctx.fillText(this.currentMemory.data.date, this.canvasWidth / 2, boxY + 65);
        }

        // 繪製地點（如果有）
        if (this.currentMemory.data.location) {
            ctx.font = '14px Arial';
            ctx.fillStyle = '#888888';
            ctx.fillText(`📍 ${this.currentMemory.data.location}`, this.canvasWidth / 2, boxY + 85);
        }

        // 根據類型渲染內容
        if (this.currentMemory.type === 'photo') {
            this.renderPhotoMemory(ctx, boxX, boxY, boxWidth, boxHeight);
        } else if (this.currentMemory.type === 'text') {
            this.renderTextMemory(ctx, boxX, boxY, boxWidth, boxHeight);
        }

        // 繪製關閉提示
        ctx.fillStyle = '#666666';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('按 E 或 ESC 關閉', this.canvasWidth / 2, boxY + boxHeight - 20);

        ctx.restore();
    }

    // 渲染照片型回憶
    renderPhotoMemory(ctx, boxX, boxY, boxWidth, boxHeight) {
        const contentY = boxY + 110;

        // 照片區域（佔位符）
        ctx.fillStyle = '#E0E0E0';
        ctx.fillRect(boxX + 50, contentY, boxWidth - 100, 150);

        ctx.fillStyle = '#999999';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('📷 照片區域', this.canvasWidth / 2, contentY + 75);
        ctx.font = '12px Arial';
        ctx.fillText('(之後可以加入真實照片)', this.canvasWidth / 2, contentY + 95);

        // 文字描述
        if (this.currentMemory.data.text) {
            ctx.fillStyle = '#333333';
            ctx.font = '16px Arial';
            ctx.textAlign = 'left';
            this.wrapText(
                ctx,
                this.currentMemory.data.text,
                boxX + 50,
                contentY + 180,
                boxWidth - 100,
                24
            );
        }
    }

    // 渲染文字型回憶
    renderTextMemory(ctx, boxX, boxY, boxWidth, boxHeight) {
        const contentY = boxY + 110;

        ctx.fillStyle = '#333333';
        ctx.font = '18px Arial';
        ctx.textAlign = 'left';

        this.wrapText(
            ctx,
            this.currentMemory.data.text,
            boxX + 50,
            contentY,
            boxWidth - 100,
            28
        );
    }

    // 文字換行輔助函數
    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const lines = text.split('\n');
        let currentY = y;

        for (const line of lines) {
            const words = line.split(' ');
            let currentLine = '';

            for (const word of words) {
                const testLine = currentLine + word + ' ';
                const metrics = ctx.measureText(testLine);

                if (metrics.width > maxWidth && currentLine !== '') {
                    ctx.fillText(currentLine, x, currentY);
                    currentLine = word + ' ';
                    currentY += lineHeight;
                } else {
                    currentLine = testLine;
                }
            }

            ctx.fillText(currentLine, x, currentY);
            currentY += lineHeight;
        }
    }
}
