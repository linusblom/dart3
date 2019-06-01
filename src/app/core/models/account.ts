import { GameType } from '@game/models';

export interface Account {
  created: number;
  jackpot: number;
  hiddenJackpot: number;
  currentGame: string;
  allowedBets: number[];
  allowedGames: GameType[];
}
