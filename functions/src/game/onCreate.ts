import * as functions from 'firebase-functions';
import { initGamePlayer } from '../utils/initGamePlayer';

export const onCreate = functions.firestore
  .document('/accounts/{accountId}/games/{gameId}')
  .onCreate(async snapshot => {
    const playerOrder = snapshot.get('playerOrder');
    const bet = snapshot.get('bet');
    const type = snapshot.get('type');
    const accountRef = snapshot.ref.parent.parent!;
    const playersRef = snapshot.ref.parent.parent!.collection('players');

    return snapshot.ref.firestore.runTransaction(async transaction => {
      await Promise.all(
        playerOrder.map(async (id: string) => {
          const player = await playersRef.doc(id).get();
          const { credits, turnover, net } = player.data()!;

          if (credits < bet) {
            await snapshot.ref.delete();
            throw new Error('Unable to create new game');
          }

          transaction.update(player.ref, {
            credits: credits - bet,
            turnover: turnover + bet,
            net: net - bet,
          });

          transaction.create(player.ref.collection('transactions').doc(), {
            amount: bet * -1,
            balance: credits - bet,
            timestamp: Date.now(),
            type: 'bet',
          });

          transaction.create(snapshot.ref.collection('players').doc(id), {
            ...initGamePlayer[type],
          });

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
      const { jackpot, hiddenJackpot, currentGame, allowedGames, allowedBets } = account.data()!;

      if (currentGame || !allowedGames.includes(type) || !allowedBets.includes(bet)) {
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
