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
  gameInterval: any;
  backgroundPositionY = 0; // Track background scroll position
  private initialTouchX: number | null = null;

  constructor(public gameService: GameService) {}

  ngOnInit(): void {
    this.startGameLoop(); // Main game loop
    this.startDotSpawner(); // Spawn dots
    this.startObstacleSpawner(); // Spawn obstacles
    this.startObstacleMovement(); // Move obstacles
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

  startGameLoop(): void {
    this.gameInterval = setInterval(() => {
      this.gameService.updateGame();
      this.updateBackground(); // Update the background position
      this.updateDots(); // Update dot positions
    }, 50); // Update every 50ms (20 times per second)
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

  ngOnDestroy(): void {
    clearInterval(this.gameInterval);
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

  get backgroundStyle() {
    return {
      'background-image':
        this.gameService.stageService.getCurrentStage().background,
      'background-position-y': `${this.backgroundPositionY}px`,
    };
  }

  updateBackground(): void {
    const maxScroll = -window.innerHeight * 2; // Prevent scrolling past the gradient's end
    this.backgroundPositionY = Math.max(
      -this.gameService.state.playerY / 2,
      maxScroll
    );
  }
  get showGround(): boolean {
    return this.gameService.state.playerY < 200; // Ground is visible at surface level
  }

  get rocketSpeed(): number {
    return Math.abs(this.gameService.physics.getVelocity()); // Absolute value for speed
  }

  get rocketSpeedKmh(): number {
    const PIXELS_PER_KILOMETER = 100000; // Adjust as needed
    const velocityInPixelsPerSecond =
      this.gameService.physics.getVelocity() * 20; // 20 updates per second
    const speedInKmh =
      (velocityInPixelsPerSecond / PIXELS_PER_KILOMETER) * 3600;
    return Math.round(speedInKmh); // Allow negative values for falling
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

  dots: { x: number; y: number }[] = []; // Track dot positions

  startDotSpawner(): void {
    const spawnDotInterval = () => {
      if (this.gameService.physics.getVelocity() !== 0) {
        this.spawnDot(); // Spawn dots only if thrust is active
      }
      const randomDelay = Math.random() * 300 + 100; // More frequent spawning
      setTimeout(spawnDotInterval, randomDelay);
    };
    spawnDotInterval();
  }

  updateDots(): void {
    const velocity = this.gameService.physics.getVelocity();

    this.dots = this.dots.map((dot) => ({
      ...dot,
      y: dot.y + velocity, // Move dots downward
    }));

    // Remove dots that move off the screen (below the viewport)
    this.dots = this.dots.filter((dot) => dot.y < window.innerHeight + 100);
  }

  spawnDot(): void {
    if (
      this.gameService.state.playerY > 100 &&
      this.gameService.physics.getVelocity() !== 0
    ) {
      // Spawn dots only after height 100
      const x = Math.random() * window.innerWidth;
      const y =
        this.gameService.physics.getVelocity() > 0 ? 0 : window.innerHeight;
      this.dots.push({ x, y });
    }
  }
}
