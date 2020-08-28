import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { takeUntil, filter, map } from 'rxjs/operators';
import { Subject, combineLatest } from 'rxjs';
import { Game } from 'dart3-sdk';

import { State, getSelectedGame } from '@game/reducers';
import { GameActions } from '@game/actions';
import { GameOption, availableGames } from '@game/models';
import { getAllPlayers } from '@root/reducers';

@Component({
  selector: 'game-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnDestroy {
  players$ = this.store.pipe(select(getAllPlayers));
  game$ = this.store.pipe(
    select(getSelectedGame),
    filter((game) => !!game),
  );
  winners$ = combineLatest([this.game$, this.players$]).pipe(
    map(([{ winners }, players]) =>
      (winners || []).map((winner) => ({
        win: winner.win,
        ...players.find(({ id }) => id === winner.playerId),
      })),
    ),
  );

  option = {} as GameOption;
  game = {} as Game;

  private readonly destroy$ = new Subject();

  constructor(private readonly store: Store<State>, private readonly route: ActivatedRoute) {
    this.store.dispatch(GameActions.getByUidRequest({ uid: this.route.snapshot.params.uid }));

    this.game$.pipe(takeUntil(this.destroy$)).subscribe((game) => {
      this.option = availableGames.find(({ type }) => type === game.type);
      this.game = game;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
