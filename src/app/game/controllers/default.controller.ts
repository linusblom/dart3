import { Injectable } from '@angular/core';

import { Game, GamePlayer, Score } from '@game/models';

import { GameController } from './game.controller';

@Injectable()
export class DefaultController extends GameController {
  endTurn(scores: Score[], game: Game): Partial<GamePlayer> {
    return {};
  }

  shouldGameEnd(players: GamePlayer[]): boolean {
    return false;
  }

  roundHeader(round: number): string {
    return `${round}`;
  }

  totalHeader(): string {
    return 'Total';
  }

  turnText(game: Game): string {
    return '';
  }
}
