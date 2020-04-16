import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { SharedModule } from '@shared/shared.module';
import { CurrencyPipe } from '@shared/pipes/currency.pipe';

import { components } from './components';
import { containers } from './containers';
import { effects } from './effects';
import { GameRoutingModule } from './game.routing';
import { reducers } from './reducers';
import { services } from './services';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    GameRoutingModule,
    DragDropModule,
    StoreModule.forFeature('game', reducers),
    EffectsModule.forFeature(effects),
  ],
  declarations: [...containers, ...components],
  providers: [...services, CurrencyPipe],
})
export class GameModule {}
