import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../game/game.service';

@Component({
  selector: 'app-explosion',
  templateUrl: './explosion.component.html',
  styleUrls: ['./explosion.component.scss'],
  imports: [CommonModule],
})
export class ExplosionComponent {
  constructor(public gameService: GameService) {}
}
