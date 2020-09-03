import { GameType, Check } from 'dart3-sdk';

export interface GameSettings {
  tournament: boolean;
  team: boolean;
  bet: number;
  sets: number;
  legs: number;
  startScore: number;
  checkIn: Check;
  checkOut: Check;
  tieBreak: number;
}

export interface GameOption {
  name: string;
  type: GameType;
  color: string;
  bets: number[];
  sets: number[];
  legs: number[];
  startScore: number[];
  checkIn: Check[];
  checkOut: Check[];
  tieBreak: number[];
  description: string;
  disabled: boolean;
}

export enum GameWizardStep {
  SelectGame = 'select-game',
  GameSettings = 'game-settings',
  SelectPlayers = 'select-players',
}

const basicOptions = {
  checkIn: [Check.Straight],
  checkOut: [Check.Straight],
  startScore: [0],
  tieBreak: [0],
  disabled: false,
  bets: [10, 20, 50, 100, 200, 500, 1000],
  sets: [1, 3, 5],
  legs: [1, 3, 5],
};

export const options: GameOption[] = [
  {
    ...basicOptions,
    name: 'Halve It',
    type: GameType.HalveIt,
    color: '#4fa7c4',
    description:
      'Players should in each round try to hit a selected target. Only the selected target will give player score, and failure to hit target will result in player losing half their accumulated score. Player with highest score after eight rounds will win.',
  },
  {
    ...basicOptions,
    name: 'Legs',
    type: GameType.Legs,
    color: '#e86831',
    description:
      'Each player starts with 3/5/7 legs and looses a leg every time they fail to beat the score of the previous player. The winner is the last player left with any legs.',
    startScore: [3, 5, 7],
  },
  {
    ...basicOptions,
    name: 'X01',
    type: GameType.X01,
    color: '#4fb37b',
    description:
      'Players start with a score of 301/501/701. First player to reach exactly zero wins. Optional check-in and -out on double or master.',
    startScore: [301, 501, 701],
    checkIn: [Check.Straight, Check.Double, Check.Master],
    checkOut: [Check.Straight, Check.Double, Check.Master],
    tieBreak: [0, 10, 15, 20, 25, 30],
  },
  {
    ...basicOptions,
    name: 'TBD',
    type: 'new' as GameType,
    color: '#ad319f',
    description: 'Cool New Game',
    disabled: true,
  },
];
