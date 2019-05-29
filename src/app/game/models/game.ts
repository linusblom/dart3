export interface Game {
  id: string;
  type: GameType;
  bet: number;
  created: number;
  started: number;
  ended: number;
  players: string[];
}

export enum GameType {
  HALVEIT = 'halveit',
  LEGS = 'legs',
}
