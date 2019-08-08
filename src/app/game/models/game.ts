import { GameController } from '@game/controllers';

export interface Game {
  type: GameType;
  bet: number;
  started: number;
  ended: number;
  playerIds: string[];
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
  jackpotWin?: boolean;
}

export interface RoundScore {
  round: Round;
  total: number;
  totalDisplay: string;
}

export interface GameConfigMap {
  [key: string]: GameConfig;
}

export interface GameConfig {
  shortRoundName: Function;
  longRoundName: Function;
  controller: GameController;
}
