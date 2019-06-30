import { GameType, GamePlayer } from '../models/game';

export const initGamePlayer: { [key: string]: GamePlayer } = {
  [GameType.HALVEIT]: {
    total: '0',
    currentRound: 0,
    out: false,
    rounds: {},
  },
};
