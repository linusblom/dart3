import { createAction, props } from '@ngrx/store';

export const loginRequest = createAction('[Auth] Login Request', props<{ url: string }>());
export const loginSuccess = createAction('[Auth] Login Success');
export const loginFailure = createAction('[Auth] Login Failure');

export const logout = createAction('[Auth] Logout');

export const setAuthenticated = createAction(
  '[Auth] Set Authenticated',
  props<{ authenticated: boolean }>(),
);
