import { createReducer, on } from '@ngrx/store';
import { GameType, TeamPlayer } from 'dart3-sdk';

import { GameWizardStep } from '@game/models';
import { WizardActions, CurrentGameActions } from '@game/actions';

export interface State {
  step: GameWizardStep;
  type: GameType;
  tournament: boolean;
  team: boolean;
  bet: number;
  sets: number;
  legs: number;
  players: TeamPlayer[];
}

export const initialState: State = {
  step: GameWizardStep.SelectGame,
  type: '' as GameType,
  tournament: false,
  team: false,
  bet: 10,
  sets: 1,
  legs: 1,
  players: [],
};

export const reducer = createReducer(
  initialState,
  on(WizardActions.setStep, (state, { step }) => ({ ...state, step })),

  on(WizardActions.setValues, (state, { _type: type, ...rest }) => ({
    ...state,
    ...rest,
    type,
  })),

  on(CurrentGameActions.createTeamPlayerSuccess, (state, { players }) => ({ ...state, players })),

  on(CurrentGameActions.deleteTeamPlayerSuccess, (state, { players }) => ({ ...state, players })),

  on(
    CurrentGameActions.createTeamPlayerFailure,
    CurrentGameActions.deleteTeamPlayerFailure,
    (state) => ({
      ...state,
      players: [...state.players],
    }),
  ),

  on(CurrentGameActions.deleteSuccess, CurrentGameActions.startSuccess, () => initialState),
);
