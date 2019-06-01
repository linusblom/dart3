import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const onCreate = functions.auth.user().onCreate(event => {
  const data = {
    created: Date.now(),
    jackpot: 0,
    hiddenJackpot: 0,
    currentGame: null,
    allowedBets: [10, 20, 50, 100, 200, 500],
    allowedGames: ['halveit'],
  };

  return db
    .collection('accounts')
    .doc(event.uid)
    .set(data);
});
