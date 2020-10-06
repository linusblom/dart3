import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  concatMap,
  map,
  catchError,
  withLatestFrom,
  tap,
  filter,
  delay,
  switchMap,
} from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';
import { MatchStatus } from 'dart3-sdk';

import { CurrentGameService } from '@game/services';
import {
  CurrentGameActions,
  HitActions,
  GameActions,
  MatchActions,
  TeamActions,
} from '@game/actions';
import { State, getSelectedMatch, getSelectedGame, getAllTeams } from '@game/reducers';
import { getPin } from '@root/reducers';
import { JackpotActions } from '@jackpot/actions';

@Injectable()
export class CurrentGameEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.getRequest),
      concatMap(() =>
        this.service.get().pipe(
          map((game) => CurrentGameActions.getSuccess({ game })),
          catchError((error) => [CurrentGameActions.getFailure({ error })]),
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
          catchError((error) => [CurrentGameActions.createTeamPlayerFailure({ error })]),
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
          catchError((error) => [CurrentGameActions.deleteTeamPlayerFailure({ error })]),
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
          map((response) => CurrentGameActions.createRoundSuccess(response)),
          catchError(() => [CurrentGameActions.createRoundFailure()]),
        ),
      ),
    ),
  );

  updateScore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.createRoundSuccess),
      map(({ hits, teams }) => ({
        hits,
        teams: teams.map(({ id, score }) => ({ id, changes: { score } })),
      })),
      switchMap(({ hits, teams }) => [
        HitActions.upsertHits({ hits }),
        TeamActions.updateTeams({ teams }),
      ]),
    ),
  );

  resetScore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.createRoundSuccess),
      delay(1500),
      withLatestFrom(this.store.pipe(select(getSelectedMatch)), this.store.select(getSelectedGame)),
      switchMap(([{ matches, teams }, currentMatch, game]) => {
        const match = matches.find(({ id }) => id === currentMatch.id);
        const newSet =
          match.activeSet !== currentMatch.activeSet || match.status === MatchStatus.Completed;
        const newLeg = match.activeLeg !== currentMatch.activeLeg;

        return [
          TeamActions.updateTeams({
            teams: teams.map((team) => ({
              id: team.id,
              changes: {
                ...team,
                legs: newSet ? 0 : team.legs,
                score: newLeg ? game.startScore : team.score,
                position: newLeg ? null : team.position,
              },
            })),
          }),
          ...(newLeg ? [HitActions.removeHits()] : []),
        ];
      }),
    ),
  );

  startJackpot$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.createRoundSuccess),
      filter(({ jackpot }) => !!jackpot),
      switchMap(({ jackpot, teams }) => [
        JackpotActions.start({ jackpot }),
        TeamActions.updateTeams({
          teams: teams.map(({ id, gems }) => ({ id, changes: { gems } })),
        }),
      ]),
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

  updateMatches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.createRoundSuccess),
      delay(2000),
      map(({ matches }) => matches.map((match) => ({ id: match.id, changes: match }))),
      map((matches) => MatchActions.updateMatches({ matches })),
    ),
  );

  getSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.getSuccess),
      filter(({ game }) => !!game.startedAt),
      switchMap(() => [CurrentGameActions.getMatchesRequest(), JackpotActions.getCurrentRequest()]),
    ),
  );

  getMatches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.getMatchesRequest),
      concatMap(() =>
        this.service.getMatches().pipe(
          map((response) => CurrentGameActions.getMatchesSuccess(response)),
          catchError(() => [CurrentGameActions.getMatchesFailure()]),
        ),
      ),
    ),
  );

  nextOrderTurn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrentGameActions.nextOrderTurn),
      withLatestFrom(
        this.store.pipe(select(getSelectedMatch)),
        this.store.pipe(select(getAllTeams)),
      ),
      map(([_, match, teams]) => {
        const currentTeam = teams.find((team) => team.id === match.activeMatchTeamId);
        const nextTeam = teams.find(
          (team) => team.matchId === match.id && team.order === currentTeam.order + 1,
        );

        return MatchActions.updateMatch({
          match: {
            id: match.id,
            changes: { activeMatchTeamId: nextTeam.id, activePlayerId: nextTeam.playerIds[0] },
          },
        });
      }),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly service: CurrentGameService,
    private readonly store: Store<State>,
    private readonly router: Router,
  ) {}
}
