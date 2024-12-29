import { Component, Input } from '@angular/core';
import { GameService } from '../../../../core/services/game.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-explosion',
  templateUrl: './explosion.component.html',
  styleUrls: ['./explosion.component.scss'],
  imports: [CommonModule],
})
export class ExplosionComponent {
  constructor(public gameService: GameService) {}
}
