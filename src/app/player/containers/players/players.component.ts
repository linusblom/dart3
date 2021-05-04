import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { PlayerActions } from '@player/actions';
import { getAllPlayers, State } from '@root/reducers';
import { CreatePlayer } from 'dart3-sdk';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss'],
})
export class PlayersComponent {
  players$ = this.store.pipe(select(getAllPlayers));

  constructor(private readonly store: Store<State>, private readonly router: Router) {
    this.store.dispatch(PlayerActions.getRequest());
  }

  create(player: CreatePlayer) {
    this.store.dispatch(PlayerActions.createRequest({ player }));
  }

  navigateToPlayer(uid: string) {
    this.router.navigate(['players', uid]);
  }
}
