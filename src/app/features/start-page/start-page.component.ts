import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss'],
})
export class StartPageComponent {
  constructor(private router: Router) {}

  startGame(): void {
    this.router.navigate(['/game']); // Navigate to the game page
  }

  chooseSkin(): void {
    this.router.navigate(['/skin-selection']); // Navigate to the skin selection page
  }

  viewLeaderboard(): void {
    this.router.navigate(['/leaderboard']);
  }
}
