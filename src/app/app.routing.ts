import { Routes } from '@angular/router';
import { NotFoundComponent } from '@core/components/not-found/not-found.component';
import { AuthGuard } from '@auth/services/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: NotFoundComponent, canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent },
];
