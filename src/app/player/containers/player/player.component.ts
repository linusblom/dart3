import { Component, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Player } from 'dart3-sdk';
import { Subject } from 'rxjs';

import { State, getSelectedPlayer } from '@root/reducers';
import { PlayerActions } from '@player/actions';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnDestroy {
  player = {} as Player;

  private readonly destroy$ = new Subject();

  constructor(private readonly store: Store<State>, private readonly route: ActivatedRoute) {
    const { id } = this.route.snapshot.params;

    this.store.dispatch(PlayerActions.getByIdRequest({ id }));

    this.store
      .pipe(select(getSelectedPlayer), takeUntil(this.destroy$))
      .subscribe(player => (this.player = player));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
