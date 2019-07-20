import { GamePlayerMap } from '../models/game';

interface ResultHalveIt {
  id: string;
  total: number;
  position: number;
}

export const resultsHalveIt = (players: FirebaseFirestore.QuerySnapshot): GamePlayerMap => {
  const results: ResultHalveIt[] = [];

  players.forEach(player => {
    results.push({ id: player.id, total: player.data().total, position: 0 });
  });

  results.sort((a, b) => (a.total < b.total ? 1 : -1));

  let position = 0;
  return results.reduce((resultsMap, result, index, array) => {
    position++;

    if (index === 0) {
      return { [result.id]: { position } };
    }

    if (result.total === array[index - 1].total) {
      return { ...resultsMap, [result.id]: { position: array[index - 1].position } };
    }

    return { ...resultsMap, [result.id]: { position } };
  }, {});
};
