import { createAction, props } from '@ngrx/store';
import { Game, TeamPlayer, Score, MatchResponse, RoundResponse } from 'dart3-sdk';
import { HttpErrorResponse } from '@angular/common/http';

export const getRequest = createAction('[Current Game] Get Request');
export const getSuccess = createAction('[Current Game] Get Success', props<{ game: Game }>());
export const getFailure = createAction(
  '[Current Game] Get Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const deleteRequest = createAction('[Current Game] Delete Request');
export const deleteSuccess = createAction('[Current Game] Delete Success');
export const deleteFailure = createAction('[Current Game] Delete Failure');

export const createTeamPlayerRequest = createAction(
  '[Current Game] Create Game Player Request',
  props<{ uid: string }>(),
);
export const createTeamPlayerSuccess = createAction(
  '[Current Game] Create Game Player Success',
  props<{ players: TeamPlayer[] }>(),
);
export const createTeamPlayerFailure = createAction(
  '[Current Game] Create Game Player Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const deleteTeamPlayerRequest = createAction(
  '[Current Game] Delete Game Player Request',
  props<{ uid: string }>(),
);
export const deleteTeamPlayerSuccess = createAction(
  '[Current Game] Delete Game Player Success',
  props<{ players: TeamPlayer[] }>(),
);
export const deleteTeamPlayerFailure = createAction(
  '[Current Game] Delete Game Player Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const startRequest = createAction('[Current Game] Start Request');
export const startSuccess = createAction('[Current Game] Start Success');
export const startFailure = createAction('[Current Game] Start Failure');

export const createRoundRequest = createAction(
  '[Current Game] Create Round Request',
  props<{ scores: Score[] }>(),
);
export const createRoundSuccess = createAction(
  '[Current Game] Create Round Success',
  props<RoundResponse>(),
);
export const createRoundFailure = createAction('[Current Game] Create Round Failure');

export const getMatchesRequest = createAction('[Current Game] Get Matches Request');
export const getMatchesSuccess = createAction(
  '[Current Game] Get Matches Success',
  props<MatchResponse>(),
);
export const getMatchesFailure = createAction('[Current Game] Get Matches Failure');
