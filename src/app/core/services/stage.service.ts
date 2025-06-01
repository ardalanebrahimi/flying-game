import { Injectable } from '@angular/core';
import { Stage } from '../models/stage.model';

@Injectable({
  providedIn: 'root',
})
export class StageService {
  private stages: Stage[] = [
    {
      name: "Earth's Surface",
      gravity: -2,
      maxSpeed: 5,
      deceleration: -1, // Simulate air resistance
      background: 'linear-gradient(to bottom, #87ceeb, #4682b4)',
      heightRange: [0, 100],
    },
    {
      name: 'Sky',
      gravity: -1.5,
      maxSpeed: 15,
      deceleration: -0.8, // Lighter air resistance
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
      maxSpeed: 150,
      deceleration: -0.1,
      background: 'linear-gradient(to bottom, #1a1a1a, #3a3a3a)',
      heightRange: [5000, 10000],
    },
    {
      name: 'Infinite Space',
      gravity: 0,
      maxSpeed: 200,
      deceleration: -0.05,
      background: 'linear-gradient(to bottom, #3a3a3a, #000000)',
      heightRange: [10000, Infinity],
    },
  ];

  private currentStage: Stage = this.stages[0];

  /**
   * Retrieves the stage corresponding to the given height.
   * @param height - The current height of the rocket.
   * @returns The stage corresponding to the height.
   */
  getStageForHeight(height: number): Stage {
    // Find the base stage for the current height
    const stage = this.stages.find(
      (stage) => height >= stage.heightRange[0] && height < stage.heightRange[1]
    );

    if (!stage) return this.currentStage;

    // Create a dynamic stage that scales difficulty with height
    const dynamicStage: Stage = { ...stage };

    // Increase maxSpeed based on height within the stage
    const heightProgress =
      (height - stage.heightRange[0]) /
      (stage.heightRange[1] - stage.heightRange[0]);
    const speedIncrease = heightProgress * (stage.maxSpeed * 0.5); // Up to 50% faster within stage
    dynamicStage.maxSpeed += speedIncrease;

    // For infinite space, continue increasing difficulty
    if (stage.name === 'Infinite Space') {
      const extraHeight = Math.max(0, height - 10000);
      const extraSpeedBoost = Math.min(extraHeight / 1000, 100); // Add up to 100 more speed
      dynamicStage.maxSpeed += extraSpeedBoost;
      dynamicStage.deceleration = Math.max(
        -0.01,
        stage.deceleration - extraHeight / 50000
      ); // Gradually reduce deceleration
    }

    if (dynamicStage && dynamicStage !== this.currentStage) {
      this.currentStage = dynamicStage;
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
