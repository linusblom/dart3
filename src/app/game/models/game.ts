export interface Game {
  id: string;
  type: GameType;
  bet: number;
  started: number;
  ended: number;
  players: string[];
  playerTurn: number;
  prizePool: number;
  currentRound: number;
}

export enum GameType {
  HALVEIT = 'halveit',
  LEGS = 'legs',
  THREEHUNDREDONE = 'threehundredone',
}
