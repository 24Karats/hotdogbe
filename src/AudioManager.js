// AudioManager - 音樂和音效管理系統
export class AudioManager {
    constructor() {
        this.bgMusic = null;
        this.isMuted = false;
        this.volume = 0.5; // 預設音量 50%
        this.isLoaded = false;

        this.loadBackgroundMusic();
    }

    loadBackgroundMusic() {
        this.bgMusic = new Audio('/JAY PARK ft. NATTY (KISS OF LIFE) - TAXI BLURR INSTRUMENTAL.mp3');
        this.bgMusic.loop = true; // 循環播放
        this.bgMusic.volume = this.volume;

        this.bgMusic.addEventListener('canplaythrough', () => {
            this.isLoaded = true;
            console.log('✅ 背景音樂載入完成');
        });

        this.bgMusic.addEventListener('error', (e) => {
            console.warn('⚠️ 背景音樂載入失敗:', e);
        });
    }

    play() {
        if (!this.bgMusic || this.isMuted) return;

        // 使用 Promise 處理自動播放限制
        const playPromise = this.bgMusic.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('🎵 背景音樂開始播放');
                })
                .catch(error => {
                    console.warn('⚠️ 自動播放被阻止，等待用戶互動:', error.message);
                    // 在用戶第一次互動時播放
                    this.setupUserInteractionPlay();
                });
        }
    }

    setupUserInteractionPlay() {
        const playOnInteraction = () => {
            console.log('👆 偵測到用戶互動，嘗試播放音樂');
            if (this.bgMusic && !this.isMuted) {
                this.bgMusic.play()
                    .then(() => console.log('🎵 音樂播放成功'))
                    .catch(e => console.warn('播放失敗:', e.message));
            }
        };

        // 監聽多種互動事件
        document.addEventListener('click', playOnInteraction, { once: true });
        document.addEventListener('touchstart', playOnInteraction, { once: true });
        document.addEventListener('keydown', playOnInteraction, { once: true });

        console.log('⏳ 等待用戶互動以播放音樂...');
    }

    pause() {
        if (this.bgMusic) {
            this.bgMusic.pause();
        }
    }

    stop() {
        if (this.bgMusic) {
            this.bgMusic.pause();
            this.bgMusic.currentTime = 0;
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.bgMusic) {
            this.bgMusic.muted = this.isMuted;
        }
        return this.isMuted;
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume)); // 限制在 0-1 之間
        if (this.bgMusic) {
            this.bgMusic.volume = this.volume;
        }
    }

    getVolume() {
        return this.volume;
    }

    isMusicMuted() {
        return this.isMuted;
    }
}
