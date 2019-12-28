import { GameType } from '@game/models';

export const getGameNiceName = (type: GameType) => {
  switch (type) {
    case GameType.HALVEIT:
      return 'halve it';
    case GameType.LEGS_CLASSIC:
      return 'legs classic';
    default:
      return type;
  }
};
