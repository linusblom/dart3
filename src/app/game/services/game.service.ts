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
      .add({ type, bet, playerOrder: players });
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

  updateGamePlayersScores(gameId: string, round: number, playerId: string, scores: Score[]) {
    return this.db
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .collection('games')
      .doc(gameId)
      .collection('players')
      .doc(playerId)
      .set({ currentRound: round, rounds: { [round]: { display: '', scores } } }, { merge: true });
  }

  listenGamePlayers(gameId: string) {
    return this.db
      .collection('accounts')
      .doc(this.auth.auth.currentUser.uid)
      .collection('games')
      .doc(gameId)
      .collection('players')
      .snapshotChanges()
      .pipe(
        map(action => action.map(({ payload }) => ({ id: payload.doc.id, ...payload.doc.data() }))),
      );
  }
}
