import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GameService } from '../game/game.service';

@Component({
  selector: 'app-hud',
  templateUrl: './hud.component.html',
  styleUrls: ['./hud.component.scss'],
  imports: [CommonModule],
  standalone: true,
})
export class HudComponent implements OnInit {
  playerSkinImage: string = '/skins/rocket.png';

  constructor(public gameService: GameService) {}

  ngOnInit(): void {
    const selectedSkin = localStorage.getItem('selectedSkin');
    if (selectedSkin) {
      this.playerSkinImage = JSON.parse(selectedSkin).image;
    }
  }

  get rocketSpeedKmh(): number {
    return Math.abs(Math.round(this.gameService.physics.getVelocity() * 3.6)); // Convert to km/h
  }

  get heightProgress(): number {
    return Math.min(
      100,
      Math.round(
        (this.gameService.state.playerY / this.gameService.state.targetHeight) *
          100
      )
    );
  }
}
