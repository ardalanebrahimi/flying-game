import { Injectable } from '@angular/core';
import { Obstacle } from '../../../../core/models/obstacle.model';

@Injectable({
  providedIn: 'root',
})
export class ObstacleService {
  obstacles: Obstacle[] = [];
  private obstacleMovementInterval: any;
  private obstacleSpawnerTimeout: any;

  private planets = [
    '/obstacles/earth.png',
    '/obstacles/moon.png',
    '/obstacles/sun.png',
    '/obstacles/mars.png',
    '/obstacles/jupiter.png',
    '/obstacles/neptune.png',
    '/obstacles/uranus.png',
    '/obstacles/grassplanet.png',
  ];

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

        // Adjust spawn frequency based on stage
        let delay = 1000; // Default 1-second delay
        switch (currentStage) {
          case 'Earth’s Surface':
            delay = Math.random() * 2000 + 500; // Less frequent
            break;
          case 'Sky':
            delay = Math.random() * 1000 + 300; // Moderate frequency
            break;
          case 'Outer Space':
            delay = Math.random() * 500 + 200; // High frequency
            break;
          case 'Deep Space':
            delay = Math.random() * 400 + 100; // Very high frequency
            break;
        }

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
    const x = Math.random() * window.innerWidth; // Random X position
    const y = 0; // Start at the top edge

    let obstacle: Obstacle | null = null;

    switch (stage) {
      case 'Earth’s Surface':
        obstacle = this.createObstacle(
          x,
          y,
          'tree',
          '/obstacles/tree.png',
          50,
          Math.random() * 2 + 1
        );
        break;
      case 'Sky':
        obstacle = this.createObstacle(
          x,
          y,
          'ice',
          '/obstacles/ice.png',
          50,
          Math.random() * 3 + 2
        );
        break;
      case 'Outer Space':
        const planetImage =
          this.planets[Math.floor(Math.random() * this.planets.length)];
        obstacle = this.createObstacle(
          x,
          y,
          'planet',
          planetImage,
          Math.random() * 50 + 50,
          Math.random() * 5 + 3
        );
        break;
      case 'Deep Space':
        obstacle = this.createObstacle(
          x,
          y,
          'star',
          '/obstacles/star.png',
          50,
          Math.random() * 8 + 5
        );
        break;
    }

    if (obstacle) {
      this.obstacles.push(obstacle);
    }
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
