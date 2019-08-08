import { RoundScore, Score } from '@game/models';

export abstract class GameController {
  abstract calculateRoundScore(
    scores: Score[],
    currentRound: number,
    total: number,
  ): Omit<RoundScore, 'round.jackpotWin'>;
  abstract shouldEnd(playersCount: number, currentRounds: number[]): boolean;

  protected getHitTotal(score: Score) {
    return score.score * score.multiplier;
  }

  getRoundTotal(scores: Score[], allowMisses = true) {
    if (!allowMisses && scores.filter(score => score.score === 0).length > 0) {
      return 0;
    }

    return scores.reduce((total, score) => total + this.getHitTotal(score), 0);
  }
}
