export interface ObstacleType {
  type: string;
  imagePool: string[];
  size?: number;
  sizeRange?: [number, number];
  speedRange: [number, number];
}

export interface StageObstacleConfig {
  types: ObstacleType[];
  spawnRateRange: [number, number];
}

export const OBSTACLE_CONFIG: Record<string, StageObstacleConfig> = {
  "Earth's Surface": {
    types: [
      {
        type: 'tree',
        imagePool: ['/obstacles/tree.png'],
        sizeRange: [40, 60],
        speedRange: [1, 3],
      },
    ],
    spawnRateRange: [800, 2000],
  },
  Sky: {
    types: [
      {
        type: 'ice',
        imagePool: ['/obstacles/ice.png'],
        sizeRange: [30, 50],
        speedRange: [2, 4], // Slightly reduced max speed
      },
    ],
    spawnRateRange: [600, 1500],
  },
  Stratosphere: {
    types: [
      {
        type: 'ice',
        imagePool: ['/obstacles/ice.png'],
        sizeRange: [25, 45],
        speedRange: [2, 5], // Reduced speed range
      },
      {
        type: 'planet',
        imagePool: ['/obstacles/moon.png'],
        sizeRange: [40, 60],
        speedRange: [2, 4],
      },
    ],
    spawnRateRange: [500, 1200],
  },
  Mesosphere: {
    types: [
      {
        type: 'planet',
        imagePool: ['/obstacles/earth.png', '/obstacles/moon.png'],
        sizeRange: [35, 55],
        speedRange: [3, 6], // Reduced speed range
      },
    ],
    spawnRateRange: [400, 1000],
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
        sizeRange: [30, 50],
        speedRange: [3, 7], // Significantly reduced speed range
      },
      {
        type: 'star',
        imagePool: ['/obstacles/star.png'],
        sizeRange: [20, 30],
        speedRange: [4, 8], // Significantly reduced speed range
      },
    ],
    spawnRateRange: [300, 800],
  },
  'Deep Space': {
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
        sizeRange: [30, 45],
        speedRange: [4, 8], // Significantly reduced from [7, 12]
      },
      {
        type: 'star',
        imagePool: ['/obstacles/star.png'],
        sizeRange: [20, 30],
        speedRange: [5, 9], // Significantly reduced from [10, 15]
      },
    ],
    spawnRateRange: [300, 800], // Increased minimum delay
  },
  'Infinite Space': {
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
        sizeRange: [25, 40],
        speedRange: [5, 9], // Significantly reduced from [10, 15]
      },
      {
        type: 'star',
        imagePool: ['/obstacles/star.png'],
        sizeRange: [15, 25],
        speedRange: [6, 10], // Significantly reduced from [12, 18]
      },
    ],
    spawnRateRange: [250, 700], // Increased delays
  },
};
