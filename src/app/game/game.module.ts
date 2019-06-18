import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { SharedModule } from '@shared/shared.module';

import { calculate } from './calculate';
import { components } from './components';
import { containers } from './containers';
import { effects } from './effects';
import { GameRoutingModule } from './game.routing';
import { reducers } from './reducers';
import { services } from './services';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    GameRoutingModule,
    StoreModule.forFeature('game', reducers),
    EffectsModule.forFeature(effects),
    SharedModule,
  ],
  declarations: [...containers, ...components],
  providers: [...services, ...calculate],
})
export class GameModule {}
