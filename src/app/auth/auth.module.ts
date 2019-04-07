import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';

import { LoginComponent } from './containers/login/login.component';
import { AuthGuard } from './services/auth.guard';
import { AuthEffects } from './effects/auth.effect';

@NgModule({
  imports: [CommonModule, EffectsModule.forFeature([AuthEffects])],
  providers: [AuthGuard],
  declarations: [LoginComponent],
})
export class AuthModule {}
