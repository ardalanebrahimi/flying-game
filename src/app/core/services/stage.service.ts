import { Injectable } from '@angular/core';
import { Stage } from '../models/stage.model';

@Injectable({
  providedIn: 'root',
})
export class StageService {
  private stages: Stage[] = [
    {
      name: 'Earth’s Surface',
      gravity: -2,
      maxSpeed: 5,
      deceleration: -1, // Simulate air resistance
      background: 'linear-gradient(to bottom, #87ceeb, #4682b4)',
      heightRange: [0, 100],
    },
    {
      name: 'Sky',
      gravity: -1,
      maxSpeed: 15,
      deceleration: -0.5, // Lighter air resistance
      background: 'linear-gradient(to bottom, #4682b4, #000000)',
      heightRange: [100, 1000],
    },
    {
      name: 'Outer Space',
      gravity: 0,
      deceleration: -0.2, // Deceleration in zero gravity
      maxSpeed: 100,
      background: 'linear-gradient(to bottom, #000000, #1a1a1a)',
      heightRange: [1000, 8000],
    },
    {
      name: 'Deep Space',
      gravity: 0,
      maxSpeed: 150,
      deceleration: -0.1, // Minimal deceleration in deep space
      background: 'linear-gradient(to bottom, #1a1a1a, #3a3a3a)',
      heightRange: [8000, Infinity],
    },
  ];

  private currentStage: Stage = this.stages[0];

  /**
   * Retrieves the stage corresponding to the given height.
   * @param height - The current height of the rocket.
   * @returns The stage corresponding to the height.
   */
  getStageForHeight(height: number): Stage {
    const stage = this.stages.find(
      (stage) => height >= stage.heightRange[0] && height < stage.heightRange[1]
    );

    if (stage && stage !== this.currentStage) {
      this.currentStage = stage;
    }

    return this.currentStage;
  }

  /**
   * Gets the current stage.
   * @returns The current stage.
   */
  getCurrentStage(): Stage {
    return this.currentStage;
  }

  /**
   * Retrieves all available stages.
   * @returns An array of all stages.
   */
  getAllStages(): Stage[] {
    return this.stages;
  }

  /**
   * Resets the current stage to the default (Earth's Surface).
   */
  resetStage(): void {
    this.currentStage = this.stages[0];
  }
}
