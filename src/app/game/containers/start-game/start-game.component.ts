import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { faCheckCircle, faCircle } from '@fortawesome/free-regular-svg-icons';
import { faUserTimes } from '@fortawesome/free-solid-svg-icons';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { Permission } from '@core/models';
import { CurrentGameActions } from '@game/actions';
import { GameType } from '@game/models';
import { State } from '@game/reducers';
import { Player } from '@player/models';
import { getAccount, getAllPlayers, getJackpotValue, getLoadingPlayers } from '@root/reducers';

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.scss'],
})
export class StartGameComponent implements OnDestroy {
  loadingPlayers$: Observable<boolean>;
  jackpot$: Observable<number>;

  players: Player[];
  GameType = GameType;
  type = GameType.HALVEIT;
  bet = 0;
  playerIds: string[] = [];
  loading = false;
  permissions: Permission[] = [];

  games: { type: GameType; name: string; permission: string }[] = [
    { type: GameType.HALVEIT, name: 'Halve it', permission: Permission.GAME_TYPE_HALVEIT },
    { type: GameType.LEGS, name: 'Legs', permission: Permission.GAME_TYPE_LEGS },
    {
      type: GameType.LEGS_CLASSIC,
      name: 'Legs Classic',
      permission: Permission.GAME_TYPE_LEGS_CLASSIC,
    },
    {
      type: GameType.THREE_HUNDRED_ONE,
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
    this.jackpot$ = this.store.pipe(select(getJackpotValue));

    this.store
      .pipe(
        select(getAllPlayers),
        takeUntil(this.destroy$),
        map(players => players.sort((a, b) => (a.xp < b.xp ? 1 : -1))),
      )
      .subscribe(players => (this.players = players));

    this.store
      .pipe(
        select(getAccount),
        takeUntil(this.destroy$),
      )
      .subscribe(({ permissions, currentGame }) => {
        this.permissions = permissions;

        if (currentGame) {
          this.router.navigate(['game']);
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

  changeBet(bet: number) {
    this.playerIds = this.playerIds.filter(
      playerId => this.players.find(player => player.id === playerId).credits >= bet,
    );
    this.bet = bet;
  }

  togglePlayers({ id, credits }: Player) {
    if (credits < this.bet) {
      return;
    }

    this.playerIds = this.playerIds.includes(id)
      ? this.playerIds.filter(playerId => playerId !== id)
      : [...this.playerIds, id];
  }

  createGame() {
    this.loading = true;

    this.store.dispatch(
      CurrentGameActions.start({
        gameType: this.type,
        bet: this.bet,
        playerIds: this.playerIds,
      }),
    );
  }

  navigateToPlayers() {
    this.router.navigate(['players']);
  }
}
