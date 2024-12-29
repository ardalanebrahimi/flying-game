import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { GameService } from '../../../../core/services/game.service';

@Component({
  selector: 'app-dot',
  templateUrl: './dot.component.html',
  styleUrls: ['./dot.component.scss'],
  imports: [CommonModule],
})
export class DotComponent implements OnInit {
  constructor(public gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.startDotSpawner(); // Spawn dots
  }
}
