import { Component, OnDestroy, OnInit } from '@angular/core';
import { Game, Score } from 'dart3-sdk';
import { Store, select } from '@ngrx/store';
import { takeUntil, map, filter, tap, takeWhile } from 'rxjs/operators';
import { Subject, combineLatest, interval } from 'rxjs';

import { State, getSelectedGame } from '@game/reducers';
import { CoreActions } from '@core/actions';
import { getAllPlayers } from '@root/reducers';
import { availableGames, GameOption, GamePlayerScore } from '@game/models';
import { CurrentGameActions } from '@game/actions';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  game$ = this.store.pipe(select(getSelectedGame));
  abortAutoEndRound$ = new Subject<void>();

  game: Game;
  options: GameOption;
  players: GamePlayerScore[] = [];
  currentPlayer: GamePlayerScore;
  activePlayerIndex = 0;
  timer = -1;
  disabled = false;

  private readonly destroy$ = new Subject();

  constructor(private readonly store: Store<State>) {
    this.game$.pipe(takeUntil(this.destroy$)).subscribe(game => {
      if (this.game && this.game.gamePlayerId !== game.gamePlayerId) {
        this.disabled = false;
      }

      this.options = availableGames.find(({ types }) => types.includes(game.type));
      this.game = game;
    });

    this.abortAutoEndRound$.pipe(takeUntil(this.destroy$)).subscribe(() => (this.timer = -1));

    combineLatest([this.game$, this.store.pipe(select(getAllPlayers))])
      .pipe(
        takeUntil(this.destroy$),
        map(([game, players]) =>
          game.players.map(gp => ({
            ...players.find(({ id }) => id === gp.playerId),
            ...gp,
          })),
        ),
      )
      .subscribe(players => {
        this.players = players;
        this.activePlayerIndex = players.findIndex(player => player.id === this.game.gamePlayerId);
      });
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

  updateScores(scores: Score[]) {
    this.abortAutoEndRound$.next();

    if (scores.length === 3) {
      this.timer = 5;
      interval(1000)
        .pipe(
          takeWhile(val => val <= 4),
          takeUntil(this.abortAutoEndRound$),
          tap(val => (this.timer = 4 - val)),
          filter(val => val === 4),
        )
        .subscribe(() => {
          this.endRound(scores);
        });
    }
  }

  endRound(scores: Score[]) {
    this.store.dispatch(CurrentGameActions.submitRoundRequest({ scores }));
    this.disabled = true;
  }

  trackByFn(_: number, { id }: GamePlayerScore) {
    return id;
  }
}
