import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LeaderboardEntry } from '../models/leaderboard-entry.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private apiUrl = 'http://localhost:3000/api'; // Adjust this to match your server URL

  constructor(private http: HttpClient) {}

  // Fetch the leaderboard
  async fetchLeaderboard(): Promise<LeaderboardEntry[]> {
    return firstValueFrom(
      this.http.get<LeaderboardEntry[]>(`${this.apiUrl}/leaderboard`)
    );
  }

  // Add a score to the leaderboard
  async addScore(entry: LeaderboardEntry): Promise<void> {
    await firstValueFrom(this.http.post(`${this.apiUrl}/leaderboard`, entry));
  }

  // Save the user profile
  async saveUserProfile(uuid: string, name: string): Promise<void> {
    await firstValueFrom(
      this.http.post(`${this.apiUrl}/users`, { uuid, name })
    );
  }

  // Fetch the user profile
  async fetchUserProfile(uuid: string): Promise<{ name: string } | null> {
    try {
      return await firstValueFrom(
        this.http.get<{ name: string }>(`${this.apiUrl}/users/${uuid}`)
      );
    } catch (error) {
      if ((error as any).status === 404) {
        return null;
      }
      throw error;
    }
  }
}
