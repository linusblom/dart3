import { Injectable } from '@angular/core';

import { BoardData, GamePlayer, JackpotDrawType, Score } from '@game/models';
import { State } from '@game/reducers';
import { Store } from '@ngrx/store';

import { GameController } from './game.controller';

@Injectable()
export class LegsController extends GameController {
  constructor(store: Store<State>) {
    super(store);
  }

  endTurn(scores: Score[]): Partial<GamePlayer> {
    const player = this.getCurrentPlayer();
    const previousPlayerScores = this.getPreviousPlayerScores();
    const activePlayers = this.getActivePlayers();

    const { round, ...rest } = this.checkScore(player, scores, previousPlayerScores, activePlayers);

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
    return this.getActivePlayers() === 1;
  }

  getBoardData(): BoardData {
    const turnText = `Score to beat ${this.getTurnTotal(this.getPreviousPlayerScores())}`;

    return {
      roundHeaders: Array(this.game.currentRound + 1)
        .fill(null)
        .map((_, index) => `${index}`),
      totalHeader: 'Legs',
      turnText,
    };
  }

  private checkScore(
    currentPlayer: GamePlayer,
    currentPlayerScores: Score[],
    previousPlayerScores: Score[],
    activePlayers: number,
  ) {
    const currentPlayerTotal = this.getTurnTotal(currentPlayerScores);
    const previousPlayerTotal = this.getTurnTotal(previousPlayerScores);

    if (currentPlayerTotal <= previousPlayerTotal) {
      const legsLeft = currentPlayer.total - 1;

      return {
        position: legsLeft === 0 ? activePlayers : 0,
        total: legsLeft,
        totalDisplay:
          legsLeft > 0
            ? Array(legsLeft)
                .fill('&#x1f9b5;')
                .join(' ')
            : '&#x274C',
        round: {
          score: currentPlayerTotal,
          scoreDisplay: `${currentPlayerTotal}`,
          color: '#bf340a',
        },
      };
    }

    return {
      total: currentPlayer.total,
      totalDisplay: currentPlayer.totalDisplay,
      round: {
        score: currentPlayerTotal,
        scoreDisplay: `${currentPlayerTotal}`,
        color: '#9ACB34',
      },
    };
  }
}
