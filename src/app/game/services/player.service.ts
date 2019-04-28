import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
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
      .valueChanges();
  }
}
