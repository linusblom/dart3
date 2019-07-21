import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { GameActions } from '@game/actions';
import { config } from '@game/game.config';
import { Game, Player } from '@game/models';
import { getGame, getGamePlayers, State } from '@game/reducers';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnDestroy {
  players: Player[] = [];
  game = {} as Game;

  private destroy$ = new Subject<void>();

  constructor(private readonly store: Store<State>, private readonly route: ActivatedRoute) {
    const gameId = this.route.snapshot.params.gameId;

    this.store.dispatch(GameActions.loadGame({ gameId }));
    this.store.dispatch(GameActions.loadGamePlayers({ gameId }));

    this.store
      .pipe(
        select(getGamePlayers),
        takeUntil(this.destroy$),
      )
      .subscribe(players => (this.players = players));

    this.store
      .pipe(
        select(getGame),
        takeUntil(this.destroy$),
      )
      .subscribe(game => (this.game = game));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
    this.store.dispatch(GameActions.loadGameDestroy());
    this.store.dispatch(GameActions.loadGamePlayersDestroy());
  }

  get gameConfig() {
    return config[this.game.type] || config.default;
  }

  get sortedGamePlayers() {
    return this.game.players.sort((a, b) => (a.position > b.position ? 1 : -1));
  }

  millisToMinutesAndSeconds(millis: number) {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

  getPlayer(id: string) {
    return this.players.find(player => player.id === id);
  }
}
