import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { forkJoin, Observable, of, race } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

import { GameActions } from '@game/actions';
import { State } from '@game/reducers';
import { getAccount } from '@root/reducers';

@Injectable()
export class GameResolver implements Resolve<boolean> {
  constructor(private readonly store: Store<State>, private readonly actions$: Actions) {}

  resolve() {
    return this.store.pipe(
      select(getAccount),
      take(1),
      switchMap(({ currentGame }) =>
        forkJoin(this.loadGame(currentGame), this.loadGamePlayers(currentGame)).pipe(
          map(() => true),
        ),
      ),
    );
  }

  loadGame(id: string) {
    this.store.dispatch(GameActions.loadGame({ id }));

    return race(
      this.actions$.pipe(ofType(GameActions.loadGameSuccess)),
      this.actions$.pipe(ofType(GameActions.loadGameFailure)),
    ).pipe(take(1));
  }

  loadGamePlayers(id: string) {
    this.store.dispatch(GameActions.loadGamePlayers({ id }));

    return race(
      this.actions$.pipe(ofType(GameActions.loadGamePlayersSuccess)),
      this.actions$.pipe(ofType(GameActions.loadGamePlayersFailure)),
    ).pipe(take(1));
  }
}
