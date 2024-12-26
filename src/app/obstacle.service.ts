import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ObstacleService {
  obstacles: {
    x: number;
    y: number;
    type: string;
    image: string;
    size: number;
  }[] = [];
  planets = [
    '/obstacles/earth.png',
    '/obstacles/moon.png',
    '/obstacles/sun.png',
    '/obstacles/mars.png',
    '/obstacles/jupiter.png',
    '/obstacles/neptune.png',
    '/obstacles/uranus.png',
    '/obstacles/grassplanet.png',
  ];

  spawnObstacle(stage: string): void {
    const x = Math.random() * window.innerWidth; // Random X position
    const y = 0; // Start at the top edge

    let type = '';
    let image = ''; // Path to obstacle image
    switch (stage) {
      case 'Earth Surface':
        type = 'tree';
        image = '/obstacles/tree.png';
        break;
      case 'Sky':
        type = 'ice';
        image = '/obstacles/ice.png';
        break;
      case 'Outer Space':
        type = 'planet';
        image = this.planets[Math.floor(Math.random() * this.planets.length)]; // Random planet
        break;
      case 'Deep Space':
        type = 'star';
        image = '/obstacles/star.png';
        break;
    }

    if (type && image) {
      const size = type === 'planet' ? Math.random() * 50 + 50 : 50; // Random size for planets
      this.obstacles.push({ x, y, type, image, size });
    }
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
