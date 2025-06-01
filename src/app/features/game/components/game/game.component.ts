import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from '../player/player.component';
import { ObstacleComponent } from '../obstacle/obstacle.component';
import { DotComponent } from '../dot/dot.component';
import { HudComponent } from '../hud/hud.component';
import { ResetButtonComponent } from '../reset-button/reset-button.component';
import { ExplosionComponent } from '../explosion/explosion.component';
import { GameService } from './game.service';
import { Router } from '@angular/router';

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
export class GameComponent implements OnInit, OnDestroy {
  private isTouchNearRocket = false; // Track if the touch starts near the rocket
  private readonly touchThreshold = 10; // Threshold for detecting proximity (in percentage)
  isPaused = false;
  showConfirmation = false; // Track confirmation dialog visibility

  constructor(public gameService: GameService, private router: Router) {}

  ngOnInit(): void {
    this.gameService.initializeGame();
  }

  ngOnDestroy(): void {
    this.gameService.stopGameLoop(); // Stop game loop
  }

  resetGame(): void {
    this.isPaused = false;
    this.gameService.restartGame();
  }

  navigateToStart(): void {
    this.gameService.stopGameLoop();
    this.router.navigate(['/home']);
  }

  showHomeConfirmation(): void {
    this.showConfirmation = true;
    this.isPaused = true;
    this.gameService.stopGameLoop();
  }

  cancelHomeNavigation(): void {
    this.showConfirmation = false;
    this.isPaused = false;
    if (!this.gameService.state.exploded && !this.gameService.state.hasWon) {
      this.gameService.startGameLoop();
    }
  }

  confirmHomeNavigation(): void {
    this.showConfirmation = false;
    this.navigateToStart();
  }

  onTouchMove(event: TouchEvent): void {
    if (this.gameService.state.exploded || this.isPaused) return;
    if (!this.isTouchNearRocket) {
      return; // Ignore touch movements that didn't start near the rocket
    }

    const touchX = event.touches[0].clientX; // Get touch X position
    const screenWidth = window.innerWidth;
    const playerX = (touchX / screenWidth) * 100; // Convert to percentage

    // Update rocket position and clamp it within bounds
    this.gameService.state.playerX = Math.max(0, Math.min(100, playerX));
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
    if (this.gameService.state.exploded || this.isPaused) return;
    this.gameService.applyThrust(); // Trigger thrust through GameService
    const touchX = event.touches[0].clientX; // Get touch X position
    const screenWidth = window.innerWidth;
    const touchPercentage = (touchX / screenWidth) * 100; // Convert to percentage

    // Check if touch is near the rocket
    const rocketX = this.gameService.state.playerX;
    this.isTouchNearRocket =
      Math.abs(touchPercentage - rocketX) <= this.touchThreshold;

    // If the touch is near the rocket, allow movement
    if (this.isTouchNearRocket) {
      this.gameService.state.playerX = Math.max(
        0,
        Math.min(100, touchPercentage)
      );
    }
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    this.gameService.physics.stopFlying(); // Stop thrust by resetting velocity
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

  togglePause(): void {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.gameService.stopGameLoop();
    }
  }

  resumeGame(): void {
    this.isPaused = false;
    this.gameService.startGameLoop();
  }
}
