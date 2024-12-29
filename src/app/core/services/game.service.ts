import { Injectable } from '@angular/core';
import { PhysicsService } from './physics.service';
import { StageService } from './stage.service';
import { ObstacleService } from './obstacle.service';
import { GameState } from '../models/game.model';
import { Stage } from '../models/stage.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
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

  constructor(
    public physics: PhysicsService,
    public stageService: StageService,
    public obstacleService: ObstacleService
  ) {}

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

    // Check for collisions
    if (this.checkCollisions()) this.triggerExplosion();
  }

  get rocketVisualPosition(): number {
    const screenHeight = window.innerHeight;
    return Math.min(this.state.playerY, screenHeight * 0.25); // One-fourth from the bottom
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

  startDotSpawner(): void {
    const spawnDotInterval = () => {
      if (this.physics.getVelocity() !== 0) {
        this.spawnDot(); // Spawn dots only if thrust is active
      }
      const randomDelay = Math.random() * 300 + 100; // More frequent spawning
      setTimeout(spawnDotInterval, randomDelay);
    };
    spawnDotInterval();
  }

  updateDots(): void {
    const velocity = this.physics.getVelocity();

    this.dots = this.dots.map((dot) => ({
      ...dot,
      y: dot.y + velocity, // Move dots downward
    }));

    // Remove dots that move off the screen (below the viewport)
    this.dots = this.dots.filter((dot) => dot.y < window.innerHeight + 100);
  }

  spawnDot(): void {
    if (this.state.playerY > 100 && this.physics.getVelocity() !== 0) {
      // Spawn dots only after height 100
      const x = Math.random() * window.innerWidth;
      const y = this.physics.getVelocity() > 0 ? 0 : window.innerHeight;
      this.dots.push({ x, y });
    }
  }
}
