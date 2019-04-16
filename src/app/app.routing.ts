import { Routes } from '@angular/router';

import { AuthGuard } from '@auth/services/auth.guard';
import { NotFoundComponent } from '@core/components';

import { LoginComponent } from './auth/containers/login/login.component';
import { SettingsComponent } from './core/containers';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [{ path: 'settings', component: SettingsComponent }],
  },
  { path: 'login', component: LoginComponent },
  { path: '**', component: NotFoundComponent },
];
