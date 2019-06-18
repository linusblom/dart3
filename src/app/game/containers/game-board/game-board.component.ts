import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { combineLatest, interval, Subject } from 'rxjs';
import { filter, map, takeUntil, takeWhile, tap } from 'rxjs/operators';

import { GameActions } from '@game/actions';
import { Player, Score } from '@game/models';
import {
  getGame,
  getGamePlayers,
  getLoadingGame,
  getLoadingPlayers,
  getLoadingRounds,
  State,
} from '@game/reducers';
import { State as Game } from '@game/reducers/game.reducer';
import { getLoadingAccount } from '@root/app.reducer';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent implements OnDestroy {
  players: Player[] = [];
  game = {} as Game;
  loading = false;
  scores: Score[] = [];
  gameId = '';
  countDown = -1;

  private abortAutoEndTurn$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor(private readonly store: Store<State>, private readonly route: ActivatedRoute) {
    this.gameId = this.route.snapshot.params.gameId;

    this.store.dispatch(GameActions.loadGame({ gameId: this.gameId }));
    this.store.dispatch(GameActions.loadRound({ gameId: this.gameId }));

    combineLatest([
      this.store.select(getLoadingAccount),
      this.store.select(getLoadingPlayers),
      this.store.select(getLoadingGame),
      this.store.select(getLoadingRounds),
    ])
      .pipe(
        map(([account, players, game, rounds]) => account || players || game || rounds),
        takeUntil(this.destroy$),
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
      .subscribe(game => (this.game = game));
  }

  get currentPlayer() {
    return this.players[this.game.currentTurn] || ({} as Player);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
    this.store.dispatch(GameActions.loadGameDestroy());
    this.store.dispatch(GameActions.loadRoundDestroy());
  }

  get roundText() {
    return this.game.scoreboard.roundText[this.game.currentRound];
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
    const { currentRound: round, currentTurn: turn } = this.game;

    this.abortAutoEndTurn$.next();
    this.countDown = -1;

    this.store.dispatch(GameActions.endTurn({ gameId: this.gameId, turn, round, scores }));

    this.scores = [];
  }

  abortAutoEndTurn() {
    this.abortAutoEndTurn$.next();
    this.countDown = -1;
  }
}
