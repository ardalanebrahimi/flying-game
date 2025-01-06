import { Component, OnInit } from '@angular/core';
import { LeaderboardEntry } from '../../core/models/leaderboard-entry.model';
import { LeaderboardService } from '../../core/services/leaderboard.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  imports: [CommonModule],
})
export class LeaderboardComponent implements OnInit {
  leaderboard: LeaderboardEntry[] = [];

  constructor(
    private leaderboardService: LeaderboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.leaderboardService.getLeaderboard().then((data) => {
      this.leaderboard = data;
    });
  }

  goToStartPage(): void {
    this.router.navigate(['/']); // Navigate back to the start page
  }
}
