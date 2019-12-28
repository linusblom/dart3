import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { BoardData, GamePlayer, JackpotDrawType, Score } from '@game/models';
import { State } from '@game/reducers';
import { GREEN, RED } from '@utils/colors';
import { GameController } from './game.controller';

@Injectable()
export class XHundredOneController extends GameController {
  constructor(store: Store<State>) {
    super(store);
  }

  endTurn(scores: Score[]): Partial<GamePlayer> {
    const player = this.getCurrentPlayer();
    const { round, ...rest } = this.checkScore(scores, player.total);

    return {
      id: player.id,
      currentRound: this.game.currentRound,
      xp: player.xp + this.getTurnTotal(scores),
      ...rest,
      rounds: {
        [this.game.currentRound]: {
          scores,
          jackpotDraw: JackpotDrawType.PENDING,
          ...round,
        },
      },
    };
  }

  shouldGameEnd(): boolean {
    return this.getCurrentPlayer().total === 0;
  }

  getBoardData(): BoardData {
    return {
      turnText: this.getCurrentPlayer().totalDisplay,
    };
  }

  private checkScore(scores: Score[], currentTotal: number) {
    const { total, score, bust } = scores.reduce(
      (acc, hit) => {
        if (acc.total === 0 && !acc.bust) {
          return acc;
        }

        const hitTotal = this.getHitTotal(hit);

        return {
          total: acc.total - hitTotal,
          score: acc.score + hitTotal,
          bust: !((acc.total - hitTotal === 0 && hit.multiplier === 2) || acc.total - hitTotal > 1),
        };
      },
      { total: currentTotal, score: 0, bust: false },
    );

    return {
      total: bust ? currentTotal : total,
      totalDisplay: `${bust ? currentTotal : total}`,
      round: {
        score,
        scoreDisplay: `${score}`,
        color: bust ? RED : GREEN,
      },
    };
  }
}
