import { Component, OnDestroy, OnInit } from '@angular/core';
import { Game, Player } from 'dart3-sdk';
import { Store, select } from '@ngrx/store';
import { takeUntil, map } from 'rxjs/operators';
import { Subject, combineLatest } from 'rxjs';

import { State, getSelectedGame } from '@game/reducers';
import { CoreActions } from '@core/actions';
import { getAllPlayers } from '@root/reducers';
import { availableGames, GameOption } from '@game/models';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  game$ = this.store.pipe(select(getSelectedGame));

  game: Game;
  options: GameOption;
  players: Player[] = [];

  private readonly destroy$ = new Subject();

  constructor(private readonly store: Store<State>) {
    this.game$.pipe(takeUntil(this.destroy$)).subscribe(game => {
      this.options = availableGames.find(({ variants }) => variants.includes(game.type));
      this.game = game;
    });

    combineLatest([this.game$, this.store.pipe(select(getAllPlayers))])
      .pipe(
        takeUntil(this.destroy$),
        map(([game, players]) => {
          const playerIds = game.players.map(({ playerId }) => playerId);
          return players
            .filter(({ id }) => playerIds.includes(id))
            .sort((a, b) => playerIds.indexOf(a.id) - playerIds.indexOf(b.id));
        }),
      )
      .subscribe(players => (this.players = players));
  }

  ngOnInit() {
    this.store.dispatch(CoreActions.toggleMenu({ menu: false }));
  }

  ngOnDestroy() {
    this.store.dispatch(CoreActions.toggleMenu({ menu: true }));
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
