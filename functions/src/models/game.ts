import { JackpotDrawType } from './jackpot';

export enum GameType {
  HALVEIT = 'halveit',
  LEGS = 'legs',
  THREEHUNDREDONE = 'threehundredone',
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
  switch (type) {
    default:
      return {
        total: 0,
        totalDisplay: '0',
        currentRound: 0,
        position: 0,
        xp: bet * 10,
        win: 0,
        rounds: {},
      };
  }
};
