import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

import { Game, GameType, Score } from '@game/models';

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

  listen(gameId: string) {
    return this.db
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .collection('games')
      .doc(gameId)
      .valueChanges();
  }

  update(id: string, data: Partial<Game>) {
    return this.db
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .collection('games')
      .doc(id)
      .update(data);
  }

  createRound(gameId: string, round: number, playerCount: number) {
    const data = Array(playerCount)
      .fill(Array(3).fill({ score: -1, multiplier: 0 }))
      .reduce((scores, initialScores, index) => ({ ...scores, [index]: initialScores }), {});

    return this.db
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .collection('games')
      .doc(gameId)
      .collection('rounds')
      .doc(`${round}`)
      .set(data);
  }

  updateRound(gameId: string, turn: number, round: number, scores: Score[]) {
    return this.db
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .collection('games')
      .doc(gameId)
      .collection('rounds')
      .doc(`${round}`)
      .set({ [turn]: scores }, { merge: true });
  }

  listenRounds(gameId: string) {
    return this.db
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .collection('games')
      .doc(gameId)
      .collection('rounds')
      .snapshotChanges()
      .pipe(
        map(action => action.map(({ payload }) => ({ id: payload.doc.id, ...payload.doc.data() }))),
      );
  }
}
