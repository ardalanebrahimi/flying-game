import { Component, EventEmitter, Output } from '@angular/core';
import { GameService } from '../../../../core/services/game.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-button',
  templateUrl: './reset-button.component.html',
  styleUrls: ['./reset-button.component.scss'],
  imports: [CommonModule],
})
export class ResetButtonComponent {
  constructor(public gameService: GameService) {}
}
