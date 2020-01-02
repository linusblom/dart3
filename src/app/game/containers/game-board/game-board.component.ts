import { Component, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Score } from 'dart3-sdk';
import { interval, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil, takeWhile, tap } from 'rxjs/operators';

import { environment } from '@envs/environment';
import { CurrentGameActions } from '@game/actions';
import { createGame, JackpotRound } from '@game/models';
import {
  getCurrentGame,
  getGameJackpotRound,
  getLoading,
  getPlayingJackpot,
  State,
} from '@game/reducers';
import { getJackpotValue } from '@root/reducers';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent implements OnDestroy {
  jackpot$: Observable<number>;
  jackpotRound$: Observable<JackpotRound>;

  betweenTurns = false;
  playingJackpot = false;
  game = createGame();
  loading = false;
  scores: Score[] = [];
  countDown = -1;
  ended = false;
  local = false;

  private abortAutoEndTurn$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor(private readonly store: Store<State>) {
    this.jackpot$ = this.store.pipe(select(getJackpotValue));
    this.jackpotRound$ = this.store.pipe(select(getGameJackpotRound));
    this.local = environment.local;

    this.store.select(getLoading).subscribe(loading => (this.loading = loading));

    this.store
      .pipe(
        select(getCurrentGame),
        takeUntil(this.destroy$),
        map(game => ({
          ...game,
          players: [
            ...game.players.sort(
              (a, b) => game.playerIds.indexOf(a.id) - game.playerIds.indexOf(b.id),
            ),
          ],
        })),
      )
      .subscribe(game => {
        if (game.currentTurn !== this.game.currentTurn) {
          this.scores = [];
          this.betweenTurns = false;
        }

        if (game.ended > 0 && !this.ended) {
          this.endGame();
        }

        this.game = game;
      });

    this.store
      .pipe(select(getPlayingJackpot), takeUntil(this.destroy$))
      .subscribe(playingJackpot => (this.playingJackpot = playingJackpot));
  }

  get disableBoard() {
    return this.loading || this.ended || this.playingJackpot || this.betweenTurns;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  endGame() {
    this.ended = true;
    this.scores = [];
    this.store.dispatch(CurrentGameActions.end());
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
          this.endTurn();
        });
    }
  }

  endTurn() {
    const zeroScores = Array(3).fill({ score: 0, multiplier: 0 });
    const scores = [...this.scores, ...zeroScores.slice(this.scores.length, 4)];

    this.abortAutoEndTurn();
    this.betweenTurns = true;
    this.store.dispatch(CurrentGameActions.endTurn({ scores }));
  }

  abortAutoEndTurn() {
    this.abortAutoEndTurn$.next();
    this.countDown = -1;
  }

  nextTurn() {
    this.store.dispatch(CurrentGameActions.nextTurn());
  }

  abortGame() {
    this.store.dispatch(CurrentGameActions.abort());
  }
}
