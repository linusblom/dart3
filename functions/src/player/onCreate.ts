import * as functions from 'firebase-functions';

export const playerOnCreate = functions.firestore
  .document('/users/{userId}/players/{playerId}')
  .onCreate(snapshot => {
    const data = {
      credits: 0,
      xp: 0,
      created: Date.now(),
    };

    return snapshot.ref.set(data, { merge: true });
  });
