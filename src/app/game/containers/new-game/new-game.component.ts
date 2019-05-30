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
  players: Player[];
  GameType = GameType;
  type = GameType.HALVEIT;
  bet = 10;
  selectedPlayerIds: string[] = [];

  selectedIcon = faCheckCircle;
  unselectedIcon = faCircle;

  private destroy$ = new Subject<void>();

  constructor(private readonly store: Store<State>) {
    this.store
      .pipe(
        select(getAllPlayers),
        takeUntil(this.destroy$),
      )
      .subscribe(players => (this.players = players));

    this.store
      .pipe(
        select(getGame),
        takeUntil(this.destroy$),
      )
      .subscribe(({ type, bet, players }) => {
        this.type = type;
        this.bet = bet;
        this.selectedPlayerIds = players;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  updateGame(data: Partial<Game>) {
    this.store.dispatch(GameActions.updateGame({ data }));
  }

  changeBet(bet: number) {
    const players = this.selectedPlayerIds.filter(
      playerId => this.players.find(player => player.id === playerId).credits >= bet,
    );
    this.updateGame({ bet, players });
  }

  togglePlayers({ id, credits }: Player) {
    // if (credits < this.bet) {
    //   return;
    // }

    const players = this.selectedPlayerIds.includes(id)
      ? this.selectedPlayerIds.filter(playerId => playerId !== id)
      : [...this.selectedPlayerIds, id];

    this.updateGame({ players });
  }

  createGame() {
    this.store.dispatch(
      GameActions.createGame({
        gameType: this.type,
        bet: this.bet,
        players: this.selectedPlayerIds,
      }),
    );
  }
}
