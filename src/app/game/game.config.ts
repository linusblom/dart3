import { GameConfigMap, GameType } from './models';

export const config: GameConfigMap = {
  default: {
    shortRoundName: () => {},
    longRoundName: () => {},
  },
  [GameType.HALVEIT]: {
    shortRoundName: (currentRound: number) =>
      ['19', '18', 'D', '17', '41', 'T', '20', 'B'][currentRound - 1],
    longRoundName: (currentRound: number) =>
      ['Nineteen', 'Eighteen', 'Double', 'Seventeen', 'Forty one', 'Triple', 'Twenty', 'Bullseye'][
        currentRound - 1
      ],
  },
};
