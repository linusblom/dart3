import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '@root/shared/shared.module';

import { LoginComponent } from './containers/login/login.component';
import { AuthEffects } from './effects/auth.effect';
import { AuthGuard } from './services/auth.guard';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([AuthEffects]),
    SharedModule,
    ReactiveFormsModule,
  ],
  providers: [AuthGuard],
  declarations: [LoginComponent],
})
export class AuthModule {}
