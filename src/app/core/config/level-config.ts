import { Stage } from '../models/stage.model';
import { ObstacleType } from './obstacle-config';

export interface LevelConfig {
  id: number;
  name: string;
  theme: string;
  backgroundColor: string;
  obstacles: Record<string, StageObstacleConfig>;
  stages: Stage[];
  availableSkins: string[];
  goalHeight: number;
}

export interface StageObstacleConfig {
  types: ObstacleType[];
  spawnRateRange: [number, number];
}

// Level 1: Current behavior (space, planets, stars)
export const LEVEL_1_CONFIG: LevelConfig = {
  id: 1,
  name: 'Space Explorer',
  theme: 'space',
  backgroundColor: '#87ceeb',
  obstacles: {
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
          speedRange: [2, 4],
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
          speedRange: [2, 5],
        },
      ],
      spawnRateRange: [500, 1200],
    },
    Mesosphere: {
      types: [
        {
          type: 'ice',
          imagePool: ['/obstacles/ice.png'],
          sizeRange: [25, 40],
          speedRange: [3, 6],
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
          speedRange: [3, 7],
        },
        {
          type: 'star',
          imagePool: ['/obstacles/star.png'],
          sizeRange: [20, 30],
          speedRange: [4, 8],
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
          speedRange: [3, 7],
        },
        {
          type: 'star',
          imagePool: ['/obstacles/star.png'],
          sizeRange: [20, 30],
          speedRange: [4, 8],
        },
      ],
      spawnRateRange: [250, 700],
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
          sizeRange: [30, 50],
          speedRange: [3, 7],
        },
        {
          type: 'star',
          imagePool: ['/obstacles/star.png'],
          sizeRange: [20, 30],
          speedRange: [4, 8],
        },
      ],
      spawnRateRange: [300, 800],
    },
  },
  stages: [
    {
      name: "Earth's Surface",
      gravity: -2,
      maxSpeed: 5,
      deceleration: -1,
      background: 'linear-gradient(to bottom, #87ceeb, #4682b4)',
      heightRange: [0, 100],
    },
    {
      name: 'Sky',
      gravity: -1.5,
      maxSpeed: 15,
      deceleration: -0.8,
      background: 'linear-gradient(to bottom, #4682b4, #000033)',
      heightRange: [100, 500],
    },
    {
      name: 'Stratosphere',
      gravity: -1,
      maxSpeed: 30,
      deceleration: -0.6,
      background: 'linear-gradient(to bottom, #000033, #000066)',
      heightRange: [500, 1000],
    },
    {
      name: 'Mesosphere',
      gravity: -0.5,
      maxSpeed: 50,
      deceleration: -0.4,
      background: 'linear-gradient(to bottom, #000066, #000099)',
      heightRange: [1000, 2000],
    },
    {
      name: 'Outer Space',
      gravity: 0,
      maxSpeed: 100,
      deceleration: -0.2,
      background: 'linear-gradient(to bottom, #000099, #1a1a1a)',
      heightRange: [2000, 5000],
    },
    {
      name: 'Deep Space',
      gravity: 0,
      maxSpeed: 120,
      deceleration: -0.15,
      background: 'linear-gradient(to bottom, #1a1a1a, #3a3a3a)',
      heightRange: [5000, 10000],
    },
    {
      name: 'Infinite Space',
      gravity: 0,
      maxSpeed: 150,
      deceleration: -0.1,
      background: 'linear-gradient(to bottom, #3a3a3a, #000000)',
      heightRange: [10000, Infinity],
    },
  ],
  availableSkins: [
    '/skins/rocket.png',
    '/skins/rocket1.png',
    '/skins/tree2.png',
    '/skins/lightening.png',
    '/skins/o-man.png',
    '/skins/tree-man.png',
    '/skins/red-man.png',
  ],
  goalHeight: 100000,
};

// Level 2: Food theme with different skins and harder difficulty
export const LEVEL_2_CONFIG: LevelConfig = {
  id: 2,
  name: 'Food Fighter',
  theme: 'food',
  backgroundColor: '#ffeb3b',
  obstacles: {
    'Kitchen Floor': {
      types: [
        {
          type: 'apple',
          imagePool: ['/obstacles/foods/apple.png'],
          sizeRange: [45, 65],
          speedRange: [2, 4],
        },
        {
          type: 'orange',
          imagePool: ['/obstacles/foods/orange.png'],
          sizeRange: [40, 60],
          speedRange: [2, 4],
        },
      ],
      spawnRateRange: [600, 1500],
    },
    'Counter Top': {
      types: [
        {
          type: 'salad',
          imagePool: ['/obstacles/foods/salad.png'],
          sizeRange: [35, 55],
          speedRange: [3, 5],
        },
        {
          type: 'watermelon',
          imagePool: ['/obstacles/foods/watermelon.png'],
          sizeRange: [50, 70],
          speedRange: [2, 4],
        },
      ],
      spawnRateRange: [500, 1200],
    },
    'Pantry Shelf': {
      types: [
        {
          type: 'mentos',
          imagePool: ['/obstacles/foods/mentos.png'],
          sizeRange: [30, 50],
          speedRange: [3, 6],
        },
        {
          type: 'tic-tac',
          imagePool: ['/obstacles/foods/tic-tac.png'],
          sizeRange: [25, 45],
          speedRange: [4, 6],
        },
      ],
      spawnRateRange: [400, 1000],
    },
    Refrigerator: {
      types: [
        {
          type: 'chicken-banana',
          imagePool: ['/obstacles/foods/chicken-banana.png'],
          sizeRange: [30, 45],
          speedRange: [4, 7],
        },
      ],
      spawnRateRange: [300, 800],
    },
    'Oven Space': {
      types: [
        {
          type: 'donut',
          imagePool: ['/obstacles/foods/donut.png'],
          sizeRange: [35, 55],
          speedRange: [4, 8],
        },
        {
          type: 'loli',
          imagePool: ['/obstacles/foods/loli.png'],
          sizeRange: [25, 35],
          speedRange: [5, 9],
        },
      ],
      spawnRateRange: [250, 600],
    },
    'Steam Zone': {
      types: [
        {
          type: 'donut',
          imagePool: ['/obstacles/foods/donut.png'],
          sizeRange: [35, 50],
          speedRange: [4, 8],
        },
        {
          type: 'apple',
          imagePool: ['/obstacles/foods/apple.png'],
          sizeRange: [30, 45],
          speedRange: [5, 9],
        },
        {
          type: 'orange',
          imagePool: ['/obstacles/foods/orange.png'],
          sizeRange: [30, 45],
          speedRange: [5, 9],
        },
      ],
      spawnRateRange: [200, 500],
    },
    'Food Heaven': {
      types: [
        {
          type: 'watermelon',
          imagePool: ['/obstacles/foods/watermelon.png'],
          sizeRange: [35, 55],
          speedRange: [4, 9],
        },
        {
          type: 'loli',
          imagePool: ['/obstacles/foods/loli.png'],
          sizeRange: [25, 35],
          speedRange: [5, 10],
        },
        {
          type: 'donut',
          imagePool: ['/obstacles/foods/donut.png'],
          sizeRange: [30, 45],
          speedRange: [5, 10],
        },
      ],
      spawnRateRange: [200, 500],
    },
  },
  stages: [
    {
      name: 'Kitchen Floor',
      gravity: -2.2,
      maxSpeed: 6,
      deceleration: -1.1,
      background: 'linear-gradient(to bottom, #ffeb3b, #ffc107)',
      heightRange: [0, 100],
    },
    {
      name: 'Counter Top',
      gravity: -1.7,
      maxSpeed: 18,
      deceleration: -0.9,
      background: 'linear-gradient(to bottom, #ffc107, #ff9800)',
      heightRange: [100, 500],
    },
    {
      name: 'Pantry Shelf',
      gravity: -1.2,
      maxSpeed: 35,
      deceleration: -0.7,
      background: 'linear-gradient(to bottom, #ff9800, #ff5722)',
      heightRange: [500, 1000],
    },
    {
      name: 'Refrigerator',
      gravity: -0.7,
      maxSpeed: 55,
      deceleration: -0.5,
      background: 'linear-gradient(to bottom, #ff5722, #e91e63)',
      heightRange: [1000, 2000],
    },
    {
      name: 'Oven Space',
      gravity: 0,
      maxSpeed: 110,
      deceleration: -0.3,
      background: 'linear-gradient(to bottom, #e91e63, #9c27b0)',
      heightRange: [2000, 5000],
    },
    {
      name: 'Steam Zone',
      gravity: 0,
      maxSpeed: 135,
      deceleration: -0.2,
      background: 'linear-gradient(to bottom, #9c27b0, #673ab7)',
      heightRange: [5000, 10000],
    },
    {
      name: 'Food Heaven',
      gravity: 0,
      maxSpeed: 170,
      deceleration: -0.12,
      background: 'linear-gradient(to bottom, #673ab7, #3f51b5)',
      heightRange: [10000, Infinity],
    },
  ],
  availableSkins: [
    '/skins/rocket.png',
    '/skins/rocket1.png',
    '/skins/tree2.png',
    '/skins/lightening.png',
  ],
  goalHeight: 15000,
};

// Export all available levels
export const AVAILABLE_LEVELS: LevelConfig[] = [LEVEL_1_CONFIG, LEVEL_2_CONFIG];

export function getLevelById(id: number): LevelConfig | undefined {
  return AVAILABLE_LEVELS.find((level) => level.id === id);
}

export function getUnlockedLevels(): number[] {
  const unlockedLevels = JSON.parse(
    localStorage.getItem('unlockedLevels') || '[1]'
  );
  return unlockedLevels;
}

export function unlockLevel(levelId: number): void {
  const unlockedLevels = getUnlockedLevels();
  if (!unlockedLevels.includes(levelId)) {
    unlockedLevels.push(levelId);
    localStorage.setItem('unlockedLevels', JSON.stringify(unlockedLevels));
  }
}

export function getCurrentLevel(): LevelConfig {
  const selectedLevelId = JSON.parse(
    localStorage.getItem('selectedLevel') || '1'
  );
  return getLevelById(selectedLevelId) || LEVEL_1_CONFIG;
}

export function setSelectedLevel(levelId: number): void {
  localStorage.setItem('selectedLevel', JSON.stringify(levelId));
}
