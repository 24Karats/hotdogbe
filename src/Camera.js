// Camera - 攝影機跟隨系統
export class Camera {
    constructor(width, height) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;

        // 平滑跟隨參數
        this.smoothness = 0.1;
    }

    // 跟隨目標（玩家）
    follow(target) {
        // 計算目標位置（讓玩家在畫面中央偏左）
        const targetX = target.x - this.width / 3;

        // 平滑移動到目標位置
        this.x += (targetX - this.x) * this.smoothness;

        // 限制攝影機不要移動到負數位置
        if (this.x < 0) {
            this.x = 0;
        }
    }

    // 將世界座標轉換為螢幕座標
    toScreenX(worldX) {
        return worldX - this.x;
    }

    toScreenY(worldY) {
        return worldY - this.y;
    }
}
