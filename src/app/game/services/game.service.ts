import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

import { Game, GamePlayer, GameType } from '@game/models';
import { throwError } from 'rxjs';

@Injectable()
export class GameService {
  constructor(private readonly db: AngularFirestore, private readonly auth: AngularFireAuth) {}

  get(id: string) {
    return this.db
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .collection('games')
      .doc(id)
      .get()
      .pipe(
        map(doc =>
          doc.exists ? { id: doc.id, ...doc.data() } : throwError('Game does not exist'),
        ),
      );
  }

  create(type: GameType, bet: number, playerIds: string[]) {
    return this.db
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .collection('games')
      .add({ type, bet, playerIds });
  }

  update(id: string, data: Partial<Game>) {
    return this.db
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .collection('games')
      .doc(id)
      .update(data);
  }

  valueChanges(gameId: string) {
    return this.db
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .collection('games')
      .doc(gameId)
      .snapshotChanges()
      .pipe(map(({ payload }) => ({ id: payload.id, ...payload.data() })));
  }
}
