import * as functions from 'firebase-functions';

export const onCreate = functions
  .region('europe-west1')
  .firestore.document('/accounts/{accountId}/jackpots/{jackpotId}')
  .onCreate((snapshot, context) => {
    const { jackpotId } = context.params;

    return snapshot.ref.parent.parent!.update({ currentJackpot: jackpotId });
  });
