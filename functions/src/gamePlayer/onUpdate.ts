import * as functions from 'firebase-functions';

import { shouldGameEnd } from './endGame';
import { calculate } from './calculate';
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

    const gameRef = change.after.ref.parent.parent!;
    const playerRef = gameRef.parent.parent!.collection('players').doc(context.params.playerId);
    const game = await gameRef.get();
    const player = await playerRef.get();
    const players = await change.after.ref.parent.get();
    const playersCurrentRound: number[] = [];
    const type = game.get('type');
    let { currentRound, currentTurn } = game.data()!;
    let roundTotal = 0;
    let { xp, hits, misses, highest, oneHundredEighties } = player.data()!;

    data.rounds[data.currentRound].scores.forEach((score: Score) => {
      const total = score.score * score.multiplier;
      roundTotal += total;

      if (total > 0) {
        hits++;
      } else {
        misses++;
      }
    });

    highest = roundTotal > highest ? roundTotal : highest;
    oneHundredEighties += roundTotal === 180 ? 1 : 0;
    xp += roundTotal;

    await playerRef.update({ xp, hits, misses, highest, oneHundredEighties });

    players.forEach(gamePlayer => {
      playersCurrentRound.push(gamePlayer.data().currentRound);
    });

    const endGame = shouldGameEnd(type, players.size, playersCurrentRound);

    if (!endGame) {
      currentTurn++;

      if (currentTurn === players.size) {
        currentTurn = 0;
        currentRound++;
      }
    }

    await gameRef.update({ ended: endGame ? Date.now() : 0, currentRound, currentTurn });

    const calculation = calculate(
      type,
      data.rounds[data.currentRound],
      data.currentRound,
      data.total,
    );

    return change.after.ref.update({
      total: calculation.total,
      totalDisplay: calculation.totalDisplay,
      xp: data.xp + roundTotal,
      [`rounds.${data.currentRound}`]: calculation.round,
    });
  });
