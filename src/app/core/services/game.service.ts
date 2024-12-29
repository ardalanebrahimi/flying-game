import { Injectable } from '@angular/core';
import { PhysicsService } from './physics.service';
import { StageService } from './stage.service';
import { ObstacleService } from './obstacle.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  score = 0;
  playerY = 0; // Vertical position
  playerX = 50; // Horizontal position (percentage of screen width)

  currentStage: any;
  explosionX?: number;
  explosionY?: number;

  constructor(
    public physics: PhysicsService,
    public stageService: StageService,
    public obstacleService: ObstacleService
  ) {}

  applyThrust(): void {
    if (this.exploded) return; // Prevent movement if exploded
    this.physics.applyThrust(); // Delegate thrust logic to PhysicsService
  }

  moveLeft(): void {
    if (this.exploded) {
      return;
    }
    this.playerX -= 2;
    if (this.playerX < 0) {
      this.playerX = 0; // Prevent moving out of bounds (left)
    }
  }

  moveRight(): void {
    if (this.exploded) {
      return;
    }
    this.playerX += 2;
    if (this.playerX > 100) {
      this.playerX = 100; // Prevent moving out of bounds (right)
    }
  }

  updateGame(): void {
    if (this.exploded) {
      return; // Do nothing if exploded
    }
    const HEIGHT_SCALE = 0.2; // Scale height progression
    this.physics.applyGravity(); // Apply physics calculations
    this.playerY += this.physics.getVelocity() * HEIGHT_SCALE; // Update vertical position with scaling

    // Prevent falling below ground
    if (this.playerY < 0) {
      this.playerY = 0;
      this.physics.reset(); // Reset velocity when hitting the ground
    }

    // Update current stage based on height
    this.currentStage = this.stageService.getStageForHeight(this.playerY);
    this.physics.gravity = this.currentStage.gravity; // Update gravity
    this.physics.maxUpwardVelocity = this.currentStage.maxSpeed; // Update max speed
    this.physics.deceleration = this.currentStage.deceleration || -1; // Update deceleration

    // Update score based on height
    this.score = Math.max(0, Math.floor(this.playerY));

    // Check for collisions
    if (this.checkCollisions()) {
      this.triggerExplosion(); // Trigger explosion on collision
    }
  }

  get rocketVisualPosition(): number {
    const screenHeight = window.innerHeight;
    return Math.min(this.playerY, screenHeight * 0.25); // One-fourth from the bottom
  }
  exploded = false;

  triggerExplosion(): void {
    this.exploded = true;
    this.physics.reset(); // Stop motion
    this.explosionX = this.playerX * (window.innerWidth / 100); // Rocket's X position on screen
    this.explosionY = window.innerHeight - this.rocketVisualPosition; // Rocket's Y position on screen
  }

  resetGame(): void {
    this.score = 0;
    this.playerY = 0;
    this.playerX = 50;
    this.physics.reset();
    this.obstacleService.clearObstacles();
    this.exploded = false;
  }

  checkCollisions(): boolean {
    const rocketX = this.playerX * (window.innerWidth / 100); // Rocket's X position
    const rocketY = window.innerHeight - this.rocketVisualPosition - 25; // Rocket's Center's Y on screen

    return this.obstacleService.obstacles.some((obstacle) => {
      const distance = Math.sqrt(
        Math.pow(rocketX - obstacle.x, 2) + Math.pow(rocketY - obstacle.y, 2)
      );
      return distance < 40; // Adjust collision radius as needed
    });
  }
}
