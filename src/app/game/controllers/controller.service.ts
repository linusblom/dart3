import { Injectable, Injector } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { GameType } from 'dart3-sdk';

import { getCurrentGame, State } from '@game/reducers';

import { DefaultController } from './default.controller';
import { GameController } from './game.controller';
import { HalveItController } from './halveit.controller';
import { LegsController } from './legs.controller';
import { X01Controller } from './x01.controller';

@Injectable()
export class ControllerService {
  private gameType: GameType;

  constructor(private readonly injector: Injector, private store: Store<State>) {
    this.store.pipe(select(getCurrentGame)).subscribe(({ type }) => (this.gameType = type));
  }

  getController(type: GameType = this.gameType): GameController {
    switch (type) {
      case GameType.HalveIt:
        return this.injector.get<HalveItController>(HalveItController);
      case GameType.Legs:
        return this.injector.get<LegsController>(LegsController);
      case GameType.Three01:
      case GameType.Five01:
        return this.injector.get<X01Controller>(X01Controller);
      default:
        return this.injector.get<DefaultController>(DefaultController);
    }
  }
}
