import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map, catchError, withLatestFrom, tap, filter, delay } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { CurrentGameService } from '@game/services';
import {
  CurrentGameActions,
  HitActions,
  GameActions,
  MatchActions,
  TeamActions,
} from '@game/actions';
import { State } from '@game/reducers';
import { getPin } from '@root/reducers';
import { Router } from '@angular/router';
import { Match, MatchTeam } from 'dart3-sdk';

@Injectable()
export class CurrentGameEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.getRequest),
      concatMap(() =>
        this.service.get().pipe(
          map(game => CurrentGameActions.getSuccess({ game })),
          catchError(error => [CurrentGameActions.getFailure({ error })]),
        ),
      ),
    ),
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.deleteRequest),
      concatMap(() =>
        this.service.delete().pipe(
          map(() => CurrentGameActions.deleteSuccess()),
          catchError(() => [CurrentGameActions.deleteFailure()]),
        ),
      ),
    ),
  );

  createGamePlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.createTeamPlayerRequest),
      withLatestFrom(this.store.pipe(select(getPin))),
      concatMap(([{ uid }, pin]) =>
        this.service.createTeamPlayer(uid, pin).pipe(
          map(({ players }) => CurrentGameActions.createTeamPlayerSuccess({ players })),
          catchError(error => [CurrentGameActions.createTeamPlayerFailure({ error })]),
        ),
      ),
    ),
  );

  deleteGamePlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.deleteTeamPlayerRequest),
      concatMap(({ uid }) =>
        this.service.deleteTeamPlayer(uid).pipe(
          map(({ players }) => CurrentGameActions.deleteTeamPlayerSuccess({ players })),
          catchError(error => [CurrentGameActions.deleteTeamPlayerFailure({ error })]),
        ),
      ),
    ),
  );

  start$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.startRequest),
      concatMap(() =>
        this.service.start().pipe(
          tap(() => this.router.navigate(['/play'], { state: { showMatches: true } })),
          map(() => CurrentGameActions.startSuccess()),
          catchError(() => [CurrentGameActions.startFailure()]),
        ),
      ),
    ),
  );

  createRound$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.createRoundRequest),
      concatMap(({ scores }) =>
        this.service.createRound(scores).pipe(
          map(response => CurrentGameActions.createRoundSuccess(response)),
          catchError(() => [CurrentGameActions.createRoundFailure()]),
        ),
      ),
    ),
  );

  upsertHits$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.createRoundSuccess),
      map(({ hits }) => HitActions.upsertHits({ hits })),
    ),
  );

  updateGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.createRoundSuccess),
      filter(({ game }) => !!game),
      delay(2000),
      map(({ game }) => GameActions.updateGame({ game: { id: game.id, changes: game } })),
    ),
  );

  upsertMatches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.createRoundSuccess),
      delay(2000),
      map(({ matches }) => MatchActions.upsertMatches({ matches: matches as Match[] })),
    ),
  );

  upsertTeams$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.createRoundSuccess),
      delay(2000),
      map(({ teams }) => TeamActions.upsertTeams({ teams: teams as MatchTeam[] })),
    ),
  );

  getSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.getSuccess),
      filter(({ game }) => !!game.startedAt),
      map(() => CurrentGameActions.getMatchesRequest()),
    ),
  );

  getMatches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.getMatchesRequest),
      concatMap(() =>
        this.service.getMatches().pipe(
          map(response => CurrentGameActions.getMatchesSuccess(response)),
          catchError(() => [CurrentGameActions.getMatchesFailure()]),
        ),
      ),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly service: CurrentGameService,
    private readonly store: Store<State>,
    private readonly router: Router,
  ) {}
}
