import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Account } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private readonly db: AngularFirestore, private readonly auth: AngularFireAuth) {}

  listen() {
    return this.db
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .valueChanges();
  }

  update(data: Partial<Account>) {
    return this.db
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .update(data);
  }

  listenJackpot(id: string) {
    return this.db
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .collection('jackpots')
      .doc(id)
      .valueChanges();
  }
}
