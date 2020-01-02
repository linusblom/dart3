import { GameType } from 'dart3-sdk';

import { GamePlayerMap } from '../models/game';
import { resultsHalveIt } from './resultsHalveIt';
import { resultsLegs } from './resultsLegs';
import { resultsX01 } from './resultsX01';

export const getGameResults = (
  players: FirebaseFirestore.QuerySnapshot,
  type: GameType,
): GamePlayerMap => {
  switch (type) {
    case GameType.HalveIt:
      return resultsHalveIt(players);
    case GameType.Legs:
      return resultsLegs(players);
    case GameType.Three01:
    case GameType.Five01:
      return resultsX01(players);
    default:
      return {};
  }
};
