import * as functions from 'firebase-functions';
import * as seedrandom from 'seedrandom';

import { JackpotDrawType } from '../models/jackpot';
import { Score } from '../models/game';

export const onUpdate = functions
  .region('europe-west1')
  .firestore.document('/accounts/{accountId}/games/{gameId}/players/{playerId}')
  .onUpdate(async (change, context) => {
    const data = change.after.data()!;
    const previousData = change.before.data()!;

    if (data.currentRound === previousData.currentRound) {
      return null;
    }

    const { playerId } = context.params;
    const batch = change.after.ref.firestore.batch();
    const scores = data.rounds[data.currentRound].scores;

    if (scores.filter((score: Score) => score.score === 0).length === 0 && jackpotHit()) {
      const account = await change.after.ref.parent.parent!.parent.parent!.get();
      const { currentJackpot } = account.data()!;

      const jackpot = await account.ref
        .collection('jackpots')
        .doc(currentJackpot)
        .get();
      const { value, next } = jackpot.data()!;
      batch.update(jackpot.ref, { ended: Date.now(), playerId });
      batch.create(account.ref.collection('jackpots').doc(), {
        value: next,
        next: 0,
        started: Date.now(),
        ended: 0,
        playerId: null,
      });
      batch.update(change.after.ref, {
        [`rounds.${data.currentRound}.jackpotDraw`]: JackpotDrawType.WIN,
        xp: data.xp + 10000,
        win: data.win + value,
      });

      const player = await account.ref
        .collection('players')
        .doc(playerId)
        .get();
      const { credits, net, xp } = player.data()!;
      batch.update(player.ref, { credits: credits + value, xp: xp + 10000, net: net + value });

      batch.create(player.ref.collection('transactions').doc(), {
        amount: value,
        balance: credits + value,
        timestamp: Date.now(),
        type: 'jackpot',
      });
    } else {
      batch.update(change.after.ref, {
        [`rounds.${data.currentRound}.jackpotDraw`]: JackpotDrawType.BLANK,
      });
    }

    return batch.commit();
  });

const jackpotHit = () => {
  const rng = seedrandom();
  return Math.floor(rng() * 10000) < 3;
};
