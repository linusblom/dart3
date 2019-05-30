import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@auth/services/auth.guard';
import { NotFoundComponent } from '@shared/components';

import { SettingsComponent } from './core/containers';

export const routes: Routes = [
  { path: '', loadChildren: () => import('@game/game.module').then(m => m.GameModule), canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
