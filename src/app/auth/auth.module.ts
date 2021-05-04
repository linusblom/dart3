import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth.routing';
import { containers } from './containers';

@NgModule({
  declarations: [...containers],
  imports: [CommonModule, AuthRoutingModule],
  exports: [],
})
export class AuthModule {}
