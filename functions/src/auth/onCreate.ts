import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const authOnCreate = functions.auth.user().onCreate(event => {
  const data = {
    created: Date.now(),
    jackpot: 0,
    hiddenJackpot: 0,
  };

  return db
    .collection('users')
    .doc(event.uid)
    .set(data);
});