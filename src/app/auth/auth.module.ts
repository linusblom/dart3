import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@root/shared/shared.module';

import { LoginComponent } from './containers/login/login.component';
import { AuthGuard } from './services/auth.guard';

@NgModule({
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  providers: [AuthGuard],
  declarations: [LoginComponent],
})
export class AuthModule {}
