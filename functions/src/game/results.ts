import { GameType, GamePlayerMap } from '../models/game';
import { resultsHalveIt } from './resultsHalveIt';

export const getGameResults = (
  players: FirebaseFirestore.QuerySnapshot,
  type: GameType,
): GamePlayerMap => {
  switch (type) {
    case GameType.HALVEIT:
      return resultsHalveIt(players);
    default:
      return {};
  }
};
