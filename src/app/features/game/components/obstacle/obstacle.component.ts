import { Component, Input } from '@angular/core';
import { Obstacle } from '../../../../core/models/obstacle.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-obstacle',
  templateUrl: './obstacle.component.html',
  styleUrls: ['./obstacle.component.scss'],
  imports: [CommonModule],
})
export class ObstacleComponent {
  @Input() obstacles: Obstacle[] = [];
}
