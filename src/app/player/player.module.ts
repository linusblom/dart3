import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';

import { containers } from './containers';
import { components } from './components';

@NgModule({
  declarations: [...containers, ...components],
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  exports: [...components],
})
export class PlayerModule {}
