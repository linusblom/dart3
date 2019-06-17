import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable()
export class AccountService {
  constructor(private readonly db: AngularFirestore, private readonly auth: AngularFireAuth) {}

  listen() {
    return this.db
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .valueChanges();
  }
}