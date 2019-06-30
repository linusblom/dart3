export enum GameType {
  HALVEIT = 'halveit',
  LEGS = 'legs',
  THREEHUNDREDONE = 'threehundredone',
}

export interface GamePlayer {
  total: string;
  currentRound: number;
  out: boolean;
  rounds: {
    [key: string]: {
      scores: Score[];
      display: string;
    };
  };
}

export interface Score {
  score: number;
  multiplier: number;
}
