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
    const gamePlayersRef = change.after.ref.collection('players');
    const playersRef = accountRef.collection('players');

    const gamePlayers = await gamePlayersRef.get();
    const results = getGameResults(gamePlayers, data.type);
    const gamePlayerIds: string[] = [];
    const winningPlayerIds = Object.entries(results)
      .filter(([_, value]) => value.position === 1)
      .map(([key, _]) => key);
    const win = data.prizePool / winningPlayerIds.length;

    gamePlayers.forEach(({ id }) => {
      gamePlayerIds.push(id);
    });

    await Promise.all(
      gamePlayerIds.map(async playerId => {
        const player = await gamePlayersRef.doc(playerId).get();
        const winner = winningPlayerIds.includes(playerId);
        const { xp } = player.data()!;

        batch.update(player.ref, {
          ...results[playerId],
          win: winner ? win : 0,
          xp: xp + (winner ? Math.round(1000 / winningPlayerIds.length) : 0),
        });
      }),
    );

    await Promise.all(
      winningPlayerIds.map(async playerId => {
        const player = await playersRef.doc(playerId).get();
        const { wins, credits, net, xp } = player.data()!;

        batch.update(player.ref, {
          wins: wins + 1,
          credits: credits + win,
          net: net + win,
          xp: xp + Math.round(1000 / winningPlayerIds.length),
        });

        batch.create(player.ref.collection('transactions').doc(), {
          amount: win,
          balance: credits + win,
          timestamp: Date.now(),
          type: 'win',
        });
      }),
    );

    batch.update(accountRef, { currentGame: null });

    return batch.commit();
  });
