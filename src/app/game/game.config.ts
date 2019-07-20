import { HalveItController } from './controllers';
import { GameConfigMap, GameType } from './models';

export const config: GameConfigMap = {
  default: {
    shortRoundName: () => {},
    longRoundName: () => {},
    controller: null,
  },
  [GameType.HALVEIT]: {
    shortRoundName: (currentRound: number) =>
      ['19', '18', 'D', '17', '41', 'T', '20', 'B'][currentRound - 1],
    longRoundName: (currentRound: number) =>
      ['Nineteen', 'Eighteen', 'Double', 'Seventeen', 'Forty one', 'Triple', 'Twenty', 'Bullseye'][
        currentRound - 1
      ],
    controller: new HalveItController(),
  },
};
