import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeartService } from './heart.service';

@Component({
  selector: 'app-heart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './heart.component.html',
  styleUrls: ['./heart.component.scss'],
})
export class HeartComponent {
  constructor(public heartService: HeartService) {}
}
