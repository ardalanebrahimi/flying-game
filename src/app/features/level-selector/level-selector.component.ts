import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LevelConfig,
  LEVEL_1_CONFIG,
  LEVEL_2_CONFIG,
  getUnlockedLevels,
  setSelectedLevel,
} from '../../core/config/level-config';

@Component({
  selector: 'app-level-selector',
  imports: [CommonModule],
  templateUrl: './level-selector.component.html',
  styleUrl: './level-selector.component.scss',
})
export class LevelSelectorComponent {
  @Output() levelSelected = new EventEmitter<LevelConfig>();

  availableLevels = [
    { config: LEVEL_1_CONFIG, unlocked: true },
    {
      config: LEVEL_2_CONFIG,
      unlocked: getUnlockedLevels().includes(LEVEL_2_CONFIG.id),
    },
  ];
  selectedLevelId: number = LEVEL_1_CONFIG.id;
  selectedLevel: LevelConfig = LEVEL_1_CONFIG;
  selectLevel(level: LevelConfig): void {
    const levelInfo = this.availableLevels.find(
      (l) => l.config.id === level.id
    );
    if (levelInfo && levelInfo.unlocked) {
      this.selectedLevelId = level.id;
      this.selectedLevel = level;
      setSelectedLevel(level.id);
    }
  }

  startLevel(): void {
    if (this.selectedLevel) {
      this.levelSelected.emit(this.selectedLevel);
    }
  }
}
