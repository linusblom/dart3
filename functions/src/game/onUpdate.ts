import * as functions from 'firebase-functions';

import { getGameResults } from './results';

export const onUpdate = functions
  .region('europe-west1')
  .firestore.document('/accounts/{accountId}/games/{gameId}')
  .onUpdate(async change => {
    const data = change.after.data()!;
    const previousData = change.before.data()!;

    if (data.ended === 0 || data.ended === previousData.ended) {
      return null;
    }

    const batch = change.after.ref.firestore.batch();

    const accountRef = change.after.ref.parent.parent!;
    batch.update(accountRef, { currentGame: null });

    const players = await change.after.ref.collection('players').get();
    const results = getGameResults(players, data.type);
    players.forEach(player => {
      batch.update(player.ref, results[player.id]);
    });

    return batch.commit();
  });
