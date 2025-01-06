import { Routes } from '@angular/router';
import { StartPageComponent } from './features/start-page/start-page.component';
import { GameComponent } from './features/game/components/game/game.component';
import { SkinSelectionPageComponent } from './features/skins/skin-selection-page/skin-selection-page.component';
import { LeaderboardComponent } from './features/leaderboard/leaderboard.component';

export const routes: Routes = [
  { path: '', component: StartPageComponent },
  { path: 'home', component: StartPageComponent },
  { path: 'game', component: GameComponent },
  { path: 'skin-selection', component: SkinSelectionPageComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
];
