import { Injectable } from '@angular/core';
import { GameState } from '../../../../core/models/game.model';
import { PhysicsService } from '../../../../core/services/physics.service';
import { StageService } from '../../../../core/services/stage.service';
import { ObstacleService } from '../obstacle/obstacle.service';
import { DotService } from '../dot/dot.service';
import { Stage } from '../../../../core/models/stage.model';
import { LeaderboardService } from '../../../../core/services/leaderboard.service';
import { BackendService } from '../../../../core/services/backend.service';
import { HeartService } from '../heart/heart.service';
import {
  LevelConfig,
  getCurrentLevel,
  unlockLevel,
} from '../../../../core/config/level-config';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private gameInterval: any;
  private countdownInterval: any;
  private currentLevelConfig: LevelConfig = getCurrentLevel();

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
    targetHeight: getCurrentLevel().goalHeight,
    isButtonPressed: false,
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
    public heartService: HeartService,
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
      targetHeight: this.currentLevelConfig.goalHeight,
      isButtonPressed: false,
    };

    this.resetVisuals();
    this.startCountdown();
  }

  /**
   * Initializes the game with a specific level configuration.
   * @param levelConfig - The level configuration to use.
   */
  initializeWithLevel(levelConfig: LevelConfig): void {
    this.currentLevelConfig = levelConfig;
    this.state.targetHeight = levelConfig.goalHeight;

    // Initialize all services with the new level config
    this.stageService.initializeWithLevel(levelConfig);
    this.obstacleService.initializeWithLevel(levelConfig);

    // Reset game state for new level
    this.resetGame();
  }

  private resetVisuals(): void {
    this.physics.reset();
    this.obstacleService.clearObstacles();
    this.heartService.clearHearts();
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
          this.state.isRecovering = false; // Clear recovery state before starting game loop
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

    // If the button is being held, make sure thrust is applied
    if (
      this.state.isButtonPressed &&
      !this.state.exploded &&
      !this.state.isRecovering
    ) {
      this.physics.setThrust(currentStage.gravity === 0 ? 1.0 : 2.0);
      this.physics.applyThrust();
    }

    // Start game systems
    this.obstacleService.startObstacleLifecycle(
      () => this.state.currentStage,
      () => this.physics.getVelocity(),
      () => this.state.playerY
    );
    this.dotService.startDotSpawner();
    this.heartService.startHeartLifecycle(
      () => this.physics.getVelocity(),
      () => this.state.playerY,
      () => this.state.lives
    );

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
    this.heartService.stopHeartLifecycle();
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
      targetHeight: this.currentLevelConfig.goalHeight,
      isButtonPressed: false,
    };

    // Clear obstacles
    this.obstacleService.clearObstacles();

    // Reset visual elements
    this.backgroundPositionY = 0;
    this.currentBackgroundColor = '#87ceeb';
    this.explosionX = undefined;
    this.explosionY = undefined;
    this.dots = [];
    this.heartService.updateLastSpawnHeight(0); // Reset last spawn height for hearts
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

    // Unlock next level if current level is completed
    const nextLevelId = this.currentLevelConfig.id + 1;
    if (nextLevelId <= 2) {
      // Only unlock if next level exists
      unlockLevel(nextLevelId);
    }

    this.handleGameOver();
  }
  triggerExplosion(): void {
    this.state.lives--;
    this.explosionX = this.state.playerX * (window.innerWidth / 100);
    this.explosionY = window.innerHeight - this.rocketVisualPosition;
    this.heartService.updateHealthLossTime();

    if (this.state.lives <= 0) {
      this.state.exploded = true;
      this.handleGameOver();
    } else {
      this.startInvincibilityPeriod();
    }
  }
  applyThrust(): void {
    if (this.state.exploded) return;

    // Always update button state
    this.state.isButtonPressed = true;

    // Don't apply thrust during countdown
    if (this.state.countdownTimer > 0) return;

    // Get current stage configuration
    const currentStage = this.stageService.getCurrentStage();
    const baseThrust = currentStage.gravity === 0 ? 1.0 : 2.0;

    // Set physics parameters
    this.physics.setMaxUpwardVelocity(currentStage.maxSpeed);
    this.physics.setThrust(baseThrust);
    this.physics.applyThrust();
  }

  stopThrust(): void {
    this.state.isButtonPressed = false;
    this.physics.stopFlying();
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
    this.state.isRecovering = true;

    // Stop physics but maintain button state
    this.physics.reset();

    // Use the main countdown system which will handle re-applying thrust
    this.startCountdown();

    // Remove invincibility after timer
    setTimeout(() => {
      this.state.isInvincible = false;
      this.state.invincibilityTimer = 0;
      this.state.isRecovering = false;
    }, this.state.invincibilityTimer);
  }
  resetGame(): void {
    // Stop any existing game loops
    this.stopGameLoop();

    // Reset physics first
    this.physics.reset(); // Reset game state to initial values
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
      targetHeight: this.currentLevelConfig.goalHeight,
      isButtonPressed: false,
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

    // Check heart collisions first
    this.heartService.hearts = this.heartService.hearts.filter((heart) => {
      const distance = Math.sqrt(
        Math.pow(rocketX - heart.x, 2) + Math.pow(rocketY - heart.y, 2)
      );
      if (distance < 40) {
        // Same collision radius as obstacles
        if (this.state.lives < 3) {
          this.state.lives++;
          // Update last spawn height to current height when collecting a heart
          this.heartService.updateLastSpawnHeight(this.state.playerY);
        }
        return false; // Remove the heart
      }
      return true; // Keep the heart
    });

    // Check obstacle collisions
    return this.obstacleService.obstacles.some((obstacle) => {
      const distance = Math.sqrt(
        Math.pow(rocketX - obstacle.x, 2) + Math.pow(rocketY - obstacle.y, 2)
      );
      return distance < 40; // Adjust collision radius as needed
    });
  }
}
