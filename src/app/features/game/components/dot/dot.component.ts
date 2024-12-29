import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dot',
  templateUrl: './dot.component.html',
  styleUrls: ['./dot.component.scss'],
  imports: [CommonModule],
})
export class DotComponent {
  @Input() dots: { x: number; y: number }[] = [];
}
