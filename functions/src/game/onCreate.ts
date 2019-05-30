import * as functions from 'firebase-functions';

export const onCreate = functions.firestore
  .document('/accounts/{accountId}/games/{gameId}')
  .onCreate(async (snapshot, context) => {
    const players = snapshot.get('players');
    const bet = snapshot.get('bet');
    const { accountId } = context.params;
    const { firestore } = snapshot.ref;
    const accountRef = firestore.collection('accounts').doc(accountId);
    const playersRef = firestore
      .collection('accounts')
      .doc(accountId)
      .collection('players');

    return firestore.runTransaction(async transaction => {
      const playerRefs = players.map((playerId: string) => playersRef.doc(playerId));
      const allPlayers = await transaction.getAll(playerRefs);
      allPlayers.forEach(async player => {
        const { credits } = player.data()!;

        if (credits < bet) {
          await snapshot.ref.delete();
          throw new Error('Not enought credits');
        }

        transaction.update(player.ref, { credits: credits - bet });
      });

      const totalBet = bet * players.length;
      const data = {
        started: Date.now(),
        ended: 0,
        players: players.sort(() => Math.random() - 0.5),
        playerTurn: 0,
        prizePool: totalBet * 0.9,
      };

      const account = await accountRef.get();
      const { jackpot, hiddenJackpot } = account.data()!;

      transaction.update(accountRef, {
        currentGame: snapshot.id,
        jackpot: jackpot + totalBet * 0.08,
        hiddenJackpot: hiddenJackpot + totalBet * 0.02,
      });
      transaction.update(snapshot.ref, data);
    });
  });
