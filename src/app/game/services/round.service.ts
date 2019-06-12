import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, tap } from 'rxjs/operators';

import { Score } from '@game/models';

@Injectable()
export class RoundService {
  constructor(private readonly db: AngularFirestore, private readonly auth: AngularFireAuth) {}

  updateRound(gameId: string, turn: number, round: number, scores: Score[]) {
    return this.db
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .collection('games')
      .doc(gameId)
      .collection('rounds')
      .doc(`${round}`)
      .set({ [turn]: scores }, { merge: true });
  }

  listen(gameId: string) {
    return this.db
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .collection('games')
      .doc(gameId)
      .collection('rounds')
      .snapshotChanges()
      .pipe(
        map(action => action.map(({ payload }) => ({ id: payload.doc.id, ...payload.doc.data() }))),
        tap(a => console.log(a)),
      );
  }
}
