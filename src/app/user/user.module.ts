import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';

import { containers } from './containers';

@NgModule({
  declarations: [...containers],
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  exports: [],
})
export class UserModule {}
