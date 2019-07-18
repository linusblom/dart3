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
  const total = getRoundTotal(scores, false);
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

const getRoundTotalScore = (score: number, currentTotal: number) => {
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
          color: '#FFFFFF',
        },
        total: Math.ceil(currentTotal / 2),
        totalDisplay: `${Math.ceil(currentTotal / 2)}`,
      };
};

export const halveItCalculate = (
  round: Round,
  currentRound: number,
  currentTotal: number,
): Calculate => {
  const score = checkRound(round.scores, currentRound);
  const roundTotal = getRoundTotalScore(score, currentTotal);

  return {
    round: { ...round, ...roundTotal.round },
    total: roundTotal.total,
    totalDisplay: roundTotal.totalDisplay,
  };
};
