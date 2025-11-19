// Particle - 粒子效果
export class Particle {
    constructor(x, y, color = '#FFD700') {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8 - 2;
        this.life = 30;
        this.maxLife = 30;
        this.size = Math.random() * 4 + 2;
        this.color = color;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.3; // 重力
        this.life--;
    }

    isDead() {
        return this.life <= 0;
    }

    render(ctx, camera) {
        const screenX = camera.toScreenX(this.x);
        const screenY = camera.toScreenY(this.y);
        const alpha = this.life / this.maxLife;

        ctx.fillStyle = this.color;
        ctx.globalAlpha = alpha;

        // 繪製星星形狀
        this.drawStar(ctx, screenX, screenY, this.size, 5);

        ctx.globalAlpha = 1.0;
    }

    drawStar(ctx, x, y, radius, points) {
        ctx.save();
        ctx.translate(x, y);
        ctx.beginPath();

        for (let i = 0; i < points * 2; i++) {
            const angle = (i * Math.PI) / points;
            const r = i % 2 === 0 ? radius : radius / 2;
            const px = Math.cos(angle) * r;
            const py = Math.sin(angle) * r;

            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }

        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

// ParticleSystem - 粒子系統管理
export class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    // 產生爆炸效果
    createExplosion(x, y, count = 10, color = '#FFD700') {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();

            if (this.particles[i].isDead()) {
                this.particles.splice(i, 1);
            }
        }
    }

    render(ctx, camera) {
        for (const particle of this.particles) {
            particle.render(ctx, camera);
        }
    }
}
