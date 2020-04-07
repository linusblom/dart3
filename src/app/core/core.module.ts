import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { components } from './components';
import { containers } from './containers';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [...components, ...containers],
  exports: [...containers, ...components],
})
export class CoreModule {}
