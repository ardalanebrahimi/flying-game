export interface StageObstacleConfig {
  types: {
    type: string;
    imagePool?: string[];
    size?: number;
    sizeRange?: [number, number];
    speedRange: [number, number];
  }[];
  spawnRateRange: [number, number];
}

export const OBSTACLE_CONFIG: Record<string, StageObstacleConfig> = {
  'Earth’s Surface': {
    types: [
      {
        type: 'tree',
        imagePool: ['/obstacles/tree.png'],
        size: 50,
        speedRange: [1, 3],
      },
    ],
    spawnRateRange: [500, 2000],
  },
  Sky: {
    types: [
      {
        type: 'ice',
        imagePool: ['/obstacles/ice.png'],
        size: 50,
        speedRange: [2, 5],
      },
    ],
    spawnRateRange: [300, 1000],
  },
  'Outer Space': {
    types: [
      {
        type: 'planet',
        imagePool: [
          '/obstacles/earth.png',
          '/obstacles/moon.png',
          '/obstacles/sun.png',
          '/obstacles/mars.png',
          '/obstacles/jupiter.png',
          '/obstacles/neptune.png',
          '/obstacles/uranus.png',
          '/obstacles/grassplanet.png',
        ],
        sizeRange: [50, 100],
        speedRange: [3, 8],
      },
    ],
    spawnRateRange: [200, 500],
  },
  'Deep Space': {
    types: [
      {
        type: 'star',
        imagePool: ['/obstacles/star.png'],
        size: 50,
        speedRange: [5, 13],
      },
    ],
    spawnRateRange: [100, 400],
  },
};
