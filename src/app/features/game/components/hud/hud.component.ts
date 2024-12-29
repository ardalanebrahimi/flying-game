import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GameService } from '../../../../core/services/game.service';

@Component({
  selector: 'app-hud',
  templateUrl: './hud.component.html',
  styleUrls: ['./hud.component.scss'],
  imports: [CommonModule],
})
export class HudComponent {
  constructor(public gameService: GameService) {}

  get rocketSpeedKmh(): number {
    const PIXELS_PER_KILOMETER = 100000;
    const velocityInPixelsPerSecond =
      this.gameService.physics.getVelocity() * 20;
    return Math.round(
      (velocityInPixelsPerSecond / PIXELS_PER_KILOMETER) * 3600
    );
  }
}
