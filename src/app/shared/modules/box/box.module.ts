import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressBarModule, MatProgressSpinnerModule } from '@angular/material';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { BoxButtonsComponent } from './box-buttons/box-buttons.component';
import { BoxGroupComponent } from './box-group/box-group.component';
import { BoxListViewComponent } from './box-list-view/box-list-view.component';
import { BoxTabsComponent } from './box-tabs/box-tabs.component';
import { BoxComponent } from './box.component';

const components = [
  BoxComponent,
  BoxGroupComponent,
  BoxButtonsComponent,
  BoxListViewComponent,
  BoxTabsComponent,
];

@NgModule({
  imports: [
    PerfectScrollbarModule,
    CommonModule,
    FontAwesomeModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
  ],
  exports: components,
  declarations: components,
})
export class BoxModule {}
