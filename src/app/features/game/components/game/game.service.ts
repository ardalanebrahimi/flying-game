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
  private gameInterval: any;
  state: GameState = {
    score: 0,
    playerY: 0, // Vertical position
    playerX: 50, // Horizontal position (percentage of screen width)
    exploded: false,
    currentStage: '',
    lives: 3,
    isInvincible: false,
    invincibilityTimer: 0,
    countdownTimer: 0,
    isRecovering: false,
  };

  explosionX?: number;
  explosionY?: number;
  dots: { x: number; y: number }[] = [];
  backgroundPositionY = 0; // Track background scroll position
  currentBackgroundColor: string = '#87ceeb'; // Initial background color

  constructor(
    public physics: PhysicsService,
    public stageService: StageService,
    public obstacleService: ObstacleService,
    public dotService: DotService,
    private leaderboardService: LeaderboardService,
    private backendService: BackendService
  ) {}
  startGameLoop(): void {
    this.stopGameLoop(); // Ensure no duplicate intervals
    this.obstacleService.startObstacleLifecycle(
      () => this.state.currentStage,
      () => this.physics.getVelocity(),
      () => this.state.playerY
    );
    this.gameInterval = setInterval(() => {
      this.updateGame(); // Update player-related logic
      this.dotService.updateDots(); // Update dots
    }, 50); // Fixed interval (adjustable as needed)
  }

  stopGameLoop(): void {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }
  }
  applyThrust(): void {
    if (this.state.exploded || this.state.isRecovering) return; // Prevent movement if exploded or recovering
    this.physics.applyThrust(); // Delegate thrust logic to PhysicsService
  }
  moveLeft(): void {
    if (this.state.exploded || this.state.isRecovering) return;
    this.state.playerX -= 2;
    if (this.state.playerX < 0) this.state.playerX = 0; // Prevent moving out of bounds (left)
  }

  moveRight(): void {
    if (this.state.exploded || this.state.isRecovering) return;
    this.state.playerX += 2;
    if (this.state.playerX > 100) this.state.playerX = 100; // Prevent moving out of bounds (right)
  }
  updateGame(): void {
    if (this.state.exploded || this.state.isRecovering) return;

    const HEIGHT_SCALE = 0.2; // Scale height progression
    this.physics.applyGravity(); // Apply physics calculations
    this.state.playerY += this.physics.getVelocity() * HEIGHT_SCALE; // Update vertical position

    if (this.state.invincibilityTimer > 0) {
      this.state.invincibilityTimer -= 50; // Decrease timer (50ms is our update interval)
    }

    // Prevent falling below ground
    if (this.state.playerY < 0) {
      this.state.playerY = 0;
      this.physics.reset(); // Reset velocity when hitting the ground
    }

    // Update current stage based on height
    const currentStage: Stage = this.stageService.getStageForHeight(
      this.state.playerY
    );
    // Smooth background transition
    this.transitBackgroundColor(currentStage);

    this.physics.gravity = currentStage.gravity; // Update gravity
    this.physics.maxUpwardVelocity = currentStage.maxSpeed; // Update max speed
    this.physics.deceleration = currentStage.deceleration || -1; // Update deceleration

    // Update score based on height
    this.state.score = Math.max(0, Math.floor(this.state.playerY));

    // Update background position
    this.updateBackground();

    // Check for collisions
    if (this.checkCollisions()) this.triggerExplosion();
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
    return Math.min(this.state.playerY, screenHeight / 3);
  }
  triggerExplosion(): void {
    this.state.lives--;
    this.explosionX = this.state.playerX * (window.innerWidth / 100);
    this.explosionY = window.innerHeight - this.rocketVisualPosition;

    if (this.state.lives <= 0) {
      this.state.exploded = true;
      this.physics.reset();
      this.saveScore();
    } else {
      this.startInvincibilityPeriod();
    }
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
    };
    this.physics.reset();
    this.obstacleService.clearObstacles();
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
