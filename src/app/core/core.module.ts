import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SharedModule } from '@root/shared/shared.module';

import { components } from './components';
import { containers } from './containers';

@NgModule({
  imports: [CommonModule, FontAwesomeModule, SharedModule],
  declarations: [...components, ...containers],
  exports: [...containers],
})
export class CoreModule {}
