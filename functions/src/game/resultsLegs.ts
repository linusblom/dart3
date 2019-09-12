import { GamePlayerMap } from '../models/game';

export const resultsLegs = (players: FirebaseFirestore.QuerySnapshot): GamePlayerMap => {
  const gamePlayerMap = {} as GamePlayerMap;

  players.forEach(player => {
    gamePlayerMap[player.id] = { position: player.data().position || 1 };
  });

  return gamePlayerMap;
};
