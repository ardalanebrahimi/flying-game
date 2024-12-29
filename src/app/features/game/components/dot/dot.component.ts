import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { GameService } from '../game/game.service';

@Component({
  selector: 'app-dot',
  templateUrl: './dot.component.html',
  styleUrls: ['./dot.component.scss'],
  imports: [CommonModule],
})
export class DotComponent implements OnInit {
  constructor(public gameService: GameService) {}

  ngOnInit(): void {
    // Register callback to fetch current velocity
    this.gameService.dotService.registerVelocityCallback(() =>
      this.gameService.physics.getVelocity()
    );
    this.gameService.dotService.registerPlayerYCallback(
      () => this.gameService.state.playerY
    );

    this.gameService.dotService.startDotSpawner(); // Spawn dots
  }
}
