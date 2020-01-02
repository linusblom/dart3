import { GameType } from 'dart3-sdk';

export const getGameNiceName = (type: GameType) => {
  switch (type) {
    case GameType.HalveIt:
      return 'halve it';
    case GameType.LegsClassic:
      return 'legs classic';
    default:
      return type;
  }
};
