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
          // Even more gradual spawn rate adjustment
          const baseDelay = this.getRandomNumber(config.spawnRateRange);
          const heightFactor = Math.max(
            0.75,
            1 - Math.log(1 + this.currentHeight / 15000) * 0.3
          ); // More gradual decrease with minimum 75% delay
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
      typeConfig.size || this.getRandomNumber(typeConfig.sizeRange || [50, 50]); // Scale speed based on height with a gentler logarithmic curve
    const baseSpeed = this.getRandomNumber(typeConfig.speedRange);
    const heightMultiplier = 1 + Math.log(1 + this.currentHeight / 7000) * 0.25; // Even gentler speed progression
    const speed = baseSpeed * heightMultiplier;

    const obstacle: Obstacle = {
      x: Math.random() * window.innerWidth,
      y: 0,
      type: typeConfig.type,
      image,
      // Keep objects slightly larger and decrease size even more gradually
      size: Math.max(25, size * Math.pow(0.97, this.currentHeight / 12000)),
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
