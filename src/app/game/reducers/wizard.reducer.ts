import { createReducer, on } from '@ngrx/store';

import { GameWizardStep } from '@game/models';
import { WizardActions, GameActions } from '@game/actions';
import { GameType, GamePlayer } from 'dart3-sdk';

export interface State {
  step: GameWizardStep;
  id: number;
  variant: GameType;
  bet: number;
  sets: number;
  legs: number;
  players: GamePlayer[];
}

export const initialState: State = {
  step: GameWizardStep.SelectGame,
  id: undefined,
  variant: '' as GameType,
  bet: 10,
  sets: 1,
  legs: 1,
  players: [],
};

export const reducer = createReducer(
  initialState,
  on(WizardActions.setStep, (state, { step }) => ({ ...state, step })),

  on(WizardActions.setId, (state, { id }) => ({ ...state, id })),

  on(WizardActions.setValues, (state, { variant, bet, sets, legs }) => ({
    ...state,
    variant,
    bet,
    sets,
    legs,
  })),

  on(GameActions.createCurrentGamePlayerSuccess, (state, { players }) => ({ ...state, players })),

  on(GameActions.createCurrentGamePlayerFailure, state => ({
    ...state,
    players: [...state.players],
  })),

  on(GameActions.getCurrentSuccess, (state, { game: { players } }) => ({ ...state, players })),

  on(GameActions.deleteCurrentSuccess, () => initialState),
);
