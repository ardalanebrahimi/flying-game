import { Injectable } from '@angular/core';
import { GameState } from '../../../../core/models/game.model';
import { PhysicsService } from '../../../../core/services/physics.service';
import { StageService } from '../../../../core/services/stage.service';
import { ObstacleService } from '../obstacle/obstacle.service';
import { DotService } from '../dot/dot.service';
import { Stage } from '../../../../core/models/stage.model';

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
  };

  explosionX?: number;
  explosionY?: number;
  dots: { x: number; y: number }[] = [];
  backgroundPositionY = 0; // Track background scroll position

  constructor(
    public physics: PhysicsService,
    public stageService: StageService,
    public obstacleService: ObstacleService,
    public dotService: DotService
  ) {}

  startGameLoop(): void {
    this.stopGameLoop(); // Ensure no duplicate intervals
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
    if (this.state.exploded) return; // Prevent movement if exploded
    this.physics.applyThrust(); // Delegate thrust logic to PhysicsService
  }

  moveLeft(): void {
    if (this.state.exploded) return;
    this.state.playerX -= 2;
    if (this.state.playerX < 0) this.state.playerX = 0; // Prevent moving out of bounds (left)
  }

  moveRight(): void {
    if (this.state.exploded) return;
    this.state.playerX += 2;
    if (this.state.playerX > 100) this.state.playerX = 100; // Prevent moving out of bounds (right)
  }

  updateGame(): void {
    if (this.state.exploded) return;

    const HEIGHT_SCALE = 0.2; // Scale height progression
    this.physics.applyGravity(); // Apply physics calculations
    this.state.playerY += this.physics.getVelocity() * HEIGHT_SCALE; // Update vertical position

    // Prevent falling below ground
    if (this.state.playerY < 0) {
      this.state.playerY = 0;
      this.physics.reset(); // Reset velocity when hitting the ground
    }

    // Update current stage based on height
    const currentStage: Stage = this.stageService.getStageForHeight(
      this.state.playerY
    );
    this.state.currentStage = currentStage.name;
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
    this.state.exploded = true;
    this.physics.reset(); // Stop motion
    this.explosionX = this.state.playerX * (window.innerWidth / 100); // Rocket's X position on screen
    this.explosionY = window.innerHeight - this.rocketVisualPosition; // Rocket's Y position on screen
  }

  resetGame(): void {
    this.state = {
      score: 0,
      playerY: 0,
      playerX: 50,
      exploded: false,
      currentStage: '',
    };
    this.physics.reset();
    this.obstacleService.clearObstacles();
  }

  checkCollisions(): boolean {
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
