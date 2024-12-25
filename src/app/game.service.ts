import { Injectable } from '@angular/core';
import { PhysicsService } from './physics.service';
import { StageService } from './stage.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  score = 0;
  playerY = 0; // Vertical position
  playerX = 50; // Horizontal position (percentage of screen width)

  currentStage: any;

  constructor(
    public physics: PhysicsService,
    private stageService: StageService
  ) {}

  applyThrust(): void {
    this.physics.applyThrust(); // Delegate thrust logic to PhysicsService
  }

  moveLeft(): void {
    this.playerX -= 5;
    if (this.playerX < 0) {
      this.playerX = 0; // Prevent moving out of bounds (left)
    }
  }

  moveRight(): void {
    this.playerX += 5;
    if (this.playerX > 100) {
      this.playerX = 100; // Prevent moving out of bounds (right)
    }
  }
  updateGame(): void {
    this.physics.applyGravity(); // Apply physics calculations
    this.playerY += this.physics.getVelocity(); // Update vertical position

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
  }

  resetGame(): void {
    this.score = 0;
    this.playerY = 0;
    this.playerX = 50;
    this.physics.reset();
  }
}
