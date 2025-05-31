import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { LeaderboardEntry } from '../models/leaderboard-entry.model';

@Injectable({
  providedIn: 'root',
})
export class LeaderboardService {
  constructor(private backend: BackendService) {}

  getLeaderboard(): Promise<LeaderboardEntry[]> {
    return this.backend.fetchLeaderboard();
  }

  addEntry(entry: LeaderboardEntry): Promise<void> {
    return this.backend.addScore(entry);
  }
}
