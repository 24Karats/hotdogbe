// Enemy - 敵人類別
export class Enemy {
    constructor(x, y, config) {
        // 位置
        this.x = x;
        this.y = y;

        // 尺寸
        this.width = 40;
        this.height = 40;

        // 生命值
        this.maxHp = 3;
        this.hp = this.maxHp;

        // 速度與移動
        this.speed = 1.5;
        this.vx = this.speed;
        this.vy = 0;

        // AI 狀態
        this.state = 'patrol'; // patrol, chase
        this.detectionRange = 200;
        this.patrolLeft = x - 100;
        this.patrolRight = x + 100;

        // 配置
        this.config = config;
        this.groundY = config.height - 50 - this.height;

        // 受傷效果
        this.hitCooldown = 0;
        this.isHurt = false;
    }

    // 更新敵人
    update(deltaTime, player) {
        // 更新受傷冷卻
        if (this.hitCooldown > 0) {
            this.hitCooldown--;
            this.isHurt = this.hitCooldown > 0;
        }

        // AI 行為
        const distanceToPlayer = Math.abs(this.x - player.x);

        if (distanceToPlayer < this.detectionRange) {
            this.state = 'chase';
            // 追逐玩家
            if (player.x > this.x) {
                this.vx = this.speed;
            } else {
                this.vx = -this.speed;
            }
        } else {
            this.state = 'patrol';
            // 巡邏
            if (this.x <= this.patrolLeft) {
                this.vx = this.speed;
            } else if (this.x >= this.patrolRight) {
                this.vx = -this.speed;
            }
        }

        // 應用重力
        this.vy += this.config.gravity;

        // 更新位置
        this.x += this.vx;
        this.y += this.vy;

        // 地面碰撞
        if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.vy = 0;
        }
    }

    // 受到傷害
    takeDamage(amount) {
        if (this.hitCooldown > 0) return false; // 無敵時間

        this.hp -= amount;
        this.hitCooldown = 20; // 20 幀無敵時間
        this.isHurt = true;

        // 擊退效果
        this.vx = -this.vx * 2;
        this.vy = -5;

        return true;
    }

    // 檢查是否死亡
    isDead() {
        return this.hp <= 0;
    }

    // 檢查與玩家的碰撞
    checkCollision(player) {
        return (
            this.x < player.x + player.width &&
            this.x + this.width > player.x &&
            this.y < player.y + player.height &&
            this.y + this.height > player.y
        );
    }

    // 渲染敵人
    render(ctx, camera) {
        const screenX = camera.toScreenX(this.x);
        const screenY = camera.toScreenY(this.y);

        // 受傷時閃爍
        if (this.isHurt && Math.floor(Date.now() / 100) % 2 === 0) {
            return;
        }

        // 繪製敵人身體（紫色）
        ctx.fillStyle = this.state === 'chase' ? '#9B59B6' : '#7D3C98';
        ctx.fillRect(screenX, screenY, this.width, this.height);

        // 繪製眼睛（讓敵人看起來可愛但有點兇）
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(screenX + 8, screenY + 10, 8, 8);
        ctx.fillRect(screenX + 24, screenY + 10, 8, 8);

        ctx.fillStyle = '#FF0000';
        ctx.fillRect(screenX + 10, screenY + 12, 4, 4);
        ctx.fillRect(screenX + 26, screenY + 12, 4, 4);

        // 繪製生命值條
        import('./HealthBar.js').then(({ HealthBar }) => {
            HealthBar.renderEnemyHealth(
                ctx,
                screenX + this.width / 2,
                screenY,
                this.hp,
                this.maxHp,
                this.width
            );
        });
    }
}
