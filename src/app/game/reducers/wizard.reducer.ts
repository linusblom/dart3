import { createReducer, on } from '@ngrx/store';

import { GameWizardStep } from '@game/models';
import { WizardActions, CurrentGameAction } from '@game/actions';
import { GameType, GamePlayer } from 'dart3-sdk';

export interface State {
  step: GameWizardStep;
  variant: GameType;
  bet: number;
  sets: number;
  legs: number;
  players: GamePlayer[];
}

export const initialState: State = {
  step: GameWizardStep.SelectGame,
  variant: '' as GameType,
  bet: 10,
  sets: 1,
  legs: 1,
  players: [],
};

export const reducer = createReducer(
  initialState,
  on(WizardActions.setStep, (state, { step }) => ({ ...state, step })),

  on(WizardActions.setValues, (state, { variant, bet, sets, legs }) => ({
    ...state,
    variant,
    bet,
    sets,
    legs,
  })),

  on(CurrentGameAction.createGamePlayerSuccess, (state, { players }) => ({ ...state, players })),

  on(CurrentGameAction.createGamePlayerFailure, state => ({
    ...state,
    players: [...state.players],
  })),

  on(CurrentGameAction.getSuccess, (state, { game: { players } }) => ({ ...state, players })),

  on(CurrentGameAction.deleteSuccess, () => initialState),
);
