import { Score } from './score';

export interface Round {
  id: string;
  [key: string]: Score[] | string;
}
