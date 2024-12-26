import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ObstacleService {
  obstacles: { x: number; y: number; type: string }[] = [];

  spawnObstacle(stage: string): void {
    const x = Math.random() * window.innerWidth; // Random X position
    const y = 0; // Start at the top edge

    // Determine obstacle type based on stage
    let type = '';
    switch (stage) {
      case 'Earth’s Surface':
        type = 'tree';
        break;
      case 'Sky':
        type = 'volcano';
        break;
      case 'Outer Space':
        type = 'planet';
        break;
      case 'Deep Space':
        type = 'star';
        break;
    }

    this.obstacles.push({ x, y, type });
  }

  moveObstacles(stageSpeed: number): void {
    const obstacleSpeed = Math.min(stageSpeed, 10); // Cap speed to 10 for visibility
    this.obstacles = this.obstacles.map((obstacle) => ({
      ...obstacle,
      y: obstacle.y + obstacleSpeed,
    }));

    this.obstacles = this.obstacles.filter(
      (obstacle) => obstacle.y < window.innerHeight + 100
    );
  }

  clearObstacles(): void {
    this.obstacles = [];
  }
}
