import * as functions from 'firebase-functions';
import * as seedrandom from 'seedrandom';

import { getGameResults } from './results';
import { Jackpot } from '../models/jackpot';

export const onUpdate = functions
  .region('europe-west1')
  .firestore.document('/accounts/{accountId}/games/{gameId}')
  .onUpdate(change => {
    const data = change.after.data()!;
    const previousData = change.before.data()!;

    if (data.ended && data.ended !== previousData.ended) {
      return endGame(change);
    }

    if (data.currentTurn !== previousData.currentTurn) {
      return checkJackpot(change);
    }

    return null;
  });

const endGame = async (change: functions.Change<FirebaseFirestore.DocumentSnapshot>) => {
  const { type, prizePool } = change.after.data()!;
  const batch = change.after.ref.firestore.batch();
  const accountRef = change.after.ref.parent.parent!;
  const gamePlayersRef = change.after.ref.collection('players');
  const playersRef = accountRef.collection('players');

  const gamePlayers = await gamePlayersRef.get();
  const results = getGameResults(gamePlayers, type);
  const gamePlayerIds: string[] = [];
  const winningPlayerIds = Object.entries(results)
    .filter(([_, value]) => value.position === 1)
    .map(([key, _]) => key);
  const win = prizePool / winningPlayerIds.length;

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
};

const checkJackpot = async (change: functions.Change<FirebaseFirestore.DocumentSnapshot>) => {
  const { bet, playerIds, currentTurn, currentRound } = change.after.data()!;
  const batch = change.after.ref.firestore.batch();

  if (jackpotHit(bet)) {
    const playerId = playerIds[currentTurn];

    const gamePlayer = await change.after.ref
      .collection('players')
      .doc(playerId)
      .get();
    const gamePlayerXP = gamePlayer.get('xp');
    batch.update(gamePlayer.ref, {
      [`rounds.${currentRound}.jackpotWin`]: true,
      xp: gamePlayerXP + 10000,
    });

    const account = await change.after.ref.parent.parent!.get();
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
  }

  return batch.commit();
};

const jackpotHit = (bet: number) => {
  const rng = seedrandom();
  return Math.floor(rng() * 10000) < Math.floor(3 + bet * (Jackpot.VALUE + Jackpot.NEXT));
};
