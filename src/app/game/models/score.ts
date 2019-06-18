import { Calculate } from '@game/calculate/calculate';

export interface Score {
  score: number;
  multiplier: number;
}

export interface ScoreServiceMap {
  [key: string]: Calculate;
}
