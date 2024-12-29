import { Injectable } from '@angular/core';
import { Obstacle } from '../../../../core/models/obstacle.model';
import { OBSTACLE_CONFIG } from '../../../../core/config/obstacle-config';

@Injectable({
  providedIn: 'root',
})
export class ObstacleService {
  obstacles: Obstacle[] = [];
  private obstacleMovementInterval: any;
  private obstacleSpawnerTimeout: any;

  startObstacleLifecycle(
    stageCallback: () => string,
    velocityCallback: () => number
  ): void {
    this.startObstacleMovement(velocityCallback);
    this.startObstacleSpawner(stageCallback, velocityCallback);
  }

  stopObstacleLifecycle(): void {
    if (this.obstacleMovementInterval) {
      clearInterval(this.obstacleMovementInterval);
    }
    if (this.obstacleSpawnerTimeout) {
      clearTimeout(this.obstacleSpawnerTimeout);
    }
  }

  private startObstacleSpawner(
    stageCallback: () => string,
    velocityCallback: () => number
  ): void {
    const spawnObstacleInterval = () => {
      let delay = 1000; // Default 1-second delay
      if (velocityCallback() !== 0) {
        const currentStage = stageCallback();
        const config = OBSTACLE_CONFIG[currentStage];
        if (!config) return;

        const delay = this.getRandomNumber(config.spawnRateRange);
        this.spawnObstacle(currentStage);
      }
      this.obstacleSpawnerTimeout = setTimeout(spawnObstacleInterval, delay);
    };

    spawnObstacleInterval();
  }

  private startObstacleMovement(velocityCallback: () => number): void {
    this.obstacleMovementInterval = setInterval(() => {
      if (velocityCallback() !== 0) {
        this.moveObstacles();
      }
    }, 50); // Adjust movement speed
  }
  private spawnObstacle(stage: string): void {
    const config = OBSTACLE_CONFIG[stage];
    if (!config) return;

    const typeConfig = this.getRandomElement(config.types);
    const image = this.getRandomElement(typeConfig.imagePool || []);
    const size =
      typeConfig.size || this.getRandomNumber(typeConfig.sizeRange || [50, 50]);
    const speed = this.getRandomNumber(typeConfig.speedRange);

    const obstacle: Obstacle = {
      x: Math.random() * window.innerWidth,
      y: 0,
      type: typeConfig.type,
      image,
      size,
      speed,
    };

    this.obstacles.push(obstacle);
  }

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getRandomNumber(range: [number, number]): number {
    const [min, max] = range;
    return Math.random() * (max - min) + min;
  }

  moveObstacles(): void {
    this.obstacles = this.obstacles.map((obstacle) => ({
      ...obstacle,
      y: obstacle.y + obstacle.speed, // Use obstacle's individual speed
    }));

    // Remove obstacles that move off-screen
    this.obstacles = this.obstacles.filter(
      (obstacle) => obstacle.y < window.innerHeight + 100
    );
  }

  clearObstacles(): void {
    this.obstacles = [];
  }

  private createObstacle(
    x: number,
    y: number,
    type: string,
    image: string,
    size: number,
    speed: number
  ): Obstacle {
    return {
      x,
      y,
      type,
      image,
      size,
      speed,
    };
  }
}
