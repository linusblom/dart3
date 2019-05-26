import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressBarModule } from '@angular/material';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { BoxButtonsComponent } from './box-buttons/box-buttons.component';
import { BoxGroupComponent } from './box-group/box-group.component';
import { BoxComponent } from './box.component';

const components = [BoxComponent, BoxGroupComponent, BoxButtonsComponent];

@NgModule({
  imports: [PerfectScrollbarModule, CommonModule, FontAwesomeModule, MatProgressBarModule],
  exports: components,
  declarations: components,
})
export class BoxModule {}
