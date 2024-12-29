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
    speed: number;
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
    let speed = 1; // Default speed

    switch (stage) {
      case 'Earth’s Surface':
        type = 'tree';
        image = '/obstacles/tree.png';
        speed = Math.random() * 2 + 1; // Random speed between 1 and 3
        break;
      case 'Sky':
        type = 'ice';
        image = '/obstacles/ice.png';
        speed = Math.random() * 3 + 2; // Random speed between 2 and 5
        break;
      case 'Outer Space':
        type = 'planet';
        image = this.planets[Math.floor(Math.random() * this.planets.length)];
        speed = Math.random() * 5 + 3; // Random speed between 3 and 8
        break;
      case 'Deep Space':
        type = 'star';
        image = '/obstacles/star.png';
        speed = Math.random() * 8 + 5; // Random speed between 5 and 13
        break;
    }

    if (type && image) {
      const size = type === 'planet' ? Math.random() * 50 + 50 : 50; // Random size for planets
      this.obstacles.push({ x, y, type, image, size, speed });
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
}
