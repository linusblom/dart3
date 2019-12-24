import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { forkJoin, race } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { CurrentGameActions } from '@game/actions';
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
    this.store.dispatch(CurrentGameActions.valueChangesGameInit({ id }));

    return race(
      this.actions$.pipe(ofType(CurrentGameActions.valueChangesGameSuccess)),
      this.actions$.pipe(ofType(CurrentGameActions.valueChangesGameFailure)),
    ).pipe(take(1));
  }

  loadGamePlayers(id: string) {
    this.store.dispatch(CurrentGameActions.valueChangesGamePlayerInit({ id }));

    return race(
      this.actions$.pipe(ofType(CurrentGameActions.valueChangesGamePlayerSuccess)),
      this.actions$.pipe(ofType(CurrentGameActions.valueChangesGamePlayerFailure)),
    ).pipe(take(1));
  }
}