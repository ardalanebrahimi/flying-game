import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hud',
  templateUrl: './hud.component.html',
  styleUrls: ['./hud.component.scss'],
  imports: [CommonModule],
})
export class HudComponent {
  @Input() score: number = 0;
  @Input() rocketSpeedKmh: number = 0;
  @Input() currentStage: string = '';
}
