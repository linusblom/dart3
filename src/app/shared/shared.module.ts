import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
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
