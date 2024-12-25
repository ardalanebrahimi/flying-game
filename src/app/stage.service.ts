import { Injectable } from '@angular/core';

interface Stage {
  name: string;
  gravity: number;
  maxSpeed: number;
  deceleration: number;
  background: string;
  heightRange: [number, number];
}

@Injectable({ providedIn: 'root' })
export class StageService {
  private stages: Stage[] = [
    {
      name: 'Earth’s Surface',
      gravity: -2,
      maxSpeed: 5,
      deceleration: -1, // Simulate air resistance
      background: 'linear-gradient(to bottom, #87ceeb, #4682b4)',
      heightRange: [0, 10],
    },
    {
      name: 'Sky',
      gravity: -1,
      maxSpeed: 15,
      deceleration: -0.5, // Lighter air resistance
      background: 'linear-gradient(to bottom, #4682b4, #000000)',
      heightRange: [10, 100],
    },
    {
      name: 'Outer Space',
      gravity: 0,
      deceleration: -0.2, // Deceleration in zero gravity
      maxSpeed: 100,
      background: 'linear-gradient(to bottom, #000000, #1a1a1a)',
      heightRange: [100, 1500000],
    },

    {
      name: 'Deep Space',
      gravity: 0,
      maxSpeed: 150,
      deceleration: -0.1, // Minimal deceleration in deep space
      background: 'linear-gradient(to bottom, #1a1a1a, #3a3a3a)',
      heightRange: [1500000, Infinity],
    },
  ];

  private currentStage: Stage = this.stages[0];

  getStageForHeight(height: number): Stage {
    const stage = this.stages.find(
      (stage) => height >= stage.heightRange[0] && height < stage.heightRange[1]
    );
    if (stage) {
      this.currentStage = stage;
    }
    return this.currentStage;
  }
}
