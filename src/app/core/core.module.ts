import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';

import { components } from './components';
import { containers } from './containers';

@NgModule({
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  declarations: [...components, ...containers],
  exports: [...containers],
})
export class CoreModule {}
