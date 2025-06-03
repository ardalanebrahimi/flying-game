import { Injectable } from '@angular/core';

interface Heart {
  x: number;
  y: number;
  speed: number;
  size: number;
}

@Injectable({
  providedIn: 'root',
})
export class HeartService {
  hearts: Heart[] = [];
  private heartMovementInterval: any;
  private heartSpawnerTimeout: any;
  private lastSpawnHeight = 0;
  private readonly HEART_SPAWN_INTERVAL = 15000; // Spawn heart every 15 seconds
  private readonly MIN_HEIGHT_DIFFERENCE = 1000; // Minimum height difference between spawns

  startHeartLifecycle(
    velocityCallback: () => number,
    heightCallback: () => number,
    livesCallback: () => number
  ): void {
    this.stopHeartLifecycle();
    this.startHeartMovement(velocityCallback);
    this.startHeartSpawner(velocityCallback, heightCallback, livesCallback);
  }

  stopHeartLifecycle(): void {
    if (this.heartMovementInterval) {
      clearInterval(this.heartMovementInterval);
      this.heartMovementInterval = null;
    }
    if (this.heartSpawnerTimeout) {
      clearTimeout(this.heartSpawnerTimeout);
      this.heartSpawnerTimeout = null;
    }
  }

  private startHeartMovement(velocityCallback: () => number): void {
    this.heartMovementInterval = setInterval(() => {
      if (velocityCallback() !== 0) {
        this.moveHearts();
      }
    }, 50);
  }
  private startHeartSpawner(
    velocityCallback: () => number,
    heightCallback: () => number,
    livesCallback: () => number
  ): void {
    const spawnHeartInterval = () => {
      const currentHeight = heightCallback();
      const lives = livesCallback();

      // Only spawn if:
      // 1. Player is moving
      // 2. Player has lost hearts
      // 3. We either haven't spawned a heart yet, or we've moved up enough since last spawn
      // 4. There isn't already a heart on screen
      if (
        velocityCallback() !== 0 &&
        lives < 3 &&
        this.hearts.length === 0 &&
        (this.lastSpawnHeight === 0 ||
          currentHeight - this.lastSpawnHeight >= this.MIN_HEIGHT_DIFFERENCE)
      ) {
        this.spawnHeart();
      }

      this.heartSpawnerTimeout = setTimeout(
        spawnHeartInterval,
        this.HEART_SPAWN_INTERVAL
      );
    };

    spawnHeartInterval();
  }

  private spawnHeart(): void {
    const heart: Heart = {
      x: Math.random() * window.innerWidth,
      y: 0,
      speed: 3,
      size: 30,
    };

    this.hearts.push(heart);
  }

  moveHearts(): void {
    this.hearts = this.hearts.filter((heart) => {
      heart.y += heart.speed;
      return heart.y <= window.innerHeight;
    });
  }

  updateLastSpawnHeight(height: number): void {
    this.lastSpawnHeight = height;
  }

  clearHearts(): void {
    this.hearts = [];
    this.lastSpawnHeight = 0;
  }
}
