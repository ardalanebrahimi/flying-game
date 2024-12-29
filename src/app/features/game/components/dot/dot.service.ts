import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DotService {
  dots: { x: number; y: number }[] = [];
  private spawnInterval: any;
  private getVelocityCallback?: () => number; // Callback to get current velocity
  private getPlayerYCallback?: () => number; // Callback to get current playerY

  /**
   * Registers a callback to fetch the latest velocity.
   * @param callback - Function to fetch current velocity.
   */
  registerVelocityCallback(callback: () => number): void {
    this.getVelocityCallback = callback;
  }

  /**
   * Registers a callback to fetch the current playerY position.
   * @param callback - Function to fetch current playerY.
   */
  registerPlayerYCallback(callback: () => number): void {
    this.getPlayerYCallback = callback;
  }

  /**
   * Spawns a new dot based on the player's position and velocity.
   */
  spawnDot(): void {
    const velocity = this.getVelocityCallback ? this.getVelocityCallback() : 0;
    const playerY = this.getPlayerYCallback ? this.getPlayerYCallback() : 0;

    if (playerY > 100 && velocity !== 0) {
      const x = Math.random() * window.innerWidth;
      const y = velocity > 0 ? 0 : window.innerHeight;
      this.dots.push({ x, y });
    }
  }

  /**
   * Updates the position of dots based on velocity.
   */
  updateDots(): void {
    const velocity = this.getVelocityCallback ? this.getVelocityCallback() : 0;

    this.dots = this.dots.map((dot) => ({
      ...dot,
      y: dot.y + velocity,
    }));

    // Remove dots that move off the screen (below the viewport)
    this.dots = this.dots.filter((dot) => dot.y < window.innerHeight + 100);
  }

  /**
   * Starts spawning dots at random intervals.
   */
  startDotSpawner(): void {
    this.stopDotSpawner(); // Ensure no duplicate intervals
    const spawnDotInterval = () => {
      this.spawnDot();
      const randomDelay = Math.random() * 300 + 100; // Random spawn interval
      this.spawnInterval = setTimeout(spawnDotInterval, randomDelay);
    };
    spawnDotInterval();
  }

  /**
   * Stops spawning dots.
   */
  stopDotSpawner(): void {
    if (this.spawnInterval) {
      clearTimeout(this.spawnInterval);
      this.spawnInterval = null;
    }
  }

  /**
   * Clears all existing dots.
   */
  clearDots(): void {
    this.dots = [];
  }
}
