import { GameType, GamePlayer } from 'dart3-sdk';

export interface GamePlayerMap {
  [key: string]: Partial<GamePlayer>;
}

export const makeGamePlayer = (type: GameType, bet: number): Partial<GamePlayer> => {
  const gamePlayerBase = {
    total: 0,
    totalDisplay: '0',
    currentRound: 0,
    position: 0,
    xp: bet * 10,
    win: 0,
    rounds: {},
  };

  switch (type) {
    case GameType.HalveIt:
      return gamePlayerBase;
    case GameType.Legs:
      return {
        ...gamePlayerBase,
        totalDisplay: '',
      };
    case GameType.Three01:
      return {
        ...gamePlayerBase,
        total: 301,
        totalDisplay: '301',
      };
    case GameType.Five01:
      return {
        ...gamePlayerBase,
        total: 501,
        totalDisplay: '501',
      };
    default:
      return gamePlayerBase;
  }
};
