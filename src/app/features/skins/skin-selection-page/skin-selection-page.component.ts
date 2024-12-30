import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-skin-selection-page',
  templateUrl: './skin-selection-page.component.html',
  styleUrls: ['./skin-selection-page.component.scss'],
  imports: [CommonModule],
})
export class SkinSelectionPageComponent {
  skins = [
    { name: 'Rocket1', image: '/skins/rocket1.png' },
    { name: 'Tree2', image: '/skins/tree2.png' },
    { name: 'Lightening', image: '/skins/lightening.png' },
  ];
  selectedSkin: number | null = null;

  constructor(private router: Router) {}

  selectSkin(index: number): void {
    this.selectedSkin = index;
  }

  confirmSelection(): void {
    if (this.selectedSkin !== null) {
      const selectedSkin = this.skins[this.selectedSkin];
      localStorage.setItem('selectedSkin', JSON.stringify(selectedSkin)); // Save to localStorage
      this.router.navigate(['/game']); // Navigate to the game
    } else {
      alert('Please select a skin!');
    }
  }

  goBack(): void {
    this.router.navigate(['/']); // Navigate back to the start page
  }
}
