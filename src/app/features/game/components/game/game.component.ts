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

    this.gameService.obstacleService.startObstacleLifecycle(
      () => this.gameService.state.currentStage, // Pass stage dynamically
      () => this.gameService.physics.getVelocity() // Pass velocity dynamically
    );
  }

  ngOnDestroy(): void {
    this.gameService.stopGameLoop(); // Stop game loop
    this.gameService.obstacleService.stopObstacleLifecycle(); // Stop obstacles
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
}
