import { createAction, props } from '@ngrx/store';
import { GameType } from 'dart3-sdk';

import { GameWizardStep } from '@game/models';

export const setStep = createAction('[Wizard] Set Step', props<{ step: GameWizardStep }>());
export const setValues = createAction(
  '[Wizard] Set Values',
  props<{
    _type: GameType;
    tournament: boolean;
    team: boolean;
    bet: number;
    sets: number;
    legs: number;
  }>(),
);
