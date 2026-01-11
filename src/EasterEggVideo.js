// EasterEggVideo - 彩蛋影片播放器
export class EasterEggVideo {
    constructor() {
        this.video = null;
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
    }

    play(videoPath, onComplete) {
        console.log('🎬 播放彩蛋影片:', videoPath);
        this.video.src = videoPath;
        this.video.style.display = 'block';
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
