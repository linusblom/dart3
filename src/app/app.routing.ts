import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@auth/services/auth.guard';
import { PlayerRoutes } from '@player/player.routing';
import { UserRoutes } from '@user/user.routing';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'game' },
  {
    path: 'game',
    loadChildren: () => import('@game/game.module').then((m) => m.GameModule),
    canActivate: [AuthGuard],
  },
  { path: 'players', children: PlayerRoutes, canActivate: [AuthGuard] },
  { path: 'user', children: UserRoutes, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
