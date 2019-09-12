import { GameType, GamePlayerMap } from '../models/game';
import { resultsHalveIt } from './resultsHalveIt';
import { resultsLegs } from './resultsLegs';

export const getGameResults = (
  players: FirebaseFirestore.QuerySnapshot,
  type: GameType,
): GamePlayerMap => {
  switch (type) {
    case GameType.HALVEIT:
      return resultsHalveIt(players);
    case GameType.LEGS:
      return resultsLegs(players);
    default:
      return {};
  }
};
