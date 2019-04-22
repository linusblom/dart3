import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatInputModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
} from '@angular/material';

import { components } from './components';
import { BoxModule } from './modules/box/box.module';

const materialComponents = [
  MatButtonModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
];

@NgModule({
  imports: [BoxModule, CommonModule, ...materialComponents],
  exports: [BoxModule, ...materialComponents, ...components],
  declarations: [...components],
})
export class SharedModule {}
