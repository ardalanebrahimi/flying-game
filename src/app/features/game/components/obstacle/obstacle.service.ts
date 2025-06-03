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
    this.stopObstacleLifecycle(); // Ensure clean start
    this.currentHeight = 0; // Reset height tracking
    this.startObstacleMovement(velocityCallback);
    this.startObstacleSpawner(stageCallback, velocityCallback, heightCallback);
  }

  stopObstacleLifecycle(): void {
    if (this.obstacleMovementInterval) {
      clearInterval(this.obstacleMovementInterval);
      this.obstacleMovementInterval = null;
    }
    if (this.obstacleSpawnerTimeout) {
      clearTimeout(this.obstacleSpawnerTimeout);
      this.obstacleSpawnerTimeout = null;
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
          const baseDelay = this.getRandomNumber(config.spawnRateRange);
          let heightFactor;

          if (currentStage === 'Infinite Space') {
            // More aggressive spawn rate in infinite space
            heightFactor = Math.max(
              0.6, // Allow for even shorter delays
              1 - Math.log(1 + this.currentHeight / 12000) * 0.4 // Faster reduction
            );
          } else {
            // Normal spawn rate adjustment for other stages
            heightFactor = Math.max(
              0.75,
              1 - Math.log(1 + this.currentHeight / 15000) * 0.3
            );
          }

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

    // Calculate speed multiplier based on height and stage
    let heightMultiplier;
    if (stage === 'Infinite Space') {
      // More aggressive scaling in infinite space
      heightMultiplier = 1 + Math.log(1 + this.currentHeight / 5000) * 0.4;
    } else {
      // Normal scaling for other stages
      heightMultiplier = 1 + Math.log(1 + this.currentHeight / 7000) * 0.25;
    }

    const baseSpeed = this.getRandomNumber(typeConfig.speedRange);
    const speed = baseSpeed * heightMultiplier;

    // Keep minimum size larger in infinite space
    const minSize = stage === 'Infinite Space' ? 30 : 25;
    const sizeMultiplier =
      stage === 'Infinite Space'
        ? Math.pow(0.98, this.currentHeight / 15000) // Slower size reduction
        : Math.pow(0.97, this.currentHeight / 12000);

    const obstacle: Obstacle = {
      x: Math.random() * window.innerWidth,
      y: 0,
      type: typeConfig.type,
      image,
      size: Math.max(minSize, size * sizeMultiplier),
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
    this.currentHeight = 0;
  }

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getRandomNumber(range: [number, number]): number {
    return range[0] + Math.random() * (range[1] - range[0]);
  }
}
