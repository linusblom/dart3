import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';

import { State, getAllPlayers } from '@root/reducers';
import { CreatePlayer } from 'dart3-sdk';
import { PlayerActions } from '@player/actions';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss'],
})
export class PlayersComponent {
  players$ = this.store.pipe(select(getAllPlayers));

  constructor(private readonly store: Store<State>, private readonly router: Router) {}

  create(player: CreatePlayer) {
    this.store.dispatch(PlayerActions.createRequest({ player }));
  }

  navigateToPlayer(uid: string) {
    this.router.navigate(['players', uid]);
  }
}
