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
  private currentHeight = 0;

  startObstacleLifecycle(
    stageCallback: () => string,
    velocityCallback: () => number,
    heightCallback: () => number
  ): void {
    this.startObstacleMovement(velocityCallback);
    this.startObstacleSpawner(stageCallback, velocityCallback, heightCallback);
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
    velocityCallback: () => number,
    heightCallback: () => number
  ): void {
    const spawnObstacleInterval = () => {
      let delay = 1000; // Default delay

      if (velocityCallback() !== 0) {
        const currentStage = stageCallback();
        this.currentHeight = heightCallback();
        const config = OBSTACLE_CONFIG[currentStage];

        if (config) {
          // Make spawn rate decrease more gradually
          const baseDelay = this.getRandomNumber(config.spawnRateRange);
          const heightFactor = Math.max(0.7, 1 - this.currentHeight / 50000); // More gradual decrease to 70% of base delay
          delay = baseDelay * heightFactor;

          this.spawnObstacle(currentStage);
        }
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
    }, 50);
  }
  private spawnObstacle(stage: string): void {
    const config = OBSTACLE_CONFIG[stage];
    if (!config) return;

    const typeConfig = this.getRandomElement(config.types);
    const image = this.getRandomElement(typeConfig.imagePool || []);
    const size =
      typeConfig.size || this.getRandomNumber(typeConfig.sizeRange || [50, 50]);

    // Make speed increase more gradually
    const baseSpeed = this.getRandomNumber(typeConfig.speedRange);
    const heightMultiplier = 1 + this.currentHeight / 20000; // Slower speed increase
    const speed = baseSpeed * heightMultiplier;

    const obstacle: Obstacle = {
      x: Math.random() * window.innerWidth,
      y: 0,
      type: typeConfig.type,
      image,
      // Make size decrease more gradually and keep a larger minimum size
      size: Math.max(20, size * Math.pow(0.95, this.currentHeight / 10000)),
      speed,
    };

    this.obstacles.push(obstacle);
  }

  moveObstacles(): void {
    this.obstacles = this.obstacles.filter((obstacle) => {
      obstacle.y += obstacle.speed;
      return obstacle.y <= window.innerHeight;
    });
  }

  clearObstacles(): void {
    this.obstacles = [];
  }

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getRandomNumber(range: [number, number]): number {
    return range[0] + Math.random() * (range[1] - range[0]);
  }
}
