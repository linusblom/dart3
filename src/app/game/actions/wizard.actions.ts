import { createAction, props } from '@ngrx/store';

import { GameWizardStep } from '@game/models';
import { GameType } from 'dart3-sdk';

export const setStep = createAction('[Wizard] Set Step', props<{ step: GameWizardStep }>());
export const setId = createAction('[Wizard] Set Id', props<{ id: number }>());
export const setValues = createAction(
  '[Wizard] Set Values',
  props<{ variant: GameType; bet: number; sets: number; legs: number }>(),
);
