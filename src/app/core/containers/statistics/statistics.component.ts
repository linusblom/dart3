import { Component, OnDestroy } from '@angular/core';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import { Jackpot, Permission } from '@core/models';
import { Player } from '@player/models';
import { getAllPlayers, getJackpot, getPermissions, State } from '@root/reducers';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnDestroy {
  Permission = Permission;

  credits$: Observable<{ name: string; value: number }[]>;
  totalTurnover$: Observable<number>;

  permissions: Permission[] = [];
  noPermissionIcon = faTimesCircle;

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly store: Store<State>) {
    this.store
      .pipe(
        select(getPermissions),
        takeUntil(this.destroy$),
      )
      .subscribe(permissions => (this.permissions = permissions));

    this.credits$ = combineLatest([
      this.store.pipe(select(getAllPlayers)),
      this.store.pipe(select(getJackpot)),
    ]).pipe(
      filter(() => this.hasPermission(Permission.CORE_TOTAL_CREDITS_READ)),
      map(([players, jackpot]: [Player[], Jackpot]) => [
        { name: 'Players', value: players.reduce((acc, { credits }) => acc + credits, 0) },
        { name: 'Jackpot', value: jackpot.value },
        { name: 'Next Jackpot', value: jackpot.next },
      ]),
      map(credits => [
        ...credits,
        { name: 'Total', value: credits.reduce((acc, { value }) => acc + value, 0) },
      ]),
    );

    this.totalTurnover$ = this.store
      .pipe(select(getAllPlayers))
      .pipe(map(players => players.reduce((acc, { turnover }) => acc + turnover, 0)));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  hasPermission(permission: Permission) {
    return this.permissions.includes(permission);
  }
}
