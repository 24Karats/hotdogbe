// EasterEggVideo - 彩蛋影片播放器
export class EasterEggVideo {
    constructor() {
        this.video = null;
        this.backButton = null;
        this.isPlaying = false;
        this.onComplete = null;
        this.createVideoElement();
    }

    createVideoElement() {
        // 創建 video 元素
        this.video = document.createElement('video');
        this.video.style.position = 'fixed';
        this.video.style.top = '0';
        this.video.style.left = '0';
        this.video.style.width = '100vw';
        this.video.style.height = '100vh';
        this.video.style.objectFit = 'contain';
        this.video.style.backgroundColor = '#000';
        this.video.style.zIndex = '9999';
        this.video.style.display = 'none';

        // 影片結束事件
        this.video.addEventListener('ended', () => {
            this.hide();
            if (this.onComplete) {
                this.onComplete();
            }
        });

        // 添加到 body
        document.body.appendChild(this.video);

        // 創建返回按鈕
        this.backButton = document.createElement('button');
        this.backButton.textContent = '← 返回';
        this.backButton.style.position = 'fixed';
        this.backButton.style.display = 'none';
        this.backButton.style.zIndex = '10000'; // 比影片層級更高
        this.backButton.style.top = '20px';
        this.backButton.style.left = '20px';
        this.backButton.style.padding = '12px 24px';
        this.backButton.style.fontSize = '18px';
        this.backButton.style.fontWeight = 'bold';
        this.backButton.style.backgroundColor = '#FF69B4'; // 粉紅色
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
            if (this.onComplete) {
                this.onComplete();
            }
        });

        document.body.appendChild(this.backButton);
    }

    play(videoPath, onComplete) {
        console.log('🎬 播放彩蛋影片:', videoPath);
        this.video.src = videoPath;
        this.video.style.display = 'block';
        this.backButton.style.display = 'block'; // 顯示按鈕
        this.isPlaying = true;
        this.onComplete = onComplete;

        // 從頭播放
        this.video.currentTime = 0;
        this.video.play().catch(e => {
            console.error('影片播放失敗:', e);
            this.hide();
            if (onComplete) onComplete();
        });
    }

    hide() {
        if (this.video) {
            this.video.pause();
            this.video.style.display = 'none';
            this.isPlaying = false;
        }
        if (this.backButton) {
            this.backButton.style.display = 'none';
        }
    }

    // 清理資源
    destroy() {
        if (this.video) {
            this.video.pause();
            this.video.remove();
            this.video = null;
        }
        if (this.backButton) {
            this.backButton.remove();
            this.backButton = null;
        }
    }
}
