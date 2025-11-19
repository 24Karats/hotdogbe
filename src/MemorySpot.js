// MemorySpot - 回憶地點標記
export class MemorySpot {
    constructor(memoryData, config) {
        this.id = memoryData.id;
        this.type = memoryData.type;
        this.title = memoryData.title;
        this.x = memoryData.x;
        this.y = config.height - 50 - 60; // 地面上方
        this.data = memoryData.data;

        this.width = 40;
        this.height = 60;
        this.interactionRange = 80;

        // 動畫
        this.floatOffset = 0;
        this.glowIntensity = 0;

        this.isPlayerNearby = false;
    }

    // 檢查玩家是否靠近
    checkPlayerNearby(player) {
        const distance = Math.abs(player.x - this.x);
        this.isPlayerNearby = distance < this.interactionRange;
        return this.isPlayerNearby;
    }

    // 更新動畫
    update() {
        this.floatOffset = Math.sin(Date.now() / 500) * 5;
        this.glowIntensity = (Math.sin(Date.now() / 300) + 1) / 2;
    }

    // 渲染回憶地點
    render(ctx, camera) {
        const screenX = camera.toScreenX(this.x);
        const screenY = camera.toScreenY(this.y + this.floatOffset);

        // 繪製光暈效果
        const gradient = ctx.createRadialGradient(
            screenX + this.width / 2,
            screenY + this.height / 2,
            0,
            screenX + this.width / 2,
            screenY + this.height / 2,
            this.width
        );
        gradient.addColorStop(0, `rgba(255, 215, 0, ${0.3 * this.glowIntensity})`);
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(
            screenX - this.width / 2,
            screenY - this.height / 2,
            this.width * 2,
            this.height * 2
        );

        // 繪製主體（書本/相框圖示）
        ctx.fillStyle = '#FFD700';
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;

        // 書本形狀
        ctx.fillRect(screenX, screenY, this.width, this.height);
        ctx.strokeRect(screenX, screenY, this.width, this.height);

        // 書本細節
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(screenX + this.width / 2, screenY);
        ctx.lineTo(screenX + this.width / 2, screenY + this.height);
        ctx.stroke();

        // 愛心圖示
        this.drawHeart(
            ctx,
            screenX + this.width / 2,
            screenY + this.height / 2,
            10,
            '#FF6B6B'
        );

        // 如果玩家靠近，顯示標題
        if (this.isPlayerNearby) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(screenX - 50, screenY - 30, 140, 25);

            ctx.fillStyle = '#FFFFFF';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.title, screenX + this.width / 2, screenY - 12);

            ctx.font = '10px Arial';
            ctx.fillText('按 E 互動', screenX + this.width / 2, screenY - 2);
        }
    }

    // 繪製愛心
    drawHeart(ctx, x, y, size, color) {
        ctx.fillStyle = color;
        ctx.beginPath();

        const topCurveHeight = size * 0.3;

        ctx.moveTo(x, y + topCurveHeight);
        ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
        ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.2, x, y + size);
        ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
        ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);

        ctx.fill();
    }
}
