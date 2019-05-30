import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SharedModule } from '@shared/shared.module';

import { components } from './components';
import { containers } from './containers';
import { CoreRoutingModule } from './core.routing';
import { services } from './services';

@NgModule({
  imports: [CommonModule, FontAwesomeModule, SharedModule, ReactiveFormsModule, CoreRoutingModule],
  declarations: [...components, ...containers],
  exports: [...containers],
  providers: [...services],
})
export class CoreModule {}
