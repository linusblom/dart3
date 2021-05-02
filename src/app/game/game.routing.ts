import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameComponent, ResultsComponent, StartComponent } from './containers';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: StartComponent,
  },
  {
    path: 'play',
    component: GameComponent,
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
