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
      'Each player start with three legs. Player with lowest score after each round will lose one leg. Players with score of 100 or above will automatically advance to next round without losing a leg. Players with zero legs left is out, and last player standing will win.',
    disabled: true,
  },
  {
    type: GameType.Three01,
    color: '#4fb37b',
    description:
      'Players start with a score of 301. First player to reach exactly zero wins. Player must check out (and optional in) on any double.',
    disabled: true,
  },
  {
    type: GameType.Five01,
    color: '#ad319f',
    description:
      'Players start with a score of 501. First player to reach exactly zero wins. Player must check out (and optional in) on any double.',
    disabled: true,
  },
];

export const availableBets: number[] = [10, 20, 50, 100, 200, 500, 1000];
export const availableSets: number[] = [1, 3, 5];
export const availableLegs: number[] = [1, 3, 5];
