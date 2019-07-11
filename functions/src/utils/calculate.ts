import { Score, Round, GameType, Calculate } from '../models/game';
import { halveItCalculate } from './calculateHalvit';

export const calculate = (
  type: GameType,
  round: Round,
  currentRound: number,
  total: number,
): Calculate => {
  switch (type) {
    case GameType.HALVEIT:
      return halveItCalculate(round, currentRound, total);
    default:
      return { round, total, totalDisplay: `${total}` };
  }
};

export const getHitTotal = (score: Score) => score.score * score.multiplier;

export const getRoundTotal = (scores: Score[]) =>
  scores.reduce((total, score) => total + getHitTotal(score), 0);