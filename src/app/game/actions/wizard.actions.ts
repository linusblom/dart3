import { createAction, props } from '@ngrx/store';
import { GameType, TeamPlayer } from 'dart3-sdk';

import { GameWizardStep, GameSettings } from '@game/models';

export const setStep = createAction('[Wizard] Set Step', props<{ step: GameWizardStep }>());
export const setType = createAction('[Wizard] Set Type', props<{ gameType: GameType }>());
export const setSettings = createAction(
  '[Wizard] Set Settings',
  props<{ settings: GameSettings }>(),
);
export const setValues = createAction(
  '[Wizard] Set Values',
  props<{
    gameType: GameType;
    players: TeamPlayer[];
    settings: GameSettings;
  }>(),
);
