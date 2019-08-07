import * as functions from 'firebase-functions';

export const onCreate = functions
  .region('europe-west1')
  .firestore.document('/accounts/{accountId}')
  .onCreate(async snapshot => {
    const currentJackpotRef = snapshot.ref.collection('jackpots').doc();
    const data = {
      value: 0,
      next: 0,
      started: Date.now(),
      ended: 0,
      playerId: null,
    };

    await currentJackpotRef.create(data);

    return snapshot.ref.update({ currentJackpot: currentJackpotRef.id });
  });
