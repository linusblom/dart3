import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatInputModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSelectModule,
} from '@angular/material';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { components } from './components';
import { BoxModule } from './modules/box/box.module';

const materialComponents = [
  MatButtonModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatSelectModule,
  MatButtonToggleModule,
];

@NgModule({
  imports: [BoxModule, CommonModule, FontAwesomeModule, ...materialComponents],
  exports: [BoxModule, ...materialComponents, ...components],
  declarations: [...components],
})
export class SharedModule {}
