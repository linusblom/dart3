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
  total: number;
  totalDisplay: string;
  currentRound: number;
  out: boolean;
  rounds: {
    [key: string]: Round;
  };
}

export interface Round {
  scores: Score[];
  score: number;
  scoreDisplay: string;
  color: string;
}

export interface GameConfigMap {
  [key: string]: GameConfig;
}

export interface GameConfig {
  shortRoundName: Function;
  longRoundName: Function;
}
