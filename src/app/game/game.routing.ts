import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameComponent, ResultsComponent, StartComponent } from './containers';
import { GameGuard } from './services';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
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
