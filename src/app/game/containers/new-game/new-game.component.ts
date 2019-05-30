import { Component, OnDestroy } from '@angular/core';
import { faCheckCircle, faCircle } from '@fortawesome/free-regular-svg-icons';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { GameActions } from '@game/actions';
import { Game, GameType, Player } from '@game/models';
import { getAllPlayers, getGame, State } from '@game/reducers';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss'],
})
export class NewGameComponent implements OnDestroy {
  players$: Observable<Player[]>;

  GameType = GameType;
  type = GameType.HALVEIT;
  bet = 10;
  selectedPlayers: string[] = [];

  selectedIcon = faCheckCircle;
  unselectedIcon = faCircle;

  private destroy$ = new Subject<void>();

  constructor(private readonly store: Store<State>) {
    this.players$ = this.store.pipe(select(getAllPlayers));

    this.store
      .pipe(
        select(getGame),
        takeUntil(this.destroy$),
      )
      .subscribe(({ type, bet, players }) => {
        this.type = type;
        this.bet = bet;
        this.selectedPlayers = players;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  updateGame(data: Partial<Game>) {
    this.store.dispatch(GameActions.updateGame({ data }));
  }

  togglePlayers(id: string) {
    const players = this.selectedPlayers.includes(id)
      ? this.selectedPlayers.filter(playerId => playerId !== id)
      : [...this.selectedPlayers, id];

    this.updateGame({ players });
  }

  play() {}
}
