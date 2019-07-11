import * as functions from 'firebase-functions';

import { makeGamePlayer } from '../models/game';

export const onCreate = functions.firestore
  .document('/accounts/{accountId}/games/{gameId}')
  .onCreate(async snapshot => {
    const { bet, type, playerOrder } = snapshot.data()!;
    const accountRef = snapshot.ref.parent.parent!;
    const playersRef = snapshot.ref.parent.parent!.collection('players');

    return snapshot.ref.firestore.runTransaction(async transaction => {
      await Promise.all(
        playerOrder.map(async (id: string) => {
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

      const prizePool = bet * playerOrder.length;
      const data = {
        started: Date.now(),
        ended: 0,
        playerOrder: playerOrder.sort(() => Math.random() - 0.5),
        prizePool: prizePool * 0.9,
        currentTurn: 0,
        currentRound: 1,
      };

      const account = await accountRef.get();
      const { jackpot, hiddenJackpot, currentGame, permissions } = account.data()!;

      if (
        currentGame ||
        !permissions.includes(`game:type:${type}`) ||
        !permissions.includes(`game:bet:${bet}`)
      ) {
        await snapshot.ref.delete();
        throw new Error('Unable to create new game');
      }

      transaction.update(accountRef, {
        currentGame: snapshot.id,
        jackpot: jackpot + prizePool * 0.08,
        hiddenJackpot: hiddenJackpot + prizePool * 0.02,
      });
      transaction.update(snapshot.ref, data);
    });
  });
