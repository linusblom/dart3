import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Game, MatchStatus, MatchTeam, Score } from 'dart3-sdk';
import { combineLatest, interval, Subject } from 'rxjs';
import {
  delay,
  distinctUntilChanged,
  filter,
  map,
  pluck,
  shareReplay,
  skipWhile,
  startWith,
  takeUntil,
  takeWhile,
  tap,
} from 'rxjs/operators';

import { CoreActions } from '@core/actions';
import { Sound } from '@core/models';
import { CurrentGameActions } from '@game/actions';
import { GameOption, getOptions, MatchTeamPlayer } from '@game/models';
import {
  getGameMatches,
  getRoundDetails,
  getSelectedGame,
  getSelectedMatch,
  getSelectedMatchTeams,
  State,
} from '@game/reducers';
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
  matchTeams$ = this.store.pipe(select(getSelectedMatchTeams));
  currentMatch$ = this.store.pipe(
    select(getSelectedMatch),
    filter((match) => !!match),
    shareReplay(1),
  );
  matches$ = this.store.pipe(select(getGameMatches));
  activePlayer$ = combineLatest([this.currentMatch$, this.players$, this.matchTeams$]).pipe(
    map(([match, players, teams]) => {
      const player = players.find(({ id }) => id === match.activePlayerId);
      const team = player && (teams || []).find(({ playerIds }) => playerIds.includes(player.id));

      return {
        ...player,
        ...(team && { matchTeamId: team.id, order: team.order }),
      };
    }),
    startWith({ order: 0 }),
  );
  activeRound$ = this.currentMatch$.pipe(pluck('activeRound'));
  jackpotDisabled$ = this.currentMatch$.pipe(
    map(
      (m) =>
        m.activeLeg > 1 || m.activeSet > 1 || m.activeRound > 3 || m.status === MatchStatus.Order,
    ),
    shareReplay(1),
  );
  gems$ = this.store.pipe(select(getJackpotGems));
  roundDetails$ = this.store.pipe(select(getRoundDetails));

  game: Game;
  option: GameOption;
  arrowTop = 0;
  timer = -1;
  disabled = false;
  clear = false;
  showMatches = false;
  orderRound = false;
  teamsCount = 0;
  teams: MatchTeamPlayer[] = [];
  activeLeg = 1;
  activeStartOrder = 1;
  matchId = 0;

  private readonly destroy$ = new Subject();

  constructor(private readonly store: Store<State>, private readonly router: Router) {
    // this.showMatches = !!this.router.getCurrentNavigation().extras.state?.showMatches;

    this.game$.pipe(takeUntil(this.destroy$)).subscribe((game) => {
      this.option = getOptions(game.type);
      this.game = game;
    });

    this.matchTeams$
      .pipe(takeUntil(this.destroy$), pluck('length'))
      .subscribe((length) => (this.teamsCount = length));

    this.currentMatch$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ status, activeLeg, activeStartOrder }) => {
        this.orderRound = status === MatchStatus.Order;
        this.activeLeg = activeLeg;
        this.activeStartOrder = activeStartOrder;
      });

    this.abortAutoEndRound$.pipe(takeUntil(this.destroy$)).subscribe(() => (this.timer = -1));

    combineLatest([this.currentMatch$, this.matchTeams$])
      .pipe(
        takeUntil(this.destroy$),
        tap(([match, teams]) => this.setArrowTop(teams, match.activeMatchTeamId)),
      )
      .subscribe();

    this.currentMatch$
      .pipe(
        takeUntil(this.destroy$),
        tap(({ id }) => (this.matchId = id)),
        map((m) => `${m.activeMatchTeamId}-${m.activeLeg}-${m.status}-${m.activeSet}`),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        this.disabled = false;
        this.clear = true;
      });

    this.game$
      .pipe(
        takeUntil(this.destroy$),
        pluck('endedAt'),
        filter((endedAt) => !!endedAt),
        tap(() => {
          this.clear = true;
          this.disabled = true;
        }),
        delay(1000),
        tap(() => {
          this.store.dispatch(CoreActions.playSound({ sound: Sound.Anthem }));
          this.store.dispatch(
            CoreActions.showBanner({
              banner: {
                header: 'Game Over',
                subHeader: 'Well played',
                color: this.option.color,
              },
            }),
          );
        }),
        delay(1000),
      )
      .subscribe(() =>
        this.router.navigate(['game', 'results', this.game.uid], { state: { countXp: true } }),
      );

    this.activeRound$
      .pipe(
        skipWhile(() => this.game.tieBreak === 0),
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        filter((activeRound) => activeRound > this.game.tieBreak),
      )
      .subscribe((activeRound) =>
        this.store.dispatch(
          CoreActions.showBanner({
            banner: {
              header: 'Tie Break',
              subHeader: 'Highest score wins',
              text: `Round ${activeRound - this.game.tieBreak}`,
              color: this.option.color,
            },
          }),
        ),
      );

    combineLatest([this.matchTeams$, this.players$])
      .pipe(
        takeUntil(this.destroy$),
        map(([teams, players]) =>
          teams.map((team) => ({
            ...team,
            players: players
              .filter(({ id }) => team.playerIds.includes(id))
              .sort((a, b) => team.playerIds.indexOf(a.id) - team.playerIds.indexOf(b.id)),
          })),
        ),
      )
      .subscribe((teams) => (this.teams = teams));
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

    if (
      (scores.length === 3 && !this.orderRound) ||
      (scores.length === this.teamsCount && this.orderRound)
    ) {
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
    } else if (this.orderRound) {
      this.store.dispatch(CurrentGameActions.nextOrderTurn());
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
