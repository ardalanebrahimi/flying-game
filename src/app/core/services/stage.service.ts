import { Injectable } from '@angular/core';
import { Stage } from '../models/stage.model';
import { LevelConfig, getCurrentLevel } from '../config/level-config';

@Injectable({
  providedIn: 'root',
})
export class StageService {
  private currentLevelConfig: LevelConfig = getCurrentLevel();
  private stages: Stage[] = this.currentLevelConfig.stages;
  private currentStage: Stage = this.stages[0];

  /**
   * Initializes the service with a specific level configuration.
   * @param levelConfig - The level configuration to use.
   */
  initializeWithLevel(levelConfig: LevelConfig): void {
    this.currentLevelConfig = levelConfig;
    this.stages = levelConfig.stages;
    this.currentStage = this.stages[0];
  }

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

    // Reduce the speed increase within stages
    const heightProgress =
      (height - stage.heightRange[0]) /
      (stage.heightRange[1] - stage.heightRange[0]);
    const speedIncrease = heightProgress * (stage.maxSpeed * 0.3); // Reduced from 0.5 (30% increase instead of 50%)
    dynamicStage.maxSpeed += speedIncrease;

    // Make Infinite Space progression more manageable
    if (stage.name === 'Infinite Space') {
      const extraHeight = Math.max(0, height - 10000);
      const extraSpeedBoost = Math.min(extraHeight / 2000, 50); // Halved speed increase and max boost
      dynamicStage.maxSpeed += extraSpeedBoost;
      // Keep deceleration more stable for better control
      dynamicStage.deceleration = Math.max(
        -0.08,
        stage.deceleration - extraHeight / 100000
      );
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
   * Resets the current stage to the default (first stage of current level).
   */
  resetStage(): void {
    this.currentStage = this.stages[0];
  }
}
