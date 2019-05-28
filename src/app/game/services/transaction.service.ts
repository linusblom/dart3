import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

import { TransactionType } from '@game/models';

@Injectable()
export class TransactionService {
  constructor(private readonly db: AngularFirestore, private readonly auth: AngularFireAuth) {}

  list(playerId: string) {
    return this.db
      .collection('users')
      .doc(this.auth.auth.currentUser.uid)
      .collection('players')
      .doc(playerId)
      .collection('transactions')
      .snapshotChanges()
      .pipe(
        map(action =>
          action.map(({ payload }) => {
            return { id: payload.doc.id, ...payload.doc.data() };
          }),
        ),
      );
  }

  transaction(playerId: string, type: TransactionType, amount: number) {
    const playerRef = this.db.firestore
      .collection('users')
      .doc(this.auth.auth.currentUser.uid)
      .collection('players')
      .doc(playerId);

    return this.db.firestore.runTransaction(transaction =>
      transaction.get(playerRef).then(doc => {
        const { name, credits } = doc.data();
        const newAmount = credits + amount;

        if (newAmount < 0) {
          return Promise.reject({
            message: `Player ${name} doesn't have enought credits for this transaction.`,
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
}
