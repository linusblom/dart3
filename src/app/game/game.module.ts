import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';

import { containers } from './containers';

@NgModule({
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  declarations: [...containers],
})
export class GameModule {}
