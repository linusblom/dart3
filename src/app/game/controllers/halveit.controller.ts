import { Score, JackpotDrawType, GamePlayer, Game } from '@game/models';

import { GameController } from './game.controller';

export class HalveItController extends GameController {
  endTurn(scores: Score[], game: Game): Partial<GamePlayer> {
    const player = this.getCurrentPlayer(game);
    const score = this.checkRound(scores, game.currentRound);
    const { round, ...rest } = this.getRoundTotalScore(score, player.total);

    return {
      id: player.id,
      currentRound: game.currentRound,
      xp: player.xp + this.getTurnTotal(scores),
      ...rest,
      rounds: { [game.currentRound]: { scores, jackpotDraw: JackpotDrawType.PENDING, ...round } },
    };
  }

  shouldEnd(players: GamePlayer[]): boolean {
    return players.length === players.filter(player => player.currentRound === 8).length;
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
