import { Injectable } from '@angular/core';
import { PhysicsService } from './physics.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  score = 0;
  playerY = 0; // Vertical position
  playerX = 50; // Horizontal position (percentage of screen width)
  horizontalSpeed = 5; // Horizontal speed per input

  constructor(public physics: PhysicsService) {}

  applyThrust(): void {
    this.physics.applyThrust(); // Delegate thrust logic to PhysicsService
  }

  moveLeft(): void {
    this.playerX -= this.horizontalSpeed;
    if (this.playerX < 0) {
      this.playerX = 0; // Prevent moving out of bounds (left)
    }
  }

  moveRight(): void {
    this.playerX += this.horizontalSpeed;
    if (this.playerX > 100) {
      this.playerX = 100; // Prevent moving out of bounds (right)
    }
  }

  updateGame(): void {
    this.physics.applyGravity(); // Apply gravity continuously
    this.playerY += this.physics.getVelocity(); // Update vertical position

    // Prevent falling below ground
    if (this.playerY < 0) {
      this.playerY = 0;
      this.physics.reset(); // Reset velocity on the ground
    }

    // Update score directly based on height
    this.score = Math.max(0, Math.floor(this.playerY));
  }

  resetGame(): void {
    this.score = 0;
    this.playerY = 0;
    this.playerX = 50;
    this.physics.reset();
  }
}
