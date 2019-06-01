import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { combineLatest, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { GameActions } from '@game/actions';
import { DartHit, Game, Player } from '@game/models';
import { getGame, getGamePlayers, getLoadingGame, getLoadingPlayers, State } from '@game/reducers';
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

  private destroy$ = new Subject<void>();

  constructor(private readonly store: Store<State>, private readonly route: ActivatedRoute) {
    const { gameId } = this.route.snapshot.params;

    this.store.dispatch(GameActions.loadGame({ gameId }));

    combineLatest([
      this.store.select(getLoadingAccount),
      this.store.select(getLoadingPlayers),
      this.store.select(getLoadingGame),
    ])
      .pipe(
        map(([account, players, game]) => account || players || game),
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
    this.store.dispatch(GameActions.loadGameDestroy());
  }

  onHit(hits: DartHit[]) {
    console.log(hits);
  }
}
