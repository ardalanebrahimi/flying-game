import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-explosion',
  templateUrl: './explosion.component.html',
  styleUrls: ['./explosion.component.scss'],
})
export class ExplosionComponent {
  @Input() explosionX?: number;
  @Input() explosionY?: number;
}
