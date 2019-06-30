import { Score } from '.';

export interface Game {
  type: GameType;
  bet: number;
  started: number;
  ended: number;
  playerOrder: string[];
  prizePool: number;
  currentTurn: number;
  currentRound: number;
  players: GamePlayer[];
}

export enum GameType {
  HALVEIT = 'halveit',
  LEGS = 'legs',
  THREEHUNDREDONE = 'threehundredone',
}

export interface GamePlayer {
  id: string;
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

export interface GameConfigMap {
  [key: string]: GameConfig;
}

export interface GameConfig {
  shortRoundName: Function;
  longRoundName: Function;
}
