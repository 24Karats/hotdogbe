// Background - 視差背景系統（像素風夜晚都市）
export class Background {
    constructor(canvasWidth, canvasHeight) {
        this.width = canvasWidth;
        this.height = canvasHeight;

        // 背景偏移量
        this.bgOffset = 0;

        // 載入圖片
        this.backgroundImage = null;
        this.imageLoaded = false;
        this.loadImage();
    }

    // 載入背景圖片
    loadImage() {
        const img = new Image();
        img.onload = () => {
            this.imageLoaded = true;
            console.log('✅ 背景圖片載入完成');
        };
        img.onerror = () => {
            console.warn('⚠️ 無法載入背景圖片');
            this.imageLoaded = false;
        };
        img.src = '/background_full.png';
        this.backgroundImage = img;
    }

    // 更新背景位置
    update(camera) {
        // 自動緩慢捲動背景
        this.bgOffset += 0.5; // 每幀移動0.5像素，創造緩慢捲動效果

        // 也可以加上輕微的視差效果（可選）
        // this.bgOffset += camera.x * 0.1;
    }

    // 渲染背景
    render(ctx) {
        if (!this.imageLoaded || !this.backgroundImage) {
            // 備用：簡單的夜空
            this.drawFallbackSky(ctx);
            return;
        }

        const img = this.backgroundImage;
        const imgWidth = img.width;
        const imgHeight = img.height;

        // 計算縮放以填滿畫布高度
        const scale = this.height / imgHeight;
        const scaledWidth = imgWidth * scale;

        // 重複平鋪背景
        const startX = -(this.bgOffset % scaledWidth);
        const numRepeats = Math.ceil(this.width / scaledWidth) + 2;

        for (let i = -1; i < numRepeats; i++) {
            ctx.drawImage(
                img,
                startX + i * scaledWidth,
                0,
                scaledWidth,
                this.height
            );
        }
    }

    // 備用天空（圖片載入失敗時使用）
    drawFallbackSky(ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#0a0e27');
        gradient.addColorStop(0.5, '#1a1a3e');
        gradient.addColorStop(1, '#2d2d5f');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);

        // 簡單的星星
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height * 0.6;
            ctx.fillRect(x, y, 1, 1);
        }
    }
}
