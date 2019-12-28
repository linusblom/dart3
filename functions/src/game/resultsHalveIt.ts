import { GamePlayerMap } from '../models/game';
import { Result } from '../models/result';

export const resultsHalveIt = (players: FirebaseFirestore.QuerySnapshot): GamePlayerMap => {
  const results: Result[] = [];

  players.forEach(player => {
    results.push({ id: player.id, total: player.data().total, position: 0 });
  });

  let position = 0;
  return results
    .sort((a, b) => (a.total < b.total ? 1 : -1))
    .reduce((resultsMap, result, index, array) => {
      position++;

      if (index === 0) {
        return { [result.id]: { position } };
      }

      if (result.total === array[index - 1].total) {
        return {
          ...resultsMap,
          [result.id]: { position: resultsMap[array[index - 1].id].position },
        };
      }

      return { ...resultsMap, [result.id]: { position } };
    }, {} as GamePlayerMap);
};
