import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameComponent, PlayersComponent, StartGameComponent } from './containers';
import { GameGuard } from './services';

export const routes: Routes = [
  {
    path: '',
    component: GameComponent,
    children: [
      { path: '', pathMatch: 'full', canActivate: [GameGuard] },
      { path: 'start', component: StartGameComponent },
      { path: 'players', component: PlayersComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameRoutingModule {}
