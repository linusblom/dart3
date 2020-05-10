import { createReducer, on } from '@ngrx/store';
import { GameType, GamePlayer, GameVariant } from 'dart3-sdk';

import { GameWizardStep } from '@game/models';
import { WizardActions, CurrentGameActions } from '@game/actions';

export interface State {
  step: GameWizardStep;
  type: GameType;
  variant: GameVariant;
  bet: number;
  sets: number;
  legs: number;
  players: GamePlayer[];
}

export const initialState: State = {
  step: GameWizardStep.SelectGame,
  type: '' as GameType,
  variant: GameVariant.Single,
  bet: 10,
  sets: 1,
  legs: 1,
  players: [],
};

export const reducer = createReducer(
  initialState,
  on(WizardActions.setStep, (state, { step }) => ({ ...state, step })),

  on(WizardActions.setValues, (state, { _type: type, variant, bet, sets, legs }) => ({
    ...state,
    type,
    variant,
    bet,
    sets,
    legs,
  })),

  on(CurrentGameActions.createGamePlayerSuccess, (state, { players }) => ({ ...state, players })),

  on(CurrentGameActions.createGamePlayerFailure, state => ({
    ...state,
    players: [...state.players],
  })),

  on(CurrentGameActions.getSuccess, (state, { game: { players } }) => ({ ...state, players })),

  on(CurrentGameActions.deleteSuccess, () => initialState),
);
