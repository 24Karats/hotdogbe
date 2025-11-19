// Player - 玩家角色
export class Player {
    constructor(x, y, config) {
        // 位置
        this.x = x;
        this.y = y;

        // 尺寸
        this.width = 32;
        this.height = 48;

        // 速度
        this.vx = 0;
        this.vy = 0;

        // 配置
        this.config = config;

        // 狀態
        this.isOnGround = false;
        this.isJumping = false;

        // 戰鬥屬性
        this.maxHp = 5;
        this.hp = this.maxHp;
        this.attackCooldown = 0;
        this.isAttacking = false;
        this.attackDuration = 15; // 攻擊動畫持續幀數
        this.attackRange = 50; // 攻擊範圍
        this.attackDamage = 1;
        this.invincibleTime = 0; // 無敵時間
        this.facingRight = true; // 面向方向

        // 地面高度（暫時固定）
        this.groundY = config.height - 50 - this.height;
    }

    // 更新玩家狀態
    update(deltaTime, input) {
        // 更新冷卻時間
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
            if (this.attackCooldown === 0) {
                this.isAttacking = false;
            }
        }

        if (this.invincibleTime > 0) {
            this.invincibleTime--;
        }

        // 攻擊
        if (input.isAttack() && this.attackCooldown === 0) {
            this.attack();
        }

        // 水平移動（攻擊時不能移動）
        if (!this.isAttacking) {
            if (input.isLeft()) {
                this.vx = -this.config.playerSpeed;
                this.facingRight = false;
            } else if (input.isRight()) {
                this.vx = this.config.playerSpeed;
                this.facingRight = true;
            } else {
                this.vx = 0;
            }
        } else {
            this.vx = 0;
        }

        // 跳躍
        if (input.isJump() && this.isOnGround && !this.isJumping) {
            this.vy = this.config.jumpForce;
            this.isOnGround = false;
            this.isJumping = true;
        }

        // 放開跳躍鍵後才能再次跳躍
        if (!input.isJump()) {
            this.isJumping = false;
        }

        // 應用重力
        if (!this.isOnGround) {
            this.vy += this.config.gravity;
        }

        // 更新位置
        this.x += this.vx;
        this.y += this.vy;

        // 地面碰撞檢測
        if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.vy = 0;
            this.isOnGround = true;
        } else {
            this.isOnGround = false;
        }

        // 限制不要移動到畫面左邊界外
        if (this.x < 0) {
            this.x = 0;
        }
    }

    // 攻擊
    attack() {
        this.isAttacking = true;
        this.attackCooldown = this.attackDuration + 10; // 攻擊動畫 + 冷卻
    }

    // 獲取攻擊判定區域
    getAttackBox() {
        if (!this.isAttacking || this.attackCooldown > this.attackDuration) {
            return null;
        }

        const offsetX = this.facingRight ? this.width : -this.attackRange;
        return {
            x: this.x + offsetX,
            y: this.y,
            width: this.attackRange,
            height: this.height
        };
    }

    // 受到傷害
    takeDamage(amount) {
        if (this.invincibleTime > 0) return false;

        this.hp -= amount;
        this.invincibleTime = 60; // 60 幀無敵時間

        // 擊退效果
        this.vy = -8;

        if (this.hp <= 0) {
            this.hp = 0;
            // 遊戲結束邏輯可以在這裡處理
        }

        return true;
    }

    // 渲染玩家
    render(ctx, camera) {
        // 計算螢幕座標
        const screenX = camera.toScreenX(this.x);
        const screenY = camera.toScreenY(this.y);

        // 無敵時間閃爍效果
        if (this.invincibleTime > 0 && Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        // 繪製玩家（簡單的矩形）
        ctx.fillStyle = '#FF6B6B'; // 紅色
        ctx.fillRect(screenX, screenY, this.width, this.height);

        // 繪製眼睛（讓角色更可愛）
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(screenX + 8, screenY + 12, 6, 6);
        ctx.fillRect(screenX + 18, screenY + 12, 6, 6);

        ctx.fillStyle = '#000000';
        ctx.fillRect(screenX + 10, screenY + 14, 3, 3);
        ctx.fillRect(screenX + 20, screenY + 14, 3, 3);

        // 恢復透明度
        ctx.globalAlpha = 1.0;

        // 繪製攻擊揮擊動畫
        if (this.isAttacking && this.attackCooldown > this.attackDuration) {
            this.drawSlashEffect(ctx, camera, screenX, screenY);
        }
    }

    // 繪製揮擊效果
    drawSlashEffect(ctx, camera, screenX, screenY) {
        const progress = 1 - (this.attackCooldown - this.attackDuration) / this.attackDuration;
        const alpha = 1 - progress;

        ctx.save();
        ctx.globalAlpha = alpha * 0.8;

        // 設定揮擊位置
        const slashX = this.facingRight ? screenX + this.width : screenX;
        const slashY = screenY + this.height / 2;

        // 繪製弧形揮擊軌跡
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';

        const startAngle = this.facingRight ? -Math.PI / 4 : Math.PI * 3 / 4;
        const endAngle = this.facingRight ? Math.PI / 4 : Math.PI * 5 / 4;
        const radius = this.attackRange * 0.8;

        ctx.beginPath();
        ctx.arc(slashX, slashY, radius, startAngle, endAngle);
        ctx.stroke();

        // 繪製光暈效果
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(slashX, slashY, radius - 3, startAngle, endAngle);
        ctx.stroke();

        ctx.restore();
    }
}
