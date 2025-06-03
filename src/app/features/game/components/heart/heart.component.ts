import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeartService } from './heart.service';

@Component({
  selector: 'app-heart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngFor="let heart of heartService.hearts"
      class="heart"
      [style.--x]="heart.x + 'px'"
      [style.--y]="heart.y + 'px'"
      [style.--size]="heart.size + 'px'"
    >
      <img src="/images/heart-filled.png" [alt]="'Heart'" />
    </div>
  `,
  styles: [
    `
      .heart {
        position: fixed;
        left: var(--x);
        top: var(--y);
        width: var(--size);
        height: var(--size);
        z-index: 1;
        pointer-events: none;
      }

      .heart img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    `,
  ],
})
export class HeartComponent {
  constructor(public heartService: HeartService) {}
}
