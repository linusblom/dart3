import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameComponent, NewGameComponent, PlayersComponent } from './containers';
import { GameGuard } from './services';

export const routes: Routes = [
  {
    path: '',
    component: GameComponent,
    children: [
      { path: '', pathMatch: 'full', canActivate: [GameGuard] },
      { path: 'new', component: NewGameComponent },
      { path: 'players', component: PlayersComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameRoutingModule {}
