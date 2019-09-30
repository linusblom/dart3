import { Injectable } from '@angular/core';

import { BoardData, GamePlayer, JackpotDrawType, Score, UNUSED } from '@game/models';
import { State } from '@game/reducers';
import { Store } from '@ngrx/store';

import { GameController } from './game.controller';

@Injectable()
export class HalveItController extends GameController {
  constructor(store: Store<State>) {
    super(store);
  }

  endTurn(scores: Score[]): Partial<GamePlayer> {
    const player = this.getCurrentPlayer();
    const score = this.checkRound(scores, this.game.currentRound);
    const { round, ...rest } = this.getRoundTotalScore(score, player.total);

    return {
      id: player.id,
      currentRound: this.game.currentRound,
      xp: player.xp + this.getTurnTotal(scores),
      ...rest,
      rounds: {
        [this.game.currentRound]: { scores, jackpotDraw: JackpotDrawType.PENDING, ...round },
      },
    };
  }

  shouldGameEnd(): boolean {
    return (
      this.game.players.length ===
      this.game.players.filter(player => player.currentRound === 8).length
    );
  }

  getBoardData(): BoardData {
    const turnText = [
      UNUSED,
      'Nineteen',
      'Eighteen',
      'Double',
      'Seventeen',
      'Forty one',
      'Triple',
      'Twenty',
      'Bullseye',
    ][this.game.currentRound];

    return {
      turnText,
    };
  }

  private checkScore(scores: Score[], allowedScores: number[]): number {
    return scores.reduce(
      (total, score) =>
        allowedScores.includes(score.score) ? total + this.getHitTotal(score) : total,
      0,
    );
  }

  private checkMultiplier(scores: Score[], allowedMultipliers: number[]): number {
    return scores.reduce(
      (total, score) =>
        allowedMultipliers.includes(score.multiplier) ? total + this.getHitTotal(score) : total,
      0,
    );
  }

  private checkTotal(scores: Score[], allowedTotal: number): number {
    const total = this.getTurnTotal(scores, false);
    return total === allowedTotal ? total : 0;
  }

  private checkRound(scores: Score[], currentRound: number): number {
    switch (currentRound) {
      case 1:
        return this.checkScore(scores, [19]);
      case 2:
        return this.checkScore(scores, [18]);
      case 3:
        return this.checkMultiplier(scores, [2]);
      case 4:
        return this.checkScore(scores, [17]);
      case 5:
        return this.checkTotal(scores, 41);
      case 6:
        return this.checkMultiplier(scores, [3]);
      case 7:
        return this.checkScore(scores, [20]);
      case 8:
        return this.checkScore(scores, [25]);
      default:
        return 0;
    }
  }

  private getRoundTotalScore(score: number, currentTotal: number) {
    return score > 0
      ? {
          round: {
            score,
            scoreDisplay: `${score}`,
            color: '#9ACB34',
          },
          total: currentTotal + score,
          totalDisplay: `${currentTotal + score}`,
        }
      : {
          round: {
            score: 0,
            scoreDisplay: '&#x2620;',
          },
          total: Math.ceil(currentTotal / 2),
          totalDisplay: `${Math.ceil(currentTotal / 2)}`,
        };
  }
}
