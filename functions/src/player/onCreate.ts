import * as functions from 'firebase-functions';

import { generateColor } from '../utils/generateColor';

export const playerOnCreate = functions.firestore
  .document('/users/{userId}/players/{playerId}')
  .onCreate(snapshot => {
    const data = {
      credits: 0,
      xp: 0,
      created: Date.now(),
      avatarUrl: null,
      color: generateColor(),
      diamonds: 0,
    };

    return snapshot.ref.set(data, { merge: true });
  });
