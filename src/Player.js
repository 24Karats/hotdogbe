// Player - 玩家角色
export class Player {
    constructor(x, y, config) {
        // 位置（X 固定不變）
        this.x = x;
        this.y = y;

        // 尺寸
        this.width = 40;  // 稍微加寬以適應角色圖片
        this.height = 60; // 稍微加高以適應角色圖片
        this.normalHeight = 60;
        this.duckHeight = 35;

        // 速度
        this.vy = 0;

        // 配置
        this.config = config;

        // 狀態
        this.isOnGround = false;
        this.isJumping = false;
        this.isDucking = false;

        // 地面高度（暫時固定）
        this.groundY = config.height - 50 - this.height;

        // 動畫系統
        this.animationFrames = [];
        this.currentFrame = 0;
        this.animationTimer = 0;
        this.animationSpeed = 8; // 每8幀切換一次圖片
        this.imagesLoaded = false;

        // 載入角色圖片
        this.loadSprites();
    }

    // 載入角色精靈圖
    loadSprites() {
        const frameCount = 4; // 改為4幀
        let loadedCount = 0;
        const totalImages = frameCount + 2; // 跑步幀 + 跳躍圖 + 蹲下圖

        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    this.imagesLoaded = true;
                    console.log('✅ 角色動畫載入完成');
                }
            };
            img.onerror = () => {
                console.warn(`⚠️ 無法載入角色圖片: character_run_${i}.png`);
            };
            img.src = `/character_run_${i}.png`;
            this.animationFrames.push(img);
        }

        // 載入跳躍圖片
        this.jumpImage = new Image();
        this.jumpImage.onload = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
                this.imagesLoaded = true;
                console.log('✅ 角色動畫載入完成');
            }
        };
        this.jumpImage.onerror = () => {
            console.warn('⚠️ 無法載入跳躍圖片');
        };
        this.jumpImage.src = '/character_jump.png';

        // 載入蹲下圖片
        this.duckImage = new Image();
        this.duckImage.onload = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
                this.imagesLoaded = true;
                console.log('✅ 角色動畫載入完成');
            }
        };
        this.duckImage.onerror = () => {
            console.warn('⚠️ 無法載入蹲下圖片');
        };
        this.duckImage.src = '/character_duck.png';
    }

    // 更新玩家狀態
    update(deltaTime, input) {
        // 蹲下
        const wasDucking = this.isDucking;
        this.isDucking = input.isDuck() && this.isOnGround;

        // 更新高度
        if (this.isDucking) {
            this.height = this.duckHeight;
            // 如果剛開始蹲下，調整 Y 位置
            if (!wasDucking) {
                this.y += this.normalHeight - this.duckHeight;
            }
        } else {
            this.height = this.normalHeight;
            // 如果剛站起來，調整 Y 位置
            if (wasDucking) {
                this.y -= this.normalHeight - this.duckHeight;
            }
        }

        // 跳躍（蹲下時不能跳）
        if (input.isJump() && this.isOnGround && !this.isJumping && !this.isDucking) {
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

        // 更新 Y 位置（X 位置固定）
        this.y += this.vy;

        // 更新地面高度
        this.groundY = this.config.height - 50 - this.height;

        // 地面碰撞檢測
        if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.vy = 0;
            this.isOnGround = true;
        } else {
            this.isOnGround = false;
        }

        // 更新動畫
        if (this.isOnGround && !this.isDucking) {
            this.animationTimer++;
            if (this.animationTimer >= this.animationSpeed) {
                this.animationTimer = 0;
                this.currentFrame = (this.currentFrame + 1) % this.animationFrames.length;
            }
        }
    }

    // 渲染玩家
    render(ctx, camera) {
        // 計算螢幕座標
        const screenX = camera.toScreenX(this.x);
        const screenY = camera.toScreenY(this.y);

        // 如果圖片已載入，使用精靈圖
        if (this.imagesLoaded && this.animationFrames.length > 0) {
            // 選擇要顯示的圖片：根據角色狀態
            let imageToShow;
            if (this.isDucking && this.duckImage) {
                // 蹲下時使用蹲下圖片
                imageToShow = this.duckImage;
            } else if (!this.isOnGround && this.jumpImage) {
                // 跳躍中使用跳躍圖片
                imageToShow = this.jumpImage;
            } else {
                // 在地面上使用跑步動畫
                imageToShow = this.animationFrames[this.currentFrame];
            }

            if (this.isDucking) {
                // 蹲下時縮小高度
                ctx.drawImage(
                    imageToShow,
                    screenX,
                    screenY,
                    this.width,
                    this.height
                );
            } else {
                // 正常繪製
                ctx.drawImage(
                    imageToShow,
                    screenX,
                    screenY,
                    this.width,
                    this.height
                );
            }
        } else {
            // 備用：繪製簡單的矩形（圖片載入中）
            ctx.fillStyle = '#FF6B6B'; // 紅色
            ctx.fillRect(screenX, screenY, this.width, this.height);

            // 繪製眼睛（讓角色更可愛）
            if (!this.isDucking) {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(screenX + 8, screenY + 12, 6, 6);
                ctx.fillRect(screenX + 18, screenY + 12, 6, 6);

                ctx.fillStyle = '#000000';
                ctx.fillRect(screenX + 10, screenY + 14, 3, 3);
                ctx.fillRect(screenX + 20, screenY + 14, 3, 3);
            } else {
                // 蹲下時眼睛位置調整
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(screenX + 8, screenY + 6, 6, 6);
                ctx.fillRect(screenX + 18, screenY + 6, 6, 6);

                ctx.fillStyle = '#000000';
                ctx.fillRect(screenX + 10, screenY + 8, 3, 3);
                ctx.fillRect(screenX + 20, screenY + 8, 3, 3);
            }
        }
    }
}
