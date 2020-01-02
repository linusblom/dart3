import { Game, GameType, Round, Score } from 'dart3-sdk';

export const UNUSED = 'unused';

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
  id: string;
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
