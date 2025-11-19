// HealthBar - 生命值顯示
export class HealthBar {
    // 渲染愛心生命值
    static renderHearts(ctx, x, y, currentHp, maxHp) {
        const heartSize = 20;
        const spacing = 25;

        for (let i = 0; i < maxHp; i++) {
            const heartX = x + i * spacing;

            if (i < currentHp) {
                // 滿血愛心（紅色）
                this.drawHeart(ctx, heartX, y, heartSize, '#FF6B6B');
            } else {
                // 空血愛心（灰色）
                this.drawHeart(ctx, heartX, y, heartSize, '#444444');
            }
        }
    }

    // 繪製愛心形狀
    static drawHeart(ctx, x, y, size, color) {
        ctx.fillStyle = color;
        ctx.beginPath();

        const topCurveHeight = size * 0.3;

        // 左半邊
        ctx.moveTo(x, y + topCurveHeight);
        ctx.bezierCurveTo(
            x, y,
            x - size / 2, y,
            x - size / 2, y + topCurveHeight
        );
        ctx.bezierCurveTo(
            x - size / 2, y + (size + topCurveHeight) / 2,
            x, y + (size + topCurveHeight) / 1.2,
            x, y + size
        );

        // 右半邊
        ctx.bezierCurveTo(
            x, y + (size + topCurveHeight) / 1.2,
            x + size / 2, y + (size + topCurveHeight) / 2,
            x + size / 2, y + topCurveHeight
        );
        ctx.bezierCurveTo(
            x + size / 2, y,
            x, y,
            x, y + topCurveHeight
        );

        ctx.fill();
    }

    // 渲染敵人生命條（簡單的血條）
    static renderEnemyHealth(ctx, x, y, currentHp, maxHp, width = 40) {
        const height = 4;
        const percentage = currentHp / maxHp;

        // 背景（黑色）
        ctx.fillStyle = '#000000';
        ctx.fillRect(x - width / 2, y - 10, width, height);

        // 生命值（紅色）
        ctx.fillStyle = '#FF6B6B';
        ctx.fillRect(x - width / 2, y - 10, width * percentage, height);
    }
}
