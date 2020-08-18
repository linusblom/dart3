import { GameType } from 'dart3-sdk';

export interface GameOption {
  type: GameType;
  color: string;
  description: string;
  disabled: boolean;
}

export enum GameWizardStep {
  SelectGame = 'select-game',
  GameSettings = 'game-settings',
  SelectPlayers = 'select-players',
}

export const availableGames: GameOption[] = [
  {
    type: GameType.HalveIt,
    color: '#4fa7c4',
    description:
      'Players should in each round try to hit a selected target. Only the selected target will give player score, and failure to hit target will result in player losing half their accumulated score. Player with highest score after eight rounds will win.',
    disabled: false,
  },
  {
    type: GameType.Legs,
    color: '#e86831',
    description:
      'Each player starts with three legs and looses a leg every time they fail to beat the score of the previous player. The winner is the last player left with any legs.',
    disabled: false,
  },
  {
    type: GameType.Three01,
    color: '#4fb37b',
    description:
      'Players start with a score of 301. First player to reach exactly zero wins. Player must check out on any double.',
    disabled: true,
  },
  {
    type: GameType.Five01,
    color: '#ad319f',
    description:
      'Players start with a score of 501. First player to reach exactly zero wins. Player must check out on any double.',
    disabled: true,
  },
];

export const availableBets: number[] = [10, 20, 50, 100, 200, 500, 1000];
export const availableSets: number[] = [1, 3, 5];
export const availableLegs: number[] = [1, 3, 5];
