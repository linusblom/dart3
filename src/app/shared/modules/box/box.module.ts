import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { BoxGroupComponent } from './box-group/box-group.component';
import { BoxLoadingComponent } from './box-loading/box-loading.component';
import { BoxComponent } from './box.component';

const components = [BoxComponent, BoxGroupComponent, BoxLoadingComponent];

@NgModule({
  imports: [CommonModule, FontAwesomeModule, MatProgressSpinnerModule],
  exports: components,
  declarations: components,
})
export class BoxModule {}
