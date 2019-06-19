import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  GameBoardComponent,
  GameComponent,
  PlayersComponent,
  ResultsComponent,
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
      { path: 'results/:gameId', component: ResultsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameRoutingModule {}
