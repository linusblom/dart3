import { Routes } from '@angular/router';

import { AuthGuard } from '@auth/services/auth.guard';
import { NotFoundComponent } from '@core/components';

import { LoginComponent } from './auth/containers/login/login.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: NotFoundComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', component: NotFoundComponent },
];
