import * as functions from 'firebase-functions';
import { shouldGameEnd } from '../utils/endGame';
import { calculate } from '../utils/calculate';

export const onUpdate = functions.firestore
  .document('/accounts/{accountId}/games/{gameId}/players/{playerId}')
  .onUpdate(async change => {
    const data = change.after.data()!;
    const previousData = change.before.data()!;

    if (data.currentRound === previousData.currentRound) {
      return null;
    }

    const gameRef = change.after.ref.parent.parent!;
    const game = await gameRef.get();
    const players = await change.after.ref.parent.get();
    const type = game.get('type');
    const playersCurrentRound: number[] = [];
    let currentRound = game.get('currentRound');
    let currentTurn = game.get('currentTurn');
    let playersCount = 0;

    players.forEach(player => {
      playersCount++;
      playersCurrentRound.push(player.data().currentRound);
    });

    const endGame = shouldGameEnd(type, playersCount, playersCurrentRound);

    currentTurn++;

    if (currentTurn === playersCount && !endGame) {
      currentTurn = 0;
      currentRound++;
    }

    if (endGame) {
      const accountRef = gameRef.parent.parent!;
      await accountRef.update({ currentGame: null });
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
      [`rounds.${data.currentRound}`]: calculation.round,
    });
  });
