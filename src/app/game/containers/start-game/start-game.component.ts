import { Component, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { GameActions } from '@game/actions';
import { Game, GameType, Player } from '@game/models';
import { getAllPlayers, getGame, State } from '@game/reducers';

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.scss'],
})
export class StartGameComponent implements OnDestroy {
  players$: Observable<Player[]>;

  GameType = GameType;
  type = GameType.HALVEIT;
  bet = 10;

  private destroy$ = new Subject<void>();

  constructor(private readonly store: Store<State>) {
    this.players$ = this.store.pipe(select(getAllPlayers));

    this.store
      .pipe(
        select(getGame),
        takeUntil(this.destroy$),
      )
      .subscribe(({ type, bet }) => {
        this.type = type;
        this.bet = bet;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  updateGame(data: Partial<Game>) {
    this.store.dispatch(GameActions.updateGame({ data }));
  }
}
