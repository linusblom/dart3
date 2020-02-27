import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@auth/services/auth.guard';

// import { AuthGuard } from '@core/services';
// import { PlayerRoutes } from '@player/player.routing';
// import { NotFoundComponent } from '@shared/components';

// import { SettingsComponent, StatisticsComponent } from './core/containers';

export const routes: Routes = [
  // {
  //   path: '',
  //   component: LoginComponent,
  // },
  {
    path: '',
    loadChildren: () => import('@game/game.module').then(m => m.GameModule),
    canActivate: [AuthGuard],
  },
  // { path: 'players', children: PlayerRoutes, canActivate: [AuthGuard] },
  // { path: 'statistics', component: StatisticsComponent, canActivate: [AuthGuard] },
  // { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  // { path: '**', component: NotFoundComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
