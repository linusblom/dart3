import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { combineLatest, interval, Observable, Subject, timer } from 'rxjs';
import { filter, first, map, takeUntil, takeWhile, tap } from 'rxjs/operators';

import { NotificationActions } from '@core/actions';
import { Status } from '@core/models';
import { GameActions } from '@game/actions';
import { config } from '@game/game.config';
import { Player, Score } from '@game/models';
import {
  getGame,
  getGamePlayers,
  getLoadingGame,
  getLoadingGamePlayers,
  getLoadingPlayers,
  State,
} from '@game/reducers';
import { State as Game } from '@game/reducers/game.reducer';
import { getJackpot, getLoadingAccount } from '@root/reducers';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent implements OnDestroy {
  jackpot$: Observable<number>;

  players: Player[] = [];
  game = {} as Game;
  loading = false;
  scores: Score[] = [];
  gameId = '';
  countDown = -1;
  ended = false;

  private abortAutoEndTurn$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor(
    private readonly store: Store<State>,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.gameId = this.route.snapshot.params.gameId;

    this.store.dispatch(GameActions.loadGame({ gameId: this.gameId }));
    this.store.dispatch(GameActions.loadGamePlayers({ gameId: this.gameId }));

    this.jackpot$ = this.store.pipe(select(getJackpot));

    combineLatest([
      this.store.select(getLoadingAccount),
      this.store.select(getLoadingPlayers),
      this.store.select(getLoadingGame),
      this.store.select(getLoadingGamePlayers),
    ])
      .pipe(
        takeUntil(this.destroy$),
        map(([account, players, game, gamePlayers]) => account || players || game || gamePlayers),
      )
      .subscribe(loading => (this.loading = loading));

    this.store
      .pipe(
        select(getGamePlayers),
        takeUntil(this.destroy$),
      )
      .subscribe(players => (this.players = players));

    this.store
      .pipe(
        select(getGame),
        takeUntil(this.destroy$),
      )
      .subscribe(game => {
        if (game.currentTurn !== this.game.currentTurn) {
          this.scores = [];
        }

        if (game.ended > 0 && !this.ended) {
          this.ended = true;
          this.scores = [];
          this.store.dispatch(
            NotificationActions.push({
              status: Status.SUCCESS,
              message: 'Game complate! Well played.',
            }),
          );
          this.navigateToResults();
        }

        this.game = game;
      });
  }

  get currentPlayer() {
    return this.players[this.game.currentTurn] || ({} as Player);
  }

  get gameConfig() {
    return config[this.game.type] || config.default;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
    this.store.dispatch(GameActions.loadGameDestroy());
    this.store.dispatch(GameActions.loadGamePlayersDestroy());
  }

  navigateToResults() {
    timer(5000)
      .pipe(first())
      .subscribe(() => this.router.navigate(['results', this.gameId]));
  }

  updateScores(scores: Score[]) {
    this.abortAutoEndTurn();
    this.scores = scores;

    if (scores.length === 3) {
      interval(1000)
        .pipe(
          takeWhile(val => val < 5),
          takeUntil(this.abortAutoEndTurn$),
          tap(val => (this.countDown = 4 - val)),
          filter(val => val === 4),
        )
        .subscribe(() => {
          this.endRound();
        });
    }
  }

  endRound() {
    const zeroScores = Array(3).fill({ score: 0, multiplier: 0 });
    const scores = [...this.scores, ...zeroScores.slice(this.scores.length, 4)];

    this.abortAutoEndTurn();
    this.store.dispatch(GameActions.endTurn({ gameId: this.gameId, scores }));
  }

  abortAutoEndTurn() {
    this.abortAutoEndTurn$.next();
    this.countDown = -1;
  }
}
