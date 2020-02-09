import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Game, GameType } from 'dart3-sdk';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { createGame, ListOptions } from '@game/models';

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
          doc.exists
            ? createGame({ id: doc.id, ...doc.data() })
            : throwError('Game does not exist'),
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
      .pipe(map(({ payload }) => ({ id: payload.id, ...(payload.data() as {}) })));
  }

  list(options: ListOptions) {
    return this.db
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .collection('games', ref => {
        let query = ref as firebase.firestore.Query;

        if (options.where) {
          query = query.where(options.where.fieldPath, options.where.operator, options.where.value);
        }

        if (options.orderBy) {
          query = query.orderBy(options.orderBy.fieldPath, options.orderBy.direction);
        }

        if (options.limit) {
          query = query.limit(options.limit);
        }

        return query;
      })
      .get()
      .pipe(map(({ docs }) => docs.map(doc => createGame({ id: doc.id, ...doc.data() }))));
  }
}
