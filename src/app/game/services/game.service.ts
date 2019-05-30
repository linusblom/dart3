import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { GameType } from '@game/models';

@Injectable()
export class GameService {
  constructor(private readonly db: AngularFirestore, private readonly auth: AngularFireAuth) {}

  create(type: GameType, bet: number, players: string[]) {
    return this.db
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .collection('games')
      .add({ type, bet, players });
  }
}
