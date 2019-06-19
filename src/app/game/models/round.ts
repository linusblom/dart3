import { Score } from './score';

export interface Round {
  id: string;
  header?: string;
  text?: string;
  [key: string]: Score[] | string;
}

export interface ScoreBoard {
  roundScores: number[][];
  total: { [key: string]: number };
  roundText: string[];
  totalText?: string;
}
