import './style.css';
import { Player } from './Player.js';
import { InputManager } from './InputManager.js';
import { Camera } from './Camera.js';
import { Obstacle } from './Obstacle.js';
import { ParticleSystem } from './ParticleSystem.js';
import { MemorySpot } from './MemorySpot.js';
import { MemoryUI } from './MemoryUI.js';
import { memories } from './memoryData.js';
import { Background } from './Background.js';
import { TouchControls } from './TouchControls.js';
import { MainMenu } from './MainMenu.js';
import { CreatorMessage } from './CreatorMessage.js';
import { HistoryScreen } from './HistoryScreen.js';
import { AudioManager } from './AudioManager.js';

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
    this.gameState = 'MENU'; // MENU, PLAYING, GAME_OVER, CREATOR, HISTORY
    this.isRunning = false;
    this.isGameOver = false;
    this.lastTime = 0;

    // Scoring
    this.score = 0;
    this.highScore = 0;
    this.memoriesCollected = 0;

    // Game speed (increases over time)
    this.gameSpeed = 1.0;

    // Initialize game objects
    this.input = new InputManager();
    this.camera = new Camera(CONFIG.width, CONFIG.height);
    this.player = new Player(150, 100, CONFIG); // Fixed X position
    this.background = new Background(CONFIG.width, CONFIG.height);
    this.touchControls = new TouchControls(this.input);

    // Initialize obstacles
    this.obstacles = [];
    this.obstacleSpawnTimer = 0;
    this.obstacleSpawnInterval = 100; // Frames between spawns

    // Initialize particle system
    this.particleSystem = new ParticleSystem();

    // Initialize memory spots
    this.memorySpots = [];
    this.memoryUI = new MemoryUI(CONFIG.width, CONFIG.height);
    this.memorySpawnTimer = 0;
    this.memorySpawnInterval = 300; // Frames between spawns
    this.memoryIndex = 0;

    // 追蹤最後生成位置,避免重疊
    this.lastObstacleX = 0;
    this.lastMemoryX = 0;
    this.minSpawnDistance = 200; // 最小間距

    // Initialize menu system
    this.mainMenu = new MainMenu(CONFIG.width, CONFIG.height);
    this.creatorMessage = new CreatorMessage(CONFIG.width, CONFIG.height);
    this.historyScreen = new HistoryScreen(CONFIG.width, CONFIG.height);

    // Load high score from localStorage
    this.highScore = parseInt(localStorage.getItem('memoryLane_highScore') || '0');

    // Load ground image
    this.groundImage = new Image();
    this.groundImage.src = '/ground.png';
    this.groundImageLoaded = false;
    this.groundImage.onload = () => {
      this.groundImageLoaded = true;
      console.log('✅ 地板圖片載入完成');
    };

    // Initialize audio manager
    this.audioManager = new AudioManager();

    // Menu input handler
    this.setupMenuInput();

    // Initialize
    this.init();
  }

  // 生成單個記憶點
  spawnMemorySpot() {
    if (this.memoryIndex >= memories.length) {
      this.memoryIndex = 0; // 循環使用記憶資料
    }

    const spawnX = CONFIG.width + 100;

    // 檢查是否與最近的障礙物太近
    if (Math.abs(spawnX - this.lastObstacleX) < this.minSpawnDistance) {
      return; // 跳過這次生成,等下一次
    }

    const memoryData = {
      ...memories[this.memoryIndex],
      x: spawnX
    };

    this.memorySpots.push(new MemorySpot(memoryData, CONFIG));
    this.lastMemoryX = spawnX;
    this.memoryIndex++;
  }

  // 生成障礙物
  spawnObstacle() {
    const spawnX = CONFIG.width + 50;

    // 檢查是否與最近的哈逗寶太近
    if (Math.abs(spawnX - this.lastMemoryX) < this.minSpawnDistance) {
      return; // 跳過這次生成,等下一次
    }

    const type = Math.random() > 0.7 ? 'flying' : 'ground';
    this.obstacles.push(new Obstacle(spawnX, type, CONFIG));
    this.lastObstacleX = spawnX;
  }

  // 收集哈逗寶
  collectMemory(memorySpot) {
    this.memoriesCollected++;
    // 移除加分,只計算數量
    // 移除提示框顯示
    // this.memoryUI.show(memorySpot);

    // 產生粒子效果
    this.particleSystem.createExplosion(
      memorySpot.x + memorySpot.width / 2,
      memorySpot.y + memorySpot.height / 2,
      12,
      '#FFD700'
    );
  }

  // 遊戲結束
  gameOver() {
    this.isGameOver = true;

    // 保存統計數據到 localStorage
    if (Math.floor(this.score) > this.highScore) {
      this.highScore = Math.floor(this.score);
      localStorage.setItem('memoryLane_highScore', this.highScore.toString());
    }

    // 更新總回憶數
    const totalMemories = parseInt(localStorage.getItem('memoryLane_totalMemories') || '0');
    localStorage.setItem('memoryLane_totalMemories', (totalMemories + this.memoriesCollected).toString());

    // 更新遊戲次數
    const gamesPlayed = parseInt(localStorage.getItem('memoryLane_gamesPlayed') || '0');
    localStorage.setItem('memoryLane_gamesPlayed', (gamesPlayed + 1).toString());

    // 更新最佳紀錄
    const bestRun = parseInt(localStorage.getItem('memoryLane_bestRun') || '0');
    if (Math.floor(this.score) > bestRun) {
      localStorage.setItem('memoryLane_bestRun', Math.floor(this.score).toString());
    }
  }

  // 重新開始
  restart() {
    this.isGameOver = false;
    this.gameState = 'PLAYING';
    this.score = 0;
    this.memoriesCollected = 0;
    this.gameSpeed = 1.0;
    this.obstacles = [];
    this.memorySpots = [];
    this.obstacleSpawnTimer = 0;
    this.memorySpawnTimer = 0;
    this.memoryIndex = 0;
    this.player.y = 100;
    this.player.vy = 0;
  }

  // 設置選單輸入
  setupMenuInput() {
    window.addEventListener('keydown', (e) => {
      if (this.gameState === 'MENU') {
        const action = this.mainMenu.handleInput(e.key);
        if (action === 'start') {
          this.startGame();
        } else if (action === 'creator') {
          this.gameState = 'CREATOR';
          this.creatorMessage.show(); // 顯示影片
        } else if (action === 'history') {
          this.gameState = 'HISTORY';
          this.historyScreen.loadStats();
        }
      } else if (this.gameState === 'CREATOR') {
        const action = this.creatorMessage.handleInput(e.key);
        if (action === 'back') {
          this.gameState = 'MENU';
        }
      } else if (this.gameState === 'HISTORY') {
        const action = this.historyScreen.handleInput(e.key);
        if (action === 'back') {
          this.gameState = 'MENU';
        }
      } else if (this.isGameOver && (e.key === ' ' || e.key === 'Enter')) {
        this.restart();
      }
    });

    // 添加觸控支援
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (this.gameState === 'MENU') {
        const action = this.mainMenu.handleTouch(x, y);
        if (action === 'start') {
          this.startGame();
        } else if (action === 'creator') {
          this.gameState = 'CREATOR';
          this.creatorMessage.show(); // 顯示影片
        } else if (action === 'history') {
          this.gameState = 'HISTORY';
          this.historyScreen.loadStats();
        }
      }
    });

    // 監聽影片返回按鈕事件
    window.addEventListener('videoBack', () => {
      if (this.gameState === 'CREATOR') {
        this.gameState = 'MENU';
      }
    });
  }

  // 開始遊戲
  startGame() {
    this.gameState = 'PLAYING';
    this.restart();
  }

  init() {
    console.log('🎮 Memory Lane Runner Initialized!');
    console.log('Canvas size:', CONFIG.width, 'x', CONFIG.height);
    console.log('Controls: W/↑/Space to jump, S/↓ to duck');

    // 啟動背景音樂
    this.audioManager.play();

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
    // 更新選單狀態
    if (this.gameState === 'MENU') {
      this.mainMenu.update();
      return;
    } else if (this.gameState === 'CREATOR') {
      this.creatorMessage.update();
      return;
    } else if (this.gameState === 'HISTORY') {
      this.historyScreen.update();
      return;
    }

    // 如果遊戲結束，不更新
    if (this.isGameOver) return;

    // Update player
    this.player.update(deltaTime, this.input);

    // 更新遊戲速度（隨時間增加）
    this.gameSpeed = Math.min(2.0, 1.0 + this.score / 2000);

    // 更新障礙物
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obstacle = this.obstacles[i];
      obstacle.update(this.gameSpeed);

      // 檢查碰撞
      if (obstacle.checkCollision(this.player)) {
        this.gameOver();
        return;
      }

      // 移除不活躍的障礙物
      if (!obstacle.isActive) {
        this.obstacles.splice(i, 1);
      }
    }

    // 生成新障礙物
    this.obstacleSpawnTimer++;
    if (this.obstacleSpawnTimer > this.obstacleSpawnInterval) {
      this.spawnObstacle();
      this.obstacleSpawnTimer = 0;
      // 隨機調整生成間隔
      this.obstacleSpawnInterval = 80 + Math.random() * 60;
    }

    // 更新記憶點
    for (let i = this.memorySpots.length - 1; i >= 0; i--) {
      const spot = this.memorySpots[i];
      spot.update(this.gameSpeed);

      // 檢查收集
      if (spot.checkCollision(this.player)) {
        spot.collect();
        this.collectMemory(spot);
      }

      // 移除不活躍的記憶點
      if (!spot.isActive) {
        this.memorySpots.splice(i, 1);
      }
    }

    // 生成新記憶點
    this.memorySpawnTimer++;
    if (this.memorySpawnTimer > this.memorySpawnInterval) {
      this.spawnMemorySpot();
      this.memorySpawnTimer = 0;
    }

    // 更新粒子系統
    this.particleSystem.update();

    // 更新記憶 UI
    this.memoryUI.update();

    // 更新背景
    this.background.update(this.camera);

    // 更新分數(基於時間) - 調整為5分鐘達到1222分
    // 5分鐘 = 300秒 = 18000幀 (60fps)
    // 目標: 1222分 / 18000幀 ≈ 0.0679 分/幀
    // 由於 gameSpeed 會從 1.0 增加到 2.0,平均約 1.2
    // 所以基礎倍率 = 0.0679 / 1.2 ≈ 0.056
    this.score += this.gameSpeed * 0.056;
    this.highScore = Math.max(this.highScore, Math.floor(this.score));
  }

  render() {
    // 渲染選單狀態
    if (this.gameState === 'MENU') {
      this.mainMenu.render(this.ctx);
      return;
    } else if (this.gameState === 'CREATOR') {
      this.creatorMessage.render(this.ctx);
      return;
    } else if (this.gameState === 'HISTORY') {
      this.historyScreen.render(this.ctx);
      return;
    }

    // Render parallax background
    this.background.render(this.ctx);

    // Draw ground
    const groundHeight = 50;
    const groundY = CONFIG.height - groundHeight;

    if (this.groundImageLoaded && this.groundImage) {
      // 創建臨時 canvas 來縮小圖片
      const scale = 0.0625; // 縮小到原始的 1/16 (0.25 × 0.25)
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = this.groundImage.width * scale;
      tempCanvas.height = this.groundImage.height * scale;
      const tempCtx = tempCanvas.getContext('2d');

      // 在臨時 canvas 上繪製縮小的圖片
      tempCtx.drawImage(
        this.groundImage,
        0, 0,
        this.groundImage.width,
        this.groundImage.height,
        0, 0,
        tempCanvas.width,
        tempCanvas.height
      );

      // 使用縮小後的圖片創建 pattern
      const pattern = this.ctx.createPattern(tempCanvas, 'repeat');
      this.ctx.fillStyle = pattern;
      this.ctx.fillRect(0, groundY, CONFIG.width, groundHeight);
    } else {
      // 備用：純色地板
      this.ctx.fillStyle = '#8B4513';
      this.ctx.fillRect(0, groundY, CONFIG.width, groundHeight);
    }

    // Draw obstacles
    for (const obstacle of this.obstacles) {
      obstacle.render(this.ctx);
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

    // Draw touch controls (on top of everything)
    this.touchControls.render(this.ctx);

    // Draw game over screen
    if (this.isGameOver) {
      this.drawGameOver();
    }
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

    this.ctx.strokeText('哈逗寶 Hotdog Babe', CONFIG.width / 2, 40);
    this.ctx.fillText('哈逗寶 Hotdog Babe', CONFIG.width / 2, 40);

    // Draw score
    this.ctx.font = 'bold 20px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 2;
    this.ctx.strokeText(`分數: ${Math.floor(this.score)}`, 10, 30);
    this.ctx.fillText(`分數: ${Math.floor(this.score)}`, 10, 30);

    // Draw memories collected
    this.ctx.font = '16px Arial';
    this.ctx.strokeText(`🌭 哈逗寶: ${this.memoriesCollected}`, 10, 55);
    this.ctx.fillText(`🌭 哈逗寶: ${this.memoriesCollected}`, 10, 55);

    // Draw high score
    this.ctx.textAlign = 'right';
    this.ctx.font = '16px Arial';
    this.ctx.fillStyle = '#FFD700';
    this.ctx.fillText(`最高分: ${this.highScore}`, CONFIG.width - 10, 30);

    // Draw controls hint
    this.ctx.font = '12px Arial';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('W/空白 跳躍 | S/↓ 蹲下', CONFIG.width / 2, CONFIG.height - 10);
  }

  drawGameOver() {
    // Semi-transparent overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);

    // Game Over text
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 4;
    this.ctx.font = 'bold 48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.strokeText('遊戲結束', CONFIG.width / 2, CONFIG.height / 2 - 60);
    this.ctx.fillText('遊戲結束', CONFIG.width / 2, CONFIG.height / 2 - 60);

    // Final score
    this.ctx.font = 'bold 24px Arial';
    this.ctx.lineWidth = 3;
    this.ctx.strokeText(`最終分數: ${Math.floor(this.score)}`, CONFIG.width / 2, CONFIG.height / 2);
    this.ctx.fillText(`最終分數: ${Math.floor(this.score)}`, CONFIG.width / 2, CONFIG.height / 2);

    // Memories collected
    this.ctx.font = '20px Arial';
    this.ctx.fillStyle = '#FFD700';
    this.ctx.fillText(`🌭 收集哈逗寶: ${this.memoriesCollected}`, CONFIG.width / 2, CONFIG.height / 2 + 35);

    // High score
    if (Math.floor(this.score) === this.highScore && this.highScore > 0) {
      this.ctx.fillStyle = '#FFD700';
      this.ctx.font = 'bold 20px Arial';
      this.ctx.fillText('🎉 新紀錄！', CONFIG.width / 2, CONFIG.height / 2 + 65);
    }

    // Restart hint
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = '18px Arial';
    this.ctx.fillText('按 空白鍵 重新開始', CONFIG.width / 2, CONFIG.height / 2 + 100);
  }
}

// Start the game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  new Game();
});
