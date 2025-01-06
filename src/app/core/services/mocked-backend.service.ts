import { Injectable } from '@angular/core';
import { LeaderboardEntry } from '../models/leaderboard-entry.model';

@Injectable({
  providedIn: 'root',
})
export class MockedBackendService {
  private leaderboard: LeaderboardEntry[] = [
    { playerName: 'Player1', score: 1000 },
    { playerName: 'Player2', score: 800 },
    { playerName: 'Player3', score: 600 },
  ];

  fetchLeaderboard(): Promise<LeaderboardEntry[]> {
    // Simulate a network delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.leaderboard), 500);
    });
  }

  addScore(entry: LeaderboardEntry): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.leaderboard.push(entry);
        this.leaderboard.sort((a, b) => b.score - a.score); // Sort by score
        resolve();
      }, 500);
    });
  }
}
