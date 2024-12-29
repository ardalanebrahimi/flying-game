import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../game/game.service';

@Component({
  selector: 'app-reset-button',
  templateUrl: './reset-button.component.html',
  styleUrls: ['./reset-button.component.scss'],
  imports: [CommonModule],
})
export class ResetButtonComponent {
  constructor(public gameService: GameService) {}
}
