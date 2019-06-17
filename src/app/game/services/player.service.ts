import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { map, take } from 'rxjs/operators';

import { Player, TransactionType } from '@game/models';

@Injectable()
export class PlayerService {
  constructor(
    private readonly db: AngularFirestore,
    private readonly auth: AngularFireAuth,
    private readonly storage: AngularFireStorage,
  ) {}

  create(name: string) {
    return this.db
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .collection('players')
      .add({ name });
  }

  listen() {
    return this.db
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .collection('players')
      .snapshotChanges()
      .pipe(
        map(action =>
          action.map(({ payload }) => {
            return { id: payload.doc.id, ...payload.doc.data() };
          }),
        ),
      );
  }

  update(id: string, data: Partial<Player>) {
    return this.db
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .collection('players')
      .doc(id)
      .update(data);
  }

  updateAvatar(id: string, file: File) {
    return this.storage
      .upload(`/${this.auth.auth.currentUser.uid}/avatars/${id}`, file)
      .then(() => {
        this.storage
          .ref(`/${this.auth.auth.currentUser.uid}/avatars/${id}`)
          .getDownloadURL()
          .pipe(take(1))
          .subscribe(avatarUrl => this.update(id, { avatarUrl }));

        return;
      });
  }

  listenTransactions(playerId: string) {
    return this.db
      .collection('accounts')
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

  createTransaction(playerId: string, type: TransactionType, amount: number) {
    const playerRef = this.db.firestore
      .collection('accounts')
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
