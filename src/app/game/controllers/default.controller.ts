import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { GameData, GamePlayer, Score } from '@game/models';
import { State } from '@game/reducers';

import { GameController } from './game.controller';

@Injectable()
export class DefaultController extends GameController {
  constructor(store: Store<State>) {
    super(store);
  }

  endTurn(scores: Score[]): Partial<GamePlayer> {
    return {};
  }

  shouldGameEnd(): boolean {
    return false;
  }

  getGameData(): GameData {
    return {
      roundHeaders: [],
      totalHeader: '',
      turnText: '',
    };
  }
}
