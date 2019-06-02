import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { combineLatest, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { GameActions, RoundActions } from '@game/actions';
import { Game, Player, Score } from '@game/models';
import {
  getGame,
  getGamePlayers,
  getLoadingGame,
  getLoadingPlayers,
  getLoadingRounds,
  State,
} from '@game/reducers';
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

  private destroy$ = new Subject<void>();

  constructor(private readonly store: Store<State>, private readonly route: ActivatedRoute) {
    const { gameId } = this.route.snapshot.params;

    this.store.dispatch(GameActions.loadGame({ gameId }));
    this.store.dispatch(RoundActions.loadRound({ gameId }));

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

    this.store.pipe(select(getGame)).subscribe(game => (this.game = game));
  }

  get currentPlayer() {
    return this.players[this.game.playerTurn] || ({} as Player);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
    this.store.dispatch(GameActions.loadGameDestroy());
    this.store.dispatch(RoundActions.loadRoundDestroy());
  }

  endRound() {
    const zeroScores = Array(3).fill({ score: 0, multiplier: 0 });
    const scores = [...this.scores, ...zeroScores.slice(this.scores.length, 4)];
    const { id: gameId, currentRound: round, playerTurn: turn } = this.game;

    this.store.dispatch(RoundActions.endTurn({ gameId, turn, round, scores }));

    this.scores = [];
  }
}
