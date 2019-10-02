import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class JackpotService {
  constructor(private readonly db: AngularFirestore, private readonly auth: AngularFireAuth) {}

  valueChanges(id: string) {
    return this.db
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .collection('jackpots')
      .doc(id)
      .valueChanges();
  }
}
