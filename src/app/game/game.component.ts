import { Component, OnInit, HostListener } from '@angular/core';
import { GameService } from '../game.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  imports: [CommonModule],
})
export class GameComponent implements OnInit {
  gameInterval: any;
  backgroundPositionY = 0; // Track background scroll position

  constructor(public gameService: GameService) {}

  ngOnInit(): void {
    this.startGameLoop();
  }

  startGameLoop(): void {
    this.gameInterval = setInterval(() => {
      this.gameService.updateGame();
      this.updateBackground(); // Update the background position
      this.updateDots(); // Update dot positions
      if (this.gameService.playerY % 50 === 0) {
        this.spawnDot(); // Spawn dots every 50 height units
      }
    }, 500); // Update every 50ms
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.gameService.applyThrust(); // Trigger thrust through GameService
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    this.gameService.physics.stopFlying(); // Stop thrust by resetting velocity
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.gameService.applyThrust(); // Trigger thrust through GameService
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

  ngOnDestroy(): void {
    clearInterval(this.gameInterval);
  }

  get playerY() {
    return this.gameService.playerY;
  }

  get score() {
    return this.gameService.score;
  }

  get currentStage(): string {
    return this.gameService.currentStage.name;
  }

  get backgroundStyle() {
    return {
      'background-image': this.gameService.currentStage.background,
      'background-position-y': `${this.backgroundPositionY}px`,
    };
  }

  updateBackground(): void {
    const maxScroll = -window.innerHeight * 2; // Prevent scrolling past the gradient's end
    this.backgroundPositionY = Math.max(
      -this.gameService.playerY / 2,
      maxScroll
    );
  }

  get rocketVisualPosition(): number {
    const screenHeight = window.innerHeight;
    return Math.min(this.gameService.playerY, screenHeight * 0.25); // One-fourth from the bottom
  }

  get showGround(): boolean {
    return this.gameService.playerY < 200; // Ground is visible at surface level
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

  get showStars(): boolean {
    // Introduce a buffer to avoid toggling near the threshold
    return this.gameService.playerY > 350; // Adjust buffer as needed
  }
  dots: { x: number; y: number }[] = []; // Track dot positions

  updateDots(): void {
    const velocity = this.gameService.physics.getVelocity();

    this.dots = this.dots.map((dot) => ({
      ...dot,
      y: dot.y - velocity, // Move dots relative to rocket velocity
    }));

    // Remove dots that are too far from the rocket
    this.dots = this.dots.filter(
      (dot) =>
        dot.y > this.gameService.playerY - 1000 &&
        dot.y < this.gameService.playerY + 1000
    );
  }

  spawnDot(): void {
    const x = Math.random() * window.innerWidth; // Random X position
    const y = this.gameService.playerY; // Match rocket's height
    this.dots.push({ x, y });
  }
}
