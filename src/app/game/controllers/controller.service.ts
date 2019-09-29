import { Injectable, Injector } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';

import { GameType } from '@game/models';
import { getCurrentGame, State } from '@game/reducers';

import { DefaultController } from './default.controller';
import { GameController } from './game.controller';
import { HalveItController } from './halveit.controller';
import { LegsController } from './legs.controller';

@Injectable()
export class ControllerService {
  private gameType: GameType;

  constructor(private readonly injector: Injector, private store: Store<State>) {
    this.store.pipe(select(getCurrentGame)).subscribe(({ type }) => (this.gameType = type));
  }

  getController(type: GameType = this.gameType): GameController {
    switch (type) {
      case GameType.HALVEIT:
        return this.injector.get<HalveItController>(HalveItController);
      case GameType.LEGS:
        return this.injector.get<LegsController>(LegsController);
      default:
        return this.injector.get<DefaultController>(DefaultController);
    }
  }
}
