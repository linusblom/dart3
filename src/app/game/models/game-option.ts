import { GameType } from 'dart3-sdk';

export interface GameOption {
  types: GameType[];
  color: string;
  name: string;
}

export enum GameOptionStep {
  SelectGame = 'select-game',
  GameSettings = 'game-settings',
}

export const availableGames: GameOption[] = [
  {
    types: [GameType.HalveIt],
    color: '#4056a1',
    name: 'Halve It',
  },
  {
    types: [GameType.Legs],
    color: '#e27d60',
    name: 'Legs',
  },
  {
    types: [GameType.Three01SingleInDoubleOut, GameType.Three01SDoubleInDoubleOut],
    color: '#5cdb95',
    name: '301',
  },
  {
    types: [GameType.Five01SingleInDoubleOut, GameType.Five01DoubleInDoubleOut],
    color: '#557a95',
    name: '501',
  },
];

export const availableBets: number[] = [10, 20, 50, 100, 200, 500];
export const availableSets: number[] = [1, 2, 3];
export const availableLegs: number[] = [1, 2, 3];
