import { Round, Calculate, Score } from '../models/game';
import { getHitTotal, getRoundTotal } from './calculate';

const checkScore = (scores: Score[], allowedScores: number[]): number =>
  scores.reduce(
    (total, score) => (allowedScores.includes(score.score) ? total + getHitTotal(score) : total),
    0,
  );

const checkMultiplier = (scores: Score[], allowedMultipliers: number[]): number =>
  scores.reduce(
    (total, score) =>
      allowedMultipliers.includes(score.multiplier) ? total + getHitTotal(score) : total,
    0,
  );

const checkTotal = (scores: Score[], allowedTotal: number): number => {
  const total = getRoundTotal(scores);
  return total === allowedTotal ? total : 0;
};

const checkRound = (scores: Score[], currentRound: number): number => {
  switch (currentRound) {
    case 1:
      return checkScore(scores, [19]);
    case 2:
      return checkScore(scores, [18]);
    case 3:
      return checkMultiplier(scores, [2]);
    case 4:
      return checkScore(scores, [17]);
    case 5:
      return checkTotal(scores, 41);
    case 6:
      return checkMultiplier(scores, [3]);
    case 7:
      return checkScore(scores, [20]);
    case 8:
      return checkScore(scores, [25]);
    default:
      return 0;
  }
};

export const halveItCalculate = (round: Round, currentRound: number, total: number): Calculate => {
  const score = checkRound(round.scores, currentRound);
  const newTotal = score === 0 ? Math.ceil(total / 2) : total + score;

  return {
    round: { ...round, score, scoreDisplay: `${score}` },
    total: newTotal,
    totalDisplay: `${newTotal}`,
  };
};
