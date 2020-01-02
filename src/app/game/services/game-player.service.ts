import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { GamePlayer } from 'dart3-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class GamePlayerService {
  constructor(private readonly db: AngularFirestore, private readonly auth: AngularFireAuth) {}

  list(gameId: string): Observable<GamePlayer[]> {
    return this.db
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .collection('games')
      .doc(gameId)
      .collection('players')
      .get()
      .pipe(
        map(collection =>
          collection.docs.map(doc => ({ id: doc.id, ...doc.data() } as GamePlayer)),
        ),
      );
  }

  update(gameId: string, playerId: string, data: Partial<GamePlayer>) {
    return this.db
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .collection('games')
      .doc(gameId)
      .collection('players')
      .doc(playerId)
      .set(data, { merge: true });
  }

  valueChanges(gameId: string): Observable<GamePlayer[]> {
    return this.db
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .collection('games')
      .doc(gameId)
      .collection('players')
      .snapshotChanges()
      .pipe(
        map(action =>
          action.map(
            ({ payload }) => ({ id: payload.doc.id, ...payload.doc.data() } as GamePlayer),
          ),
        ),
      );
  }
}
