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

  private userProfiles: { [uuid: string]: { name: string } } = {};

  // Simulate fetching the leaderboard
  fetchLeaderboard(): Promise<LeaderboardEntry[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.leaderboard), 500);
    });
  }

  // Simulate adding a score to the leaderboard
  addScore(entry: LeaderboardEntry): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.leaderboard.push(entry);
        this.leaderboard.sort((a, b) => b.score - a.score); // Sort by score
        resolve();
      }, 500);
    });
  }

  // Simulate saving the user profile
  saveUserProfile(uuid: string, name: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.userProfiles[uuid] = { name };
        resolve();
      }, 500);
    });
  }

  // Simulate fetching the user profile
  fetchUserProfile(uuid: string): Promise<{ name: string } | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.userProfiles[uuid] || null);
      }, 500);
    });
  }
}
