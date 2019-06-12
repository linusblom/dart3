import { Round, Score, ScoreBoard } from '@game/models';

export abstract class Calculate {
  abstract calculate(rounds: Round[]): ScoreBoard;

  mapToPlayerRounds(rounds: Round[]): Score[][][] {
    return rounds.map(round =>
      Object.entries(round)
        .filter(([_, value]) => Array.isArray(value))
        .reduce((acc, [_, value]: [string, Score[]]) => [...acc, value], []),
    );
  }

  getHitTotal(score: Score) {
    return score.score * score.multiplier;
  }

  getRoundTotal(scores: Score[]) {
    return scores.reduce((total, score) => total + this.getHitTotal(score), 0);
  }
}
