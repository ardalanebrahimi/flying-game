import { Component, OnInit } from '@angular/core';
import { GameService } from '../game/game.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  skinImage: string = '/skins/rocket.png'; // Default skin
  constructor(public gameService: GameService) {}

  ngOnInit(): void {
    const selectedSkin = localStorage.getItem('selectedSkin');
    if (selectedSkin) {
      this.skinImage = JSON.parse(selectedSkin).image;
    }
  }
}
