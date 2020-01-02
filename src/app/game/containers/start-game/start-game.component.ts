import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { faCheckCircle, faCircle } from '@fortawesome/free-regular-svg-icons';
import { faUserTimes } from '@fortawesome/free-solid-svg-icons';
import { select, Store } from '@ngrx/store';
import { GameType, Permission, Player } from 'dart3-sdk';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { CurrentGameActions, GameActions } from '@game/actions';
import { ListOptions, Result } from '@game/models';
import { list, State } from '@game/reducers';
import { getGameNiceName } from '@game/utils/game-nice-name';
import { getAccount, getAllPlayers, getJackpotValue, getLoadingPlayers } from '@root/reducers';

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.scss'],
})
export class StartGameComponent implements OnDestroy {
  loadingPlayers$: Observable<boolean>;
  jackpot$: Observable<number>;
  latestWinners$: Observable<Result[]>;

  players: Player[];
  GameType = GameType;
  type = GameType.HalveIt;
  bet = 0;
  playerIds: string[] = [];
  loading = false;
  permissions: Permission[] = [];

  games: { type: GameType; name: string; permission: string }[] = [
    { type: GameType.HalveIt, name: 'Halve it', permission: Permission.GameTypeHalveIt },
    { type: GameType.Legs, name: 'Legs', permission: Permission.GameTypeLegs },
    {
      type: GameType.Three01,
      name: '301',
      permission: Permission.GameTypeThree01,
    },
    {
      type: GameType.Five01,
      name: '501',
      permission: Permission.GameTypeFive01,
    },
    {
      type: GameType.LegsClassic,
      name: 'Legs Classic',
      permission: Permission.GameTypeLegsClassic,
    },
  ];
  bets: { value: number; permission: string }[] = [
    { value: 10, permission: Permission.GameBet10 },
    { value: 20, permission: Permission.GameBet20 },
    { value: 50, permission: Permission.GameBet50 },
    { value: 100, permission: Permission.GameBet100 },
    { value: 200, permission: Permission.GameBet200 },
    { value: 500, permission: Permission.GameBet500 },
  ];

  selectedIcon = faCheckCircle;
  unselectedIcon = faCircle;
  noPlayersIcon = faUserTimes;
  getGameNiceName = getGameNiceName;

  private destroy$ = new Subject<void>();

  constructor(private readonly store: Store<State>, private readonly router: Router) {
    const options: ListOptions = { orderBy: { fieldPath: 'ended', direction: 'desc' }, limit: 5 };

    this.loadingPlayers$ = this.store.pipe(select(getLoadingPlayers));
    this.jackpot$ = this.store.pipe(select(getJackpotValue));

    this.latestWinners$ = this.store.pipe(
      select(list(options)),
      map(games =>
        games.map(game => {
          const winner = game.players.find(({ position }) => position === 1);

          return {
            id: game.id,
            type: game.type,
            ended: game.ended,
            name: winner ? winner.base.name : '',
            win: winner ? winner.win : 0,
          };
        }),
      ),
    );

    this.store.dispatch(GameActions.list({ options }));

    this.store
      .pipe(
        select(getAllPlayers),
        takeUntil(this.destroy$),
        map(players => players.sort((a, b) => (a.xp < b.xp ? 1 : -1))),
      )
      .subscribe(players => (this.players = players));

    this.store
      .pipe(select(getAccount), takeUntil(this.destroy$))
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

  navigateToResults(id: string) {
    this.router.navigate(['results', id]);
  }
}
