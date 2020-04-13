import { GameType } from 'dart3-sdk';

export interface GameOption {
  variants: GameType[];
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
    variants: [GameType.HalveIt],
    color: '#4056a1',
    name: 'Halve It',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    variants: [GameType.Legs],
    color: '#e27d60',
    name: 'Legs',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    variants: [GameType.Three01SingleInDoubleOut, GameType.Three01SDoubleInDoubleOut],
    color: '#5cdb95',
    name: '301',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    variants: [GameType.Five01SingleInDoubleOut, GameType.Five01DoubleInDoubleOut],
    color: '#557a95',
    name: '501',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
];

export const availableBets: number[] = [10, 20, 50, 100, 200, 500];
export const availableSets: number[] = [1, 2, 3];
export const availableLegs: number[] = [1, 2, 3];
