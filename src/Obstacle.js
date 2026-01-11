// Obstacle.js - 關係挑戰障礙物
export class Obstacle {
    // 靜態屬性：共享的障礙物圖片
    static obstacleImage = null;
    static imageLoaded = false;

    // 靜態方法：載入障礙物圖片（只載入一次）
    static loadImage() {
        if (!Obstacle.obstacleImage) {
            Obstacle.obstacleImage = new Image();
            Obstacle.obstacleImage.onload = () => {
                Obstacle.imageLoaded = true;
                console.log('✅ 障礙物圖片載入完成');
            };
            Obstacle.obstacleImage.onerror = () => {
                console.warn('⚠️ 無法載入障礙物圖片');
            };
            Obstacle.obstacleImage.src = './obstacle.png';
        }
    }

    constructor(x, type, config) {
        this.x = x;
        this.type = type; // 'ground' or 'flying'
        this.config = config;
        this.isActive = true;

        // 確保圖片已開始載入
        Obstacle.loadImage();

        // 根據類型設定屬性
        if (type === 'ground') {
            // 保持圖片比例 (假設原圖接近正方形)
            this.width = 50;
            this.height = 50;
            this.y = config.height - 50 - this.height;
        } else {
            // 飛行障礙物 - 設定在角色頭部高度
            this.width = 50;
            this.height = 50;
            // 計算角色站立時的頭部位置
            const playerGroundY = config.height - 50 - 60; // 490
            const playerHeadY = playerGroundY - 20 + 10; // 頭部上方一點,再降低10像素
            this.y = playerHeadY - this.height / 2; // 障礙物中心對準頭部
        }

        // 移動速度（會被遊戲速度調整）
        this.baseSpeed = -5;
    }

    update(gameSpeed) {
        // 根據遊戲速度移動
        this.x += this.baseSpeed * gameSpeed;

        // 如果移出螢幕左側，標記為不活躍
        if (this.x + this.width < 0) {
            this.isActive = false;
        }
    }

    render(ctx) {
        if (Obstacle.imageLoaded && Obstacle.obstacleImage) {
            // 繪製障礙物圖片
            ctx.drawImage(
                Obstacle.obstacleImage,
                this.x,
                this.y,
                this.width,
                this.height
            );
        } else {
            // 備用：繪製簡單的方塊
            ctx.fillStyle = '#FF6B6B';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    // 碰撞檢測
    checkCollision(player) {
        return (
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y
        );
    }
}
