import * as functions from 'firebase-functions';

import { makeGamePlayer } from '../models/game';
import { Jackpot } from '../models/jackpot';

export const onCreate = functions
  .region('europe-west1')
  .firestore.document('/accounts/{accountId}/games/{gameId}')
  .onCreate(async snapshot => {
    const { bet, type, playerIds } = snapshot.data()!;
    const accountRef = snapshot.ref.parent.parent!;
    const playersRef = snapshot.ref.parent.parent!.collection('players');

    return snapshot.ref.firestore.runTransaction(async transaction => {
      await Promise.all(
        playerIds.map(async (id: string) => {
          const player = await playersRef.doc(id).get();
          const { credits, turnover, net, played, xp } = player.data()!;

          if (credits < bet) {
            await snapshot.ref.delete();
            throw new Error('Unable to create new game');
          }

          transaction.update(player.ref, {
            xp: xp + bet * 10,
            credits: credits - bet,
            played: played + 1,
            turnover: turnover + bet,
            net: net - bet,
          });

          transaction.create(player.ref.collection('transactions').doc(), {
            amount: bet * -1,
            balance: credits - bet,
            timestamp: Date.now(),
            type: 'bet',
          });

          transaction.create(snapshot.ref.collection('players').doc(id), makeGamePlayer(type, bet));

          return Promise.resolve();
        }),
      );

      const prizePool = bet * playerIds.length;
      const data = {
        started: Date.now(),
        ended: 0,
        playerIds: playerIds.sort(() => Math.random() - 0.5),
        prizePool: +(prizePool * (1 - Jackpot.VALUE - Jackpot.NEXT)).toFixed(2),
        currentTurn: 0,
        currentRound: 1,
      };

      const account = await accountRef.get();
      const { currentGame, permissions, currentJackpot } = account.data()!;

      if (
        currentGame ||
        !permissions.includes(`game:type:${type}`) ||
        !permissions.includes(`game:bet:${bet}`)
      ) {
        await snapshot.ref.delete();
        throw new Error('Unable to create new game');
      }

      const jackpotRef = accountRef.collection('jackpots').doc(currentJackpot);
      const jackpot = await jackpotRef.get();
      const { value, next } = jackpot.data()!;

      transaction.update(jackpotRef, {
        value: +(value + prizePool * Jackpot.VALUE).toFixed(2),
        next: +(next + prizePool * Jackpot.NEXT).toFixed(2),
      });
      transaction.update(accountRef, { currentGame: snapshot.id });
      transaction.update(snapshot.ref, data);
    });
  });
