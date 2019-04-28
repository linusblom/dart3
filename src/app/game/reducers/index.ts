import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromPlayer from './player.reducer';

export interface State {
  player: fromPlayer.State;
}

export const reducers: ActionReducerMap<State> = {
  player: fromPlayer.reducer,
};

export const getPlayerState = createFeatureSelector<fromPlayer.State>('player');
