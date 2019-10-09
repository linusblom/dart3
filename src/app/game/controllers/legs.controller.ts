import { Injectable } from '@angular/core';

import { BoardData, GamePlayer, JackpotDrawType, Score } from '@game/models';
import { State } from '@game/reducers';
import { Store } from '@ngrx/store';
import { GREEN, RED } from '@utils/colors';
import { SKULL } from '@utils/emojis';

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
    return {
      turnText: `Score to beat ${this.getTurnTotal(this.getPreviousPlayerScores())}`,
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
      const total = currentPlayer.total + 1;

      return {
        position: total === 3 ? activePlayers : 0,
        total,
        totalDisplay: Array(total)
          .fill(SKULL)
          .join(' '),
        round: {
          score: currentPlayerTotal,
          scoreDisplay: `${currentPlayerTotal}`,
          color: RED,
        },
      };
    }

    return {
      total: currentPlayer.total,
      totalDisplay: currentPlayer.totalDisplay,
      round: {
        score: currentPlayerTotal,
        scoreDisplay: `${currentPlayerTotal}`,
        color: GREEN,
      },
    };
  }
}
