import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';

import { BoxModule } from './modules/box/box.module';

const MATERIAL_COMPONENTS = [MatButtonModule, MatInputModule, MatProgressSpinnerModule];

@NgModule({
  imports: [BoxModule, CommonModule, ...MATERIAL_COMPONENTS],
  exports: [BoxModule, ...MATERIAL_COMPONENTS],
  declarations: [],
})
export class SharedModule {}
