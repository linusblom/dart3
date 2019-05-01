import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameComponent, StartGameComponent } from './containers';
import { GameGuard } from './services';

export const routes: Routes = [
  {
    path: '',
    component: GameComponent,
    canActivate: [GameGuard],
    children: [{ path: 'start', component: StartGameComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameRoutingModule {}
