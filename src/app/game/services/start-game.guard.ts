import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { State } from '@game/reducers';
import { getAccount } from '@root/reducers';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class StartGameGuard implements CanActivate {
  constructor(private store: Store<State>, private readonly router: Router) {}

  canActivate() {
    return this.store.pipe(select(getAccount)).pipe(
      filter(account => !account.loading),
      map(account => {
        if (account.currentGame) {
          this.router.navigate(['game']);
          return false;
        }

        return true;
      }),
    );
  }
}
