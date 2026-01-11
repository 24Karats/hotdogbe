// CreatorMessage - 製作人的話（影片版本）
export class CreatorMessage {
    constructor(canvasWidth, canvasHeight) {
        this.width = canvasWidth;
        this.height = canvasHeight;
        this.fadeAlpha = 0;
        this.fadeIn = true;

        // 創建影片元素
        this.video = null;
        this.videoReady = false;
        this.createVideoElement();
    }

    createVideoElement() {
        // 創建 video 元素
        this.video = document.createElement('video');
        this.video.src = '/creator_message.mp4'; // 影片檔案路徑
        this.video.controls = true; // 顯示播放控制
        this.video.style.position = 'fixed'; // 改用 fixed 定位
        this.video.style.display = 'none';
        this.video.style.zIndex = '1000';
        this.video.style.left = '50%';
        this.video.style.top = '50%';
        this.video.style.transform = 'translate(-50%, -50%)'; // 置中
        this.video.style.width = '80%';
        this.video.style.maxWidth = '800px';
        this.video.style.maxHeight = '80vh';
        this.video.style.backgroundColor = '#000';
        this.video.style.borderRadius = '10px';
        this.video.style.boxShadow = '0 0 30px rgba(0,0,0,0.8)';

        // 載入完成事件
        this.video.addEventListener('loadeddata', () => {
            this.videoReady = true;
            console.log('✅ 製作人影片載入完成');
        });

        this.video.addEventListener('error', (e) => {
            console.warn('⚠️ 影片載入失敗:', e);
            console.warn('檢查路徑:', this.video.src);
            this.videoReady = false;
        });

        // 添加到 body
        document.body.appendChild(this.video);

        // 創建返回按鈕
        this.backButton = document.createElement('button');
        this.backButton.textContent = '← 返回';
        this.backButton.style.position = 'fixed';
        this.backButton.style.display = 'none';
        this.backButton.style.zIndex = '1001';
        this.backButton.style.top = '20px';
        this.backButton.style.left = '20px';
        this.backButton.style.padding = '12px 24px';
        this.backButton.style.fontSize = '18px';
        this.backButton.style.fontWeight = 'bold';
        this.backButton.style.backgroundColor = '#FF69B4';
        this.backButton.style.color = '#FFFFFF';
        this.backButton.style.border = 'none';
        this.backButton.style.borderRadius = '8px';
        this.backButton.style.cursor = 'pointer';
        this.backButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        this.backButton.style.transition = 'all 0.3s ease';

        // 懸停效果
        this.backButton.addEventListener('mouseenter', () => {
            this.backButton.style.backgroundColor = '#FFB6C1';
            this.backButton.style.transform = 'scale(1.05)';
        });
        this.backButton.addEventListener('mouseleave', () => {
            this.backButton.style.backgroundColor = '#FF69B4';
            this.backButton.style.transform = 'scale(1)';
        });

        // 點擊返回
        this.backButton.addEventListener('click', () => {
            this.hide();
            // 觸發返回主選單的事件
            window.dispatchEvent(new CustomEvent('videoBack'));
        });

        document.body.appendChild(this.backButton);
    }

    show() {
        if (this.video) {
            this.video.style.display = 'block';
            this.backButton.style.display = 'block';

            // 從頭播放
            this.video.currentTime = 0;
            this.video.play().catch(e => console.warn('播放失敗:', e));
        }
    }

    hide() {
        if (this.video) {
            this.video.pause();
            this.video.style.display = 'none';
        }
        if (this.backButton) {
            this.backButton.style.display = 'none';
        }
    }

    update() {
        // 淡入效果
        if (this.fadeIn && this.fadeAlpha < 1) {
            this.fadeAlpha += 0.02;
            if (this.fadeAlpha >= 1) {
                this.fadeAlpha = 1;
                this.fadeIn = false;
            }
        }
    }

    handleInput(key) {
        if (key === 'Escape') {
            this.hide();
            return 'back';
        }
        return null;
    }

    render(ctx) {
        // 繪製背景
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#0a0e27');
        gradient.addColorStop(1, '#2d2d5f');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.save();
        ctx.globalAlpha = this.fadeAlpha;

        // 標題
        ctx.fillStyle = '#FFB6C1';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('製作人的話', this.width / 2, 80);

        // 分隔線
        ctx.strokeStyle = '#FF69B4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.width / 2 - 150, 110);
        ctx.lineTo(this.width / 2 + 150, 110);
        ctx.stroke();

        // 提示文字
        if (!this.videoReady) {
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('影片載入中...', this.width / 2, this.height / 2);
        } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = '18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('點擊影片播放控制來操作', this.width / 2, this.height / 2 + 200);
        }

        ctx.restore();

        // 返回提示
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('按 ESC 返回主選單', this.width / 2, this.height - 30);
    }

    // 清理資源
    destroy() {
        if (this.video) {
            this.video.pause();
            this.video.remove();
            this.video = null;
        }
    }
}
