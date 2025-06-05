import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../../core/services/backend.service';
import { LevelSelectorComponent } from '../level-selector/level-selector.component';
import { LevelConfig, setSelectedLevel } from '../../core/config/level-config';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss'],
  imports: [CommonModule, FormsModule, LevelSelectorComponent],
  standalone: true,
})
export class StartPageComponent implements OnInit {
  showNamePrompt = false;
  userName = '';
  showLevelSelector = false;

  constructor(private router: Router, private backendService: BackendService) {}

  ngOnInit() {
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    this.showNamePrompt = !profile.name;
  }

  startGame(): void {
    this.router.navigate(['/game']); // Navigate to the game page
  }

  chooseSkin(): void {
    this.router.navigate(['/skin-selection']); // Navigate to the skin selection page
  }

  viewLeaderboard(): void {
    this.router.navigate(['/leaderboard']);
  }

  editProfile(): void {
    this.router.navigate(['/profile']); // Navigate to the profile setup page
  }

  saveName(): void {
    if (!this.userName.trim()) {
      alert('Please enter a valid name.');
      return;
    }

    const uuid = this.generateUUID();
    const profile = { name: this.userName.trim(), uuid };
    localStorage.setItem('userProfile', JSON.stringify(profile));

    this.backendService
      .saveUserProfile(uuid, this.userName.trim())
      .then(() => {
        console.log('Profile saved successfully:', profile);
        this.showNamePrompt = false;
      })
      .catch((error) => console.error('Failed to save profile:', error));
  }

  showLevelSelection(): void {
    this.showLevelSelector = true;
  }

  onLevelSelected(levelConfig: LevelConfig): void {
    setSelectedLevel(levelConfig.id);
    this.showLevelSelector = false;
    this.router.navigate(['/game']);
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}
