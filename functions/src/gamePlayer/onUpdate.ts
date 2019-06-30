import * as functions from 'firebase-functions';
import { calculate } from '../calculate/calculate';

export const onUpdate = functions.firestore
  .document('/accounts/{accountId}/games/{gameId}/players/{playerId}')
  .onUpdate(async change => {
    const game = await change.after.ref.parent.parent!.get();
    const type = game.get('type');
    const data = change.after.data()!;
    const previousData = change.before.data()!;

    if (data.currentRound === previousData.currentRound) {
      return null;
    }

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
