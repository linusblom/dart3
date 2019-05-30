import * as functions from 'firebase-functions';

import { generateColor } from '../utils/generateColor';

export const onCreate = functions.firestore
  .document('/accounts/{accountId}/players/{playerId}')
  .onCreate(snapshot => {
    const data = {
      credits: 0,
      xp: 0,
      created: Date.now(),
      avatarUrl: null,
      color: generateColor(),
      diamonds: 0,
      played: 0,
      wins: 0,
      lost: 0,
      hits: 0,
      misses: 0,
      highest: 0,
      oneHundredEighties: 0,
      halveIt: 0,
      legs: 0,
      turnover: 0,
      net: 0,
    };

    return snapshot.ref.update(data);
  });
