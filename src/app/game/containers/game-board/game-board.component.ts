import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';

import { GameActions } from '@game/actions';
import { Game } from '@game/models';
import { getLoadingGame, getLoadingPlayers, State } from '@game/reducers';
import { getLoadingAccount } from '@root/app.reducer';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent implements OnDestroy {
  game$: Observable<Game>;

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
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
    this.store.dispatch(GameActions.loadGameDestroy());
  }
}
