import { GameType } from 'dart3-sdk';

export interface RoundDetails {
  matchTeamId: number;
  gameType: GameType;
  round: number;
  tieBreak: boolean;
  currentTotal: number;
  previousTotal: number;
}

export enum CheckOutType {
  Bust = 'bust',
  Done = 'done',
  Continue = 'continue',
}

export interface CheckOutScore {
  v: number;
  m: number;
  s: string;
}

export const multiplierChar = {
  3: 'T',
  2: 'D',
  1: '',
};

export const getBoardScores = (): CheckOutScore[] => {
  return [
    { v: 25, m: 1, s: '25' },
    { v: 25, m: 2, s: 'BULL' },
    ...[1, 2, 3].reduce(
      (acc, m) => [
        ...acc,
        ...Array(20)
          .fill(0)
          .map((_, v) => ({ v: v + 1, m, s: `${multiplierChar[m]}${v + 1}` })),
      ],
      [],
    ),
  ].sort((a, b) => b.v * b.m - a.v * a.m);
};
