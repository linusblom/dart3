import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { faCheckCircle, faCircle } from '@fortawesome/free-regular-svg-icons';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { GameActions } from '@game/actions';
import { Game, GameType, Player } from '@game/models';
import { getAllPlayers, getGame, State } from '@game/reducers';
import { getAccount } from '@root/app.reducer';

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.scss'],
})
export class StartGameComponent implements OnDestroy {
  players: Player[];
  GameType = GameType;
  type = GameType.HALVEIT;
  bet = 0;
  selectedPlayerIds: string[] = [];
  allowedGames: GameType[] = [];
  allowedBets: number[] = [];
  loading = false;

  availableGames: { type: GameType; name: string }[] = [
    { type: GameType.HALVEIT, name: 'Halve it' },
    { type: GameType.LEGS, name: 'Legs' },
    { type: GameType.THREEHUNDREDONE, name: '301' },
  ];
  availableBets: number[] = [10, 20, 50, 100, 200, 500];

  selectedIcon = faCheckCircle;
  unselectedIcon = faCircle;

  private destroy$ = new Subject<void>();

  constructor(private readonly store: Store<State>, private readonly router: Router) {
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
        this.type = type || this.allowedGames[0];
        this.bet = bet || this.allowedBets[0];
        this.selectedPlayerIds = players;
      });

    this.store
      .pipe(
        select(getAccount),
        takeUntil(this.destroy$),
      )
      .subscribe(({ allowedBets, allowedGames, currentGame }) => {
        this.allowedGames = allowedGames;
        this.allowedBets = allowedBets;
        this.type = allowedGames[0];
        this.bet = allowedBets[0];

        if (currentGame) {
          this.router.navigate(['game', currentGame]);
        }
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
    if (credits < this.bet) {
      return;
    }

    const players = this.selectedPlayerIds.includes(id)
      ? this.selectedPlayerIds.filter(playerId => playerId !== id)
      : [...this.selectedPlayerIds, id];

    this.updateGame({ players });
  }

  createGame() {
    this.loading = true;

    this.store.dispatch(
      GameActions.createGame({
        gameType: this.type,
        bet: this.bet,
        players: this.selectedPlayerIds,
      }),
    );
  }
}
