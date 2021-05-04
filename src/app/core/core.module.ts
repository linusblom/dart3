import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { components } from './components';
import { containers } from './containers';
import { CoreRoutingModule } from './core.routing';

@NgModule({
  imports: [CommonModule, SharedModule, CoreRoutingModule],
  declarations: [...components, ...containers],
  exports: [...containers, ...components],
})
export class CoreModule {}
