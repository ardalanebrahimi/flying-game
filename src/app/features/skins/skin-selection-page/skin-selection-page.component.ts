import { Component, OnInit } from '@angular/core';
import { SKINS } from '../skins';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-skin-selection-page',
  templateUrl: './skin-selection-page.component.html',
  styleUrls: ['./skin-selection-page.component.scss'],
  imports: [CommonModule],
})
export class SkinSelectionPageComponent implements OnInit {
  skins = SKINS;
  selectedSkinId: number | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const savedSkin = localStorage.getItem('selectedSkin');
    if (savedSkin) {
      const parsedSkin = JSON.parse(savedSkin);
      this.selectedSkinId = parsedSkin.id; // Set the saved skin as selected
    }
  }

  selectSkin(skinId: number): void {
    this.selectedSkinId = skinId;
  }

  confirmSelection(): void {
    const selectedSkin = this.skins.find(
      (skin) => skin.id === this.selectedSkinId
    );

    if (selectedSkin) {
      localStorage.setItem('selectedSkin', JSON.stringify(selectedSkin));
      this.router.navigate(['/game']); // Navigate to the game
    } else {
      alert('Please select a skin!');
    }
  }

  goBack(): void {
    this.router.navigate(['/']); // Navigate back to the start page
  }
}
