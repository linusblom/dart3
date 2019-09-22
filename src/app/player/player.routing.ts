import { Routes } from '@angular/router';
import { PlayersComponent } from './containers';

export const PlayerRoutes: Routes = [
  { path: '', pathMatch: 'full', component: PlayersComponent },
  { path: ':id', component: PlayersComponent },
];
