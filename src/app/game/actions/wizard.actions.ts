import { createAction, props } from '@ngrx/store';
import { GameType, GameVariant } from 'dart3-sdk';

import { GameWizardStep } from '@game/models';

export const setStep = createAction('[Wizard] Set Step', props<{ step: GameWizardStep }>());
export const setValues = createAction(
  '[Wizard] Set Values',
  props<{ _type: GameType; variant: GameVariant; bet: number; sets: number; legs: number }>(),
);
