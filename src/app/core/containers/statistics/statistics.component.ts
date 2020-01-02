import { Component, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Jackpot, Player } from 'dart3-sdk';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { getAllPlayers, getJackpot, State } from '@root/reducers';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnDestroy {
  credits$: Observable<{ name: string; value: number }[]>;
  totalTurnover$: Observable<number>;

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly store: Store<State>) {
    this.credits$ = combineLatest([
      this.store.pipe(select(getAllPlayers)),
      this.store.pipe(select(getJackpot)),
    ]).pipe(
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
}
