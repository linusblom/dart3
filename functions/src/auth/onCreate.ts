import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const onCreate = functions
  .region('europe-west1')
  .auth.user()
  .onCreate(event => {
    const data = {
      created: Date.now(),
      jackpot: 0,
      hiddenJackpot: 0,
      currentGame: null,
      permissions: [
        'core:account:write',
        'core:password:write',
        'game:bet:10',
        'game:bet:20',
        'game:bet:50',
        'game:bet:100',
        'game:bet:200',
        'game:bet:500',
        'game:type:halveit',
      ],
    };

    return db
      .collection('accounts')
      .doc(event.uid)
      .set(data);
  });
