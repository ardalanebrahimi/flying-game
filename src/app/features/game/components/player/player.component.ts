import { Component, Input } from '@angular/core';
import { GameService } from '../../../../core/services/game.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent {
  constructor(public gameService: GameService) {}
}
