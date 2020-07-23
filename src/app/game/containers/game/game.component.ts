import { Component, OnDestroy, OnInit } from '@angular/core';
import { Game, Score, MatchTeam } from 'dart3-sdk';
import { Store, select } from '@ngrx/store';
import {
  takeUntil,
  filter,
  tap,
  takeWhile,
  map,
  startWith,
  pluck,
  distinctUntilChanged,
  delay,
  shareReplay,
} from 'rxjs/operators';
import { Subject, interval, combineLatest } from 'rxjs';
import { Router } from '@angular/router';

import {
  State,
  getSelectedGame,
  getSelectedMatch,
  getGameMatches,
  getSelectedMatchTeams,
} from '@game/reducers';
import { CoreActions } from '@core/actions';
import { availableGames, GameOption } from '@game/models';
import { CurrentGameActions } from '@game/actions';
import { getAllPlayers, getJackpotGems } from '@root/reducers';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  abortAutoEndRound$ = new Subject<void>();
  game$ = this.store.pipe(select(getSelectedGame));
  players$ = this.store.pipe(select(getAllPlayers));
  currentMatch$ = this.store.pipe(
    select(getSelectedMatch),
    filter((match) => !!match),
  );
  matches$ = this.store.pipe(select(getGameMatches));
  teams$ = combineLatest([this.store.pipe(select(getSelectedMatchTeams)), this.players$]).pipe(
    map(([teams, players]) =>
      teams.map((team) => ({
        ...team,
        players: players
          .filter(({ id }) => team.playerIds.includes(id))
          .sort((a, b) => team.playerIds.indexOf(a.id) - team.playerIds.indexOf(b.id)),
      })),
    ),
    shareReplay(1),
  );
  activePlayer$ = combineLatest(this.currentMatch$, this.players$).pipe(
    map(([match, players]) => players.find(({ id }) => id === match.activePlayerId)),
    startWith({}),
  );
  activeRound$ = this.currentMatch$.pipe(pluck('activeRound'));
  jackpotDisabled$ = this.currentMatch$.pipe(
    map((m) => m.activeLeg > 1 || m.activeSet > 1 || m.activeRound > 3),
    shareReplay(1),
  );
  gems$ = this.store.pipe(select(getJackpotGems));

  game: Game;
  option: GameOption;
  arrowTop = 0;
  timer = -1;
  disabled = false;
  clear = false;
  showMatches = false;

  private readonly destroy$ = new Subject();

  constructor(private readonly store: Store<State>, private readonly router: Router) {
    this.showMatches = !!this.router.getCurrentNavigation().extras.state?.showMatches;

    this.game$.pipe(takeUntil(this.destroy$)).subscribe((game) => {
      this.option = availableGames.find(({ types }) => types.includes(game.type));
      this.game = game;
    });

    this.abortAutoEndRound$.pipe(takeUntil(this.destroy$)).subscribe(() => (this.timer = -1));

    combineLatest([this.currentMatch$, this.store.pipe(select(getSelectedMatchTeams))])
      .pipe(
        takeUntil(this.destroy$),
        tap(([match, teams]) => this.setArrowTop(teams, match.activeMatchTeamId)),
      )
      .subscribe();

    this.currentMatch$
      .pipe(takeUntil(this.destroy$), pluck('activeMatchTeamId'), distinctUntilChanged())
      .subscribe(() => {
        this.disabled = false;
        this.clear = true;
      });

    this.game$
      .pipe(
        takeUntil(this.destroy$),
        pluck('endedAt'),
        filter((endedAt) => !!endedAt),
        tap(() => (this.clear = true)),
        delay(2000),
      )
      .subscribe(() => this.router.navigate(['results', this.game.uid]));
  }

  ngOnInit() {
    this.store.dispatch(CoreActions.toggleMenu({ menu: false }));
    this.store.dispatch(CoreActions.toggleFooter({ footer: false }));
  }

  ngOnDestroy() {
    this.store.dispatch(CoreActions.toggleMenu({ menu: true }));
    this.store.dispatch(CoreActions.toggleFooter({ footer: true }));
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  setArrowTop(teams: MatchTeam[], activeMatchTeamId: number) {
    this.arrowTop = teams.findIndex(({ id }) => id === activeMatchTeamId) * 111 + 8;
  }

  updateScores(scores: Score[]) {
    this.abortAutoEndRound$.next();

    if (scores.length === 3) {
      this.timer = 5;
      interval(1000)
        .pipe(
          takeWhile((val) => val <= 4),
          takeUntil(this.abortAutoEndRound$),
          tap((val) => (this.timer = 4 - val)),
          filter((val) => val === 4),
        )
        .subscribe(() => {
          this.endRound(scores);
        });
    }
  }

  endRound(scores: Score[]) {
    this.disabled = true;
    this.clear = false;
    this.abortAutoEndRound$.next();
    this.store.dispatch(CurrentGameActions.createRoundRequest({ scores }));
  }

  trackByFn(_: number, { id }: MatchTeam) {
    return id;
  }
}
