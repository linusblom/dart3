import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { faCheckCircle, faCircle } from '@fortawesome/free-regular-svg-icons';
import { faUserTimes } from '@fortawesome/free-solid-svg-icons';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Permission } from '@core/models';
import { GameActions } from '@game/actions';
import { Game, GameType, Player } from '@game/models';
import { getAllPlayers, getGame, getLoadingPlayers, State } from '@game/reducers';
import { getAccount } from '@root/reducers';

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.scss'],
})
export class StartGameComponent implements OnDestroy {
  loadingPlayers$: Observable<boolean>;

  players: Player[];
  GameType = GameType;
  type = GameType.HALVEIT;
  bet = 0;
  selectedPlayerIds: string[] = [];
  loading = false;
  permissions: Permission[] = [];

  games: { type: GameType; name: string; permission: string }[] = [
    { type: GameType.HALVEIT, name: 'Halve it', permission: Permission.GAME_TYPE_HALVEIT },
    { type: GameType.LEGS, name: 'Legs', permission: Permission.GAME_TYPE_LEGS },
    {
      type: GameType.THREEHUNDREDONE,
      name: '301',
      permission: Permission.GAME_TYPE_THREEHUNDREDONE,
    },
  ];
  bets: { value: number; permission: string }[] = [
    { value: 10, permission: Permission.GAME_BET_10 },
    { value: 20, permission: Permission.GAME_BET_20 },
    { value: 50, permission: Permission.GAME_BET_50 },
    { value: 100, permission: Permission.GAME_BET_100 },
    { value: 200, permission: Permission.GAME_BET_200 },
    { value: 500, permission: Permission.GAME_BET_500 },
  ];

  selectedIcon = faCheckCircle;
  unselectedIcon = faCircle;
  noPlayersIcon = faUserTimes;

  private destroy$ = new Subject<void>();

  constructor(private readonly store: Store<State>, private readonly router: Router) {
    this.loadingPlayers$ = this.store.pipe(select(getLoadingPlayers));
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
      .subscribe(({ type, bet, playerOrder }) => {
        this.type = type;
        this.bet = bet;
        this.selectedPlayerIds = playerOrder;
      });

    this.store
      .pipe(
        select(getAccount),
        takeUntil(this.destroy$),
      )
      .subscribe(({ permissions, currentGame }) => {
        this.permissions = permissions;

        if (currentGame) {
          this.router.navigate(['game', currentGame]);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  hasPermission(permission: Permission) {
    return this.permissions.includes(permission);
  }

  updateGame(data: Partial<Game>) {
    this.store.dispatch(GameActions.updateGame({ data }));
  }

  changeBet(bet: number) {
    const playerOrder = this.selectedPlayerIds.filter(
      playerId => this.players.find(player => player.id === playerId).credits >= bet,
    );
    this.updateGame({ bet, playerOrder });
  }

  togglePlayers({ id, credits }: Player) {
    if (credits < this.bet) {
      return;
    }

    const playerOrder = this.selectedPlayerIds.includes(id)
      ? this.selectedPlayerIds.filter(playerId => playerId !== id)
      : [...this.selectedPlayerIds, id];

    this.updateGame({ playerOrder });
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

  navigateToPlayers() {
    this.router.navigate(['players']);
  }
}
