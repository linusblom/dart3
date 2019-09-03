import { Score } from './game';

export interface JackpotRound {
  win: boolean;
  hits: Score[];
}

export enum JackpotDrawType {
  PENDING = 'pending',
  BLANK = 'blank',
  WIN = 'win',
}
