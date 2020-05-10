import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { pipes } from './pipes';
import { directives } from './directives';
import { components } from './components';

const materialComponents = [
  MatButtonModule,
  MatInputModule,
  MatProgressBarModule,
  MatSelectModule,
  MatButtonToggleModule,
  MatCheckboxModule,
];

@NgModule({
  imports: [CommonModule, ...materialComponents],
  exports: [...materialComponents, ...pipes, ...directives, ...components],
  declarations: [...pipes, ...directives, ...components],
})
export class SharedModule {}
