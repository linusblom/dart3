import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

import { TransactionType } from '@player/models';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  constructor(private readonly db: AngularFirestore, private readonly auth: AngularFireAuth) {}

  create(id: string, type: TransactionType, amount: number) {
    const playerRef = this.db.firestore
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .collection('players')
      .doc(id);

    return this.db.firestore.runTransaction(transaction =>
      transaction.get(playerRef).then(doc => {
        const { name, credits } = doc.data();
        const newAmount = credits + amount;

        if (newAmount < 0) {
          return Promise.reject({
            message: `Player ${name} doesn't have enough credits for this transaction.`,
          });
        }

        transaction.update(playerRef, { credits: newAmount });
        transaction.set(playerRef.collection('transactions').doc(), {
          type,
          amount: amount,
          balance: newAmount,
          timestamp: Date.now(),
        });
      }),
    );
  }

  valueChanges(id: string) {
    return this.db
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .collection('players')
      .doc(id)
      .collection('transactions')
      .snapshotChanges()
      .pipe(
        map(action => action.map(({ payload }) => ({ id: payload.doc.id, ...payload.doc.data() }))),
      );
  }
}
