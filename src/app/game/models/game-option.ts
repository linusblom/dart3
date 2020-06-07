import { GameType } from 'dart3-sdk';

export interface GameOption {
  types: GameType[];
  color: string;
  name: string;
  description: string;
}

export enum GameWizardStep {
  SelectGame = 'select-game',
  GameSettings = 'game-settings',
  SelectPlayers = 'select-players',
}

export const availableGames: GameOption[] = [
  {
    types: [GameType.HalveIt],
    color: '#4fa7c4',
    name: 'Halve It',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    types: [GameType.Legs],
    color: '#e86831',
    name: 'Legs',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    types: [GameType.Three01SingleInDoubleOut, GameType.Three01SDoubleInDoubleOut],
    color: '#4fb37b',
    name: '301',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    types: [GameType.Five01SingleInDoubleOut, GameType.Five01DoubleInDoubleOut],
    color: '#ad319f',
    name: '501',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
];

export const availableBets: number[] = [10, 20, 50, 100, 200, 500, 1000];
export const availableSets: number[] = [1, 3, 5];
export const availableLegs: number[] = [1, 3, 5];
