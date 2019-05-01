import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

import { makePlayer } from '@game/models';

@Injectable()
export class PlayerService {
  constructor(private readonly db: AngularFirestore, private readonly fireAuth: AngularFireAuth) {}

  create(name: string) {
    return this.db
      .collection('users')
      .doc(this.fireAuth.auth.currentUser.uid)
      .collection('players')
      .add({ name });
  }

  list() {
    return this.db
      .collection('users')
      .doc(this.fireAuth.auth.currentUser.uid)
      .collection('players')
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(({ payload }) => makePlayer({ id: payload.doc.id, ...payload.doc.data() })),
        ),
      );
  }
}
