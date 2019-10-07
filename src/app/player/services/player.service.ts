import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { map, take } from 'rxjs/operators';

import { Player } from '@player/models';

@Injectable({ providedIn: 'root' })
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

  valueChanges() {
    return this.db
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .collection('players')
      .snapshotChanges()
      .pipe(
        map(action => action.map(({ payload }) => ({ id: payload.doc.id, ...payload.doc.data() }))),
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
}
