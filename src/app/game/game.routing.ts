import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StartGameComponent } from './containers/start-game/start-game.component';
import { GameGuard } from './services';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'start',
  },
  {
    path: 'start',
    component: StartGameComponent,
    canActivate: [GameGuard],
  },
  {
    path: 'play',
    component: StartGameComponent,
    canActivate: [GameGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameRoutingModule {}
