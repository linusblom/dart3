import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';

import { containers } from './containers';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [...containers],
  exports: [...containers],
})
export class JackpotModule {}
