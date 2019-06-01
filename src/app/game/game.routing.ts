import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  GameBoardComponent,
  GameComponent,
  PlayersComponent,
  StartGameComponent,
} from './containers';

export const routes: Routes = [
  {
    path: '',
    component: GameComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'start' },
      { path: 'start', component: StartGameComponent },
      { path: 'game/:gameId', component: GameBoardComponent },
      { path: 'players', component: PlayersComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameRoutingModule {}
