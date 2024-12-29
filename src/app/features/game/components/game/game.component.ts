import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../../../core/services/game.service';
import { PlayerComponent } from '../player/player.component';
import { ObstacleComponent } from '../obstacle/obstacle.component';
import { DotComponent } from '../dot/dot.component';
import { HudComponent } from '../hud/hud.component';
import { ResetButtonComponent } from '../reset-button/reset-button.component';
import { ExplosionComponent } from '../explosion/explosion.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  imports: [
    CommonModule,
    PlayerComponent,
    ObstacleComponent,
    DotComponent,
    HudComponent,
    ResetButtonComponent,
    ExplosionComponent,
  ],
})
export class GameComponent implements OnInit {
  private initialTouchX: number | null = null;

  constructor(public gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.startGameLoop(); // Main game loop
    this.startObstacleSpawner(); // Spawn obstacles
    this.startObstacleMovement(); // Move obstacles
  }

  ngOnDestroy(): void {
    this.gameService.stopGameLoop(); // Stop the update loop on destroy
  }

  onTouchMove(event: TouchEvent): void {
    if (this.initialTouchX !== null) {
      const currentTouchX = event.touches[0].clientX;
      const deltaX = currentTouchX - this.initialTouchX;

      if (deltaX > 10) {
        // Move right if swipe is significant
        this.gameService.moveRight();
        this.initialTouchX = currentTouchX; // Update reference point
      } else if (deltaX < -10) {
        // Move left if swipe is significant
        this.gameService.moveLeft();
        this.initialTouchX = currentTouchX; // Update reference point
      }
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(): void {
    this.gameService.applyThrust(); // Trigger thrust through GameService
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(): void {
    this.gameService.physics.stopFlying(); // Stop thrust by resetting velocity
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.gameService.applyThrust(); // Trigger thrust through GameService
    this.initialTouchX = event.touches[0].clientX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    this.gameService.physics.stopFlying(); // Stop thrust by resetting velocity
    this.initialTouchX = null; // Reset the reference point
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
      this.gameService.moveLeft();
    }
    if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
      this.gameService.moveRight();
    }
  }

  get playerY() {
    return this.gameService.state.playerY;
  }

  get score() {
    return this.gameService.state.score;
  }

  get currentStage(): string {
    return this.gameService.state.currentStage;
  }

  get showGround(): boolean {
    return this.gameService.state.playerY < 200; // Ground is visible at surface level
  }

  get rocketSpeed(): number {
    return Math.abs(this.gameService.physics.getVelocity()); // Absolute value for speed
  }

  startObstacleSpawner(): void {
    const spawnObstacleInterval = () => {
      if (this.gameService.physics.getVelocity() !== 0) {
        const currentStage = this.gameService.state.currentStage;

        // Adjust spawn frequency based on stage
        let delay = 1000; // Default 1-second delay
        switch (currentStage) {
          case 'Earth’s Surface':
            delay = Math.random() * 2000 + 500; // Less frequent
            break;
          case 'Sky':
            delay = Math.random() * 1000 + 300; // Moderate frequency
            break;
          case 'Outer Space':
            delay = Math.random() * 500 + 200; // High frequency
            break;
          case 'Deep Space':
            delay = Math.random() * 400 + 100; // Very high frequency
            break;
        }

        this.gameService.obstacleService.spawnObstacle(currentStage);
      }
      setTimeout(spawnObstacleInterval, 1000); // Debugging with fixed delay
    };
    spawnObstacleInterval();
  }

  startObstacleMovement(): void {
    setInterval(() => {
      if (this.gameService.physics.getVelocity() !== 0) {
        this.gameService.obstacleService.moveObstacles();
      }
    }, 50); // Adjust movement speed
  }
}
