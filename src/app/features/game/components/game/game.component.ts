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
import { HeartComponent } from '../heart/heart.component';

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
    HeartComponent,
  ],
  standalone: true,
})
export class GameComponent implements OnInit, OnDestroy {
  private moveInterval: any;
  isPaused = false;
  showConfirmation = false;
  showTutorial = true;
  isThrusting = false;
  private lastX: number | null = null;

  constructor(public gameService: GameService, private router: Router) {}

  ngOnInit(): void {
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (!profile.name) {
      this.router.navigate(['/profile']);
      return;
    }
    this.gameService.initializeGame();
  }

  ngOnDestroy(): void {
    this.gameService.stopGameLoop();
    this.clearMoveInterval();
  }

  private clearMoveInterval(): void {
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
      this.moveInterval = null;
    }
  }
  // Movement control methods
  startMovingLeft(): void {
    if (this.gameService.state.exploded || this.isPaused) return;
    this.clearMoveInterval();
    this.moveInterval = setInterval(() => {
      this.gameService.moveLeft();
    }, 50);
  }

  startMovingRight(): void {
    if (this.gameService.state.exploded || this.isPaused) return;
    this.clearMoveInterval();
    this.moveInterval = setInterval(() => {
      this.gameService.moveRight();
    }, 50);
  }

  stopMoving(): void {
    this.clearMoveInterval();
  }

  onThrustStart(event: TouchEvent | MouseEvent): void {
    if (this.gameService.state.exploded) {
      this.resetGame();
      return;
    }

    this.isThrusting = true;
    this.gameService.applyThrust();

    // Store initial position
    if (event instanceof TouchEvent) {
      this.lastX = event.touches[0].clientX;
    } else {
      this.lastX = event.clientX;
    }
  }

  onThrustMove(event: TouchEvent | MouseEvent): void {
    if (!this.isThrusting || !this.lastX) return;

    let currentX: number;
    if (event instanceof TouchEvent) {
      currentX = event.touches[0].clientX;
    } else {
      currentX = event.clientX;
    }

    // Calculate movement
    const deltaX = currentX - this.lastX;
    const screenWidth = window.innerWidth;
    const movement = (deltaX / screenWidth) * 100;

    // Move rocket
    if (Math.abs(movement) > 1) {
      this.gameService.state.playerX = Math.max(
        0,
        Math.min(100, this.gameService.state.playerX + movement)
      );
      this.lastX = currentX;
    }
  }

  onThrustEnd(): void {
    this.isThrusting = false;
    this.lastX = null;
    this.gameService.stopThrust();
  }

  resetGame(): void {
    this.isPaused = false;
    this.isThrusting = false;
    this.lastX = null;
    this.gameService.restartGame();
    this.showTutorial = true;
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

  dismissTutorial(): void {
    this.showTutorial = false;
  }
}
