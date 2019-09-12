import { HalveItController, LegsController } from './controllers';
import { GameConfigMap, GameType } from './models';

export const config: GameConfigMap = {
  default: {
    shortRoundName: () => {},
    longRoundName: () => {},
    totalHeader: 'Total',
    controller: null,
  },
  [GameType.HALVEIT]: {
    shortRoundName: (currentRound: number) =>
      ['19', '18', 'D', '17', '41', 'T', '20', 'B'][currentRound - 1],
    longRoundName: (currentRound: number) =>
      ['Nineteen', 'Eighteen', 'Double', 'Seventeen', 'Forty one', 'Triple', 'Twenty', 'Bullseye'][
        currentRound - 1
      ],
    totalHeader: 'Total',
    controller: new HalveItController(),
  },
  [GameType.LEGS]: {
    shortRoundName: (currentRound: number) => `${currentRound}`,
    longRoundName: (currentRound: number) => `Round ${currentRound}`,
    totalHeader: 'Legs',
    controller: new LegsController(),
  },
};
