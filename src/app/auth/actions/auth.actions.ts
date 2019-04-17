import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props, union } from '@ngrx/store';
import { User } from 'firebase';

export const login = createAction('[Auth] Login', props<{ email: string; password: string }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ user: User }>());
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const updateProfile = createAction(
  '[Auth] Update Profile',
  props<{ displayName: string }>(),
);
export const updateProfileSuccess = createAction(
  '[Auth] Update Profile Success',
  props<{ displayName: string }>(),
);
export const updateProfileFailure = createAction(
  '[Auth] Update Profile Failre',
  props<{ error: HttpErrorResponse }>(),
);

export const logout = createAction('[Auth] Logout');

const actions = union({
  login,
  loginSuccess,
  loginFailure,
  updateProfile,
  updateProfileSuccess,
  updateProfileFailure,
  logout,
});
export type AuthActionsUnion = typeof actions;
