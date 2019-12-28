import { GamePlayerMap } from '../models/game';
import { Result } from '../models/result';

export const resultsX01 = (players: FirebaseFirestore.QuerySnapshot): GamePlayerMap => {
  const results: Result[] = [];

  players.forEach(player => {
    results.push({ id: player.id, total: player.data().total });
  });

  return results.reduce(
    (resultsMap, { id, total }) => ({
      ...resultsMap,
      [id]: { position: total === 0 ? 1 : 2 },
    }),
    {},
  );
};
