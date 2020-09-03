import { createReducer, on } from '@ngrx/store';
import { GameType, TeamPlayer, Check } from 'dart3-sdk';

import { GameWizardStep, GameSettings } from '@game/models';
import { WizardActions, CurrentGameActions } from '@game/actions';

export const defaultSettings: GameSettings = {
  tournament: false,
  team: false,
  bet: 10,
  sets: 1,
  legs: 1,
  startScore: 0,
  checkIn: Check.Straight,
  checkOut: Check.Straight,
  tieBreak: 0,
};

export interface State {
  step: GameWizardStep;
  type: GameType;
  players: TeamPlayer[];
  [GameType.HalveIt]: GameSettings;
  [GameType.Legs]: GameSettings;
  [GameType.X01]: GameSettings;
}

export const initialState: State = {
  step: GameWizardStep.SelectGame,
  type: undefined,
  players: [],
  [GameType.HalveIt]: {
    ...defaultSettings,
  },
  [GameType.Legs]: {
    ...defaultSettings,
    startScore: 3,
  },
  [GameType.X01]: {
    ...defaultSettings,
    startScore: 501,
    tieBreak: 15,
    checkOut: Check.Double,
  },
};

export const reducer = createReducer(
  initialState,
  on(WizardActions.setStep, (state, { step }) => ({ ...state, step })),

  on(WizardActions.setValues, (state, { gameType, players, settings }) => ({
    ...state,
    type: gameType,
    players,
    [gameType]: settings,
  })),

  on(WizardActions.setType, (state, { gameType }) => ({ ...state, type: gameType })),

  on(WizardActions.setSettings, (state, { settings }) => ({
    ...state,
    ...(state.type && { [state.type]: settings }),
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
