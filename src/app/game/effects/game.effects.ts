import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class GameEffects {
  constructor(private readonly actions$: Actions) {}
}
