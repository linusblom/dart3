import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Game } from 'dart3-sdk';
import { race } from 'rxjs';
import { map } from 'rxjs/operators';

import { CurrentGameActions, WizardActions } from '@game/actions';
import { GameWizardStep } from '@game/models';
import { State } from '@game/reducers';

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
        let navigate: string[];
        let step: GameWizardStep;
        let setValues = false;
        let allowed = false;
        let state = {};

        switch (true) {
          case path === 'play' && game && !!game.startedAt:
            allowed = true;
            break;
          case path === '' && !!error:
            allowed = true;
            step = GameWizardStep.SelectGame;
            break;
          case path === '' && game && !!game.startedAt:
            allowed = false;
            navigate = ['game', 'play'];
            state = { showMatches: true };
            break;
          case path === 'play' && game && !game.startedAt: {
            allowed = false;
            navigate = ['game'];
            step = GameWizardStep.SelectPlayers;
            setValues = true;
            break;
          }
          case path === '' && game && !game.startedAt: {
            allowed = true;
            step = GameWizardStep.SelectPlayers;
            setValues = true;
            break;
          }
          case path === 'play' && !!error:
            allowed = false;
            navigate = ['game'];
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
          this.router.navigate(navigate, { state });
        }

        return allowed;
      }),
    );
  }
}
