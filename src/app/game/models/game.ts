import { GameController } from '@game/controllers';

import { JackpotDrawType } from './jackpot';

export interface Game {
  id: string;
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
  LEGS_CLASSIC = 'legs-classic',
  THREE_HUNDRED_ONE = 'three-hundred-one',
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
  jackpotDraw: JackpotDrawType;
  color?: string;
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
  totalHeader: string;
  controller: GameController;
}

export enum DartHitType {
  AVATAR = 'avatar',
  DIAMOND = 'diamond',
}

export interface DartHit extends Score {
  id: string;
  top: number;
  left: number;
  type: DartHitType;
}
