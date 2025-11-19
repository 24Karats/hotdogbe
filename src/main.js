import './style.css';
import { Player } from './Player.js';
import { InputManager } from './InputManager.js';
import { Camera } from './Camera.js';
import { Enemy } from './Enemy.js';
import { HealthBar } from './HealthBar.js';
import { ParticleSystem } from './ParticleSystem.js';
import { MemorySpot } from './MemorySpot.js';
import { MemoryUI } from './MemoryUI.js';
import { memories } from './memoryData.js';
import { Background } from './Background.js';

// Game Configuration
const CONFIG = {
  width: 800,
  height: 600,
  gravity: 0.5,
  jumpForce: -12,
  playerSpeed: 5
};

// Game Class
class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    // Set canvas size
    this.canvas.width = CONFIG.width;
    this.canvas.height = CONFIG.height;

    // Game state
    this.isRunning = false;
    this.lastTime = 0;

    // Initialize game objects
    this.input = new InputManager();
    this.camera = new Camera(CONFIG.width, CONFIG.height);
    this.player = new Player(100, 100, CONFIG);
    this.background = new Background(CONFIG.width, CONFIG.height);

    // World size (for future expansion)
    this.worldWidth = 3000;

    // Initialize enemies
    this.enemies = [];
    this.spawnEnemies();

    // Initialize particle system
    this.particleSystem = new ParticleSystem();

    // Initialize memory spots
    this.memorySpots = [];
    this.memoryUI = new MemoryUI(CONFIG.width, CONFIG.height);
    this.spawnMemorySpots();

    // Interaction state
    this.nearbyMemorySpot = null;
    this.interactPressed = false;

    // Initialize
    this.init();
  }

  spawnMemorySpots() {
    for (const memoryData of memories) {
      this.memorySpots.push(new MemorySpot(memoryData, CONFIG));
    }
  }

  spawnEnemies() {
    // Spawn some enemies at different positions
    this.enemies.push(new Enemy(400, 100, CONFIG));
    this.enemies.push(new Enemy(800, 100, CONFIG));
    this.enemies.push(new Enemy(1200, 100, CONFIG));
  }

  init() {
    console.log('🎮 Memory Lane Game Initialized!');
    console.log('Canvas size:', CONFIG.width, 'x', CONFIG.height);
    console.log('Controls: A/D or ←/→ to move, W/↑/Space to jump, J to attack, E to interact');

    // Start game loop
    this.isRunning = true;
    this.gameLoop(0);
  }

  gameLoop(currentTime) {
    if (!this.isRunning) return;

    // Calculate delta time
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Update
    this.update(deltaTime);

    // Render
    this.render();

    // Continue loop
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  update(deltaTime) {
    // Update player
    this.player.update(deltaTime, this.input);

    // Update enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(deltaTime, this.player);

      // Check if enemy is dead
      if (enemy.isDead()) {
        this.enemies.splice(i, 1);
        continue;
      }

      // Check player attack collision
      const attackBox = this.player.getAttackBox();
      if (attackBox) {
        const hit = (
          attackBox.x < enemy.x + enemy.width &&
          attackBox.x + attackBox.width > enemy.x &&
          attackBox.y < enemy.y + enemy.height &&
          attackBox.y + attackBox.height > enemy.y
        );

        if (hit) {
          const damaged = enemy.takeDamage(this.player.attackDamage);
          if (damaged) {
            // 產生粒子效果
            this.particleSystem.createExplosion(
              enemy.x + enemy.width / 2,
              enemy.y + enemy.height / 2,
              8,
              '#FFD700'
            );
          }
        }
      }

      // Check enemy collision with player
      if (enemy.checkCollision(this.player)) {
        this.player.takeDamage(1);
      }
    }

    // Update particle system
    this.particleSystem.update();

    // Update memory spots
    this.nearbyMemorySpot = null;
    for (const spot of this.memorySpots) {
      spot.update();
      if (spot.checkPlayerNearby(this.player)) {
        this.nearbyMemorySpot = spot;
      }
    }

    // Handle memory interaction
    if (!this.memoryUI.isVisible) {
      if (this.input.isInteract() && !this.interactPressed && this.nearbyMemorySpot) {
        this.memoryUI.show(this.nearbyMemorySpot);
        this.interactPressed = true;
      }
    } else {
      if ((this.input.isInteract() || this.input.isCancel()) && !this.interactPressed) {
        this.memoryUI.hide();
        this.interactPressed = true;
      }
    }

    if (!this.input.isInteract() && !this.input.isCancel()) {
      this.interactPressed = false;
    }

    this.memoryUI.update();

    // Update background
    this.background.update(this.camera);

    // Update camera to follow player
    this.camera.follow(this.player);
  }

  render() {
    // Render parallax background
    this.background.render(this.ctx);

    // Draw extended ground (world coordinates)
    this.ctx.fillStyle = '#8B4513';
    const groundScreenX = this.camera.toScreenX(0);
    this.ctx.fillRect(groundScreenX, CONFIG.height - 50, this.worldWidth, 50);

    // Draw enemies
    for (const enemy of this.enemies) {
      enemy.render(this.ctx, this.camera);
    }

    // Draw particles
    this.particleSystem.render(this.ctx, this.camera);

    // Draw memory spots
    for (const spot of this.memorySpots) {
      spot.render(this.ctx, this.camera);
    }

    // Draw player
    this.player.render(this.ctx, this.camera);

    // Draw UI
    this.drawUI();

    // Draw memory UI (on top of everything)
    this.memoryUI.render(this.ctx);
  }

  drawClouds() {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';

    // Cloud 1
    const cloud1X = this.camera.toScreenX(200);
    this.ctx.beginPath();
    this.ctx.arc(cloud1X, 80, 30, 0, Math.PI * 2);
    this.ctx.arc(cloud1X + 25, 80, 35, 0, Math.PI * 2);
    this.ctx.arc(cloud1X + 50, 80, 30, 0, Math.PI * 2);
    this.ctx.fill();

    // Cloud 2
    const cloud2X = this.camera.toScreenX(600);
    this.ctx.beginPath();
    this.ctx.arc(cloud2X, 120, 25, 0, Math.PI * 2);
    this.ctx.arc(cloud2X + 20, 120, 30, 0, Math.PI * 2);
    this.ctx.arc(cloud2X + 40, 120, 25, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawUI() {
    // Draw title
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 3;
    this.ctx.font = 'bold 24px Arial';
    this.ctx.textAlign = 'center';

    this.ctx.strokeText('回憶長廊 - Memory Lane', CONFIG.width / 2, 40);
    this.ctx.fillText('回憶長廊 - Memory Lane', CONFIG.width / 2, 40);

    // Draw controls hint
    this.ctx.font = '14px Arial';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('控制: A/D 移動, W/空白 跳躍, J 攻擊', 10, CONFIG.height - 10);

    // Draw player health
    HealthBar.renderHearts(this.ctx, 10, 10, this.player.hp, this.player.maxHp);

    // Draw enemy count
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`敵人: ${this.enemies.length}`, CONFIG.width - 10, 30);

    // Draw player position (debug info)
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`位置: ${Math.round(this.player.x)}, ${Math.round(this.player.y)}`, CONFIG.width - 10, CONFIG.height - 10);
  }
}

// Start the game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  new Game();
});
