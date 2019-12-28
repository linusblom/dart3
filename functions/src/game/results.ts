import { GameType, GamePlayerMap } from '../models/game';
import { resultsHalveIt } from './resultsHalveIt';
import { resultsLegs } from './resultsLegs';
import { resultsX01 } from './resultsX01';

export const getGameResults = (
  players: FirebaseFirestore.QuerySnapshot,
  type: GameType,
): GamePlayerMap => {
  switch (type) {
    case GameType.HALVEIT:
      return resultsHalveIt(players);
    case GameType.LEGS:
      return resultsLegs(players);
    case GameType.THREE_HUNDRED_ONE:
    case GameType.FIVE_HUNDRED_ONE:
      return resultsX01(players);
    default:
      return {};
  }
};
