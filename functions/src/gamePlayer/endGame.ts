import { GameType } from '../models/game';

const checkHalveItEnd = (playersCount: number, currentRounds: number[]): boolean =>
  playersCount === currentRounds.filter(currentRound => currentRound === 8).length;

export const shouldGameEnd = (
  type: GameType,
  playersCount: number,
  currentRounds: number[],
): boolean => {
  switch (type) {
    case GameType.HALVEIT:
      return checkHalveItEnd(playersCount, currentRounds);
    default:
      return false;
  }
};
