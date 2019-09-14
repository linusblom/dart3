import { Injectable, Injector } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { GameType } from '@game/models';
import { getGame, State } from '@game/reducers';

import { DefaultController } from './default.controller';
import { GameController } from './game.controller';
import { HalveItController } from './halveit.controller';
import { LegsController } from './legs.controller';

@Injectable()
export class ControllerService {
  private gameType: GameType;

  constructor(private readonly injector: Injector, private store: Store<State>) {
    this.store.pipe(select(getGame)).subscribe(({ type }) => (this.gameType = type));
  }

  getController(): GameController {
    switch (this.gameType) {
      case GameType.HALVEIT:
        return this.injector.get<HalveItController>(HalveItController);
      case GameType.LEGS:
        return this.injector.get<LegsController>(LegsController);
      default:
        return this.injector.get<DefaultController>(DefaultController);
    }
  }
}
