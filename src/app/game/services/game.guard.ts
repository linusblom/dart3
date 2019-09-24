import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';

import { GameActions } from '@game/actions';
import { GameBoardComponent } from '@game/containers';
import { State } from '@game/reducers';
import { getAccount } from '@root/reducers';

@Injectable()
export class GameGuard implements CanActivate, CanDeactivate<GameBoardComponent> {
  constructor(private store: Store<State>, private readonly router: Router) {}

  canActivate() {
    return this.store.pipe(
      select(getAccount),
      filter(account => !account.loading),
      map(account => {
        if (!account.currentGame) {
          this.router.navigate(['start']);
          return false;
        }

        return true;
      }),
    );
  }

  canDeactivate() {
    this.store.dispatch(GameActions.loadGameDestroy());
    this.store.dispatch(GameActions.loadGamePlayersDestroy());

    return true;
  }
}
