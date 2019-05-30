export interface Game {
  id: string;
  type: GameType;
  bet: number;
  started: number;
  ended: number;
  players: string[];
  playerTurn: number;
  prizePool: number;
}

export enum GameType {
  HALVEIT = 'halveit',
  LEGS = 'legs',
  THREEHUNDREDONE = 'threehundredone',
}
