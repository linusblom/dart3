import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { catchError, map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';

import {
  loadPlayerFailure,
  loadPlayers,
  loadPlayersDestroy,
  loadPlayersSuccess,
} from '@game/actions/player.actions';
import { Player } from '@game/models/player';
import { PlayerService } from '@game/services';
import { getAuthUser, State } from '@root/app.reducer';

@Injectable()
export class PlayerEffects {
  @Effect()
  loadPlayers$ = this.actions$.pipe(
    ofType(loadPlayers.type),
    withLatestFrom(this.store.pipe(select(getAuthUser))),
    switchMap(([_, { uid }]) =>
      this.service.list(uid).pipe(
        takeUntil(this.actions$.pipe(ofType(loadPlayersDestroy.type))),
        map((players: Player[]) => loadPlayersSuccess({ players })),
        catchError(error => [loadPlayerFailure(error)]),
      ),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store<State>,
    private readonly service: PlayerService,
  ) {}
}
