import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '@shared/shared.module';

import { containers } from './containers';
import { effects } from './effects';
import { GameRoutingModule } from './game.routing';
import { reducers } from './reducers';
import { services } from './services';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GameRoutingModule,
    StoreModule.forFeature('game', reducers),
    EffectsModule.forFeature(effects),
    SharedModule,
  ],
  declarations: [...containers],
  providers: [...services],
})
export class GameModule {}
