import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  GameBoardComponent,
  GameComponent,
  ResultsComponent,
  StartGameComponent,
} from './containers';
import { GameGuard, StartGameGuard } from './services';

export const routes: Routes = [
  {
    path: '',
    component: GameComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'start' },
      { path: 'start', component: StartGameComponent, canActivate: [StartGameGuard] },
      { path: 'game/:gameId', component: GameBoardComponent, canActivate: [GameGuard] },
      { path: 'results/:gameId', component: ResultsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameRoutingModule {}
