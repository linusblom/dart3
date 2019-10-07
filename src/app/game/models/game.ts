import { JackpotDrawType } from './jackpot';

export const UNUSED = 'unused';

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
  boardData?: BoardData;
}

export enum GameType {
  HALVEIT = 'halveit',
  LEGS = 'legs',
  LEGS_CLASSIC = 'legs-classic',
  THREE_HUNDRED_ONE = 'three-hundred-one',
}

export interface PlayerBase {
  name: string;
  xp: number;
  color: string;
  avatarUrl: string;
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
  base: PlayerBase;
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

export interface BoardData {
  turnText: string;
}

export interface ListOptions {
  where?: {
    fieldPath: string;
    operator: '<' | '<=' | '==' | '>=' | '>' | 'array-contains';
    value: any;
  };
  orderBy?: {
    fieldPath: string;
    direction: 'asc' | 'desc';
  };
  limit?: number;
}

export interface Result {
  type: GameType;
  name: string;
  win: number;
  ended: number;
}

export const createGame = (values: Partial<Game> = {}): Game => ({
  id: null,
  type: null,
  bet: 0,
  started: 0,
  ended: 0,
  players: [],
  playerIds: [],
  prizePool: 0,
  currentTurn: 0,
  currentRound: 0,
  boardData: {
    turnText: '',
  },
  ...values,
});
