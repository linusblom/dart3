import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  constructor(private readonly db: AngularFirestore) {}

  list(uid: string) {
    return this.db
      .collection('users')
      .doc(uid)
      .collection('players')
      .valueChanges();
  }
}
