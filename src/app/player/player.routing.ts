import { Routes } from '@angular/router';

import { PlayerComponent, PlayersComponent } from './containers';

export const PlayerRoutes: Routes = [
  { path: '', pathMatch: 'full', component: PlayersComponent },
  { path: ':uid', component: PlayerComponent },
];
