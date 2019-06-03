import { Score } from './score';

export interface Round {
  id: string;
  header?: string;
  text?: string;
  [key: string]: Score[] | string;
}

export const halveItRoundText = {
  '0': 'Round 19',
  '1': 'Round 18',
  '2': 'Round Double',
  '3': 'Round 17',
  '4': 'Round 41',
  '5': 'Round Triple',
  '6': 'Round 20',
  '7': 'Round Bullseye',
};

export interface Calculate {
  calculate(rounds: Round[]): Round[];
}
