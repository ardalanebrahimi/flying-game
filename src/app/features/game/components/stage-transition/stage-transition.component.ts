import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stage-transition',
  templateUrl: './stage-transition.component.html',
  styleUrls: ['./stage-transition.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class StageTransitionComponent {
  @Input() stageName: string = '';
  @Input() show: boolean = false;
}
