import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { interval, Observable, Subject, timer } from 'rxjs';
import { filter, first, shareReplay, takeUntil, takeWhile, tap } from 'rxjs/operators';

import { NotificationActions } from '@core/actions';
import { Permission, Player, Status } from '@core/models';
import { GameActions } from '@game/actions';
import { Game, GameData, JackpotRound, Score } from '@game/models';
import {
  getGame,
  getGameData,
  getGameJackpotRound,
  getGamePlayers,
  getLoading,
  getPlayingJackpot,
  State,
} from '@game/reducers';
import { getJackpotValue, hasPermission } from '@root/reducers';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent implements OnDestroy {
  jackpot$: Observable<number>;
  jackpotRound$: Observable<JackpotRound>;
  hasGameDevControls$: Observable<boolean>;
  gameData$: Observable<GameData>;

  betweenTurns = false;
  playingJackpot = false;
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

    this.jackpot$ = this.store.pipe(select(getJackpotValue));
    this.jackpotRound$ = this.store.pipe(select(getGameJackpotRound));
    this.hasGameDevControls$ = this.store.pipe(select(hasPermission(Permission.GAME_DEV_CONTROLS)));
    this.gameData$ = this.store.pipe(
      select(getGameData),
      shareReplay(1),
    );

    this.store.select(getLoading).subscribe(loading => (this.loading = loading));

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
          this.betweenTurns = false;
        }

        if (game.ended > 0 && !this.ended) {
          this.endGame();
        }

        this.game = game;
      });

    this.store
      .pipe(
        select(getPlayingJackpot),
        takeUntil(this.destroy$),
      )
      .subscribe(playingJackpot => (this.playingJackpot = playingJackpot));
  }

  get currentPlayer() {
    return this.players[this.game.currentTurn] || ({} as Player);
  }

  get disableBoard() {
    return this.loading || this.ended || this.playingJackpot || this.betweenTurns;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
    this.store.dispatch(GameActions.loadGameDestroy());
    this.store.dispatch(GameActions.loadGamePlayersDestroy());
  }

  endGame() {
    this.ended = true;
    this.scores = [];
    this.store.dispatch(
      NotificationActions.push({
        status: Status.SUCCESS,
        message: 'Game complete! Well played.',
      }),
    );

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
          this.endTurn();
        });
    }
  }

  endTurn() {
    const zeroScores = Array(3).fill({ score: 0, multiplier: 0 });
    const scores = [...this.scores, ...zeroScores.slice(this.scores.length, 4)];

    this.abortAutoEndTurn();
    this.betweenTurns = true;
    this.store.dispatch(GameActions.endTurn({ scores }));
  }

  abortAutoEndTurn() {
    this.abortAutoEndTurn$.next();
    this.countDown = -1;
  }

  nextTurn() {
    this.store.dispatch(GameActions.nextTurn());
  }

  abortGame() {
    this.store.dispatch(GameActions.abortGame());
  }
}
