import { Routes } from '@angular/router';
import { PlayersComponent, PlayerComponent } from './containers';

export const PlayerRoutes: Routes = [
  { path: '', pathMatch: 'full', component: PlayersComponent },
  { path: ':uid', component: PlayerComponent },
];
