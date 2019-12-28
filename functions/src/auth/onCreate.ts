import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const onCreate = functions
  .region('europe-west1')
  .auth.user()
  .onCreate(user => {
    const batch = db.batch();

    batch.create(db.collection('accounts').doc(user.uid), {
      created: Date.now(),
      currentJackpot: null,
      currentGame: null,
      currency: 'Ð',
      permissions: [
        'core:account:write',
        'core:password:write',
        'core:total-credits:read',
        'game:bet:10',
        'game:bet:20',
        'game:bet:50',
        'game:bet:100',
        'game:bet:200',
        'game:bet:500',
        'game:type:halveit',
        'game:type:legs',
        'game:type:301',
        'game:type:501',
      ],
    });

    batch.create(
      db
        .collection('accounts')
        .doc(user.uid)
        .collection('jackpots')
        .doc(),
      {
        value: 0,
        next: 0,
        started: Date.now(),
        ended: 0,
        playerId: null,
      },
    );

    return batch.commit();
  });
