import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '@shared/shared.module';

import { components } from './components';
import { containers } from './containers';
import { effects } from './effects';
import { GameRoutingModule } from './game.routing';
import { reducers } from './reducers';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    GameRoutingModule,
    StoreModule.forFeature('game', reducers),
    EffectsModule.forFeature(effects),
  ],
  declarations: [...containers, ...components],
  providers: [],
})
export class GameModule {}
