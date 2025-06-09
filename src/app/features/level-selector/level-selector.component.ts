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

  currentIndex: number = 0;

  // Touch/swipe functionality
  private startX: number = 0;
  private currentX: number = 0;
  private isDragging: boolean = false;
  private threshold: number = 50; // Minimum distance to trigger swipe

  get currentLevel() {
    return this.availableLevels[this.currentIndex];
  }

  previousLevel(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  nextLevel(): void {
    if (this.currentIndex < this.availableLevels.length - 1) {
      this.currentIndex++;
    }
  }

  startLevel(): void {
    const currentLevel = this.currentLevel;
    if (currentLevel && currentLevel.unlocked) {
      setSelectedLevel(currentLevel.config.id);
      this.levelSelected.emit(currentLevel.config);
    }
  }

  getDifficultyLevel(levelId: number): number {
    // Returns a difficulty rating from 1-5 stars based on level
    switch (levelId) {
      case 1:
        return 2; // Easy
      case 2:
        return 4; // Hard
      default:
        return 3; // Medium
    }
  }

  // Touch event handlers
  onTouchStart(event: TouchEvent): void {
    this.startX = event.touches[0].clientX;
    this.isDragging = true;
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging) return;
    this.currentX = event.touches[0].clientX;
    event.preventDefault(); // Prevent scrolling
  }

  onTouchEnd(event: TouchEvent): void {
    if (!this.isDragging) return;
    this.isDragging = false;

    const deltaX = this.startX - this.currentX;

    if (Math.abs(deltaX) > this.threshold) {
      if (deltaX > 0) {
        // Swipe left - go to next level
        this.nextLevel();
      } else {
        // Swipe right - go to previous level
        this.previousLevel();
      }
    }
  }

  // Mouse event handlers (for desktop)
  onMouseDown(event: MouseEvent): void {
    this.startX = event.clientX;
    this.isDragging = true;
    event.preventDefault();
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    this.currentX = event.clientX;
  }

  onMouseUp(event: MouseEvent): void {
    if (!this.isDragging) return;
    this.isDragging = false;

    const deltaX = this.startX - this.currentX;

    if (Math.abs(deltaX) > this.threshold) {
      if (deltaX > 0) {
        // Drag left - go to next level
        this.nextLevel();
      } else {
        // Drag right - go to previous level
        this.previousLevel();
      }
    }
  }

  // Allow direct level selection via indicators
  goToLevel(index: number): void {
    if (index >= 0 && index < this.availableLevels.length) {
      this.currentIndex = index;
    }
  }
}
