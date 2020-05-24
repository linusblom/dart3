import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Game } from 'dart3-sdk';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { race } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { State } from '@game/reducers';
import { WizardActions, CurrentGameActions } from '@game/actions';
import { GameWizardStep } from '@game/models';

interface CurrentGame {
  game?: Game;
  error?: HttpErrorResponse;
}

@Injectable()
export class GameGuard implements CanActivate {
  constructor(
    private readonly store: Store<State>,
    private readonly actions$: Actions,
    private readonly router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const { path } = route.routeConfig;

    this.store.dispatch(CurrentGameActions.getRequest());

    return race([
      this.actions$.pipe(ofType(CurrentGameActions.getSuccess)),
      this.actions$.pipe(ofType(CurrentGameActions.getFailure)),
    ]).pipe(
      map(({ game, error }: CurrentGame) => {
        let navigate = '';
        let allowed = false;
        let state = {};

        switch (true) {
          case path === 'play' && game && !!game.startedAt:
          case path === 'start' && !!error:
            allowed = true;
            break;
          case path === 'start' && game && !!game.startedAt:
            allowed = false;
            navigate = 'play';
            state = { showMatches: true };
            break;
          case path === 'play' && game && !game.startedAt: {
            const { type: _type, tournament, team, bet, sets, legs } = game;
            allowed = false;
            navigate = 'start';
            this.store.dispatch(
              WizardActions.setValues({ _type, tournament, team, bet, sets, legs }),
            );
            this.store.dispatch(WizardActions.setStep({ step: GameWizardStep.SelectPlayers }));
            break;
          }
          case path === 'start' && game && !game.startedAt: {
            const { type: _type, tournament, team, bet, sets, legs } = game;
            allowed = true;
            this.store.dispatch(
              WizardActions.setValues({ _type, tournament, team, bet, sets, legs }),
            );
            this.store.dispatch(WizardActions.setStep({ step: GameWizardStep.SelectPlayers }));
            break;
          }
          case path === 'play' && !!error:
            allowed = false;
            navigate = 'start';
            this.store.dispatch(WizardActions.setStep({ step: GameWizardStep.SelectGame }));
            break;
          default:
            allowed = false;
            break;
        }

        if (navigate) {
          this.router.navigate([navigate], { state });
        }

        return allowed;
      }),
    );
  }
}
