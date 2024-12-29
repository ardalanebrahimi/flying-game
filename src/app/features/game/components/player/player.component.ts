import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent {
  @Input() playerX: number = 0; // Horizontal position as percentage
  @Input() rocketVisualPosition: number = 0; // Vertical position
}
