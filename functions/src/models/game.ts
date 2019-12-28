import { JackpotDrawType } from './jackpot';

export enum GameType {
  HALVEIT = 'halveit',
  LEGS = 'legs',
  LEGS_CLASSIC = 'legs-classic',
  THREE_HUNDRED_ONE = 'three-hundred-one',
  FIVE_HUNDRED_ONE = 'five-hundred-one',
}

export interface GamePlayer {
  total: number;
  totalDisplay: string;
  currentRound: number;
  position: number;
  xp: number;
  win: number;
  rounds: {
    [key: string]: Round;
  };
}

export interface Score {
  score: number;
  multiplier: number;
}

export interface Round {
  scores: Score[];
  score: number;
  scoreDisplay: string;
  color: string;
  jackpotDraw: JackpotDrawType;
}

export interface GamePlayerMap {
  [key: string]: Partial<GamePlayer>;
}

export const makeGamePlayer = (type: GameType, bet: number): GamePlayer => {
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
    case GameType.HALVEIT:
      return gamePlayerBase;
    case GameType.LEGS:
      return {
        ...gamePlayerBase,
        totalDisplay: '',
      };
    case GameType.THREE_HUNDRED_ONE:
      return {
        ...gamePlayerBase,
        total: 301,
        totalDisplay: '301',
      };
    case GameType.FIVE_HUNDRED_ONE:
      return {
        ...gamePlayerBase,
        total: 301,
        totalDisplay: '501',
      };
    default:
      return gamePlayerBase;
  }
};
