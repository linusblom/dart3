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

    const gamePlayers = await change.after.ref.collection('players').get();
    const results = getGameResults(gamePlayers, data.type);
    const winningPlayerIds = Object.entries(results)
      .filter(([_, value]) => value.position === 1)
      .map(([key, _]) => key);
    const win = data.prizePool / winningPlayerIds.length;

    gamePlayers.forEach(gamePlayer => {
      batch.update(gamePlayer.ref, {
        ...results[gamePlayer.id],
        win: winningPlayerIds.includes(gamePlayer.id) ? win : 0,
      });
    });

    const playersRef = accountRef.collection('players');
    await Promise.all(
      winningPlayerIds.map(async playerId => {
        const player = await playersRef.doc(playerId).get();
        const { wins, credits, net, xp } = player.data()!;

        batch.update(player.ref, {
          wins: wins + 1,
          credits: credits + win,
          net: net + win,
          xp: xp + 1000,
        });

        batch.create(player.ref.collection('transactions').doc(), {
          amount: win,
          balance: credits + win,
          timestamp: Date.now(),
          type: 'win',
        });
      }),
    );

    return batch.commit();
  });
