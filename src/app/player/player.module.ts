import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SharedModule } from '@shared/shared.module';

import { components } from './components';
import { containers } from './containers';

@NgModule({
  imports: [CommonModule, FontAwesomeModule, SharedModule, ReactiveFormsModule],
  declarations: [...containers, ...components],
})
export class PlayerModule {}
