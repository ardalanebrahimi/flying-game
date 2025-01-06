import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockedBackendService } from '../../core/services/mocked-backend.service';

@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrls: ['./user-profile-page.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class UserProfilePageComponent {
  userName: string = '';

  constructor(
    private router: Router,
    private mockedBackendService: MockedBackendService
  ) {
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    this.userName = profile.name;
  }

  saveProfile(): void {
    if (!this.userName.trim()) {
      alert('Please enter a valid name.');
      return;
    }

    const uuid = this.generateUUID();
    const profile = { name: this.userName.trim(), uuid };
    localStorage.setItem('userProfile', JSON.stringify(profile));

    this.mockedBackendService
      .saveUserProfile(uuid, this.userName.trim())
      .then(() => {
        console.log('Profile saved successfully:', profile);
        this.router.navigate(['/home']);
      })
      .catch((error) => console.error('Failed to save profile:', error));
  }

  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}
