import { Injectable } from '@angular/core';
import { GameState } from '../../../../core/models/game.model';
import { PhysicsService } from '../../../../core/services/physics.service';
import { StageService } from '../../../../core/services/stage.service';
import { ObstacleService } from '../obstacle/obstacle.service';
import { DotService } from '../dot/dot.service';
import { Stage } from '../../../../core/models/stage.model';
import { LeaderboardService } from '../../../../core/services/leaderboard.service';
import { BackendService } from '../../../../core/services/backend.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private static readonly INITIAL_TARGET_HEIGHT = 100000;
  private gameInterval: any;
  private countdownInterval: any;

  state: GameState = {
    score: 0,
    playerY: 0,
    playerX: 50,
    exploded: false,
    currentStage: '',
    lives: 3,
    isInvincible: false,
    invincibilityTimer: 0,
    countdownTimer: 0,
    isRecovering: false,
    hasWon: false,
    targetHeight: GameService.INITIAL_TARGET_HEIGHT,
  };

  explosionX?: number;
  explosionY?: number;
  dots: { x: number; y: number }[] = [];
  backgroundPositionY = 0;
  currentBackgroundColor: string = '#87ceeb';

  constructor(
    public physics: PhysicsService,
    public stageService: StageService,
    public obstacleService: ObstacleService,
    public dotService: DotService,
    private leaderboardService: LeaderboardService,
    private backendService: BackendService
  ) {}

  // Game Lifecycle Management
  initializeGame(): void {
    this.state = {
      playerX: 50,
      playerY: 0, // Start at 0 to align score and visual position
      score: 0,
      lives: 3,
      currentStage: 'Earth Surface',
      exploded: false,
      isRecovering: false,
      isInvincible: false,
      invincibilityTimer: 0,
      hasWon: false,
      countdownTimer: 3,
      targetHeight: GameService.INITIAL_TARGET_HEIGHT,
    };

    this.resetVisuals();
    this.startCountdown();
  }

  private resetVisuals(): void {
    this.physics.reset();
    this.obstacleService.clearObstacles();
    this.backgroundPositionY = 0;
    this.currentBackgroundColor = '#87ceeb';
    this.explosionX = undefined;
    this.explosionY = undefined;
    this.dots = [];
  }

  private startCountdown(): void {
    // Clear any existing countdown
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    this.state.countdownTimer = 3;
    this.countdownInterval = setInterval(() => {
      if (this.state.countdownTimer > 0) {
        this.state.countdownTimer--;
        if (this.state.countdownTimer === 0) {
          clearInterval(this.countdownInterval);
          this.startGameLoop();
        }
      }
    }, 1000);
  }

  startGameLoop(): void {
    // Stop any existing game loop
    this.stopGameLoop();

    // Initialize stage and physics
    const currentStage = this.stageService.getStageForHeight(
      this.state.playerY
    );
    this.transitBackgroundColor(currentStage);
    this.physics.gravity = currentStage.gravity;
    this.physics.maxUpwardVelocity = currentStage.maxSpeed;
    this.physics.deceleration = currentStage.deceleration || -1;

    // Start game systems
    this.obstacleService.startObstacleLifecycle(
      () => this.state.currentStage,
      () => this.physics.getVelocity(),
      () => this.state.playerY
    );
    this.dotService.startDotSpawner();

    // Start main game loop
    this.gameInterval = setInterval(() => {
      this.updateGame();
      this.dotService.updateDots();
    }, 50);
  }

  stopGameLoop(): void {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }
    this.obstacleService.stopObstacleLifecycle();
    this.dotService.stopDotSpawner();
  }

  resetGameState(): void {
    // Stop all active systems
    this.stopGameLoop();

    // Reset physics
    this.physics.reset();

    // Reset game state
    this.state = {
      score: 0,
      playerY: 0,
      playerX: 50,
      exploded: false,
      currentStage: '',
      lives: 3,
      isInvincible: false,
      invincibilityTimer: 0,
      countdownTimer: 0,
      isRecovering: false,
      hasWon: false,
      targetHeight: GameService.INITIAL_TARGET_HEIGHT,
    };

    // Clear obstacles
    this.obstacleService.clearObstacles();

    // Reset visual elements
    this.backgroundPositionY = 0;
    this.currentBackgroundColor = '#87ceeb';
    this.explosionX = undefined;
    this.explosionY = undefined;
    this.dots = [];
  }

  restartGame(): void {
    this.stopGameLoop();
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    this.resetGameState();
    this.startCountdown();
  }

  handleGameOver(): void {
    this.stopGameLoop();
    this.saveScore();
  }

  private handleWin(): void {
    this.state.hasWon = true;
    this.handleGameOver();
  }

  triggerExplosion(): void {
    this.state.lives--;
    this.explosionX = this.state.playerX * (window.innerWidth / 100);
    this.explosionY = window.innerHeight - this.rocketVisualPosition;

    if (this.state.lives <= 0) {
      this.state.exploded = true;
      this.handleGameOver();
    } else {
      this.startInvincibilityPeriod();
    }
  }
  applyThrust(): void {
    if (this.state.exploded || this.state.countdownTimer > 0) return;

    // Get current stage configuration
    const currentStage = this.stageService.getCurrentStage();
    const baseThrust = currentStage.gravity === 0 ? 1.0 : 2.0;

    // Set physics parameters
    this.physics.setMaxUpwardVelocity(currentStage.maxSpeed);
    this.physics.setThrust(baseThrust);
    this.physics.applyThrust();
  }
  moveLeft(): void {
    if (this.state.exploded || this.state.isRecovering) return;
    const moveSpeed = 3;
    this.state.playerX = Math.max(0, this.state.playerX - moveSpeed);
  }

  moveRight(): void {
    if (this.state.exploded || this.state.isRecovering) return;
    const moveSpeed = 3;
    this.state.playerX = Math.min(100, this.state.playerX + moveSpeed);
  }
  updateGame(): void {
    if (this.state.exploded || this.state.hasWon) return;

    if (this.state.countdownTimer > 0) {
      return; // Don't update physics during countdown
    }

    const HEIGHT_SCALE = 0.2;
    this.physics.applyGravity();
    this.state.playerY += this.physics.getVelocity() * HEIGHT_SCALE;

    // Check for win condition
    if (this.state.playerY >= this.state.targetHeight) {
      this.handleWin();
      return;
    }

    if (this.state.invincibilityTimer > 0) {
      this.state.invincibilityTimer -= 50;
      if (this.state.invincibilityTimer <= 0) {
        this.state.isInvincible = false;
      }
    }

    // Prevent falling below ground
    if (this.state.playerY < 0) {
      this.state.playerY = 0;
      this.physics.reset();
    }

    // Update stage and physics
    const currentStage = this.stageService.getStageForHeight(
      this.state.playerY
    );
    this.transitBackgroundColor(currentStage);
    this.physics.setGravity(currentStage.gravity);
    this.physics.setMaxUpwardVelocity(currentStage.maxSpeed);
    this.physics.setDeceleration(currentStage.deceleration || -1);

    // Update score and visuals
    this.state.score = Math.max(0, Math.floor(this.state.playerY));
    this.updateBackground();

    // Check collisions only if not invincible
    if (!this.state.isInvincible && this.checkCollisions()) {
      this.triggerExplosion();
    }
  }

  saveScore(): void {
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const { name, uuid } = profile;
    const score = this.state.score;

    if (!name || !uuid) {
      console.error('User profile is missing!');
      return;
    }

    const scoreData = { playerName: name, score };

    this.backendService
      .addScore(scoreData)
      .then(() => console.log('Score saved successfully:', scoreData))
      .catch((error) => console.error('Failed to save score:', error));
  }

  private transitBackgroundColor(currentStage: Stage) {
    if (this.state.currentStage !== currentStage.name) {
      this.state.currentStage = currentStage.name;
      this.currentBackgroundColor = this.extractBackgroundColor(
        currentStage.background
      );
    }
  }

  // Helper to extract a representative color from the gradient
  private extractBackgroundColor(gradient: string): string {
    const matches = gradient.match(/#[0-9a-fA-F]{6}/g); // Extract hex colors
    return matches ? matches[0] : '#87ceeb'; // Default if no match
  }

  private updateBackground(): void {
    const maxScroll = -window.innerHeight * 2; // Prevent scrolling past the gradient's end
    this.backgroundPositionY = Math.max(-this.state.playerY / 2, maxScroll);
  }

  get backgroundStyle() {
    return {
      'background-image': this.stageService.getCurrentStage().background,
      'background-position-y': `${this.backgroundPositionY}px`,
    };
  }
  get rocketVisualPosition(): number {
    const screenHeight = window.innerHeight;
    const minPosition = 128; // Minimum height to stay above controls

    // Ensure the player starts moving up visually from the beginning
    return Math.max(
      minPosition,
      Math.min(this.state.playerY + minPosition, screenHeight / 3)
    );
  }

  private startInvincibilityPeriod(): void {
    this.state.isInvincible = true;
    this.state.invincibilityTimer = 3000; // 3 seconds of invincibility
    this.state.countdownTimer = 3;
    this.state.isRecovering = true;

    // Stop all physics
    this.physics.reset();

    // Start countdown
    const countdownInterval = setInterval(() => {
      this.state.countdownTimer--;
      if (this.state.countdownTimer <= 0) {
        clearInterval(countdownInterval);
        // Resume the game
        this.state.isRecovering = false;
      }
    }, 1000);

    // Remove invincibility after timer
    setTimeout(() => {
      this.state.isInvincible = false;
      this.state.invincibilityTimer = 0;
    }, this.state.invincibilityTimer);
  }
  resetGame(): void {
    // Stop any existing game loops
    this.stopGameLoop();

    // Reset physics first
    this.physics.reset();

    // Reset game state to initial values
    this.state = {
      score: 0,
      playerY: 128,
      playerX: 50,
      exploded: false,
      currentStage: '',
      lives: 3,
      isInvincible: false,
      invincibilityTimer: 0,
      countdownTimer: 0,
      isRecovering: false,
      hasWon: false,
      targetHeight: GameService.INITIAL_TARGET_HEIGHT,
    };

    // Clear all obstacles
    this.obstacleService.clearObstacles();

    // Reset background position
    this.backgroundPositionY = 0;
    this.currentBackgroundColor = '#87ceeb';

    // Update current stage and physics properties
    const currentStage = this.stageService.getStageForHeight(0);
    this.transitBackgroundColor(currentStage);
    this.physics.gravity = currentStage.gravity;
    this.physics.maxUpwardVelocity = currentStage.maxSpeed;
    this.physics.deceleration = currentStage.deceleration || -1;
  }

  checkCollisions(): boolean {
    if (this.state.isInvincible) return false;

    const rocketX = this.state.playerX * (window.innerWidth / 100); // Rocket's X position
    const rocketY = window.innerHeight - this.rocketVisualPosition - 25; // Rocket's Center Y on screen

    return this.obstacleService.obstacles.some((obstacle) => {
      const distance = Math.sqrt(
        Math.pow(rocketX - obstacle.x, 2) + Math.pow(rocketY - obstacle.y, 2)
      );
      return distance < 40; // Adjust collision radius as needed
    });
  }
}
