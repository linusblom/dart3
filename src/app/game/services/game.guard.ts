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
        let navigate = undefined;
        let step = undefined;
        let setValues = false;
        let allowed = false;
        let state = {};

        switch (true) {
          case path === 'play' && game && !!game.startedAt:
            allowed = true;
            break;
          case path === 'start' && !!error:
            allowed = true;
            step = GameWizardStep.SelectGame;
            break;
          case path === 'start' && game && !!game.startedAt:
            allowed = false;
            navigate = 'play';
            state = { showMatches: true };
            break;
          case path === 'play' && game && !game.startedAt: {
            allowed = false;
            navigate = 'start';
            step = GameWizardStep.SelectPlayers;
            setValues = true;
            break;
          }
          case path === 'start' && game && !game.startedAt: {
            allowed = true;
            step = GameWizardStep.SelectPlayers;
            setValues = true;
            break;
          }
          case path === 'play' && !!error:
            allowed = false;
            navigate = 'start';
            step = GameWizardStep.SelectGame;
            break;
          default:
            allowed = false;
            break;
        }

        if (step) {
          this.store.dispatch(WizardActions.setStep({ step }));
        }

        if (setValues) {
          this.store.dispatch(
            WizardActions.setValues({
              gameType: game.type,
              players: game.pendingPlayers || [],
              settings: {
                tournament: game.tournament,
                team: game.team,
                bet: game.bet,
                sets: game.sets,
                legs: game.legs,
                startScore: game.startScore,
                checkIn: game.checkIn,
                checkOut: game.checkOut,
                tieBreak: game.tieBreak,
                random: game.random,
              },
            }),
          );
        }

        if (navigate) {
          this.router.navigate([navigate], { state });
        }

        return allowed;
      }),
    );
  }
}
