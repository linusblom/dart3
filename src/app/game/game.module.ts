import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '@shared/shared.module';

import { containers } from './containers';
import { effects } from './effects';
import { reducers } from './reducers';
import { services } from './services';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    StoreModule.forFeature('game', reducers),
    EffectsModule.forFeature([...effects]),
  ],
  declarations: [...containers],
  providers: [...services],
})
export class GameModule {}
