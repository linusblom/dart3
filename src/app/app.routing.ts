import { Routes } from '@angular/router';
import { NotFoundComponent } from '@core/components/not-found/not-found.component';
import { AuthGuard } from '@auth/services/auth.guard';

import { LoginComponent } from './auth/containers/login/login.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: NotFoundComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', component: NotFoundComponent },
];
