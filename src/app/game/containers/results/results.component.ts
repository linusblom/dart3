import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { takeUntil, filter, map } from 'rxjs/operators';
import { Subject, combineLatest } from 'rxjs';
import { Game } from 'dart3-sdk';

import { State, getSelectedGame } from '@game/reducers';
import { GameActions } from '@game/actions';
import { GameOption, options } from '@game/models';
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
  results$ = combineLatest([this.game$, this.players$]).pipe(
    map(([{ results }, players]) =>
      (results || []).map((result) => ({
        ...result,
        ...players.find(({ id }) => id === result.playerId),
      })),
    ),
  );
  winners$ = this.results$.pipe(
    map((results) => results.filter((result) => result.position === 1)),
  );
  runnerUps$ = this.results$.pipe(
    map((results) => results.filter((result) => result.position > 1)),
  );

  option = {} as GameOption;
  game = {} as Game;
  countXp = false;

  private readonly destroy$ = new Subject();

  constructor(
    private readonly store: Store<State>,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    this.countXp = !!this.router.getCurrentNavigation().extras.state?.showMatches;

    this.store.dispatch(GameActions.getByUidRequest({ uid: this.route.snapshot.params.uid }));

    this.game$.pipe(takeUntil(this.destroy$)).subscribe((game) => {
      this.option = options.find(({ type }) => type === game.type);
      this.game = game;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
