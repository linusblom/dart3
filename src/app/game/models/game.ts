export interface Game {
  type: GameType;
  bet: number;
  started: number;
  ended: number;
  players: string[];
  prizePool: number;
  currentTurn: number;
  currentRound: number;
}

export enum GameType {
  HALVEIT = 'halveit',
  LEGS = 'legs',
  THREEHUNDREDONE = 'threehundredone',
}
