import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameGuard } from './services';
import { GameComponent, StartComponent, ResultsComponent } from './containers';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'start',
  },
  {
    path: 'start',
    component: StartComponent,
    canActivate: [GameGuard],
  },
  {
    path: 'play',
    component: GameComponent,
    canActivate: [GameGuard],
  },
  {
    path: 'results/:uid',
    component: ResultsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameRoutingModule {}
