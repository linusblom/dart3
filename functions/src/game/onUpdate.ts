import * as functions from 'firebase-functions';

export const onUpdate = functions
  .region('europe-west1')
  .firestore.document('/accounts/{accountId}/games/{gameId}')
  .onUpdate(async (change, context) => {
    const data = change.after.data()!;
    const previousData = change.before.data()!;

    if (data.ended === 0 || data.ended === previousData.ended) {
      return null;
    }

    const accountRef = change.after.ref.parent.parent!;

    return accountRef.update({ currentGame: null });
  });
