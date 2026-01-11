// MemorySpot - 回憶地點標記（可收集道具）
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
        this.isActive = true;
        this.isCollected = false;

        // 動畫
        this.floatOffset = 0;
        this.glowIntensity = 0;

        // 移動速度（會被遊戲速度調整）
        this.baseSpeed = -5;

        // 載入熱狗圖片
        this.hotdogImage = new Image();
        this.hotdogImage.src = '/hotdog.png';
        this.imageLoaded = false;
        this.hotdogImage.onload = () => {
            this.imageLoaded = true;
        };
    }

    // 檢查碰撞（自動收集）
    checkCollision(player) {
        if (this.isCollected) return false;

        return (
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y
        );
    }

    // 更新動畫和位置
    update(gameSpeed) {
        this.floatOffset = Math.sin(Date.now() / 500) * 5;
        this.glowIntensity = (Math.sin(Date.now() / 300) + 1) / 2;

        // 自動向左移動
        if (!this.isCollected) {
            this.x += this.baseSpeed * gameSpeed;

            // 如果移出螢幕左側，標記為不活躍
            if (this.x + this.width < 0) {
                this.isActive = false;
            }
        }
    }

    // 標記為已收集
    collect() {
        this.isCollected = true;
        this.isActive = false;
    }

    // 渲染回憶地點
    render(ctx, camera) {
        if (this.isCollected) return;

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

        // 繪製熱狗圖片
        if (this.imageLoaded && this.hotdogImage) {
            ctx.drawImage(
                this.hotdogImage,
                screenX,
                screenY,
                this.width,
                this.height
            );
        } else {
            // 備用：繪製簡單的方塊
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(screenX, screenY, this.width, this.height);
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
