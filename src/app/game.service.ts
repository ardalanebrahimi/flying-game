import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  score = 0;
  playerY = 0; // Vertical position
  playerX = 50; // Horizontal position (percentage of screen width)
  velocity = 0; // Vertical velocity
  gravity = -2; // Gravity force
  thrust = 10; // Rocket thrust force per input
  maxUpwardVelocity = 400; // Adjust as needed
  maxDownwardVelocity = -200; // Adjust as needed
  horizontalSpeed = 5; // Horizontal speed per input
  isFlying = false;
  isAscending = false; // Track direction

  applyThrust(): void {
    this.velocity += this.thrust; // Apply a single burst of thrust
    if (this.velocity > this.maxUpwardVelocity) {
      this.velocity = this.maxUpwardVelocity; // Cap upward velocity
    }
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
    this.velocity += this.gravity; // Apply gravity continuously

    // Cap the velocity within the defined limits
    if (this.velocity > this.maxUpwardVelocity) {
      this.velocity = this.maxUpwardVelocity;
    }

    if (this.velocity < this.maxDownwardVelocity) {
      this.velocity = this.maxDownwardVelocity;
    }

    this.playerY += this.velocity; // Update the vertical position

    // Prevent falling below ground
    if (this.playerY < 0) {
      this.playerY = 0;
      this.velocity = 0; // Reset velocity on the ground
    }

    // Update score directly based on height
    this.score = Math.max(0, Math.floor(this.playerY));
  }

  startFlying(): void {
    this.isFlying = true;
  }

  stopFlying(): void {
    this.isFlying = false;
  }

  resetGame(): void {
    this.score = 0;
    this.playerY = 0;
    this.velocity = 0;
    this.isFlying = false;
  }
}
