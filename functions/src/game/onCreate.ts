import * as functions from 'firebase-functions';

export const onCreate = functions.firestore
  .document('/accounts/{accountId}/games/{gameId}')
  .onCreate(async (snapshot, context) => {
    const players = snapshot.get('players');
    const bet = snapshot.get('bet');
    const type = snapshot.get('type');
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
      });

      const prizePool = bet * players.length;
      const data = {
        started: Date.now(),
        ended: 0,
        players: players.sort(() => Math.random() - 0.5),
        prizePool: prizePool * 0.9,
        currentTurn: 0,
        currentRound: 0,
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
