import { GameType, GamePlayerMap } from '../models/game';
import { resultsHalveIt } from './resultsHalveIt';
import { resultsLegs } from './resultsLegs';
import { resultsXHundredOne } from './resultsXHundredOne';

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
      return resultsXHundredOne(players);
    default:
      return {};
  }
};
