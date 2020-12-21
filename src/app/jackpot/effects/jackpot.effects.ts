import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import {
  concatMap,
  map,
  catchError,
  filter,
  delay,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { merge, of } from 'rxjs';

import { JackpotService } from '@jackpot/services';
import { JackpotActions } from '@jackpot/actions';
import { CoreActions } from '@core/actions';
import { State, getJackpotValue, getUserCurrency, getAllPlayers } from '@root/reducers';
import { Sound } from '@core/models';

@Injectable()
export class JackpotEffects {
  getCurrent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JackpotActions.getCurrentRequest),
      concatMap(() =>
        this.service.getCurrent().pipe(
          map((jackpot) => JackpotActions.getCurrentSuccess({ jackpot })),
          catchError(() => [JackpotActions.getCurrentFailure()]),
        ),
      ),
    ),
  );

  winner$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JackpotActions.start),
      filter(({ jackpot }) => !!jackpot.playerIds && jackpot.playerIds.length > 0),
      withLatestFrom(
        this.store.pipe(select(getJackpotValue)),
        this.store.pipe(select(getUserCurrency)),
        this.store.pipe(select(getAllPlayers)),
      ),
      switchMap(([{ jackpot }, value, currency, players]) => {
        const playerNames = players
          .filter(({ id }) => jackpot.playerIds.includes(id))
          .reduce((acc, { name }, index) => `${acc}${index > 0 ? ', ' : ''}${name}`, '');

        return merge(
          of(CoreActions.playSound({ sound: Sound.Congratulations })),
          of(
            CoreActions.showBanner({
              banner: {
                header: 'Jackpot',
                subHeader: `${currency} ${value}`,
                text: `Congratulations ${playerNames.trim()}!`,
                color: '#bc7bd1',
              },
            }),
          ).pipe(delay(500)),
          of(JackpotActions.reset()).pipe(delay(3000)),
        );
      }),
    ),
  );

  gem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JackpotActions.start),
      map(({ jackpot }) => jackpot.gems.filter((gem) => gem).length),
      filter((gems) => gems > 0),
      switchMap((gems) =>
        merge(
          of(CoreActions.playSound({ sound: Sound.Gem })).pipe(delay(0)),
          of(CoreActions.playSound({ sound: Sound.Gem })).pipe(
            filter(() => gems > 1),
            delay(300),
          ),
          of(CoreActions.playSound({ sound: Sound.Gem })).pipe(
            filter(() => gems > 2),
            delay(600),
          ),
        ),
      ),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly service: JackpotService,
    private readonly store: Store<State>,
  ) {}
}
