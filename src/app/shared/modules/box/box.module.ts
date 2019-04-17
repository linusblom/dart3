import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { BoxGroupComponent } from './box-group/box-group.component';
import { BoxComponent } from './box.component';

@NgModule({
  imports: [CommonModule, FontAwesomeModule],
  exports: [BoxComponent, BoxGroupComponent],
  declarations: [BoxComponent, BoxGroupComponent],
})
export class BoxModule {}
