export enum GameType {
  HALVEIT = 'halveit',
  LEGS = 'legs',
  THREEHUNDREDONE = 'threehundredone',
}

export interface GamePlayer {
  total: number;
  totalDisplay: string;
  currentRound: number;
  out: boolean;
  xp: number;
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
}

export interface Calculate {
  round: Round;
  total: number;
  totalDisplay: string;
}

export const makeGamePlayer = (type: GameType, bet: number): GamePlayer => {
  switch (type) {
    default:
      return {
        total: 0,
        totalDisplay: '0',
        currentRound: 0,
        out: false,
        xp: bet * 10,
        rounds: {},
      };
  }
};
